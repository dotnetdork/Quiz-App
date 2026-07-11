# AI Course Extension — Build Plan

**Status:** Living document — update the checkboxes and "Where we are" line as milestones land, the same way UA Framework's own `UA0-PROJECT-STATUS.md` tracks progress for students.
**Companion doc:** `docs/AI-COURSE-EXTENSION-PLAN.md` (the design — read that first if you need the *why* behind any of this)
**Working style:** No fixed deadline. Sequenced for quality — each milestone should be fully working and verified before the next one starts, not half-built in parallel.

## Where we are

Milestones 0, 1, 2, and 3 are done (2026-07-10). Milestone 4 (pilot readiness pass) is next.

**Why Milestone 3 got pulled forward immediately after Milestone 2:** M1/M2 were deliberately backend-only, verified through Swagger UI and pytest — but that meant the extension was invisible in the actual running app. Once M2 was done, that became a real, reasonable complaint ("how do I look this over if there's no frontend?"), so M3 was built right away rather than left for later.

**Known blocker, not blocking further work:** the real OpenRouter account behind the current key has $0 credit balance (confirmed via a `402 Insufficient credits` from OpenRouter itself, not a bug in this codebase — see the two bugfix notes below for the auth/routing issues that were real bugs). Auth and model routing are both confirmed correct up to that point. Proceeding with Milestone 2 on the assumption the account gets funded separately; nothing here needs to change once it is.

**Post-M1 bugfix #1 (2026-07-10):** Real-world testing via Swagger UI hit a bare 500 on `/api/ai/tutor-chat`. Root cause: `config.py`'s defaults used `deepseek-v3.2` (not a real, currently-accepted DeepSeek model) and a base URL with a stray `/beta` suffix. Fixed in `config.py`. Also hardened `ai_routes.py`: a provider-side failure (bad model name, bad key, network error) now returns a clean `502` with a logged server-side traceback instead of a bare, undebuggable `500` — added `test_tutor_chat_provider_failure_returns_clean_502` to cover this.

**Post-M1 bugfix #2 (2026-07-10):** Fixing bugfix #1 surfaced a bigger issue: the real DeepSeek call still failed, this time with a clean `502` and a `401 invalid api key` from DeepSeek itself. The League's available key for this project turned out to be an **OpenRouter** key (the same one already configured in the project's Continue.dev `config.yaml`), not a DeepSeek-issued key — DeepSeek's API correctly rejects OpenRouter keys as invalid, since they're a different issuer entirely. Fix: switched the provider from calling DeepSeek's API directly to calling it through OpenRouter (openrouter.ai), which is itself OpenAI-compatible. Renamed `DEEPSEEK_API_KEY`/`DEEPSEEK_API_BASE` to `OPENROUTER_API_KEY`/`OPENROUTER_API_BASE` in `config.py` and `.env-template` (requires a matching one-line rename in the real `.env`, done manually since it holds a secret), base URL is now `https://openrouter.ai/api/v1`, and model slugs now use OpenRouter's `<provider>/<model>` convention (`deepseek/deepseek-v4-flash`, `deepseek/deepseek-v4-pro` — confirmed via openrouter.ai/deepseek). Propagated to `docs/AI-COURSE-EXTENSION-PLAN.md`, `backend/ai_routes.py`, `backend/requirements.txt`, and the skill files under `.claude/skills/`. All 6 tests still pass (the fake-client tests aren't affected by provider choice).

**Open decisions made autonomously during Milestone 1 — worth a look, not blocking:**
- Rate limit default is 6 calls/minute per user (`AI_RATE_LIMIT_MAX_CALLS`/`AI_RATE_LIMIT_WINDOW_SECONDS` in `config.py`, overridable via env). Arbitrary starting point, easy to tune.
- Credits are raw token counts, not a converted "friendlier" unit (e.g. "1 credit = 100 tokens"). Simplest for MVP; revisit once real students are looking at these numbers on the credit meter and "you have 1,847 tokens left" turns out to read worse than "you have 18 credits left."
- Every quest currently gets a hardcoded 2,000-token budget (`get_quest_credit_budget()` in `ai_routes.py`, marked `TODO(Milestone 2)`) since no quest YAML loader exists yet. Milestone 2 replaces this with real per-quest budgets from content.
- `pytest` was added directly to `requirements.txt` rather than a separate dev-only requirements file, matching this repo's existing single-file convention.

---

## Milestone 0 — Prerequisites (done)

- [x] `backend/deps.py` created; `get_current_user`/`require_user` consolidated there instead of living in `main.py` with a second, slightly different copy inlined in `quiz_routes.py`.
- [x] `backend/requirements.txt` has `openai==2.44.0` (DeepSeek's API is OpenAI-compatible, so this client works against it — see design doc §6).
- [x] `.env-template` documents `DEEPSEEK_API_KEY`.
- [ ] **Action needed from you:** your local `.env` doesn't have `DEEPSEEK_API_KEY` set yet (I checked for the key's presence, not its value). Add it before Milestone 1's backend code can actually make a real call — everything up to that point can be built and unit-tested without it.

---

## Milestone 1 — Backend AI plumbing, no course content yet (done 2026-07-10)

The goal here is entirely infrastructure: prove the credit economy is real and correctly wired *before* any student-facing content exists to spend against. This is the highest-risk piece to get wrong (it's the one that touches real money), so it goes first and gets tested hardest.

- [x] `backend/models.py`: added `CreditLedger`, `CourseProgress`, `QuestCompletion` (design doc §7), same SQLAlchemy style as the existing `User`/`Score`.
- [x] `backend/ai_routes.py`: the shared `call_model_and_log()` helper and budget-check gate (`credit-ledger-integration` skill), plus `POST /api/ai/tutor-chat` and `GET /api/ai/credits` (`ai-tutor-endpoints` skill, fast tier). Tutor persona lives in `backend/prompts/tutor_system_prompt.md`, loaded at import time rather than inlined as a Python string.
- [x] `main.py`: registered `ai_routes.router` at `/api/ai`, alongside the existing `quiz_router`/`leaderboard_router`, before the static-file catch-all.
- [x] **Rate limiting**: simple in-memory per-user sliding-window cap (`enforce_rate_limit()` in `ai_routes.py`, default 6 calls/60s, tunable via `AI_RATE_LIMIT_MAX_CALLS`/`AI_RATE_LIMIT_WINDOW_SECONDS`), sitting in front of the budget check.
- [x] **Tests**: `backend/tests/` (new — first backend tests in this repo). `conftest.py` sets up an isolated in-memory DB and dependency overrides so tests don't need a real session cookie or DeepSeek key; `test_ai_routes.py` covers: 401 with no auth, a successful call logging exactly one correctly-tiered `credit_ledger` row, the budget check blocking a call *before* the model is ever invoked (asserted via a fake client that raises if called), and the rate limiter tripping with 429. All 5 pass (`pytest tests/ -v` from `backend/`).

**Exit check (partially verified — real API call still needs your DeepSeek key in `.env`):** the plumbing is proven end to end against a fake model client. What hasn't been verified yet is a *real* DeepSeek call, since that needs `DEEPSEEK_API_KEY` actually set locally. Once you add it, a quick manual check (`curl` or `/docs` Swagger UI, logged in) that `/api/ai/tutor-chat` returns a real reply and `/api/ai/credits` reflects the spend closes this out.

---

## Milestone 2 — First quest content + progress tracking (done 2026-07-10)

- [x] `backend/courses/build-real-stuff/` — `kickoff_ux_reflection` (`reflection_journal`, `credit_budget: 0` — no AI call at all, the simplest possible content to prove the quest-loading pattern) and `pressure_test_target_customer` (`ai_chat_challenge`, `credit_budget: 1500`, exercises the real tutor call end-to-end). Both authored per the `course-quest-authoring` skill.
- [x] **Renamed 2026-07-10** (post-M3 feedback): `kickoff_driver_seat_reflection` → `kickoff_ux_reflection`. The original prompt led with "staying in the driver's seat" (AI-ownership framing) as the very first thing a student reads — feedback was that this course should lead with UI/UX first, not AI-ownership philosophy. The AI-ownership theme still matters (see design doc §3's credit-economy rationale) but now surfaces later, through the credit meter and tutor experience itself, rather than as the opening reflection prompt. New prompt asks students to observe and name concrete UI/UX decisions in an app they already use daily.
- [x] **New file `backend/course_routes.py`** (deviation from the original plan, which said this would live in `ai_routes.py`): owns `load_quests()`/`get_quest()` (auto-discovery, same walk-the-directory pattern as `quiz_routes.load_questions()`), `GET /api/courses/{course_slug}/quests` (list), `GET /api/courses/{course_slug}/quests/{quest_id}` (detail), and `POST /api/courses/{course_slug}/quests/{quest_id}/complete` (records a `quest_completions` row, updates `course_progress` xp/streak). This mirrors `quiz_routes.py`'s role for quizzes more closely than dumping quest-loading into the AI-calling module — `ai_routes.py` imports `get_quest()` from here instead.
- [x] `backend/ai_routes.py`: `get_quest_credit_budget()` now does a real lookup via `get_quest()` instead of the Milestone 1 hardcoded-2000 placeholder — an unknown `quest_id` is a 404, not a silently-granted budget. Added `POST /api/ai/grade-response` (rubric grading, fast tier, temperature 0.1, JSON-structured output) per the `ai-tutor-endpoints` skill; `call_model_and_log()` gained optional `temperature`/`response_format` passthrough to support it without changing `tutor_chat`'s behavior.
- [x] **Tests**: `test_course_routes.py` (quest loading/detail/completion against the real quest files above) and `test_grade_response.py` (structured grading, no-rubric 400, malformed-JSON 502, credits-exhausted 402) — 23/23 passing total. The 4 Milestone 1 tests that used placeholder quest ids now monkeypatch `get_quest_credit_budget` directly, decoupling credit-ledger *mechanics* tests from real quest *content*.

**Exit check:** both quests can be fetched (`GET /api/courses/build-real-stuff/quests`), and completed (`POST .../complete`) purely through API calls — verified via the test suite. Real end-to-end grading against a live OpenRouter reply still depends on the account-credits blocker noted above.

---

## Milestone 3 — Minimal frontend for the first slice (done 2026-07-10)

Deliberately minimal here — a working list-of-quests page, not the full campaign-map visuals. Polish comes after the mechanic is proven, not before.

- [x] `backend/course_routes.py`: added `GET /{course_slug}/progress` (new endpoint, not in the original plan) returning `{xp, streak_count, current_quest, completed_quest_ids}`. Needed because `complete_quest`'s response only reflects state *after* an attempt — the CourseMap page needs a way to show where a student already stands on page load. `completed_quest_ids` is derived from `QuestCompletion` rows filtered by `user_id` only (not `course_slug`, since that column doesn't exist on the model) — fine with a single course, worth revisiting if a second one is added. 3 new tests in `test_course_routes.py`; 26/26 passing overall.
- [x] `frontend/src/api.js`: added a 5s cache TTL for `/api/ai/credits` and a 1min TTL for `/api/courses/`; extended the post-mutation cache-clearing block to clear `/api/ai/credits` after `tutor-chat`/`grade-response` calls and `/progress` after any `/complete` call. Also fixed a real bug found while reading this file: `apiCall`'s error handling assumed `data.detail` was always a string (true for FastAPI's defaults), but the AI extension's endpoints raise object-shaped `detail` (`{"error": "credits_exhausted", "message": "..."}`) — `new Error(data.detail)` on an object stringifies to `"[object Object]"`. Fixed by checking the type and preferring `.message`, and attaching the raw `.detail` and `.status` to the thrown `Error` so components can branch on `error.detail?.error` (e.g. show a dedicated "out of credits" state) instead of string-matching a message.
- [x] `frontend/src/context/AuthContext.js`: `prefetchDashboardData()` now also fetches `GET /api/courses/build-real-stuff/progress` in the same `Promise.all`, with a zeroed fallback on failure so a slow/broken courses API never blocks the rest of the (already-working) dashboard prefetch. Exported `BUILD_REAL_STUFF_SLUG` as the one hardcoded course slug for now.
- [x] `frontend/src/pages/CourseMap.js` (new) — XP/streak/completed-count header + a quest card grid (reusing `Dashboard.js`'s `.quiz-card-modern`/`.stats-grid` classes for visual consistency rather than inventing new ones), each card linking to `/course/:courseSlug/quest/:questId`. Follows `Dashboard.js`'s prefetch-then-fallback pattern.
- [x] `frontend/src/pages/QuestDetail.js` (new) — **architectural deviation from the original plan**, which called for extending `Quiz.js`'s `question.type` chain. After reading `Quiz.js` closely, quests turned out to be a different data model entirely (quest completion + XP/streak vs. `quiz.questions` scored all-at-once with a `results` screen) — extending `Quiz.js` would have meant fighting its assumptions rather than reusing anything real from it. `QuestDetail` branches on `quest.type`: `reflection_journal` gets a plain textarea with a live word count against `min_length_words` (draft auto-saved to `localStorage` per quest id so a refresh doesn't lose it) and completes via `POST .../complete`; `ai_chat_challenge` renders the new `AITutorPanel`; anything else gets a "not supported yet" message instead of crashing.
- [x] `frontend/src/components/CreditMeter.js` (new) — reads `GET /api/ai/credits` live (never a stored/cached balance, matching the backend's own rule), takes a `refreshSignal` prop bumped after each AI call to force a re-fetch. Renders nothing for `credit_budget: 0` quests (nothing to show).
- [x] `frontend/src/components/AITutorPanel.js` (new) — chat widget for `ai_chat_challenge` quests. Calls `POST /api/ai/tutor-chat` per message; a separate, student-initiated "Submit conversation for grading" button sends the full transcript to `POST /api/ai/grade-response` (grading spends a credit too, so it's deliberately not automatic after every message). Renders each rubric criterion's pass/fail + evidence. Handles `credits_exhausted`/`rate_limited`/`no_rubric` error codes from `error.detail.error` with specific messages rather than a generic failure banner.
- [x] `frontend/src/App.js`: lazy-loaded `CourseMap`/`QuestDetail`, added routes `/course/:courseSlug` and `/course/:courseSlug/quest/:questId` (both `ProtectedRoute`-wrapped), added a "Build Real Stuff" nav link.
- [x] New CSS in `App.css` for `.credit-meter*` and `.ai-tutor-*` classes, reusing existing CSS variables (`--color-accent`, `--color-error`, spacing/radius scale) rather than introducing new ones.

**Judgment call, not fully settled:** `AIChatChallengeQuest`'s "Mark quest complete" button is always enabled, even if the rubric grading hasn't returned `all_passed: true` yet (or hasn't been run at all) — mirrors the backend's own "if you're out of credits, finish on your own" philosophy rather than hard-gating completion on AI approval. Worth revisiting during the Milestone 4 UX pass once this has actually been used.

**Known gap:** a reflection quest's actual written text isn't persisted server-side anywhere (`QuestCompletion` only has `artifact_ref`, a reference/path, not a text body) — only completion + the word count implied by passing the client-side check. The text lives in the browser's `localStorage` as a draft and is cleared on submit. Fine for now (no instructor review flow exists yet either), but a real text-storage field is worth adding before reflections need to be read by anyone.

**Exit check:** log in, click "Build Real Stuff" in the nav, see XP/streak/quest cards, open the reflection quest and submit it (completes instantly, no AI/credits involved), open the AI chat challenge quest and see the credit meter — a real chat exchange still depends on the OpenRouter account-credits blocker noted above, but the 502/429/402 error paths were verified against the fake-client test suite and render distinct, honest messages in `AITutorPanel` rather than a generic failure.

---

## Milestone 4 — Pilot readiness pass

- [ ] Manually verify the "ran out of credits mid-quest" experience actually feels like the intended teaching moment (design doc §3) and not just an error message — this is a UX check, not a backend check.
- [ ] Decide, based on how Milestones 1-3 actually felt to build and use, whether to proceed straight to Milestone 5 or pause and get real student feedback first. Given there's no fixed deadline, pausing here for a small pilot is a reasonable default rather than something that needs special justification.

---

## Milestone 5+ — Expansion (not urgent, ordered by dependency, not by date)

- [ ] `debug_rescue` quest type + `/api/ai/generate-bug` (agent tier, `ai-coding-tier-setup` skill).
- [ ] `spec_sprint` quest type, tied into the UA Framework specification skill's five-part rubric.
- [ ] Phase B: devcontainer `config.yaml` for real coding sessions (`ai-coding-tier-setup` skill) — this is the point where "The Build" region becomes real, not simulated.
- [ ] Campaign-map visual polish: regions, XP levels, streaks, badges (design doc §2).
- [ ] Revisit SQLite → Postgres once `credit_ledger`'s write volume actually justifies it, not preemptively.

---

## Notes for future sessions

If you're picking this up without full context: read `docs/AI-COURSE-EXTENSION-PLAN.md` first (the why), then this file (the where), then the four skills in `.claude/skills/` (`credit-ledger-integration`, `ai-tutor-endpoints`, `ai-coding-tier-setup`, `course-quest-authoring` — the how). Update the checkboxes and the "Where we are" line at the top of this file whenever a milestone lands, the same discipline UA Framework already expects of its own status file — this file is your memory across sessions, not a form to fill out for its own sake.
