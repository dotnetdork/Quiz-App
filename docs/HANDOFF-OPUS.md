# Handoff: Build Real Stuff (AI/SDLC Course Extension)

**Written:** 2026-07-10, end of session, for a fresh Opus session picking this up with no memory of the work described here.
**Companion docs (read these too, in this order):** `docs/AI-COURSE-EXTENSION-PLAN.md` (the *why* — original design), `docs/AI-COURSE-BUILD-PLAN.md` (the *where* — living milestone tracker, update it as you go), then this file (the *what's-next*).
**Repo:** Quiz-App (The League of Amazing Programmers' Codecademy-style quiz platform). This extension adds a gamified course, "Build Real Stuff," that teaches high schoolers to use AI as a tool without losing ownership of the work — credit economy, quests, XP/streaks, all wired into the existing FastAPI + React app.

---

## 1. Do this first, it's unfinished

The most recent thing the user asked for, right before this handoff was requested, **has not been implemented yet**:

> "Can you make the design of the course unique in comparison to the quiz app portion in the dashboard? I'm also wondering what a good solution for this design is for future scalability. I like the color scheme and everything else, but would like to improve all aspects of this app. Please help me figure out what could be refined throughout the entire quiz-app to make this system work. That goes for its UI/UX design of the app itself."

Context: earlier in the session the course pages (`CourseMap.js`, `QuestDetail.js`) were deliberately redesigned to **match** Dashboard.js's existing visual language (gradient hero card, spinning avatar ring, `stat-card-modern` tiles, `quiz-card-modern` cards) because the first pass looked too plain and the user said to reuse the app's existing playful style. That work is done and looks good. But the user's *follow-up* ask is different and hasn't been addressed: they now want the course section to have its **own distinct visual identity** rather than looking identical to the quiz dashboard, *and* they want a broader think-through of the whole app's CSS architecture for scalability, plus general UI/UX refinement ideas across the entire app (not just this course extension).

This is a real scope expansion. Suggested approach, not yet executed:

- **Give the course its own accent identity while sharing structure.** The app's CSS (`frontend/src/index.css` + `frontend/src/App.css`, ~2300 lines combined) already has a decent token layer (`--color-primary`, `--color-secondary`, `--spacing-*`, `--radius-*`, `--font-*` custom properties defined in `index.css`). The problem is that component-level classes (`.user-profile-card`, `.stat-card-modern`, `.quiz-card-modern`, `.category-card-modern`) hardcode League Orange/Navy directly in the CSS rather than through a themeable variable, so reusing the *structure* for the course currently means reusing the *exact same colors* too. A clean fix: introduce a `--theme-accent`/`--theme-accent-dark` pair (or similar) that these shared classes reference instead of the hardcoded orange, then wrap the course pages in a container class (e.g. `.theme-build-real-stuff`) that overrides those two variables to a distinct hue (something like a violet/teal to signal "AI/build lab" vs. the orange "quiz" identity — the existing `getQuestColor()`/`QUEST_TYPE_ICONS` in `frontend/src/components/QuestIcons.js` already establishes an orange/navy/green per-quest-type palette that could inform this, or be reworked alongside it).
- **Extract real shared primitives instead of copy-pasted card variants.** Right now `user-profile-card` (Dashboard's profile card, reused as-is for the course hero) and `quiz-card-modern` (quiz cards, reused as-is for quest cards) are literally the same CSS classes doing double duty. That's fine for now, but if a third section is added later (e.g. a future course, a badges page) the instinct will be to either reuse these dashboard-specific class names for unrelated content (confusing) or copy-paste the whole block again (the exact duplication problem the user is flagging). Worth proposing genuinely generic primitive classes — e.g. `.hero-card`, `.stat-tile`, `.content-card` — that `Dashboard.js`, `CourseMap.js`, and `QuestDetail.js` all consume, with `.user-profile-card`/`.stat-card-modern`/`.quiz-card-modern` either becoming thin aliases or being migrated away from over time. This is a bigger refactor — scope it with the user before doing a sweeping rename, since `Dashboard.js`, `Quiz.js`, and `Leaderboard.js` all currently depend on the existing class names.
- **CSS file organization.** `App.css` is one 2300+ line file with section-comment dividers but no real modularity. CRA supports plain CSS imports fine, so splitting into `styles/tokens.css`, `styles/dashboard.css`, `styles/course.css`, `styles/quiz.css` etc. (imported from `App.css` or directly in components) would make "which file do I touch for X" much clearer as the app grows. This is a mechanical, low-risk refactor — good candidate to actually just do, after confirming the user wants file-splitting and not just conceptual guidance.
- **Broader app-wide UI/UX refinement** — the user's ask here is open-ended ("refine throughout the entire quiz-app"). Do not assume they want you to redesign `Dashboard.js`/`Quiz.js`/`Leaderboard.js`/`Login.js` visuals right now. That's a much bigger job than today's course-extension work. **Recommend using `AskUserQuestion` to scope this** before touching those files: are they asking for (a) just the course's visual distinction + a scalable pattern going forward, (b) a full design-token refactor across the whole app now, or (c) a lighter audit/punch-list first. The user has previously pushed back hard when work proceeded on an assumption rather than confirmed scope (see §5), so don't guess big here.

---

## 2. What's actually done and working

All four milestones from `docs/AI-COURSE-BUILD-PLAN.md` are complete as of 2026-07-10:

- **Milestone 0/1 (backend AI plumbing):** `backend/ai_routes.py` — credit-ledger enforcement (`call_model_and_log`, `get_remaining_budget`, never a cached balance), rate limiting, `POST /api/ai/tutor-chat`, `GET /api/ai/credits`. Routes through **OpenRouter** (not DeepSeek directly — see §4 for why), model slugs `deepseek/deepseek-v4-flash` (fast tier) / `deepseek/deepseek-v4-pro` (agent tier, unused so far).
- **Milestone 2 (quest content + progress):** `backend/course_routes.py` (mirrors `quiz_routes.py`'s role — `load_quests()`, `get_quest()`, `GET .../quests`, `GET .../quests/{id}`, `POST .../quests/{id}/complete`, `GET .../progress`). Two real quests in `backend/courses/build-real-stuff/`: `kickoff_ux_reflection` (renamed today from `kickoff_driver_seat_reflection` — see §3) and `pressure_test_target_customer` (`ai_chat_challenge`, 4-criterion rubric). `POST /api/ai/grade-response` for rubric grading (structured JSON output, temperature 0.1).
- **Milestone 3 (frontend):** `frontend/src/pages/CourseMap.js` (quest list + XP/level/streak header), `frontend/src/pages/QuestDetail.js` (branches on quest type: reflection textarea with word-count bar, or the AI chat panel), `frontend/src/components/AITutorPanel.js` (chat widget, avatar bubbles, student-initiated grading), `frontend/src/components/CreditMeter.js` (live budget bar), `frontend/src/components/QuestIcons.js` (SVG icons per quest type). Routes `/course/:courseSlug` and `/course/:courseSlug/quest/:questId` added to `App.js`, both `ProtectedRoute`-wrapped, plus a nav link.
- **Test suite:** `backend/tests/` — 26/26 passing (`pytest tests/ -v` from `backend/`). Covers credit-ledger mechanics (fake client, decoupled from real quest content), real quest loading/completion/progress, and rubric grading (success, mixed pass/fail, no-rubric 400, malformed-JSON 502, credits-exhausted 402).
- **Design/copy fix (2026-07-10, later in session):** the course description and the kickoff quest were originally framed around "staying in the driver's seat" (AI-ownership language). User feedback: this course should lead with **UI/UX first**, not AI-ownership philosophy. Fixed: `CourseMap.js`'s hero description now leads with UI/UX/research/planning; `kickoff_driver_seat_reflection` was renamed to `kickoff_ux_reflection` and its prompt rewritten to ask students to observe concrete UI/UX decisions in an app they already use, rather than reflect on AI ownership. The AI-ownership theme still exists in the design doc (`AI-COURSE-EXTENSION-PLAN.md` §3, credit economy) and now surfaces later through the credit meter/tutor experience itself rather than as the opening reflection.

---

## 3. Known blockers (not bugs — don't try to "fix" these)

1. **OpenRouter account has a $0 credit balance.** Confirmed via a real `402 Insufficient credits` from OpenRouter itself, after auth/routing were both confirmed correct (see `AI-COURSE-BUILD-PLAN.md`'s bugfix notes for the two real bugs that led here: wrong model name/base URL, then wrong provider entirely — DeepSeek key vs. OpenRouter key). This is an external account-funding issue, not something fixable in code. The user explicitly said to build ahead of this and treat it as resolved externally later. Nothing needs to change in the code once it's funded.
2. **`frontend/build/` (the production bundle FastAPI serves via its static-file catch-all in `main.py`) is stale** — it predates all of today's frontend work and does not contain `CourseMap`/`QuestDetail`/etc. This caused real user-visible confusion (`localhost:8000/courses/build-real-stuff` rendered blank, because that build has never heard of the course routes, and also because the user tried the plural `/courses/` URL instead of the actual singular `/course/` route).
   - **If you're running in the same Linux sandbox this session used:** `npm run build` fails at the "empty the build directory" step with `EPERM: operation not permitted, unlink ...` — the sandbox can *overwrite* files in place (`cp` over an existing file works) but cannot *delete* them (`rm`/`unlink` fails on files that live on the Windows-mounted path). Workaround if you need to rebuild from this sandbox: set `BUILD_PATH=/tmp/newbuild` (or similar, off the mounted path) so CRA builds somewhere deletion works, then `cp -r` (not `rm` first) the output files into `frontend/build/`, accepting that old orphaned hashed chunk files will sit unused alongside the new ones (harmless — nothing references them once `index.html`/`asset-manifest.json` are overwritten with the new hashes).
   - **Better fix:** tell the user to just run `npm run build` themselves from a real Windows terminal (not this sandbox), or better yet, use `npm start` (dev server on port 3000) to actually develop/verify against, and only build for the port-8000 static-serving path when they want a "production-style" check.
3. **This sandbox's bash-mounted view of the repo (`/sessions/.../mnt/Quiz-App/...`) repeatedly goes stale or corrupts relative to the real Windows-path files (`D:\Users\voido\source\repos\Quiz-App\...`).** Symptoms seen this session: truncated file contents, stale `.pyc` bytecode being used despite source changes, and once, null bytes injected into two test files after a `replace_all` Edit. **The Windows-path Read/Write/Edit tools are always ground truth.** Established workaround, used repeatedly and successfully: Read the file via the Windows path, `Write` an identical copy to a scratch file in the outputs directory, then `cp` that scratch file over the stale bash-mounted path, then re-verify (`python3 -c "import ast; ast.parse(...)"` for Python, `@babel/parser` for JS — see `frontend/node_modules/@babel/parser`, already available, no need to run a full CRA build to catch syntax errors). Expect to hit this again; don't trust bash-side reads/edits without cross-checking against the Windows-path tools when something looks unexpectedly broken.

---

## 4. Architecture map (where things live)

**Backend** (`backend/`):
- `config.py` — `OPENROUTER_API_KEY`/`OPENROUTER_API_BASE`, `AI_MODEL_BY_TIER`, rate-limit constants.
- `ai_routes.py` — all AI-model-calling endpoints, credit-ledger enforcement, rate limiting. `call_model_and_log()` is the *only* function allowed to call a model — route everything through it.
- `course_routes.py` — quest content loading (`load_quests()`/`get_quest()`, auto-discovered from `backend/courses/<slug>/*.yaml`), quest listing/detail/completion/progress endpoints. `ai_routes.py` imports `get_quest()` from here rather than duplicating loading logic.
- `courses/build-real-stuff/*.yaml` — quest content. Each file's top level is a **list** of quest dicts (differs from `backend/quizzes/`'s one-dict-per-file convention).
- `models.py` — `CreditLedger`, `CourseProgress`, `QuestCompletion` (new tables for this extension).
- `tests/` — `conftest.py` has the shared fixtures (`client`, `unauth_client`, `test_user`, `test_engine` — isolated in-memory SQLite per test, `get_db`/`require_user` overridden). `test_ai_routes.py`, `test_course_routes.py`, `test_grade_response.py`.
- `.claude/skills/` — `credit-ledger-integration`, `ai-tutor-endpoints`, `ai-coding-tier-setup`, `course-quest-authoring` — read these for the *how* of extending any of this.

**Frontend** (`frontend/src/`):
- `api.js` — the shared `apiCall()` fetch helper. Already handles the AI extension's object-shaped `HTTPException` `detail` (a real bug found and fixed this session — most FastAPI errors have string `detail`, this extension's don't) and clears the right caches after credit-spending/quest-completing mutations.
- `context/AuthContext.js` — `prefetchDashboardData()` now also prefetches course progress (`BUILD_REAL_STUFF_SLUG` exported from here as the one hardcoded course slug — will need to become a route param if a second course is ever added).
- `pages/CourseMap.js`, `pages/QuestDetail.js`, `components/AITutorPanel.js`, `components/CreditMeter.js`, `components/QuestIcons.js` — see §2.
- `App.js` — routes and nav link for the course extension.
- `App.css`/`index.css` — see §1 for the scalability discussion; this is where any design-system work happens.

---

## 5. Judgment calls made autonomously — worth a second look, not blocking

Flagging these per the working style established this session (user wants autonomous progress with judgment calls documented, not blocked on):

- XP award is a flat 10/quest (`XP_AWARD_PER_QUEST` in `course_routes.py`), streak window is 24h, "level" is a purely cosmetic frontend construct (50 XP/level, not stored anywhere server-side) — all arbitrary starting points, easy to retune once real usage exists.
- `AIChatChallengeQuest`'s "Mark quest complete" button in `QuestDetail.js` is **not gated** on the AI grader returning `all_passed: true` — mirrors the backend's own "if you're out of credits, finish on your own" philosophy. Not fully settled; revisit during a UX pass.
- A reflection quest's actual written text is **not persisted server-side** — `QuestCompletion` only has `artifact_ref` (a reference/path, not a text body). The draft lives in browser `localStorage` and is cleared on submit. Fine for now (no instructor-review flow exists), but will need a real field if reflections ever need to be read by anyone besides the student.
- `git status` currently shows nearly every file in the repo as modified, including files untouched this session (quiz YAML, Docker config, etc.) — almost certainly line-ending or mount-related noise from the Windows↔Linux sandbox bridge, not real content drift. Worth a `git diff --stat` sanity check before assuming anything unexpected changed.

---

## 6. Working-style notes (how this user likes to collaborate)

- No fixed deadline; sequence for quality over speed.
- Wants the agent doing real autonomous work between check-ins, not constant clarifying questions — but *does* expect a check-in via `AskUserQuestion` before large, ambiguous-scope work (e.g. the design-system question in §1) rather than guessing and redoing.
- Has corrected overconfident/incorrect claims sharply before (e.g. asserting a `.env` value was missing based on a stale sandbox view, when it wasn't) — when the sandbox's view of a file conflicts with what should be true, say so plainly and verify via the Windows-path tools rather than asserting confidence in the sandbox's view.
- Reacted badly to a visually plain first pass on the course pages ("looks terrible and extremely boring") — this user cares about the app actually looking good and game-like, not just functioning. Don't under-invest in visual polish on user-facing work for this project.
- Prefers concise, direct chat responses (minimal preamble/postamble) — but this document itself should stay thorough, since it's the one artifact a context-free successor session depends on.
