"""
Tests for backend/ai_routes.py -- the AI course extension's credit-ledger
enforcement, tutor-chat endpoint, and rate limiting (Milestone 1, see
docs/AI-COURSE-BUILD-PLAN.md).

These tests never make a real DeepSeek/OpenRouter API call --
ai_routes._get_client is monkeypatched to a fake client, so no
OPENROUTER_API_KEY is needed to run this file. What's being tested is our
own logic around that call: does the budget check actually stop a call
before it happens, does a successful call log the right tier, does the
rate limiter actually trip.

Since Milestone 2, get_quest_credit_budget() does a real lookup against
quest YAML (course_routes.get_quest()) instead of a hardcoded placeholder.
These tests care about credit-ledger *mechanics*, not quest content, so
they monkeypatch get_quest_credit_budget to a fixed 2000 regardless of
quest_id -- keeping them decoupled from whatever quests happen to exist in
backend/courses/. Tests specifically covering real quest content and
budget-wiring live in test_course_routes.py.
"""
import ai_routes
from config import AI_RATE_LIMIT_MAX_CALLS
from models import CreditLedger


def _fixed_budget(*args, **kwargs):
    """Stand-in for get_quest_credit_budget in tests that only care about
    credit-ledger mechanics (budget enforcement, tier tagging, rate
    limiting), not real quest content."""
    return 2000


class FakeMessage:
    def __init__(self, content):
        self.content = content


class FakeChoice:
    def __init__(self, content):
        self.message = FakeMessage(content)


class FakeUsage:
    def __init__(self, total_tokens):
        self.total_tokens = total_tokens


class FakeResponse:
    def __init__(self, content, total_tokens):
        self.choices = [FakeChoice(content)]
        self.usage = FakeUsage(total_tokens)


class FakeCompletions:
    def __init__(self, content, total_tokens):
        self._content = content
        self._total_tokens = total_tokens

    def create(self, model, messages):
        return FakeResponse(self._content, self._total_tokens)


class FakeChat:
    def __init__(self, content, total_tokens):
        self.completions = FakeCompletions(content, total_tokens)


class FakeClient:
    """Stand-in for the real DeepSeek/OpenAI client."""

    def __init__(self, content="Have you checked what your loop returns on the last item?", total_tokens=123):
        self.chat = FakeChat(content, total_tokens)


class ExplodingCompletions:
    def create(self, model, messages):
        raise AssertionError(
            "The model should never be called once the budget is already exhausted -- "
            "the budget check must happen before this point."
        )


class ExplodingClient:
    """
    A fake client whose .chat.completions.create() always raises. Used to
    prove the budget check actually short-circuits before any model call,
    not just that the endpoint eventually returns a 402.
    """

    def __init__(self):
        self.chat = type("Chat", (), {"completions": ExplodingCompletions()})()


class ProviderFailingCompletions:
    """
    Simulates DeepSeek itself rejecting the request -- e.g. an invalid
    model name, which is exactly the real bug this test guards against
    regressing (see AI-COURSE-BUILD-PLAN.md's Milestone 1 exit-check note).
    """

    def create(self, model, messages):
        raise RuntimeError(f"simulated provider failure for model={model!r}")


class ProviderFailingClient:
    def __init__(self):
        self.chat = type("Chat", (), {"completions": ProviderFailingCompletions()})()


def test_tutor_chat_requires_auth(unauth_client):
    """No session cookie, no dependency override -- should be a clean 401."""
    response = unauth_client.post(
        "/api/ai/tutor-chat",
        json={"quest_id": "test-quest", "message": "hi", "conversation_history": []},
    )
    assert response.status_code == 401


def test_tutor_chat_success_logs_correct_tier(client, monkeypatch, test_engine, test_user):
    """A successful call should log exactly one credit_ledger row, tier='fast'."""
    monkeypatch.setattr(ai_routes, "get_quest_credit_budget", _fixed_budget)
    monkeypatch.setattr(ai_routes, "_get_client", lambda: FakeClient(total_tokens=123))

    response = client.post(
        "/api/ai/tutor-chat",
        json={"quest_id": "test-quest", "message": "my loop skips the last item", "conversation_history": []},
    )

    assert response.status_code == 200
    body = response.json()
    assert "loop" in body["reply"].lower() or len(body["reply"]) > 0
    assert body["credits_remaining"] == 2000 - 123

    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=test_engine)
    db = Session()
    rows = db.query(CreditLedger).filter(CreditLedger.user_id == test_user["id"]).all()
    db.close()

    assert len(rows) == 1
    assert rows[0].model_tier == "fast"
    assert rows[0].tokens_spent == 123
    assert rows[0].quest_id == "test-quest"


def test_tutor_chat_blocks_when_credits_exhausted(client, monkeypatch, test_engine, test_user):
    """
    Pre-seed enough spend to exhaust the (hardcoded, Milestone-1-placeholder)
    2000-credit budget, then confirm the endpoint refuses with 402 and the
    model is never actually called.
    """
    from sqlalchemy.orm import sessionmaker
    from datetime import datetime

    Session = sessionmaker(bind=test_engine)
    db = Session()
    db.add(CreditLedger(
        user_id=test_user["id"],
        quest_id="test-quest",
        model_tier="fast",
        tokens_spent=2000,
        budget=2000,
        timestamp=datetime.utcnow(),
    ))
    db.commit()
    db.close()

    monkeypatch.setattr(ai_routes, "get_quest_credit_budget", _fixed_budget)
    monkeypatch.setattr(ai_routes, "_get_client", lambda: ExplodingClient())

    response = client.post(
        "/api/ai/tutor-chat",
        json={"quest_id": "test-quest", "message": "help", "conversation_history": []},
    )

    assert response.status_code == 402
    assert response.json()["detail"]["error"] == "credits_exhausted"

    # Confirm no new row was added beyond the one we pre-seeded.
    db = Session()
    rows = db.query(CreditLedger).filter(CreditLedger.user_id == test_user["id"]).all()
    db.close()
    assert len(rows) == 1


def test_rate_limit_enforced(client, monkeypatch):
    """
    Calling tutor-chat more than AI_RATE_LIMIT_MAX_CALLS times in quick
    succession should trip the limiter with a 429, independent of budget.
    """
    monkeypatch.setattr(ai_routes, "_get_client", lambda: FakeClient(total_tokens=1))

    last_response = None
    for _ in range(AI_RATE_LIMIT_MAX_CALLS + 1):
        last_response = client.post(
            "/api/ai/tutor-chat",
            json={"quest_id": "rate-limit-quest", "message": "hi", "conversation_history": []},
        )

    assert last_response.status_code == 429
    assert last_response.json()["detail"]["error"] == "rate_limited"


def test_tutor_chat_provider_failure_returns_clean_502(client, monkeypatch, test_engine, test_user):
    """
    If the DeepSeek call itself fails (bad model name, bad key, network
    error, etc.), the endpoint should return a clean 502 with no ledger
    row written -- not a bare, uninformative 500. This guards against the
    real bug hit during manual testing: an invalid default model name
    (deepseek-v3.2) caused every tutor-chat call to 500 with no detail.
    """
    monkeypatch.setattr(ai_routes, "get_quest_credit_budget", _fixed_budget)
    monkeypatch.setattr(ai_routes, "_get_client", lambda: ProviderFailingClient())

    response = client.post(
        "/api/ai/tutor-chat",
        json={"quest_id": "provider-fail-quest", "message": "hi", "conversation_history": []},
    )

    assert response.status_code == 502
    assert response.json()["detail"]["error"] == "ai_provider_error"

    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=test_engine)
    db = Session()
    rows = db.query(CreditLedger).filter(CreditLedger.user_id == test_user["id"]).all()
    db.close()
    assert len(rows) == 0


def test_credits_endpoint_reflects_spend(client, monkeypatch):
    """GET /api/ai/credits should reflect a spend made through tutor-chat."""
    monkeypatch.setattr(ai_routes, "get_quest_credit_budget", _fixed_budget)
    monkeypatch.setattr(ai_routes, "_get_client", lambda: FakeClient(total_tokens=50))

    client.post(
        "/api/ai/tutor-chat",
        json={"quest_id": "credits-check-quest", "message": "hi", "conversation_history": []},
    )

    response = client.get("/api/ai/credits", params={"quest_id": "credits-check-quest"})
    assert response.status_code == 200
    body = response.json()
    assert body["budget"] == 2000
    assert body["remaining"] == 2000 - 50
