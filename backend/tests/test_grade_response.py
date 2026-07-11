"""
Tests for POST /api/ai/grade-response -- rubric grading for
ai_chat_challenge and spec_sprint quests (Milestone 2, see
docs/AI-COURSE-BUILD-PLAN.md and the ai-tutor-endpoints skill).

Uses the real pressure_test_target_customer quest (4 rubric criteria,
credit_budget 1500) from backend/courses/build-real-stuff/, and the real
kickoff_ux_reflection quest (no rubric at all) to prove grading a
non-gradeable quest type fails cleanly rather than crashing.
"""
import json

import ai_routes
from models import CreditLedger

REAL_QUEST_ID = "pressure_test_target_customer"  # 4 rubric criteria, credit_budget 1500
REAL_QUEST_RUBRIC_LEN = 4
NO_RUBRIC_QUEST_ID = "kickoff_ux_reflection"  # reflection_journal, no rubric


class JSONFakeMessage:
    def __init__(self, content):
        self.content = content


class JSONFakeChoice:
    def __init__(self, content):
        self.message = JSONFakeMessage(content)


class JSONFakeUsage:
    def __init__(self, total_tokens):
        self.total_tokens = total_tokens


class JSONFakeResponse:
    def __init__(self, content, total_tokens):
        self.choices = [JSONFakeChoice(content)]
        self.usage = JSONFakeUsage(total_tokens)


class JSONFakeCompletions:
    """
    Records the kwargs it was called with, so tests can assert the grading
    call actually used the fast tier, low temperature, and JSON response
    format -- not just that *a* call happened.
    """

    def __init__(self, content, total_tokens):
        self._content = content
        self._total_tokens = total_tokens
        self.last_kwargs = None

    def create(self, **kwargs):
        self.last_kwargs = kwargs
        return JSONFakeResponse(self._content, self._total_tokens)


class JSONFakeChat:
    def __init__(self, completions):
        self.completions = completions


class JSONFakeClient:
    def __init__(self, content, total_tokens=100):
        self.completions_obj = JSONFakeCompletions(content, total_tokens)
        self.chat = JSONFakeChat(self.completions_obj)


def _valid_grading_json(all_pass=True, n=REAL_QUEST_RUBRIC_LEN):
    results = [
        {"text": f"criterion {i}", "passed": all_pass, "evidence": "because reasons"}
        for i in range(n)
    ]
    return json.dumps({"results": results})


def test_grade_response_requires_auth(unauth_client):
    response = unauth_client.post(
        "/api/ai/grade-response",
        json={"quest_id": REAL_QUEST_ID, "submission": "some transcript"},
    )
    assert response.status_code == 401


def test_grade_response_returns_structured_results(client, monkeypatch):
    fake_client = JSONFakeClient(content=_valid_grading_json(all_pass=True), total_tokens=200)
    monkeypatch.setattr(ai_routes, "_get_client", lambda: fake_client)

    response = client.post(
        "/api/ai/grade-response",
        json={
            "quest_id": REAL_QUEST_ID,
            "submission": "Is my target customer clause missing anyone?",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body["results"]) == REAL_QUEST_RUBRIC_LEN
    assert body["all_passed"] is True
    assert body["credits_remaining"] == 1500 - 200

    # Confirm the call actually used the fast tier, low temperature, and
    # asked for JSON output -- not just that some call happened.
    kwargs = fake_client.completions_obj.last_kwargs
    assert kwargs["model"] == ai_routes.AI_MODEL_BY_TIER["fast"]
    assert kwargs["temperature"] == 0.1
    assert kwargs["response_format"] == {"type": "json_object"}


def test_grade_response_mixed_pass_fail(client, monkeypatch):
    results = [
        {"text": "criterion 1", "passed": True, "evidence": "yes"},
        {"text": "criterion 2", "passed": False, "evidence": "missing"},
        {"text": "criterion 3", "passed": True, "evidence": "yes"},
        {"text": "criterion 4", "passed": True, "evidence": "yes"},
    ]
    content = json.dumps({"results": results})
    fake_client = JSONFakeClient(content=content, total_tokens=50)
    monkeypatch.setattr(ai_routes, "_get_client", lambda: fake_client)

    response = client.post(
        "/api/ai/grade-response",
        json={"quest_id": REAL_QUEST_ID, "submission": "..."},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["all_passed"] is False
    assert sum(r["passed"] for r in body["results"]) == 3


def test_grade_response_unknown_quest_404(client, monkeypatch):
    monkeypatch.setattr(ai_routes, "_get_client", lambda: JSONFakeClient(content="{}"))
    response = client.post(
        "/api/ai/grade-response",
        json={"quest_id": "does-not-exist", "submission": "..."},
    )
    assert response.status_code == 404


def test_grade_response_quest_without_rubric_400(client, monkeypatch):
    # kickoff_ux_reflection is a reflection_journal quest with no
    # rubric at all -- grading it should be a clean 400, not a crash.
    monkeypatch.setattr(ai_routes, "_get_client", lambda: JSONFakeClient(content="{}"))
    response = client.post(
        "/api/ai/grade-response",
        json={"quest_id": NO_RUBRIC_QUEST_ID, "submission": "..."},
    )
    assert response.status_code == 400
    assert response.json()["detail"]["error"] == "no_rubric"


def test_grade_response_malformed_json_returns_clean_502(client, monkeypatch):
    fake_client = JSONFakeClient(content="this is not valid json at all", total_tokens=10)
    monkeypatch.setattr(ai_routes, "_get_client", lambda: fake_client)

    response = client.post(
        "/api/ai/grade-response",
        json={"quest_id": REAL_QUEST_ID, "submission": "..."},
    )
    assert response.status_code == 502
    assert response.json()["detail"]["error"] == "ai_provider_error"


def test_grade_response_credits_exhausted_returns_402(client, monkeypatch, test_engine, test_user):
    from sqlalchemy.orm import sessionmaker
    from datetime import datetime

    Session = sessionmaker(bind=test_engine)
    db = Session()
    db.add(CreditLedger(
        user_id=test_user["id"],
        quest_id=REAL_QUEST_ID,
        model_tier="fast",
        tokens_spent=1500,
        budget=1500,
        timestamp=datetime.utcnow(),
    ))
    db.commit()
    db.close()

    def exploding_client():
        raise AssertionError("model should never be called once credits are exhausted")

    monkeypatch.setattr(ai_routes, "_get_client", exploding_client)

    response = client.post(
        "/api/ai/grade-response",
        json={"quest_id": REAL_QUEST_ID, "submission": "..."},
    )
    assert response.status_code == 402
    assert response.json()["detail"]["error"] == "credits_exhausted"
