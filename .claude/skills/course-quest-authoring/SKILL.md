---
name: course-quest-authoring
description: Guide authoring new quest YAML files for the Quiz-App AI/SDLC course extension's five new activity types — ai_chat_challenge, credit_budget_sim, spec_sprint, debug_rescue, and reflection_journal — following the same auto-discovery pattern as the existing quizzes in backend/quizzes/. Use this whenever someone wants to add a new quest, write course content for the "Build Real Stuff" campaign, define a grading rubric, map a quest to a UA Framework stage, or extend the campaign map with a new activity. Push toward this skill even if the request is just "add a quest about X" or "write some content for the debugging module" without the person naming a specific activity type.
---

# Course Quest Authoring

## The pattern this follows

Quizzes today are plain YAML files auto-discovered from `backend/quizzes/<category>/*.yaml` by `quiz_routes.load_questions()`, which walks the directory tree and parses every `.yaml`/`.yml` file it finds — no code change needed to add content, just a new file. The course extension follows the identical pattern with a parallel tree: `backend/courses/<course-slug>/*.yaml`, one file per quest. If you're writing new quest content, you're writing a YAML file in that tree, the same mental model as writing a quiz — just with new fields and new type values.

## Fields every quest shares

Regardless of activity type, a quest file needs:

| Field | Purpose |
|---|---|
| `id` | Unique quest identifier, referenced by `quest_completions` and `credit_ledger` |
| `title` / `prompt` | What the student sees |
| `stage` | Maps back to the UA Framework document/pass this quest corresponds to, e.g. `"Stage 1 — Pass 1"` — this is what lets the campaign map render progress against a student's real `UA0-PROJECT-STATUS.md` if one exists |
| `type` | One of the five activity types below |
| `credit_budget` | How many tokens this quest allows before the credit meter runs dry — tune this deliberately per quest difficulty, not as a flat default across everything |

## The five activity types

Each has its own schema and grading approach — read the matching reference file for the one you're writing:

| Type | Reference | What it needs from you |
|---|---|---|
| `ai_chat_challenge` | `references/ai_chat_challenge.md` | A specific target outcome and a rubric for the grader to check against |
| `credit_budget_sim` | `references/credit_budget_sim.md` | A bug or feature scenario with a hard credit ceiling |
| `spec_sprint` | `references/spec_sprint.md` | A screen/feature prompt and the five-part description rubric |
| `debug_rescue` | `references/debug_rescue.md` | A topic and difficulty for `/api/ai/generate-bug` to work from |
| `reflection_journal` | `references/reflection_journal.md` | A reflection prompt tied to what the student just did |

If you're not sure which type fits what someone's asking for, the fast heuristic: does it need the AI to *evaluate* something the student produced against criteria (`ai_chat_challenge`, `spec_sprint`)? Does it need the AI to *generate* a flawed artifact (`debug_rescue`)? Is credit scarcity itself the point (`credit_budget_sim`)? Or is there no AI grading at all, just an unlock-on-submit reflection (`reflection_journal`)?

## Writing a good rubric (for the two rubric-graded types)

The single most common way these quests go wrong is a vague rubric — "did the student explain it well" produces inconsistent grading because the model has nothing concrete to check. Every rubric criterion should be independently checkable and phrased so a grader (human or model) could point at specific evidence, not render a subjective overall impression. Compare:

**Weak:** "Explains the bug clearly"
**Strong:** "Names the specific line or variable causing the incorrect behavior" / "States what the code currently does versus what it should do" / "Does not just restate the error message without explaining the cause"

Write 3-5 criteria per rubric, not one giant one. This also makes the grading endpoint's output more useful to the student — specific per-criterion feedback teaches more than a single pass/fail.

## Tuning credit budgets

A quest's `credit_budget` is a real design decision, not a placeholder. Too generous and the "running out of credits" mechanic never triggers, which quietly undoes the whole point of the credit economy (design doc §3). Too tight and students can't complete a reasonable attempt even when using the AI well, which teaches frustration instead of discipline. A reasonable starting point is to draft the quest, complete it yourself using only the AI calls a careful (not lazy) student would make, note the actual token spend, and set the budget slightly above that — then adjust after watching real students hit it.

## Testing checklist for a new quest file

- Confirm the file parses as valid YAML and appears in `load_questions()`'s output (or the course-content equivalent) without errors.
- If it's a rubric-graded type, confirm every criterion is independently checkable — could two different graders looking at the same submission agree on each one?
- Confirm `stage` matches an actual UA Framework stage/pass name from `AGENTS.md`'s routing table, not a made-up label the campaign map won't recognize.
- Run the quest once yourself and check whether `credit_budget` felt right — too loose or too tight are both worth catching before students do.

## Related skills

- `credit-ledger-integration` — reads this file's `credit_budget` at runtime to enforce the ceiling.
- `ai-tutor-endpoints` — grades `ai_chat_challenge` and `spec_sprint` submissions against the rubric written here.
- `ai-coding-tier-setup` — generates the flawed code for `debug_rescue` quests from the topic/difficulty declared here.
