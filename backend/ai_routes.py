"""
AI Routes - OpenRouter-backed (DeepSeek models) tutor chat, credit-ledger
enforcement, and rate limiting for the "Build Real Stuff" course extension.

See docs/AI-COURSE-EXTENSION-PLAN.md for the full design and
.claude/skills/{credit-ledger-integration,ai-tutor-endpoints}/SKILL.md
for the patterns this file follows.

Milestone 1 scope (docs/AI-COURSE-BUILD-PLAN.md): the shared credit-ledger
helper, budget enforcement, a simple per-user rate limit, and the
POST /api/ai/tutor-chat + GET /api/ai/credits endpoints.

Milestone 2 adds POST /api/ai/grade-response (rubric grading for
ai_chat_challenge and spec_sprint quests, still fast tier). Bug generation
(/api/ai/generate-bug, agent tier) is a later milestone.

Note on the provider: calls route through OpenRouter (openrouter.ai) rather
than DeepSeek's own API. OpenRouter is OpenAI-API-compatible, so the same
`openai` client works -- just pointed at OpenRouter's base URL, using
OpenRouter's "<provider>/<model>" slug convention, and authenticated with
an OpenRouter key (the same one used in this project's Continue.dev
config.yaml), not a DeepSeek-issued key.
"""
import json
import logging
import time
from collections import defaultdict, deque
from datetime import datetime
from pathlib import Path
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from openai import APIError, OpenAI
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from config import (
    AI_MODEL_BY_TIER,
    AI_RATE_LIMIT_MAX_CALLS,
    AI_RATE_LIMIT_WINDOW_SECONDS,
    OPENROUTER_API_BASE,
    OPENROUTER_API_KEY,
)
from course_routes import get_quest
from database import get_db
from deps import require_user
from models import CreditLedger, User

router = APIRouter()

ModelTier = Literal["fast", "agent"]


# ----------------------------
# OpenRouter client (OpenAI-compatible)
# ----------------------------
# Created lazily so importing this module (or running /docs, or running
# tests) doesn't require a real API key to be set -- only actually calling
# the model does.
_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        if not OPENROUTER_API_KEY:
            raise RuntimeError(
                "OPENROUTER_API_KEY is not set. Add it to your .env file "
                "(see .env-template) before calling any /api/ai endpoint."
            )
        _client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url=OPENROUTER_API_BASE,
            # Optional per OpenRouter's docs -- lets calls from this app
            # show up under a recognizable name on OpenRouter's own
            # dashboard/rankings. Has no effect on functionality.
            default_headers={
                "HTTP-Referer": "https://github.com/jointheleague/Quiz-App",
                "X-OpenRouter-Title": "Quiz-App: Build Real Stuff",
            },
        )
    return _client


# ----------------------------
# Tutor persona and grading prompts
# ----------------------------
# Loaded from files at import time rather than duplicated as Python
# strings, so editing either is a content edit, not a code change.
_PROMPT_PATH = Path(__file__).parent / "prompts" / "tutor_system_prompt.md"
TUTOR_SYSTEM_PROMPT = _PROMPT_PATH.read_text(encoding="utf-8")

_GRADING_PROMPT_PATH = Path(__file__).parent / "prompts" / "grading_system_prompt.md"
GRADING_SYSTEM_PROMPT = _GRADING_PROMPT_PATH.read_text(encoding="utf-8")


# ----------------------------
# Credit ledger: the one place allowed to call a DeepSeek model
# ----------------------------
class CreditsExhausted(Exception):
    """Raised when a student has no remaining AI credit budget for a quest."""

    def __init__(self, quest_id: str, budget: int):
        self.quest_id = quest_id
        self.budget = budget
        super().__init__(f"No AI credits remaining for quest {quest_id!r}")


class AIProviderError(Exception):
    """
    Raised when the call to DeepSeek itself fails -- bad model name, bad
    API key, network hiccup, DeepSeek-side outage, etc. Kept distinct from
    CreditsExhausted so endpoints can tell "you're out of budget" (402,
    expected/routine) apart from "the provider call broke" (502, a real
    problem worth logging with a traceback). Without this, any provider
    failure surfaced as a bare, uninformative FastAPI 500.
    """


def get_remaining_budget(db: Session, user_id: int, quest_id: str, quest_budget: int) -> int:
    """
    Live remaining-budget computation: quest_budget - SUM(tokens_spent).
    This is the only correct way to compute remaining budget anywhere in
    the codebase -- never read a cached/stored balance (see the
    credit-ledger-integration skill). The frontend's CreditMeter should
    call GET /api/ai/credits below rather than duplicating this query.
    """
    spent = (
        db.query(func.coalesce(func.sum(CreditLedger.tokens_spent), 0))
        .filter(CreditLedger.user_id == user_id, CreditLedger.quest_id == quest_id)
        .scalar()
    )
    return quest_budget - int(spent)


def call_model_and_log(
    db: Session,
    user_id: int,
    quest_id: str,
    tier: ModelTier,
    messages: list,
    budget_remaining: int,
    temperature: Optional[float] = None,
    response_format: Optional[dict] = None,
):
    """
    The only function in the codebase allowed to call a DeepSeek model.
    Every AI-calling endpoint routes through this so tier selection and
    credit-ledger logging can never drift apart -- see
    docs/AI-COURSE-EXTENSION-PLAN.md section 11's routing-mistake risk
    (a grading call silently landing on the expensive tier because an
    endpoint was copy-pasted from a different one).

    Two things are deliberate here:
    1. The budget check happens before the network call, not after -- an
       "insufficient credits" response should be instant, not something
       the student discovers after tokens are already spent.
    2. `tier` is a required, explicit argument restricted to exactly two
       values, never inferred from the endpoint or quest metadata.

    `temperature` and `response_format` are optional and only passed
    through when given -- tutor_chat leaves both unset (provider default),
    while grade_response sets temperature low (consistency matters more
    than creativity when grading) and requests JSON output (see
    ai-tutor-endpoints skill).
    """
    if tier not in AI_MODEL_BY_TIER:
        raise ValueError(f"Invalid model tier: {tier!r}")

    if budget_remaining <= 0:
        raise CreditsExhausted(quest_id=quest_id, budget=budget_remaining)

    try:
        client = _get_client()
    except RuntimeError as exc:
        # _get_client() raises this specifically when OPENROUTER_API_KEY
        # isn't set at all -- a very likely first-run mistake (forgetting to
        # add it to .env), not an exotic edge case. Route it through the
        # same AIProviderError -> clean 502 path as a real provider failure,
        # instead of letting it propagate as a bare, unhandled 500.
        logger.exception(
            "OpenRouter client unavailable (tier=%s, quest_id=%s)", tier, quest_id
        )
        raise AIProviderError(str(exc)) from exc

    create_kwargs = {"model": AI_MODEL_BY_TIER[tier], "messages": messages}
    if temperature is not None:
        create_kwargs["temperature"] = temperature
    if response_format is not None:
        create_kwargs["response_format"] = response_format

    try:
        response = client.chat.completions.create(**create_kwargs)
    except APIError as exc:
        # Covers OpenRouter (or the underlying DeepSeek model) rejecting the
        # request outright: invalid model slug, bad API key, malformed
        # request, upstream 5xx, etc. Logged with the real traceback
        # server-side (so this is still debuggable), but the student/client
        # only ever sees a clean, honest "the AI tutor is having trouble" --
        # never a bare 500.
        logger.exception(
            "OpenRouter API call failed (tier=%s, quest_id=%s, model=%s)",
            tier, quest_id, AI_MODEL_BY_TIER[tier],
        )
        raise AIProviderError(str(exc)) from exc
    except Exception as exc:
        # Catch-all for anything else unexpected (network timeout, etc.)
        # -- same reasoning as above.
        logger.exception(
            "Unexpected error calling OpenRouter (tier=%s, quest_id=%s)",
            tier, quest_id,
        )
        raise AIProviderError(str(exc)) from exc

    tokens_spent = response.usage.total_tokens if response.usage else 0

    db.add(CreditLedger(
        user_id=user_id,
        quest_id=quest_id,
        model_tier=tier,
        tokens_spent=tokens_spent,
        budget=budget_remaining,
        timestamp=datetime.utcnow(),
    ))
    db.commit()

    return response


# ----------------------------
# Rate limiting
# ----------------------------
# Simple in-memory sliding-window limiter, keyed by user id. This is
# insurance sitting in front of the budget check -- it protects against a
# bug or a fast client-side loop hammering the endpoint faster than the
# budget check alone would catch, not against a determined attacker.
# Fine for a single-process classroom deployment; would need a shared
# store (e.g. Redis) if this ever runs multi-process/multi-worker.
_call_history: dict[int, deque] = defaultdict(deque)


def enforce_rate_limit(user_id: int) -> None:
    now = time.monotonic()
    history = _call_history[user_id]

    while history and now - history[0] > AI_RATE_LIMIT_WINDOW_SECONDS:
        history.popleft()

    if len(history) >= AI_RATE_LIMIT_MAX_CALLS:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "rate_limited",
                "message": (
                    f"Too many AI requests -- wait a moment before trying again "
                    f"(limit: {AI_RATE_LIMIT_MAX_CALLS} per {AI_RATE_LIMIT_WINDOW_SECONDS}s)."
                ),
            },
        )

    history.append(now)


def _reset_rate_limit_state() -> None:
    """Test-only helper to clear rate-limit history between test cases."""
    _call_history.clear()


# ----------------------------
# Quest budget lookup
# ----------------------------
def get_quest_credit_budget(quest_id: str) -> int:
    """
    Reads the quest's declared credit_budget from its YAML file (see
    course-quest-authoring skill), via course_routes.get_quest() -- the
    same auto-discovery pattern quiz_routes.load_questions() uses for
    quiz YAML. Milestone 1 had this hardcoded to 2000 for every quest_id
    since no quest content existed yet; now that real quests exist
    (backend/courses/build-real-stuff/), an unknown quest_id is treated
    as a real error (404) rather than silently granted a budget --
    spending real tokens against a quest that doesn't exist shouldn't be
    possible.
    """
    quest = get_quest(quest_id)
    if quest is None:
        raise HTTPException(status_code=404, detail=f"Quest not found: {quest_id!r}")
    return quest.get("credit_budget", 0)


# ----------------------------
# Pydantic request/response models
# ----------------------------
class TutorChatRequest(BaseModel):
    quest_id: str
    message: str
    conversation_history: list = []  # [{"role": "user"|"assistant", "content": "..."}]


class TutorChatResponse(BaseModel):
    reply: str
    credits_remaining: int


class CreditsResponse(BaseModel):
    quest_id: str
    budget: int
    remaining: int


class GradeResponseRequest(BaseModel):
    quest_id: str
    submission: str  # transcript or written work to grade against the quest's rubric


class GradeCriterionResult(BaseModel):
    text: str
    passed: bool
    evidence: str


class GradeResponseResponse(BaseModel):
    quest_id: str
    results: list[GradeCriterionResult]
    all_passed: bool
    credits_remaining: int


# ----------------------------
# Endpoints
# ----------------------------
@router.post("/tutor-chat", response_model=TutorChatResponse)
def tutor_chat(
    payload: TutorChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """
    Conversational tutor endpoint. Always the fast tier (DeepSeek V4 Flash)
    -- see the ai-tutor-endpoints skill: tutor chat has no business landing
    on the expensive agent tier, and that's enforced here by never
    accepting a tier from the client, not just by convention.
    """
    enforce_rate_limit(user.id)

    quest_budget = get_quest_credit_budget(payload.quest_id)
    remaining = get_remaining_budget(
        db, user_id=user.id, quest_id=payload.quest_id, quest_budget=quest_budget
    )

    if remaining <= 0:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "credits_exhausted",
                "quest_id": payload.quest_id,
                "message": "You're out of AI credits for this quest. Finish this part on your own.",
            },
        )

    messages = [
        {"role": "system", "content": TUTOR_SYSTEM_PROMPT},
        *payload.conversation_history,
        {"role": "user", "content": payload.message},
    ]

    try:
        response = call_model_and_log(
            db=db,
            user_id=user.id,
            quest_id=payload.quest_id,
            tier="fast",
            messages=messages,
            budget_remaining=remaining,
        )
    except CreditsExhausted as exc:
        # Belt-and-suspenders: the check above already caught the common
        # case, but if two requests race between that check and this call,
        # call_model_and_log's own check still fires -- this still surfaces
        # as a clean 402, not a 500.
        raise HTTPException(
            status_code=402,
            detail={"error": "credits_exhausted", "quest_id": exc.quest_id},
        )
    except AIProviderError:
        # The real error (bad model name, bad key, DeepSeek outage, etc.)
        # is already logged with a traceback inside call_model_and_log.
        # The client gets an honest-but-generic 502 rather than a bare,
        # unexplained 500 -- this is the class of bug that motivated this
        # except block in the first place (see AI-COURSE-BUILD-PLAN.md).
        raise HTTPException(
            status_code=502,
            detail={
                "error": "ai_provider_error",
                "message": "The AI tutor is having trouble right now. Try again in a moment.",
            },
        )

    reply_text = response.choices[0].message.content
    new_remaining = get_remaining_budget(
        db, user_id=user.id, quest_id=payload.quest_id, quest_budget=quest_budget
    )

    return TutorChatResponse(reply=reply_text, credits_remaining=new_remaining)


@router.get("/credits", response_model=CreditsResponse)
def get_credits(
    quest_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """
    Live remaining-credit lookup for a quest, used by the frontend
    CreditMeter component. Always computed fresh via get_remaining_budget
    -- never a cached balance.
    """
    quest_budget = get_quest_credit_budget(quest_id)
    remaining = get_remaining_budget(
        db, user_id=user.id, quest_id=quest_id, quest_budget=quest_budget
    )
    return CreditsResponse(quest_id=quest_id, budget=quest_budget, remaining=remaining)


@router.post("/grade-response", response_model=GradeResponseResponse)
def grade_response(
    payload: GradeResponseRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """
    Rubric grading for ai_chat_challenge and spec_sprint quests (see the
    ai-tutor-endpoints and course-quest-authoring skills). Always the fast
    tier -- grading follows a rubric precisely rather than needing
    frontier reasoning, same reasoning as tutor_chat. Temperature is set
    low (0.1) because consistency matters more than creativity here: the
    same submission graded twice should get the same verdict.
    """
    enforce_rate_limit(user.id)

    quest = get_quest(payload.quest_id)
    if quest is None:
        raise HTTPException(status_code=404, detail=f"Quest not found: {payload.quest_id!r}")

    rubric = quest.get("rubric")
    if not rubric:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "no_rubric",
                "message": f"Quest {payload.quest_id!r} has no rubric to grade against.",
            },
        )

    quest_budget = quest.get("credit_budget", 0)
    remaining = get_remaining_budget(
        db, user_id=user.id, quest_id=payload.quest_id, quest_budget=quest_budget
    )

    if remaining <= 0:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "credits_exhausted",
                "quest_id": payload.quest_id,
                "message": "You're out of AI credits for this quest. Finish this part on your own.",
            },
        )

    rubric_text = "\n".join(f"{i + 1}. {criterion}" for i, criterion in enumerate(rubric))
    messages = [
        {"role": "system", "content": GRADING_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"Rubric:\n{rubric_text}\n\nStudent submission:\n{payload.submission}",
        },
    ]

    try:
        response = call_model_and_log(
            db=db,
            user_id=user.id,
            quest_id=payload.quest_id,
            tier="fast",
            messages=messages,
            budget_remaining=remaining,
            temperature=0.1,
            response_format={"type": "json_object"},
        )
    except CreditsExhausted as exc:
        raise HTTPException(
            status_code=402,
            detail={"error": "credits_exhausted", "quest_id": exc.quest_id},
        )
    except AIProviderError:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "ai_provider_error",
                "message": "The AI grader is having trouble right now. Try again in a moment.",
            },
        )

    raw = response.choices[0].message.content
    try:
        parsed = json.loads(raw)
        results_data = parsed["results"]
        results = [GradeCriterionResult(**r) for r in results_data]
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        # The model didn't return the structured JSON we asked for -- this
        # is a provider-quality problem, not a client error, so it gets the
        # same clean 502 treatment as a real API failure rather than a
        # bare 500 from an unhandled parsing exception.
        logger.exception(
            "Grading response was not valid structured JSON (quest_id=%s)",
            payload.quest_id,
        )
        raise HTTPException(
            status_code=502,
            detail={
                "error": "ai_provider_error",
                "message": "The AI grader returned something unexpected. Try again in a moment.",
            },
        )

    new_remaining = get_remaining_budget(
        db, user_id=user.id, quest_id=payload.quest_id, quest_budget=quest_budget
    )

    return GradeResponseResponse(
        quest_id=payload.quest_id,
        results=results,
        all_passed=all(r.passed for r in results),
        credits_remaining=new_remaining,
    )
