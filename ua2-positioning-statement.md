# UA2 — Positioning Statement

The deliverable of Stage 1. Drafted in Pass 1 from current belief, revised across Passes 2–4 as research and interview evidence comes in. Every clause must be defensible by the time Stage 1 exits.

The statement at the top is the public-facing artifact — short, clean, one paragraph. The evidence record below it is the working document where the student's thinking lives. The messiness in the evidence record is the point. Cleaning it up to look polished destroys the record of learning. This is a living document; its git history is part of the deliverable.

---

## Statement

> For *middle- and high-school students at The LEAGUE of Amazing Programmers who are working through its instructor-led, Codespaces-based coding courses*
> who *have no engaging way to check whether they've actually understood what a lesson taught (today the only signals are running notebook cells and an instructor's informal read), so misunderstandings slip by and practice can feel repetitive*,
> the *LEAGUE Quiz App (working name)* is a *web-based coding quiz-and-practice app*
> that *lets students see and prove what they've actually learned, and makes practicing it genuinely fun*.
> Unlike *the status quo — working through notebook exercises with an instructor, plus re-reading or re-running lessons (and often doing nothing to check understanding)*,
> our product *gives an explicit, repeatable, game-like check that a concept was actually understood, with immediate feedback and progress a student and instructor can see — instead of leaving mastery to be inferred from finished exercises*.

---

## Status

Per-clause status. Mirrors the per-clause status in `UA0-PROJECT-STATUS.md`.

- **Target customer:** drafted-unconfirmed
- **Need or opportunity:** drafted-unconfirmed
- **Product name:** drafted-unconfirmed
- **Product category:** drafted-unconfirmed
- **Key benefit:** drafted-unconfirmed
- **Primary competitive alternative:** drafted-unconfirmed
- **Primary differentiation:** drafted-unconfirmed

Status values: `not started` | `drafted from belief` | `drafted-unconfirmed` | `refined by research` | `evidenced by interview` | `stable`.

---

## Evidence

One subsection per clause. Updated continuously across all five passes.

### Target customer

- **Current belief:** Middle- and high-school students at The LEAGUE working through its instructor-led, Codespaces-based coding courses.
- **Basis for the belief:** Jay's knowledge of the LEAGUE program as a curriculum developer; course.yml lists grades 6–10 for Python Apprentice; Eric scoped the tool to "a quiz app" for the courses. Jay explicitly chose the student (not instructor or Eric) as the primary target and wants the experience to feel fun.
- **Evidence found:**
  - 2026-07-13, Jay: primary target is the student; LEAGUE students are "mostly middle–high school." Wants it fun/engaging; GitHub + Codespaces linkage desirable.
  - 2026-07-13, public course.yml (Python Apprentice): grades 6–10, tier 2, ~24 weeks, self-paced.
- **Alternatives considered:** Instructor as primary target (dropped — Jay wants the student's experience changed first); Eric/the LEAGUE as customer (they are the decision-maker/buyer, not the primary user).
- **What would change my mind:** If interviews show students don't actually want or use quizzes, that the real adopter/gatekeeper is the instructor (making them the effective primary customer), or that the meaningful age band is much narrower (e.g. only AP-prep teens, or only beginners on turtles).

> NOTE: Jay has never met or observed LEAGUE students. This clause is belief, not observation — it must be tested by interview before Stage 1 can exit.

### Need or opportunity

- **Current belief:** Students have no engaging way to check whether they've actually understood a lesson; the only signals today are running notebook cells and an instructor's informal read, so misunderstandings slip by and practice can feel repetitive.
- **Basis for the belief:** Jay's origin observation (Python Apprentice has no quizzes/knowledge checks) combined with desk research on how classes run. Research shows the LEAGUE advances students "upon mastery" but provides no assessment instrument to measure that mastery.
- **Evidence found:**
  - 2026-07-13, Jay: the courses run in VSCode/Codespaces with no quizzes or knowledge checks of any kind.
  - 2026-07-13, jointheleague.org (intro-python, python-programming pages) + web search: classes are instructor-led weekly cohorts, 1.5 hrs/week, 5:1 ratio, in person/online; students progress through ~10 levels "upon mastery of material."
  - Implication: a human instructor IS present (5:1), so the gap is not total absence of feedback but the absence of a consistent instrument to verify/measure mastery and keep practice engaging.
- **Alternatives considered:**
  - "Students have no feedback at all" — dropped; the 5:1 instructor provides feedback. The gap is a mastery-measurement instrument, not raw feedback.
  - "Students find the course boring/monotonous" — Jay wants engagement (fun, games, XP, leaderboard) as a CO-EQUAL aim with assessment, not a wrapper. Both drive the design. Not yet evidenced as a felt problem for students.
  - "New students have no way to be placed at the right level" — third need strand raised by Jay 2026-07-13. Students enter at varying levels; nothing assesses where a new student should start. See parking-lot idea: AI-driven onboarding placement quiz at account creation.
  - "Instructors can't tell who has mastered what / who's ready to advance" — a strong alternative framing that makes the instructor the primary customer; parked pending interviews.
- **What would change my mind:** If students say they already know when they understand something (instructor tells them) and don't want quizzes; if instructors say mastery judgments work fine informally and a quiz tool would just be more grading burden; if the felt problem turns out to be engagement/retention rather than assessment; or if Eric's "quiz app" means something narrower (e.g. just PCEP exam prep) than a mastery-check-plus-engagement tool.

> NOTE: This is the single most important clause to test in interviews (Eric first, then an instructor, then students). It is currently research-informed belief, not confirmed need.

### Product name

- **Current belief:** "LEAGUE Quiz App" — working name only.
- **Basis for the belief:** Project will be renamed later (per project instructions and Eric: "we just need a quiz app"). Holding a plain placeholder rather than inventing branding prematurely.
- **Evidence found:** n/a (internal).
- **Alternatives considered:** "Quiz-App" (the old prototype's name — carries prototype baggage, avoid); a Codecademy-style brand name (premature, and Eric warned against replicating Codecademy).
- **What would change my mind:** A real name will be chosen later; not worth evidencing now.

> Mostly internal; thin evidence here is acceptable.

### Product category

- **Current belief:** A web-based coding quiz-and-practice app.
- **Basis for the belief:** Eric explicitly scoped it as "a quiz app," not a learning environment/LMS. "Quiz-and-practice app" keeps it in the category Eric named while covering games/tasks Jay wants.
- **Evidence found:**
  - 2026-07-13, Eric Busboom: "we just need a quiz app"; "don't aim for a complete learning environment… don't replicate Codecademy."
- **Alternatives considered:** "Learning platform / LMS" (rejected by Eric); "assessment tool" (too dry, undersells the games/engagement); "coding game" (oversells; assessment is core too).
- **What would change my mind:** If interviews reveal students/instructors think of it as something else (e.g. "homework," "exam prep," "a game"), the category should shift to match the words they use.

### Key benefit

- **Current belief:** Lets students see and prove what they've actually learned, and makes practicing it genuinely fun.
- **Basis for the belief:** Combines the assessment need (verify understanding/mastery) with Jay's co-equal engagement aim (fun, games, XP, leaderboard).
- **Evidence found:**
  - 2026-07-13, Jay: wants both assessment and engagement; students should have fun and want to come back.
- **Alternatives considered:** "Prepares students for PCEP certification" (a benefit, but narrow and instructor/org-facing); "helps instructors see who's mastered what" (real, but that's the instructor's benefit, not the student's — revisit if instructor becomes primary customer).
- **What would change my mind:** If students describe the value as something else entirely (e.g. "helps me not feel lost," "lets me compete with friends," "gets me the certificate"), rewrite to their words. If they don't actually want to "prove" anything, drop that half.

### Primary competitive alternative

- **Current belief:** The status quo: working through the notebook exercises with an instructor present, plus re-reading/re-running lessons — and often doing nothing to check understanding.
- **Basis for the belief:** Research on the delivery model (Codespaces notebooks + weekly 5:1 instructor cohorts) and the absence of any assessment tool in the repo. The real competition is the current in-course method and inertia, not another software product.
- **Evidence found:**
  - 2026-07-13, public repo: no quiz/assessment tooling; exercises are self-checked by running cells.
  - 2026-07-13, research: instructor present at 5:1 is the current "feedback mechanism."
- **Alternatives considered:** External quiz tools (Kahoot, Quizizz, Google Forms) — possible that instructors already improvise with these; MUST check in interviews. PCEP practice exams — relevant for the cert-prep end. Codecademy itself — the comparison Jay reaches for, but it's an alternative the LEAGUE has chosen NOT to be.
- **What would change my mind:** If instructors already use Kahoot/Quizizz/Forms for quizzes, that (not "nothing") is the real alternative and reframes differentiation. If students say they check understanding some other way entirely.

### Primary differentiation

- **Current belief:** Gives an explicit, repeatable, game-like check that a concept was actually understood — with immediate feedback and progress a student and instructor can see — instead of leaving mastery to be inferred from finished exercises.
- **Basis for the belief:** Combines the assessment gap (no mastery instrument) with Jay's engagement aim, and the fact that it would live alongside the LEAGUE's own courses/levels rather than being a generic quiz tool.
- **Evidence found:**
  - 2026-07-13, Jay: wants varied quizzes, mini-games tied to lessons, scores, leaderboard, skills profile — i.e. engagement + visible progress.
- **Alternatives considered:** "Unlike Codecademy, ours is built for the LEAGUE's curriculum" (true but Eric said don't frame against Codecademy); "unlike generic quiz tools, ours is tied to LEAGUE lessons and levels" (strong candidate IF instructors currently use generic tools — pending interview).
- **What would change my mind:** If the differentiation students/instructors actually care about is something else (tighter tie to the exact lesson, alignment to PCEP, the fun/competition, or automatic level placement). If "game-like" turns out to distract rather than help.
