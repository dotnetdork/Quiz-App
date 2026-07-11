# AI-Powered SDLC & UI/UX Course — Extension Design Plan

**Status:** Draft for review
**Owner:** Jay
**Scope:** Extension to Quiz-App (The League's Codecademy-style platform), pedagogically anchored to the UA Framework plugin

---

## 1. What this is

A new, game-first course inside Quiz-App that teaches high school students to build a real application by working *with* an AI coding agent rather than having the AI build it for them. The course teaches three things at once: how to leverage AI as a tool without losing ownership of the work, the software development lifecycle (discovery → analysis → spec → build), and UI/UX design principles — all wrapped in a fast, game-like loop because teenagers bail on anything that feels like homework before it feels like progress.

This is an **extension of the UA Framework**, not a competing curriculum. UA Framework already solves the hard pedagogical problem — a three-stage, evidence-driven process (Discovery, Analysis, Specification/Wireframes) delivered through Claude Code / Copilot / Cursor skills, with a status file (`UA0-PROJECT-STATUS.md`) tracking exactly where a student is and strict exit criteria gating stage transitions. Quiz-App's job is to be the *game layer* on top of that process: the skill tree map, the XP and streaks, the AI-credit economy that makes "running out of credits" a real, felt constraint instead of a lecture slide, and the on-ramp for students who aren't yet comfortable working straight in a coding-agent CLI/IDE.

Concretely: UA Framework's skills keep doing the coaching and own the markdown documents (`ua1`–`ua6`) and the exit criteria. Quiz-App's new course module visualizes progress through those same stages as a campaign map, layers game mechanics on top, and adds two things UA Framework doesn't have today — a built-in AI tutor chat inside the web app, and an explicit, gamified credit-budget mechanic.

## 2. The learner experience

The course is framed as a campaign called **Build Real Stuff** (working title). A student picks or is assigned a project idea, then moves through a map of quests, each quest corresponding to a UA Framework pass or Quiz-App-native activity:

| Map region | UA Framework stage | What the student does |
|---|---|---|
| Basecamp | Opportunity discovery (optional) | Short quiz + reflection on "what friction have you noticed in someone's life" |
| The Pitch | Stage 1 — Discovery | Draft and defend a positioning statement; AI Chat Challenges pressure-test each clause |
| The Field | Stage 1 Pass 2/3/4 | Research plan + interview planning; "Talk to a human" quests can't be faked by AI |
| The Map | Stage 2 — Analysis | Landscape, stakeholders, JTBD scenarios; AI Chat Challenge to red-team the scenario |
| The Blueprint | Stage 3 — Specification | Screen inventory and descriptions, scored against the five-part rubric |
| The Workshop | Stage 3 — Wireframes | Wireframe Builder quest, wired-elements output reviewed in-app |
| The Build | Beyond UA Framework's current scope | Real coding in the devcontainer with an AI coding agent, credit-budget mechanic live |

Each region is a set of quests (2–6 activities). Completing a quest awards XP and, where it maps to a UA Framework exit criterion, triggers the orchestrator's real stage-transition logic — Quiz-App doesn't invent its own notion of "done," it reads the same exit criteria already defined in `ua-orchestrator`'s `SKILL.md` and renders them as a boss checkpoint. This keeps the game honest: you can't level up by clicking through, because the underlying document still needs interview-backed evidence or a five-part screen description, and that door is not really open until it is.

Meta-progression: XP levels, a streak counter, and badges tied to the design principles the framework already values (first badge for a falsification commitment written down, not just for finishing an interview — mirroring the framework's own emphasis on *why* this is mandatory).

## 3. The credit economy — teaching "don't run out"

The single most important game mechanic is that AI help costs something, because that mirrors reality: every Continue.dev-style coding agent burns real API spend per token. Rather than treating credits as an abstract game currency, the course ties the in-app "AI Credits" meter directly to actual token usage against the same provider key the student's Continue.dev config points at (see §6). Each quest gives a credit budget appropriate to its difficulty. Spending it carelessly — pasting whole files instead of asking targeted questions, re-asking instead of reading the AI's answer, asking the AI to "just write it" instead of a scoped diff — visibly drains the meter. Running out mid-quest doesn't fail the student; it forces a specific, designed consequence: they must finish the task using only what they already have (code they already wrote, docs already produced) with the AI locked out until a cooldown or a small "earned" refill (e.g., completing a reflection question honestly). This is where "running out of credits" and "staying in the driver's seat" stop being warnings in a slide deck and become something the student has actually felt.

## 4. New activity types

Quiz-App today has seven question types (multiple_choice, parsons, output_prediction, debugging, fill_in_blank, free_response, faded_parsons), each with its own React component and its own grading branch in `quiz_routes.py`. None of them involve a live AI call. The course needs new types layered in the same pattern:

| New type | Purpose | Grading approach |
|---|---|---|
| `ai_chat_challenge` | Student must get a specific outcome from the AI tutor within a turn/token budget (e.g., "get the AI to explain what your fetch call does, without pasting your whole file") | Rubric-based, graded by a second AI call against a rubric the teacher/course author defines in YAML, reviewed like `free_response` |
| `credit_budget_sim` | Timed/credit-limited scenario: fix a bug or extend a feature before credits run out | Pass/fail on functional outcome + efficiency score (credits spent vs. budget) |
| `spec_sprint` | Wraps the `specification` UA skill's five-part screen description exercise in a scored, timed activity | Structural check (all five parts present) + AI-assisted rubric pass |
| `debug_rescue` | AI proposes plausible-looking but subtly wrong code; student must catch and explain the bug before accepting it | Correct catch + correct explanation, modeled on existing `debugging` type but AI-generated per attempt |
| `reflection_journal` | Short written reflection required before advancing a stage (mirrors UA's "Known gaps" and non-negotiable falsification commitments) | Not auto-graded; unlocks next quest on submission, visible to teacher dashboard |

These slot into the existing `Quiz.js` question-type switch and `quiz_routes.py` grading dispatch the same way `faded_parsons` was added — new component, new branch, same submission/scoring pipeline. The AI-graded ones (`ai_chat_challenge`, `spec_sprint`) are the one real architectural addition: grading needs a live model call, which none of the current types require.

## 5. Content authoring

Quizzes today are plain YAML files auto-discovered from `backend/quizzes/<category>/*.yaml` by `quiz_routes.load_questions()` — anyone can add a quiz by dropping a file in, no code change needed. The course should follow the same pattern with a parallel `backend/courses/<course-slug>/*.yaml` tree, where each file is one quest and carries the new activity types above plus a `stage` field that maps back to the UA Framework document it corresponds to (e.g., `stage: "Stage 1 — Pass 1"`), so the campaign map can render progress by reading both the course YAML and the student's `UA0-PROJECT-STATUS.md` if one exists for their project.

## 6. Continue.dev integration — what's realistic

One important technical clarification before building: Continue.dev is an IDE extension and CLI ("headless mode"), not a hosted chat API of its own. It reads a `config.yaml` pointing at a model provider and calls that provider directly using the key you give it; "credits" in practice means the underlying provider's token billing, not something Continue issues itself. So "leveraging a Continue.dev API key" for in-app interactivity really means: Quiz-App's backend and the student's Continue.dev config both draw against the same provider credentials, which is exactly what makes the credit-economy mechanic in §3 honest rather than simulated.

**Decision: DeepSeek is the standardized model family, accessed through OpenRouter, split across two tiers by task.** Not every AI call in this course needs the same model. The tutor chat, rubric grading, and general Q&A are high-volume and don't need frontier-level coding ability — they need reliable instruction-following. `debug_rescue` generation and the real agent-assisted coding in Phase B do need genuine coding competence, since a model that can't write a subtly-wrong-but-plausible bug, or can't actually help fix a real one, breaks the exercise. So the plan uses two DeepSeek models rather than one:

| Tier | Model | Used for | Approx. price via OpenRouter (mid-2026) |
|---|---|---|---|
| Cheap / high-volume | DeepSeek V4 Flash | Tutor chat, `ai_chat_challenge` and `spec_sprint` rubric grading, general Q&A | ~$0.098/M input, $0.197/M output |
| Coding-capable | DeepSeek V4 Pro | `debug_rescue` bug generation, Phase B devcontainer coding agent | ~$0.435/M input, $0.87/M output |

*(Corrected 2026-07-10, twice: first, an earlier draft named the fast tier "DeepSeek V3.2" with a `/beta` base URL, neither a real value on DeepSeek's own API. Second, and more fundamentally: the League's available key for this project turned out to be an OpenRouter key, not a DeepSeek-issued one — DeepSeek's API correctly rejects OpenRouter keys as invalid, since they're a different issuer. The plan now routes through OpenRouter (openrouter.ai), which is itself OpenAI-compatible and proxies to DeepSeek's models under OpenRouter's own slugs (`deepseek/deepseek-v4-flash`, `deepseek/deepseek-v4-pro`) and base URL (`https://openrouter.ai/api/v1`), confirmed via openrouter.ai/deepseek and openrouter.ai/docs/quickstart. This is also the exact setup already in the project's Continue.dev `config.yaml`. Both bugs are recorded in docs/AI-COURSE-BUILD-PLAN.md.)*

That's roughly a 4-5x price gap on the calls that happen dozens of times per session (tutor chat, grading) versus the calls that happen a handful of times per quest (generating a realistic bug, doing real agent coding) — the split meaningfully lowers the classroom bill without touching quality where quality actually matters.

Continue.dev's OpenRouter provider (`docs.continue.dev/customize/model-providers/openrouter`) and OpenRouter's chat API are both OpenAI-compatible, so both the devcontainer's `config.yaml` and `ai_routes.py`'s server-side calls use the same request shape and the same SDK (`openai` Python/JS client pointed at OpenRouter's base URL) for both models — just a different `model` slug. This is also literally the project's existing Continue.dev config, so the devcontainer template below is not hypothetical:

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
    defaultCompletionOptions:
      maxTokens: 384000
    roles: [chat, edit, apply]
    contextLength: 1000000
```

Two things to confirm before shipping Phase A: OpenRouter (and the underlying DeepSeek models it proxies to) is hosted outside the US, which may need a look from whoever handles student-data policy at The League given FERPA/COPPA considerations for under-18 users (see the data-privacy open question below — this makes it more urgent, not less); and pricing has shifted before on both models, so `ai_routes.py` and the credit-ledger should read price-per-token per model from config rather than hardcoding either, so the math doesn't silently drift if pricing changes again.

That implies two integration surfaces, matching the "both, sequenced" plan:

**Phase A — in-app AI tutor (server-side proxy).** A new backend module, `ai_routes.py`, holds the OpenRouter API key server-side (never shipped to the browser) and exposes narrow endpoints — `/api/ai/tutor-chat` and `/api/ai/grade-response`, both routed to DeepSeek V4 Flash — that the frontend calls for the AI Chat Challenges, tutor Q&A, and rubric grading. A third endpoint, `/api/ai/generate-bug`, routes to V4 Pro specifically for `debug_rescue`. Every call logs token usage and the model used to a `credit_ledger` table (see §7) keyed by user and quest, so the credit meter is real, not decorative, and reflects which tier was actually spent. This phase requires no changes to the student's local dev environment at all — it just needs `OPENROUTER_API_KEY` in Quiz-App's own `.env`, alongside `GITHUB_CLIENT_ID`/`SECRET` the app already manages that way.

**Phase B — real coding in the devcontainer.** For "The Build" region, students work in the existing `.devcontainer` (already configured for Python 3.12 + Node 20) with Continue.dev installed and configured with both DeepSeek tiers via the `config.yaml` above (through OpenRouter), doing real agent-assisted coding on their actual project with V4 Pro doing the heavy lifting. Quiz-App can't observe that session directly, but it can grade artifacts: git commit history (which UA Framework already treats as a pedagogical record — "cleaning up the history... destroys the record of learning"), presence and shape of specific files, and a final walkthrough quest where the student explains their own code back to the tutor chat (routed to the cheap V4 Flash tier, since explaining code back doesn't need frontier reasoning), which is graded conversationally. This is the natural place to enforce "explain how this works" gates before a build quest counts as complete — directly serving the "understand your program on a technical level" goal.

## 7. Data model additions

Alongside the existing `users` and `scores` tables in `models.py`:

- `course_progress` — user_id, course_slug, current_quest, xp, streak_count, last_activity_at. The XP/streak/quest-map equivalent of `scores`, but course-scoped rather than quiz-scoped.
- `credit_ledger` — user_id, quest_id, model_tier, tokens_spent, budget, timestamp. One row per AI call; the credit meter is a live sum against budget, not a stored balance, so it can't drift out of sync with actual spend. `model_tier` (`fast` / `agent`) matters now that cost-per-token differs roughly 3x between the two DeepSeek models — a quest's credit cost should reflect which tier it actually used, not a flat per-call rate.
- `quest_completions` — user_id, quest_id, completed_at, artifact_ref (nullable — e.g., a path to the student's `ua6-specification.md` or wireframe project when the quest is UA-Framework-backed).

These sit next to `User`/`Score` in `models.py` with the same SQLAlchemy patterns already used there; no new ORM conventions needed.

## 8. Frontend additions

New components following the existing structure (`components/`, `pages/`, `utils/`):

- `pages/CourseMap.js` — the campaign map / skill tree view, region and quest cards, XP/streak header.
- `components/AITutorPanel.js` — persistent chat widget for AI Chat Challenges and tutor Q&A, calling `/api/ai/tutor-chat`.
- `components/CreditMeter.js` — live-updating budget bar, reusing the visual language of the existing themed `AnimatedBackground` system so it doesn't feel bolted on.
- `components/QuestCard.js`, `components/DebugRescue.js`, `components/ReflectionJournal.js` — new activity-type components, added to `Quiz.js`'s type switch the same way `FadedParsons` was.

## 9. Phased rollout

**MVP** — one full course track (e.g., "Build a Quiz App" as the dogfood project, fittingly), Phase A AI tutor only, `ai_chat_challenge` and `reflection_journal` activity types, course_progress + credit_ledger tables, no devcontainer/Continue.dev changes yet.

**v1** — add `debug_rescue` and `spec_sprint`, wire the campaign map's stage gates to real UA Framework exit criteria (reading `UA0-PROJECT-STATUS.md` when present), badges and streaks.

**v2** — Phase B devcontainer integration, `credit_budget_sim` activity type, git-history-aware grading for build quests, teacher-facing dashboard for reflection journals and credit spend patterns.

## 10. Open questions for you

- ~~Model provider standardization for Continue.dev's `config.yaml`~~ — resolved: DeepSeek V4 Pro (see §6).
- Individual student API keys vs. one pooled classroom key with per-student budgets tracked in `credit_ledger` — affects cost exposure and whether minors' usage needs to route through a teacher-controlled key.
- Whether this course requires a standalone `UA0`-style project per student even for students who never touch the UA Framework plugin directly, or whether Quiz-App should generate/own a lightweight version of that status tracking itself for students who stay entirely inside the web app.
- Data privacy: since real students under 18 will have their chat/code interactions sent to a third-party model API, this needs a retention/logging policy before Phase A ships, not after.

## 11. Risks

Real API spend from a class of students is real money; the credit-ledger mechanic doubles as a cost control, but budgets per quest need to be tuned before rollout, not after a surprise bill. The two-tier model split helps here but adds a small risk of its own: `ai_routes.py` now has to route correctly (grading calls must not accidentally hit the expensive tier), so that routing logic deserves its own test coverage rather than being an incidental side effect of which endpoint got called. The core pedagogical risk — AI does the work for them — is the whole reason for the credit economy and the `debug_rescue`/explain-it-back gates; those two mechanics are load-bearing, not decorative, and should not be cut for scope reasons. Grading `ai_chat_challenge` and `spec_sprint` with a second AI call introduces a new failure mode (inconsistent or gameable grading) that the existing quiz types never had to deal with; this needs its own rubric-design and spot-checking pass before v1, likely worth a short pilot with a handful of students before wider rollout.

## 12. Concrete integration points in the existing codebase

Everything above describes what to build. This section is about where it actually plugs into the app as it exists today — read this before writing the first line of `ai_routes.py`.

**Auth: reuse what's there, but note it's not fully consolidated yet.** `main.py` defines `get_current_user()` and `require_user()` as session-based dependencies (reading `request.session.get("user_id")`, looking up `User` by `github_id`). Oddly, `quiz_routes.py`'s `submit_quiz` endpoint doesn't actually use either — it inlines its own copy of the same session lookup. `ai_routes.py` should not add a *third* copy. The cleanest move is to lift `get_current_user`/`require_user` out of `main.py` into a small `deps.py` (or into `database.py` alongside `get_db`) that `main.py`, `quiz_routes.py`, and the new `ai_routes.py` all import from — a small refactor, but it's the difference between one shared auth dependency and three drifting copies once a fourth router shows up after this one. If a full refactor feels like too much scope creep for the first PR, at minimum `ai_routes.py` should import `require_user` from `main` rather than inlining a fourth version.

**Router registration.** `main.py` imports and registers `quiz_router` and `leaderboard_router` near the bottom of the file, each with `app.include_router(..., prefix="/api/...", tags=[...])`, and — critically — *before* the catch-all frontend-serving route (`@app.get("/{path:path}")`) that's guarded behind `if STATIC_DIR.exists()`. `ai_routes.router` needs to be registered the same way, in the same block, before that catch-all, or requests to `/api/ai/*` will fall through to the React-serving wildcard instead of hitting the actual endpoint.

**Database.** Nothing new needed beyond what §7 already describes — `CreditLedger`, `CourseProgress`, and `QuestCompletion` register on the same `Base` from `database.py` that `User`/`Score` already use, and `init_db()`'s `Base.metadata.create_all()` picks them up automatically on next startup as long as they're imported somewhere before that call (the same way `models.py` is imported for its side effect in `init_db()`).

**Frontend data fetching and caching.** `frontend/src/api.js`'s `apiCall()` has a per-endpoint `CACHE_TTL` map for GET requests (leaderboard: 30s, quiz list: 5 minutes) and clears the leaderboard cache specifically after `/submit` POSTs. Two follow-ons for the AI course: add a short TTL entry for `/api/ai/credits` (something like 5-10 seconds — long enough to avoid hammering the endpoint on every keystroke, short enough that the credit meter doesn't look stale right after a spend), and extend the post-mutation cache-clearing block so any endpoint that spends credits (`tutor-chat`, `generate-bug`, `grade-response`) also calls `clearCacheFor('/api/ai/credits')`, mirroring exactly how `/submit` already clears `/api/leaderboard`.

**Auth prefetching.** `AuthContext.js` already prefetches dashboard data (scores, quiz list, leaderboard) in parallel with the `/auth/me` check via `prefetchDashboardData()`, so `Dashboard.js` loads instantly instead of waterfalling three requests after auth resolves. The same function is the natural place to add a fourth parallel fetch for course progress and remaining credits, so `CourseMap.js` gets the same instant-load treatment Dashboard already has, rather than being the one page that feels slower.

**Where the campaign map lives.** Two real options, and it's worth picking deliberately rather than defaulting: (a) a new top-level route (`/course/:courseSlug`, added to `App.js`'s `<Routes>` alongside `/dashboard` and `/quiz/:quizId`, lazy-loaded the same way `Dashboard` and `Quiz` already are, wrapped in the same `ProtectedRoute`), or (b) a fourth tab inside `Dashboard.js`'s existing tab system (`quizzes` / `history` / `leaderboard` → add `course`), reusing the card-grid patterns (`category-grid-modern`, `quiz-grid`) already styled there. Given the course is meant to feel like its own campaign rather than one more dashboard tab buried next to quiz history, (a) is the better fit — but it means duplicating a little of Dashboard's skeleton-loading/profile-card scaffolding rather than inheriting it for free, so budget a little extra frontend time for that if going this route.

**Quest-taking pages can reuse Quiz.js's shape almost directly.** `Quiz.js` already does exactly what a quest page needs: load content by ID from the backend, render a type-specific component from a `question.type === '...'` chain, collect answers in state, submit, show a results view, themed `AnimatedBackground` per content ID. The five new activity types are a natural extension of that same chain — this is a much smaller lift than building an entirely parallel quest-taking page from scratch, and it's exactly the pattern the design doc's §8 already gestures at when it says new components get "added to `Quiz.js`'s type switch the same way `FadedParsons` was."

**Two small housekeeping items before any of this compiles.** `backend/requirements.txt` doesn't have the `openai` package yet (needed for the DeepSeek OpenAI-compatible client) — every skill-generated draft during testing had to flag this as a TODO rather than silently assuming it. And `.env-template` needs a `DEEPSEEK_API_KEY` line added next to the existing `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`/`SECRET_KEY` entries so the pattern in `config.py` (`os.getenv(..., "default")`) has something to document.
