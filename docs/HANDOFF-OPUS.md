# Handoff: Quiz-App UI/UX Redesign & Studio Extension

**Written:** 2026-07-11, end of session.  
**For:** A fresh session picking this up with no memory of prior work.  
**Companion docs:** `docs/Studio-Architecture-Plan.md` (Studio design philosophy + phase details), `docs/AI-COURSE-EXTENSION-PLAN.md` (original AI course design), `docs/AI-COURSE-BUILD-PLAN.md` (milestone tracker).  
**Repo:** Quiz-App (The League of Amazing Programmers). React CRA frontend + FastAPI backend. Teaches high schoolers to use AI as a tool for real software development — not a crutch.

---

## 1. Current state of the app

The app has five sidebar nav items (top to bottom): **Dashboard**, **Learn**, **Crucible**, **Workspaces**, **Studio**.

### What's built and working

- **Dashboard** (`pages/Dashboard.js`, 11,742 bytes) — Three-zone layout: profile card with avatar ring, stat tiles (XP, streak, quizzes completed), recent activity. Fully functional, fetches from backend.

- **Crucible** (`pages/Crucible.js`, ~21K bytes) — Three tabs: Arena (category-based quiz browsing with Python/Java/Technology cards → filtered quiz list), Gauntlet (quiz history groups), Review Lab (leaderboard + spaced repetition placeholder). Fully functional.

- **Studio** (`pages/CourseMap.js`, ~22K bytes) — The big new feature. Three-panel layout:
  - Left sidebar: project list (capstone + 5 guided projects), XP/level card, collapsible
  - Center: phase-dependent workspace with 5-phase nav bar (Discover → Analyze → Design → Build → Ship)
  - AI Mentor: floating chat widget in bottom-right corner (minimizable to a FAB button)
  - **AI is NOT wired to backend yet** — chat shows a placeholder response. That's next week's work.
  - Phase nav tabs are currently freely clickable (no progression gating). Will be locked by deliverable completion once backend is wired.
  - Each phase has placeholder workspace content (textareas, buttons, templates, file trees) showing what the real tools will look like.

- **Learn** (`pages/Learn.js`) — Coming soon placeholder. Will be the course catalog where students browse and enroll in courses.

- **Workspaces** (`pages/Workspaces.js`) — Coming soon placeholder. Will be an IDE-like coding environment connected to Studio projects.

### Design system

- **One unified theme everywhere**: League Orange (`#ef6c00`) + Navy (`#1a365d`). No separate color palettes per section — user was explicit about this.
- **CSS**: Plain CSS with custom properties in `index.css` (tokens) + `App.css` (components, ~3500+ lines). No CSS modules, no Tailwind.
- **Typography**: Google Fonts — Poppins (headings) + Open Sans (body).
- **Layout**: Fixed left sidebar (240px desktop, bottom tab bar on mobile <768px). 8dp spacing grid.
- **Icons**: Inline SVG components, Lucide-style (20-24px, 1.5px stroke).

---

## 2. File inventory (what changed this session)

| File | Status | Notes |
|------|--------|-------|
| `frontend/src/App.js` | Modified | 5 nav items (added Workspaces), WorkspacesIcon, route for `/workspaces` |
| `frontend/src/App.css` | Modified | Coming-soon styles (§9b), Studio three-panel layout (§10), floating AI widget, sidebar collapse grid fix |
| `frontend/src/pages/CourseMap.js` | Rewritten | Complete Studio skeleton — was the old quest-list course page |
| `frontend/src/pages/Learn.js` | Rewritten | Was quiz category browser, now coming-soon placeholder |
| `frontend/src/pages/Workspaces.js` | New | Coming-soon placeholder for IDE environment |
| `frontend/src/pages/Crucible.js` | Modified (earlier) | Arena tab restored with category quiz browsing |
| `frontend/src/pages/Dashboard.js` | Unchanged | |
| `docs/Studio-Architecture-Plan.md` | New | Full Studio design: philosophy, phases, AI roles, gamification, implementation plan |

---

## 3. Architecture decisions

- **Studio replaces the old CourseMap.** The file is still named `CourseMap.js` but exports `Studio`. Route is `/course/build-real-stuff`.
- **AI Mentor is a floating widget**, not a fixed panel column. Opens/closes via a sparkles FAB in the bottom-right. Uses `aiPanelOpen` state. This was a deliberate UX choice — the user wanted it minimizable into the corner.
- **Sidebar collapse** uses a CSS class on the grid container (`studio-layout.sidebar-collapsed`) that changes `grid-template-columns` from `260px 1fr` to `60px 1fr`. The collapsed state hides text labels and shows only icons.
- **Phase progression** is visual-only right now. The PHASES array defines 5 phases with colors and icons. No backend gating exists yet — that's future work.
- **Two project tracks**: Guided Projects (short skill-builders, hardcoded in GUIDED_PROJECTS array) and Capstone (one long-running full-SDLC project). Both are UI stubs.

---

## 4. What to build next (user's stated priorities)

1. **Wire AI Mentor to backend** — Connect the chat widget to `POST /api/ai/tutor-chat`. Phase-aware system prompts (coach in Discover, generator in Design, evaluator in Build, etc.). Credit spending per interaction.
2. **Phase progression gating** — Lock phases behind deliverable completion. Student can't enter Design until they've submitted artifacts in Discover and Analyze.
3. **Learn page** — Course catalog with categories, enrollment, progress tracking.
4. **Workspaces page** — IDE-like coding environment (file explorer, code editor, terminal, live preview).
5. **Mini-games** — Interactive concept checkpoints between phases (drag-and-drop, spot-the-bug, timed puzzles). Never essay questions.

---

## 5. Known issues / gotchas

1. **Sandbox mount staleness.** The bash-mounted view (`/sessions/.../mnt/Quiz-App/...`) frequently goes stale relative to the Windows-path files (`D:\Users\voido\source\repos\Quiz-App\...`). **Windows-path Read/Write/Edit tools are always ground truth.** Workaround used successfully multiple times: Read via Windows path → Write to outputs scratch file → `cp` to mount path → verify with parser (`@babel/parser` for JS at `frontend/node_modules/@babel/parser`, `ast.parse()` for Python).

2. **OpenRouter $0 balance.** The AI backend (`backend/ai_routes.py`) routes through OpenRouter to DeepSeek models. Account has $0 credits — confirmed via real 402 error. This is an external funding issue, not a code bug. Everything works once funded.

3. **`frontend/build/` is stale.** The production bundle predates all recent frontend work. `npm run build` fails in the sandbox due to EPERM on unlink. User should run `npm run build` from a real Windows terminal, or just use `npm start` (dev server on port 3000) for development.

4. **git status noise.** Many files show as modified due to line-ending differences from the Windows↔Linux sandbox bridge. Run `git diff --stat` to check for real content drift.

---

## 6. Backend recap (unchanged this session)

- `backend/ai_routes.py` — Credit-ledger enforcement, `POST /api/ai/tutor-chat`, `POST /api/ai/grade-response`, `GET /api/ai/credits`. Routes through OpenRouter.
- `backend/course_routes.py` — Quest loading from YAML, listing/detail/completion/progress endpoints.
- `backend/courses/build-real-stuff/` — Two quest YAML files: `reflection_kickoff.yaml` (no AI, UX observation prompt) and `pressure_test_target_customer.yaml` (AI chat challenge with 4-criterion rubric).
- `backend/tests/` — 26/26 passing. Covers credit ledger, quest loading, rubric grading.

---

## 7. Working-style notes

- **"Improve design" means full professional redesign**, not incremental tweaks. User has pushed back hard on boring/plain output.
- **One unified orange/navy theme** — no separate color palettes per section. This was explicit feedback.
- **Concise and direct** — user prefers minimal preamble/postamble in chat.
- **Use AskUserQuestion before large ambiguous work** — don't guess scope on open-ended requests.
- **Verify sandbox views** — when something looks broken, cross-check Windows-path tools before asserting.
- **Fun, game-like, not homework** — concept checkpoints should be interactive games (Duolingo-style), never essays or paragraphs of text.
- **AI available from day one** — students direct AI, they don't earn access to it. The skill is learning what to tell AI to build, how to evaluate output, and when to push back.

---

## 8. UA Framework plugin

The UA Framework plugin (installed in Cowork) already implements SDLC coaching logic that maps to Studio phases 1-3:
- Opportunity discovery → Stage 1 Discovery (positioning statement)
- Stage 2 Analysis (landscape, personas, JTBD, scenarios)
- Stage 3 Specification + Wireframes

These skills (`ua-framework:*`) are available and can be invoked. They own their own markdown artifacts (`ua1-*` through `ua6-*`) and route through an orchestrator skill.
