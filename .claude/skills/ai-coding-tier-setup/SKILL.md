---
name: ai-coding-tier-setup
description: Guide implementing the coding-capable tier of the Quiz-App AI course extension — the POST /api/ai/generate-bug endpoint used by debug_rescue quests, and the .devcontainer Continue.dev config.yaml that wires up real agent-assisted coding for the "Build Real Stuff" course region — both using DeepSeek V4 Pro per docs/AI-COURSE-EXTENSION-PLAN.md §6. Use this whenever building the debug_rescue activity type's bug-generation logic, whenever setting up or modifying .devcontainer/ for the course, whenever a quest needs genuine coding ability rather than tutoring or grading, or when deciding whether a given AI call is expensive enough to need this tier at all.
---

# AI Coding Tier Setup (agent tier)

## Why this tier exists, and why it should stay small

DeepSeek V4 Pro costs roughly 3x DeepSeek V4 Flash per token. It earns that cost in exactly two places in this course: generating a bug that's actually subtly wrong rather than obviously or incorrectly wrong, and doing real agent-assisted coding where the student needs a capable pair-programmer. Everything else — tutor chat, rubric grading — belongs on the cheap tier (see the `ai-tutor-endpoints` skill). Part of this skill's job is gatekeeping: if you're about to route a new call to V4 Pro, ask first whether it's actually generating or reasoning about code, or whether it's really just following instructions, in which case it belongs on the fast tier instead.

## `/api/ai/generate-bug` — debug_rescue's engine

This is the one backend endpoint on this tier. It needs to produce, per attempt (not from a fixed bank a student could memorize), a piece of code that looks plausible but has a specific, identifiable flaw. The design constraint that matters most: the bug has to be *real* and *catchable*, not decorative.

1. **Input**: the quest's topic/theme and difficulty (from the quest's YAML — see `course-quest-authoring`'s `debug_rescue.md` reference for the exact schema).
2. **Generation**: ask DeepSeek V4 Pro for two things in one call — a working reference solution, and a variant with one introduced flaw — plus a short internal explanation of what the flaw is and why it's wrong. Keep the explanation server-side only; it's the answer key, and it must never reach the frontend before the student submits their own explanation.
3. **Validation before showing the student anything**: a freshly generated "bug" from a model is not guaranteed to actually be a bug, or to be at the right difficulty — it might be trivially obvious, or might not actually break anything. Before serving it, run a cheap sanity check: does the reference solution actually differ from the flawed variant in exactly the way the explanation claims? If you have a way to execute the code (even a simple syntax/type check), use it — don't ship an unvalidated generation straight to a student, since a wrong "bug" undermines the exercise's credibility in a way that's hard to recover from mid-quest.
4. **Grading the student's response**: once the student names the bug and explains it, that comparison against the internal answer key is a rubric-grading task — route it to `/api/ai/grade-response` on the fast tier (see `ai-tutor-endpoints`), not back through V4 Pro. Generating the bug needs coding capability; checking whether a student correctly identified it does not.

## Devcontainer setup for Phase B — real coding

For "The Build" region, students work in the existing `.devcontainer` (already Python 3.12 + Node 20, see `.devcontainer/devcontainer.json`) with Continue.dev installed and configured to use both DeepSeek tiers. This is the config.yaml template from the design doc — place it wherever the devcontainer setup script (`.devcontainer/post-create.sh`) expects Continue's config, or document the path clearly if introducing a new location:

```yaml
name: Build Real Stuff
version: 1.0.0
schema: v1
models:
  - name: DeepSeek V4 Flash (fast)
    provider: openrouter
    model: deepseek/deepseek-v4-flash
    apiKey: ${{ secrets.OPENROUTER_API_KEY }}
    roles: [autocomplete, summarize]
    contextLength: 128000
  - name: DeepSeek V4 Pro (agent)
    provider: openrouter
    model: deepseek/deepseek-v4-pro
    apiKey: ${{ secrets.OPENROUTER_API_KEY }}
    roles: [chat, edit, apply]
    contextLength: 1000000
```

The role split matters: autocomplete fires dozens of times a minute and doesn't need frontier quality, so it goes to the cheap model; chat/edit/apply are the less frequent, higher-stakes calls where the student is actually leaning on the AI to help build something, so those go to V4 Pro. `OPENROUTER_API_KEY` should come from the same secret the backend's `.env` uses (see `credit-ledger-integration` and the existing `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` pattern in `.devcontainer/devcontainer.json`'s `remoteEnv` block) — one key, one real budget, which is what makes the credit economy honest instead of simulated.

## Grading Phase B build quests

Quiz-App's backend can't observe a devcontainer coding session directly, so build-quest completion should be graded from artifacts instead: git commit history (treat this as a real record, not something to be squashed clean — the design doc explicitly calls this out as pedagogically important), the presence and shape of expected files, and a final "explain your code back to the tutor" walkthrough quest — which is a conversational grading task and belongs back on the fast tier via `/api/ai/tutor-chat`, not this one.

## Testing checklist

- Generate several bugs for the same topic/difficulty and confirm they're not identical (freshness) and that each one's flaw is real, not fabricated after the fact.
- Confirm the validation step actually rejects a generation where the "flaw" doesn't reproduce, rather than serving it anyway.
- Confirm `/api/ai/generate-bug` is the only endpoint calling the model with `tier="agent"` in `credit_ledger` — grading and tutor calls that show up as `"agent"` tier are misrouted.
- In the devcontainer, confirm autocomplete requests hit the fast model and chat/agent requests hit V4 Pro (check Continue's logs or a request inspector, not just the config file — configs can be right while runtime behavior drifts).

## Related skills

- `credit-ledger-integration` — the shared helper and budget checks this endpoint must use.
- `ai-tutor-endpoints` — where bug-explanation grading and the walkthrough quest actually get routed (fast tier, not this one).
- `course-quest-authoring` — the `debug_rescue.md` reference has the exact YAML schema `/api/ai/generate-bug` reads from.
