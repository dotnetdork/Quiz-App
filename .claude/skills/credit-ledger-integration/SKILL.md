---
name: credit-ledger-integration
description: Guide implementing and instrumenting the credit_ledger table that tracks real AI token spend across the Quiz-App "Build Real Stuff" course extension (see docs/AI-COURSE-EXTENSION-PLAN.md). Use this whenever adding or modifying any code path in backend/ai_routes.py that calls a DeepSeek model, whenever the frontend "AI Credits" meter needs to reflect real spend, whenever reviewing a pull request that adds a new AI-calling endpoint, or whenever a new quest activity type will call an AI model and its cost needs to be tracked correctly. Also use this if a bug report says the credit meter drifted from actual spend, or if someone asks how to make sure a student can't rack up unlimited free AI credits.
---

# Credit Ledger Integration

## Why this exists

The entire pedagogical point of the credit economy (design doc §3) is that AI help costs something real, and running out forces the student to finish on their own. That only works if the in-app credit meter reflects actual token spend — a decorative or approximate meter teaches nothing, and a meter that silently drifts from reality (undercounting spend, or counting the wrong price for the wrong model) either lets students game it or triggers "out of credits" unfairly. This skill exists to make every AI-calling code path log correctly, every time, without each endpoint author having to remember the rules.

## The one rule that matters

**Every call to a DeepSeek model must go through a single shared helper, never a raw API call inlined in a route handler.** The design doc (§11) specifically flags "grading calls accidentally hitting the expensive tier" as a real risk once there are two models in play. Centralizing the call-and-log logic in one place is what prevents that — if every endpoint makes its own call and does its own logging, it's only a matter of time before one of them gets the tier or the token accounting wrong, and nobody notices until the bill or the meter is off.

## What the ledger tracks

Per design doc §7, `credit_ledger` has: `user_id`, `quest_id`, `model_tier` (`"fast"` for DeepSeek V4 Flash or `"agent"` for DeepSeek V4 Pro), `tokens_spent`, `budget`, `timestamp`. Add this model to `backend/models.py` next to `User` and `Score`, using the same SQLAlchemy patterns already there (see the existing `Score` class for the relationship/foreign-key style to follow).

## Building the shared helper

Put this in `backend/ai_routes.py` (or a `credit_ledger.py` module it imports) as the single choke point every AI call passes through:

```python
def call_model_and_log(
    db: Session,
    user_id: int,
    quest_id: str,
    tier: Literal["fast", "agent"],
    messages: list[dict],
    budget_remaining: int,
) -> dict:
    """
    The only function in the codebase allowed to call a DeepSeek model.
    Every endpoint in ai_routes.py routes through this.
    """
    model_name = TIER_TO_MODEL[tier]  # {"fast": "deepseek/deepseek-v4-flash", "agent": "deepseek/deepseek-v4-pro"}

    # Check budget BEFORE spending, not after — this is what makes the
    # "ran out of credits" teaching moment trigger at the right time
    # instead of after the student has already overspent.
    if budget_remaining <= 0:
        raise CreditsExhausted(quest_id=quest_id)

    response = openai_client.chat.completions.create(
        model=model_name,
        messages=messages,
        # DeepSeek's API is OpenAI-compatible; base_url points at
        # https://openrouter.ai/api/v1 regardless of tier (we route through OpenRouter, not DeepSeek directly -- see config.py).
    )

    tokens_spent = response.usage.total_tokens
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
```

The two things worth being deliberate about here: the budget check happens *before* the call, not after — an "insufficient credits" response should be cheap and instant, not something the student discovers after the AI already answered and the tokens are already spent. And `tier` is a required, explicit parameter with only two valid values — never inferred from context — so a grading call can't silently end up on the agent tier just because someone copy-pasted from the debug_rescue endpoint.

## Wiring the frontend meter

The `CreditMeter.js` component (design doc §8) should compute remaining budget as a live query — `SUM(tokens_spent) WHERE user_id = ? AND quest_id = ?` compared against the quest's declared budget — rather than trusting a cached number that could drift. If you're building the `/api/ai/credits` endpoint that feeds this component, make it do that live sum, not read a stored balance column.

## Price-per-token: read it from config, don't hardcode it

Design doc §6 calls out that DeepSeek's pricing has shifted before on both models. Store `PRICE_PER_TOKEN = {"fast": {...}, "agent": {...}}` in `backend/config.py` alongside the other environment-driven settings (follow the existing pattern there — `GITHUB_CLIENT_ID`, `SECRET_KEY`, etc. are all `os.getenv()` calls with sane defaults), not as a literal inside `ai_routes.py`. If pricing changes, one config edit should fix the ledger math everywhere, not a search-and-replace across every endpoint.

## Testing checklist before merging any change that touches AI calls

Verify these explicitly, not just by eyeballing the code:

- Every function that calls a DeepSeek model does so exclusively through the shared helper — grep for any direct `openai_client.chat.completions.create` calls outside of it and treat each one as a bug.
- A `credit_ledger` row is created for every successful AI call, with `model_tier` matching what the endpoint is supposed to use (tutor-chat and grade-response → `"fast"`; generate-bug → `"agent"`).
- Simulate a student at zero remaining budget and confirm the budget check fires before any model call is made (check this by asserting no new tokens were logged, not just that an error was returned).
- Confirm the frontend meter's remaining-budget number matches a manual `SUM(tokens_spent)` query against the same quest/user — if they disagree, something is reading from a stale or cached value.

## Related skills

- `ai-tutor-endpoints` — the fast-tier endpoints (`/api/ai/tutor-chat`, `/api/ai/grade-response`) that call through this helper.
- `ai-coding-tier-setup` — the agent-tier endpoint (`/api/ai/generate-bug`) and devcontainer config that also call through this helper.
- `course-quest-authoring` — quest YAML files declare `credit_budget`, which this skill's budget check reads at runtime.
