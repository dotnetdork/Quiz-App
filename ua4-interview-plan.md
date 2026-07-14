# UA4 — Interview Plan

Produced in Pass 3 of Stage 1. Names who the student is interviewing and why, the question areas for the open-ended phase, the prompts for the solution feedback phase, and a falsification commitment set per planned interview.

The plan format is bullet points of question areas, not a script. Scripts produce mechanical interviews.

---

## Recruiting

One subsection per planned interviewee.

### Interview 1 — Eric Busboom (Executive Director)

- **Who:** Eric Busboom, Executive Director / Board Chair of The LEAGUE; Jay's boss and the decision-maker funding this project. Reachable directly (Slack / email eric.busboom@jointheleague.org). [Jay to confirm timing.]
- **Why worth talking to:** He defined the scope ("just a quiz app," not a learning environment) and controls whether it gets built and adopted. He can say what problem he thinks it solves and what "worth building" looks like to him.
- **Clauses their input most affects:** Need or opportunity; Product category (scope); Primary competitive alternative; secondarily Target customer and Key benefit.
- **Earlyvangelist filter (which apply):**
  - [x] Has the problem (org-level: no way to measure mastery)
  - [x] Knows they have the problem (he asked for a quiz app)
  - [ ] Has tried to solve the problem (unknown — ask)
  - [ ] Is unhappy with their workaround (unknown — ask)

### Interview 2 — Jed Stumpf (Teacher & Development Manager)

- **Who:** Jed Stumpf, Teacher & Development Manager at The LEAGUE. Present in Jay's **weekly meeting alongside Eric** — so Interviews 1 and 2 happen in the same session.
- **Why worth talking to:** He both teaches students (runs cohorts, judges mastery today) and manages development — a rare two-in-one: the instructor perspective AND a build/feasibility perspective. He'd be a primary acter-on-results.
- **Clauses their input most affects:** Need or opportunity; Primary competitive alternative (does he already use Kahoot/Quizizz/Forms in class?); Primary differentiation; feasibility of the engagement features.
- **Earlyvangelist filter (which apply):**
  - [ ] Has the problem
  - [ ] Knows they have the problem
  - [ ] Has tried to solve the problem
  - [ ] Is unhappy with their workaround
  - _(To assess during the interview.)_

> Because Eric and Jed are in the same meeting: run the open-ended problem questions to the room first. Watch for where Jed (who teaches) and Eric (who decides) disagree — that gap is gold. Save the platform-vision probe and any solution talk for the end.

### Interview 3–4 — LEAGUE students (TBD)

- **Who:** Two current students in the middle–high-school band, ideally at different levels. [Jay to arrange access — this is the group Jay has never had contact with; may need Eric's/an instructor's help to reach ethically, with parent/guardian awareness given they are minors.]
- **Why worth talking to:** They are the primary target customer. The Need and Key benefit clauses cannot be confirmed without them.
- **Clauses their input most affects:** Target customer; Need or opportunity; Key benefit.
- **Earlyvangelist filter (which apply):**
  - [ ] Has the problem
  - [ ] Knows they have the problem
  - [ ] Has tried to solve the problem
  - [ ] Is unhappy with their workaround
  - _(To assess during the interview.)_

---

## Open-ended phase guide

Question areas for the problem-discovery half of the interview. Ordered roughly broad to specific. Two or three example phrasings per area. **Bullet points, not a script.**

> Reminders:
>
> - Ask about past behavior, not hypothetical future behavior. "When was the last time…" beats "would you ever…".
> - Don't ask hypothetical, feature, or validation questions. They produce nodding, not learning.
> - Eric and Jed ALREADY know about the Quiz-App concept, so you can't (and needn't) hide it. The risk shifts: instead of a pitch they politely bless, actively invite disagreement — "tell me where this is wrong," "what would make it useless." Get them describing the problem in their own words, not just approving your solution.
> - Don't ask leading/validation questions ("this would help, right?"). They produce nodding.
> - Let silence be okay.

_(Tailored for the Eric interview; reuse the structure for the instructor and students.)_

- **How students are doing today / how mastery is judged**
  - "Walk me through how you currently know whether a student has actually mastered a level."
  - "When was the last time a student advanced a level — how did that decision get made?"
  - "Tell me about a time a student seemed to finish the work but hadn't really understood it."
- **Where the current setup falls short**
  - "What's the most common complaint you hear from instructors or parents about how the courses run?"
  - "What have you wished you could see about students that you can't see today?"
- **Prior attempts / workarounds**
  - "Has anyone tried to add quizzes or checks before? What happened?"
  - "Do instructors improvise their own quizzes or games today? With what?"
- **Why now, and what 'just a quiz app' means to him**
  - "When you say 'just a quiz app,' what does it need to do for you to consider it worth building?"
  - "What would make you consider it a failure or a waste of effort?"
  - "Why is this worth doing now rather than a year ago or a year from now?"
- **Fragmentation across courses (the platform-vision probe — ask LAST, as a problem, not a pitch)**
  - "Today the courses each live in their own repo that students fork separately — has that setup ever caused a real headache for a student, an instructor, or you?"
  - "When a student finishes one course and moves to the next, what actually happens? Does anything get lost or repeated?"
  - "If you could see one thing across all the courses at once that you can't see now, what would it be?"
  - _Do NOT follow these with "so we should build a platform." Just listen and write down what they say._

---

## Solution feedback phase guide

Only entered after the user has confirmed the problem in their own words. If they have not, skip this phase — that interview was about confirming the problem.

- **What to show, in what order:**
  - Nothing polished. At most, describe the plain concept in one sentence ("a quiz-and-practice app tied to the LEAGUE lessons") and let him react.
  - With Eric specifically: listen for where his idea of scope differs from yours (he may push back on games/XP/leaderboard as scope creep).
- **What to listen for:**
  - Where he narrows or expands the scope unprompted.
  - Any "we already tried X" or "instructors already use Y."
  - Hesitation about whether students would actually use it.
- **Prompts:**
  - "If this existed next semester, who would touch it first and when?"
  - "What part of this would you cut if you had to?"

---

## Closing

- Thank them for their time.
- "Is there anyone else you think I should talk to?" (For Eric: which instructor, and can he help arrange access to a couple of students.)
- "Would it be okay to come back with a follow-up question if something comes up?"

---

## Falsification commitments

**One set per planned interview. Written before the interview happens. Reviewed and updated after.**

### Interview 1 — Eric Busboom (planned date: TBD)

#### Need or opportunity

- **Current belief:** Students have no engaging way to check whether they've actually understood a lesson; mastery is judged only by running cells and an instructor's informal read.
- **Confirms it if:** Eric independently names the lack of a mastery check / assessment as a real problem, without Jay prompting the word "quiz."
- **Refutes it if:** Eric says mastery judgment already works fine, and the quiz app is really about something else (e.g. marketing, enrollment, parent-facing progress reports, or PCEP pass rates).
- **Complicates it if:** He frames the problem as primarily instructor-facing (visibility for teachers) or primarily engagement/retention, rather than assessment for students.
- **What actually happened:** _[after interview]_

#### Product category (scope)

- **Current belief:** A web-based coding quiz-and-practice app — including games, scores, leaderboard, XP.
- **Confirms it if:** Eric agrees the engagement features (games/XP/leaderboard) belong inside "a quiz app."
- **Refutes it if:** Eric calls the games/XP/leaderboard scope creep — "just a quiz app" to him means only knowledge-check quizzes.
- **Complicates it if:** He's fine with some engagement (scores) but not other parts (leaderboards, mini-games).
- **What actually happened:** _[after interview]_

#### Primary competitive alternative

- **Current belief:** The status quo — notebook exercises + instructor, and often nothing to check understanding.
- **Confirms it if:** Eric confirms there's no assessment tool in use and no prior working attempt.
- **Refutes it if:** Eric says instructors already use Kahoot/Quizizz/Google Forms or some LMS feature — that's the real alternative.
- **Complicates it if:** Some instructors improvise checks and others don't; it's inconsistent.
- **What actually happened:** _[after interview]_

#### Bigger vision — is the fragmentation a real problem? (tests whether the all-in-one platform case has legs)

- **Current belief (Jay's aspiration):** Tying the courses together into one Codecademy-like platform would solve a real pain caused by the separate-repos setup.
- **Confirms it if:** Eric or Jed, unprompted, describes a concrete recent headache caused by courses being scattered (a student lost, progress invisible, onboarding painful).
- **Refutes it if:** They say the separate-repos setup works fine and causes no real friction — the fragmentation is only a problem in Jay's head.
- **Complicates it if:** It's a mild annoyance nobody prioritizes, or a problem for one role (e.g. Jay/curriculum) but not for students or instructors.
- **What actually happened:** _[after interview]_

### Interview 2 — Jed Stumpf (same weekly meeting)

#### Primary competitive alternative (instructor's-eye view)

- **Current belief:** No assessment tool is in use; the alternative is notebook exercises + the instructor's read.
- **Confirms it if:** Jed says he doesn't use any quiz/check tool today and would have to eyeball it.
- **Refutes it if:** Jed already uses Kahoot / Quizizz / Google Forms / another tool to quiz his cohort — that's the real alternative to beat.
- **Complicates it if:** He improvises occasionally but nothing systematic.
- **What actually happened:** _[after interview]_

#### Need or opportunity (does the teacher feel it?)

- **Current belief:** There's no instrument to verify mastery; misunderstandings slip by.
- **Confirms it if:** Jed recounts a real case of a student who looked done but hadn't understood, and wishes he'd caught it sooner.
- **Refutes it if:** Jed says at 5:1 he already knows exactly who understands what, and a quiz would just be busywork/grading burden.
- **Complicates it if:** He can tell for strong/weak students but the middle is murky, or it's fine live but breaks down for online cohorts.
- **What actually happened:** _[after interview]_
