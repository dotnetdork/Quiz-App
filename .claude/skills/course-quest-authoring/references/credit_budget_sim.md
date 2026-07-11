# credit_budget_sim

A timed, credit-limited scenario: fix a bug or extend a feature before credits run out. No AI grading call of its own — grading is functional (did the student's final code/answer actually work) plus an efficiency score (credits spent vs. budget). This is the type where running out mid-task is a designed, expected outcome, not a failure mode to avoid.

## Schema

```yaml
- id: leaderboard_off_by_one
  type: credit_budget_sim
  stage: "Beyond Stage 3 — The Build"
  credit_budget: 800
  scenario: >
    The leaderboard is showing rank 1 for the second-highest scorer.
    Find and fix the bug using the AI tutor, but you only have 800
    credits — plan your questions before you start spending them.
  starter_code_ref: "backend/leaderboard_routes.py"
  success_criteria:
    - "Leaderboard ranks are correct for a test set of 5 known scores"
    - "Fix does not introduce a new off-by-one in the opposite direction"
  out_of_credits_behavior: >
    If credits run out before success_criteria are met, the student
    must finish using only conversation history already spent — no
    new AI calls — until a cooldown period or a completed
    reflection_journal quest grants a small refill.
```

## Writing tips

`out_of_credits_behavior` is not optional — it's the mechanic that makes this activity type meaningfully different from a normal debugging exercise. Be explicit about what "finishing without AI" looks like for this specific scenario so the frontend can render the right state. Set `credit_budget` by actually solving the scenario yourself with careful, non-wasteful prompting and adding a small margin — not by guessing.
