# Studio — Architecture Plan

## Core Philosophy

**AI is not the reward — it's the instrument. The student is the director.**

Every phase has full AI access from day one. The student can ask AI to research competitors, draft personas, generate wireframes, scaffold code, and review their work. AI can build anything. The student's job is to learn *what* to tell it to build, *how* to evaluate whether it did a good job, and *when* to push back or iterate.

This is the skill that matters in 2026: not "can you write a for loop" but "can you direct a tool to build something real for real people, grounded in research you did yourself." Studio teaches that by putting students in the driver's seat of a real product development process where AI does the heavy lifting but the student makes every decision.

**AI is a power tool — and power tools are dangerous without understanding.**

A student who tells AI "build me a login page" without understanding authentication, session management, or password hashing will ship something insecure. A student who says "make me an app" without research will build something nobody wants. Studio teaches the *understanding* that makes AI useful rather than dangerous:

- **Software engineering concepts** — architecture patterns, component design, state management, API design, data modeling. Students learn *what* these things are and *why* they matter, so when AI generates code using them, the student can evaluate whether it made good choices.
- **Security practices** — authentication, input validation, data privacy, HTTPS, environment variables. AI will happily hardcode an API key if you don't know to ask for better. Students learn to spot these issues.
- **Systems thinking** — how frontend talks to backend, how databases store data, how deployment works. Not so they write every line, but so they can direct AI to build the right thing and debug when it doesn't work.
- **Process discipline** — research before design, design before code. Students who skip straight to "AI, build me an app" learn the hard way when they can't answer "who is this for?" at demo day.

**What prevents students from just letting AI do everything?**
- Each phase requires artifacts that prove understanding, not just output. "Explain why you chose this architecture" matters more than "show me the code."
- AI-generated work is explicitly labeled — students must review, edit, and defend it
- The positioning statement (built from real conversations) is the through-line every artifact must trace back to
- Concept checkpoints between phases: quick interactive challenges (drag-and-drop, spot-the-bug, match-the-concept, timed puzzles) — never essay questions. Think Duolingo, not homework.
- Peer reviews and demo day mean other humans will ask "why?" — and the student needs to know the answer

## Overview

Studio is the "Create" mode of the Quiz-App. It teaches high school students to build real applications by guiding them through the full software development lifecycle (SDLC) — with AI as a co-pilot they direct, not one that builds for them.

---

## Two Tracks

### Track 1: Guided Projects (Skill Builders)
Short, focused projects (1–2 sessions each) that teach one concept at a time.

**Examples:**
- "Design a Login Flow" — learn screen inventory + wireframing
- "Research Your Users" — practice user interviews and persona creation
- "Write a Positioning Statement" — define what you're building and for whom
- "Spot the UX Mistake" — interactive review of common design anti-patterns
- "Build a Component" — scaffold a React component from a wireframe

**Purpose:** Earn XP, level up, unlock tools for the Capstone. Beginners start here. Experienced students can skip ahead or use them as reference.

### Track 2: Capstone Project (Your App)
One long-running project through the full SDLC. The student picks a real problem, researches real users, designs a real UI, and builds a real app — across many sessions over weeks.

**AI is available from the start — in every phase.** The student's job is to learn how to direct AI effectively, not to earn the right to use it. A beginner directing AI to scaffold a React component is learning just as much as an experienced student writing it by hand — they're learning *what to ask for*, *how to evaluate the output*, and *when to push back*.

**AI adapts scaffolding to student level:**
- Beginners get more guardrails: AI asks "what should this button do?" before generating code
- Experienced students get more autonomy: AI generates on request, student drives

---

## Five Phases (Full SDLC)

### Phase 1: DISCOVER
**Goal:** Find a real problem worth solving.

**Activities:**
- Observe friction in people's daily lives
- Have conversations with potential users
- Write a positioning statement (who has the problem, what's the alternative, why yours is better)

**AI Role:** Conversational coach + research assistant. Student can say "help me find people who have this problem" and AI suggests where to look. Student can say "draft interview questions for a barber" and AI generates them — but the student decides which questions to actually ask. AI asks probing questions back ("Who specifically has this problem?" "What do they do today instead?").

**The teaching moment:** Students learn that AI can generate a positioning statement in 5 seconds — but one built from real conversations is defensible and theirs. The AI helps them see the difference.

**Concept checkpoint:** "Here's an AI-generated positioning statement and one built from interviews. Which claims can be defended? Which are guesses?" Tests whether the student understands the difference between research-backed and made-up.

**Mini-game:** "Problem or Solution?" — cards flash on screen, student sorts them. Teaches staying in the problem space.

**Deliverables:** Opportunity notes, conversation logs, positioning statement draft

---

### Phase 2: ANALYZE
**Goal:** Understand the world the system has to live in.

**Activities:**
- Landscape research (what already exists? who are the competitors?)
- Create user personas and Jobs-To-Be-Done
- Write scenarios (stories of how users will interact with the system)

**AI Role:** Researcher + Coach. Student says "find apps that solve a similar problem" and AI pulls competitors. Student says "create a persona based on my interview with Marcus" and AI drafts one — student edits it. AI can generate entire scenario drafts that the student stress-tests and revises.

**The teaching moment:** AI-generated personas look professional but are fiction. Students learn to ground them in real interviews and reject the ones AI hallucinated.

**Concept checkpoint:** "Your app has three user types. Draw how they interact with each other and the system." Tests systems thinking — can the student see the whole picture, not just individual screens?

**Mini-game:** "User Says" — match user needs to features. Teaches the research-to-design connection.

**Deliverables:** Landscape analysis, personas, JTBD statements, scenarios

---

### Phase 3: DESIGN
**Goal:** Turn the analysis into screens.

**Activities:**
- Create a screen inventory (list every screen the app needs)
- Write screen descriptions (what's on each screen, what happens when you interact)
- Build low-fidelity wireframes
- Walk scenarios through the wireframes to test them

**AI Role:** Generator + Evaluator. Student says "I need a screen where users can browse recipes by category" and AI generates a wireframe. Student says "make the search bar more prominent" and AI revises. Student can also ask "review this wireframe against mobile UX best practices" and AI critiques it.

**The teaching moment:** Students learn to speak the language of design — "visual hierarchy", "information architecture", "call to action" — because that's how you direct AI to produce good work. Vague prompts get vague designs.

**Concept checkpoint:** "AI generated this wireframe. List three UX problems and explain how you'd fix them." Tests whether the student can critically evaluate AI output against real design principles, not just accept it.

**Mini-game:** "Layout Challenge" — drag-and-drop UI elements to match a spec. Teaches spacing and component placement.

**Deliverables:** Screen inventory, screen descriptions, wireframes, scenario walkthrough results

---

### Phase 4: BUILD
**Goal:** Turn the design into a working application.

**Activities:**
- Student tells AI "scaffold a React project from my wireframes" — AI generates the project structure
- Student directs AI screen by screen: "build the recipe card component from my wireframe" → AI generates it → student reviews, tests, requests changes
- Student learns to read code AI writes, spot issues, and give better instructions
- AI explains what it built and why, teaching concepts in context rather than in abstract

**AI Role:** Co-builder from the start. The student is the project manager — they decide what gets built, in what order, and whether the AI's output is good enough. AI writes code, but the student approves every merge.

**The teaching moment:** Students who give AI precise specs ("a card component with an image on top, title below, 2-line description truncated with ellipsis, and a 'Save' button bottom-right") get better results than students who say "make a recipe card." They learn prompt engineering through practice, not lectures.

**Concept checkpoint:** "AI built this login form. Find the security issue." (e.g., password sent in URL params, no CSRF token, API key in frontend code). Also: "Explain how data flows from this form to the database — draw it." Tests whether the student understands what AI built, not just that it works on screen.

**Mini-game:** "Debug Detective" — AI introduces a bug, student finds and fixes it. Teaches debugging and reading error messages.

**Deliverables:** Working application code, component library

---

### Phase 5: SHIP
**Goal:** Polish and present the work.

**Activities:**
- Test the application (accessibility, responsiveness, edge cases)
- Polish UI details (loading states, error messages, empty states)
- Prepare a presentation / demo
- Demo day: present to peers

**AI Role:** Evaluator + presentation coach. Student says "review my app for accessibility issues" and AI audits it. Student says "help me write my demo script" and AI drafts talking points from the project's positioning statement and features. Student directs the polish: "add a loading spinner to the search" → AI implements → student approves.

**The teaching moment:** Students see that shipping is a phase, not an afterthought. AI can find 20 issues in 10 seconds — but the student decides which ones matter for their users.

**Concept checkpoint:** "Walk through your app's architecture end-to-end: what happens when a user signs up, from the button click to the database write and back?" Tests whether the student can explain the system they directed AI to build. If they can't, they're not ready to ship.

**Mini-game:** "QA Blitz" — timed challenge to find issues in a demo app. Teaches testing mindset.

**Deliverables:** Polished app, presentation, peer feedback

---

## Gamification Layer

### XP + Leveling
- Complete phases → earn XP → level up developer rank
- Rank titles: Explorer (L1) → Designer (L3) → Builder (L5) → Architect (L7) → Shipper (L10)
- **All AI tools are available from Level 1.** The student learns to use them, not earn them.
- Level unlocks are cosmetic and social: new rank titles, profile badges, ability to mentor peers, featured on the leaderboard
- XP rewards *quality of direction*, not volume: asking a great question earns more than spamming prompts

### Mini-Games
Placed between phases as breathers and skill reinforcement:
- **Problem or Solution?** (after Discover) — sort cards
- **User Says** (after Analyze) — match needs to features
- **Layout Challenge** (after Design) — drag-and-drop UI building
- **Debug Detective** (after Build) — find the bug
- **QA Blitz** (after Ship) — timed issue hunting

### Social + Competition
- Peer design reviews: vote on wireframes and designs
- Team design sprints: small groups tackle the same brief
- Milestone leaderboard: track progress across the cohort
- Achievement badges: "First Interview", "100 XP", "Shipped It"

---

## Studio UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Studio                                                          │
├─────────────┬────────────────────────────┬───────────────────────┤
│ PROJECT     │ WORKSPACE                  │ AI MENTOR             │
│ SIDEBAR     │ (changes per phase)        │                       │
│             │                            │ Contextual AI that    │
│ ▸ My Cap-   │ Phase 1: Interview notes   │ knows your phase,     │
│   stone     │         + conversation     │ project, and skill    │
│ ▸ Guided:   │         guide              │ level.                │
│   Login     │                            │                       │
│   Flow      │ Phase 2: Research canvas   │ Coaches during        │
│ ▸ Guided:   │         + persona builder  │ research.             │
│   User      │                            │                       │
│   Research  │ Phase 3: Wireframe editor  │ Generates during      │
│             │         + component palette│ design.               │
│ + New       │                            │                       │
│   Project   │ Phase 4: Code editor       │ Evaluates during      │
│             │         + live preview     │ review.               │
│ ────────    │                            │                       │
│ Level 4     │ Phase 5: Deploy checklist  │ Credits: ████░░       │
│ 2,350 XP    │         + presentation     │ 1200 / 1500           │
└─────────────┴────────────────────────────┴───────────────────────┘
```

---

## What Already Exists (Backend)

### Course API
- `GET /api/courses/{slug}/quests` — list quests
- `GET /api/courses/{slug}/quests/{id}` — quest detail
- `POST /api/courses/{slug}/quests/{id}/complete` — mark done, award XP
- `GET /api/courses/{slug}/progress` — XP, streak, completed quests

### AI API
- `POST /api/ai/tutor-chat` — send message to AI tutor (OpenRouter/DeepSeek)
- `POST /api/ai/grade-response` — rubric-based grading
- `GET /api/ai/credits` — credit balance
- Credit economy with per-user budgets and rate limiting

### Quest Types
- `reflection_journal` — plain textarea, no AI
- `ai_chat_challenge` — AI chat with rubric grading
- Planned: `debug_rescue`, `spec_sprint`

### UA Framework Plugin (Cowork)
The UA Framework plugin already implements the SDLC coaching logic:
- Opportunity discovery → Stage 1 Discovery → Stage 2 Analysis → Stage 3 Specification + Wireframes
- This maps directly to Studio phases 1–3

---

## Implementation Plan

### This Week (No AI API)
1. Build the Studio landing page with project list + "New Project" flow
2. Build the phase navigation bar (5 phases, progress indicator)
3. Build workspace shells for each phase (placeholder content)
4. Build the AI mentor panel UI (chat interface, credit display, "coming soon" state)
5. Create 2-3 guided project templates
6. Add XP display and level indicator to the sidebar

### Next Week (AI API Connected)
1. Wire AI mentor panel to `/api/ai/tutor-chat`
2. Implement phase-aware system prompts (coach in phase 1, generator in phase 3, etc.)
3. Build the rubric evaluation flow for phase transitions
4. Implement credit spending per AI interaction

### Later
1. Mini-games (drag-and-drop, sorting, timed challenges)
2. Peer review system
3. Wireframe editor (interactive, not just images)
4. Code editor integration
5. Deploy pipeline for student apps
