---
name: ai-tutor-endpoints
description: Guide implementing the fast-tier AI endpoints in backend/ai_routes.py — POST /api/ai/tutor-chat and POST /api/ai/grade-response — that power the AI Chat Challenges, in-app tutor chat, and rubric grading for ai_chat_challenge and spec_sprint quests in the Quiz-App course extension, both routed to DeepSeek V4 Flash per docs/AI-COURSE-EXTENSION-PLAN.md §6. Use this whenever building or modifying the AITutorPanel.js chat widget, whenever writing or tuning the tutor persona's system prompt, whenever building rubric-based grading for any quest type, or whenever deciding whether a specific AI call belongs on the cheap tier versus the coding tier. Also use this if the tutor is giving away complete answers instead of coaching, or if grading feels inconsistent between attempts.
---

# AI Tutor Endpoints (fast tier)

## Why these calls stay on the cheap tier

Tutor chat and rubric grading are high-volume — they happen dozens of times per session across a whole class — and neither needs frontier-level coding ability. What they need is reliable instruction-following: stay in character as a coach, follow a rubric precisely, don't wander. DeepSeek V4 Flash does that at roughly a third the price of V4 Pro. If you're tempted to reach for the more capable model here because a particular tutor answer felt weak, that's usually a prompt problem, not a model-capability problem — fix the system prompt first (see below) before considering a tier change, and if a tier change genuinely seems warranted, that's a design-doc-level decision, not something to quietly patch into one endpoint.

## `/api/ai/tutor-chat` — the coaching persona

The single hardest thing to get right here is the same thing the whole course is trying to teach: the AI should not just answer. If a student asks "what's wrong with my code," a tutor that pastes back the fix has undone the entire pedagogical point of the credit economy and the `debug_rescue` mechanic. Concretely, the system prompt needs to:

- Never emit a complete, directly-pasteable solution as the first response to a "how do I fix/build this" question. Ask a clarifying or leading question back first — "what do you think happens when this loop hits the last item?" — the same way a good human tutor would.
- Treat "just give me the code" or "just fix it for me" as a moment to name what's happening ("I could just write this for you, but then you wouldn't know why it works — let's figure out the piece you're stuck on") rather than complying, and rather than being preachy about it every single time either. It should feel like a real tutor's patience, not a scolding.
- Still actually help. This isn't about withholding information — it's about the shape of the help. Explaining a concept, walking through a smaller example, or pointing at the specific line that's suspicious are all fine; handing over the finished artifact is not.
- Stay grounded in what the student has actually written or asked about — don't invent context about their project that wasn't given to it.

Route: accepts `{quest_id, message, conversation_history}`, calls `call_model_and_log(tier="fast", ...)` (see the `credit-ledger-integration` skill for that helper), returns the tutor's reply. Every call logs to `credit_ledger` — this endpoint should never call the model directly.

## `/api/ai/grade-response` — rubric grading

Used by `ai_chat_challenge` and `spec_sprint` quests (see `course-quest-authoring` for how those quests declare their rubric in YAML). The endpoint:

1. Loads the quest's rubric from its YAML definition — a list of specific, checkable criteria, not a vague "did they do a good job" prompt. Vague grading prompts produce inconsistent grades across attempts, which is exactly what erodes student trust in the mechanic.
2. Calls DeepSeek V4 Flash with the rubric and the student's submission, asking for structured output: one pass/fail plus a short evidence note per criterion, not just an overall score. This mirrors the format used elsewhere in this project's own grading tooling (`expectations` arrays with `text`/`passed`/`evidence` fields) — reuse that shape here too, since it's just as useful for a rubric grader as it is for evaluating a skill.
3. Set temperature low (0 to 0.2) for grading calls specifically — consistency matters more than creativity when the same submission graded twice should get the same result.
4. Returns the structured verdict to the frontend, which renders it as feedback per rubric line rather than a single opaque score.

## Route and model pattern to follow

Mirror the existing Pydantic model style in `backend/quiz_routes.py` (`AnswerSubmission`, `QuizSubmission`) rather than inventing a new convention — e.g., a `TutorChatRequest` and `GradeResponseRequest` model, registered on the same `APIRouter()` pattern already used there. `main.py` registers routers by import; add `ai_routes.router` the same way `quiz_routes.router` and `leaderboard_routes.router` are already registered.

## Testing checklist

- Ask the tutor endpoint a direct "just write the code for me" prompt and confirm the reply does not contain a complete, pasteable solution.
- Run the same submission through `/api/ai/grade-response` three times and confirm the pass/fail verdict is stable (temperature is doing its job).
- Confirm every call through both endpoints logs `model_tier="fast"` in `credit_ledger` — a `"agent"` tier entry from either of these endpoints is a bug.
- Check that a rubric with 5 criteria returns exactly 5 graded entries, not a summary that collapses them.

## Related skills

- `credit-ledger-integration` — the shared helper and budget-check logic both endpoints here must use.
- `ai-coding-tier-setup` — the sibling agent-tier endpoint (`/api/ai/generate-bug`) for when a call genuinely needs coding capability instead of instruction-following.
- `course-quest-authoring` — where the rubrics this skill's grading endpoint consumes are actually written.
