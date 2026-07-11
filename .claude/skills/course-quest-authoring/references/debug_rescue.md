# debug_rescue

The AI proposes plausible-looking but subtly wrong code; the student must catch and explain the bug before accepting it. Bug generation runs through `/api/ai/generate-bug` (agent tier, DeepSeek V4 Pro — see the `ai-coding-tier-setup` skill); the student's catch is graded through `/api/ai/grade-response` (fast tier).

## Schema

```yaml
- id: python_loop_bug
  type: debug_rescue
  stage: "Beyond Stage 3 — The Build"
  credit_budget: 600
  topic: "off-by-one errors in Python range() loops"
  difficulty: "intro"
  bug_generation_hint: >
    Prefer a boundary condition error (using range(n) instead of
    range(n+1), or an inclusive/exclusive mixup) over something
    exotic — intro difficulty should be catchable by a student
    who understands range() correctly, not a trick question.
  answer_key_rubric:
    - "Student identifies the specific line with the bug"
    - "Student explains what the code currently does vs. what it should do"
    - "Student does not just say 'it's wrong' without locating the cause"
```

## Writing tips

`bug_generation_hint` matters more than it looks — an ungrounded prompt to "generate a subtle bug" tends to produce either something too obscure for the stated difficulty or something that isn't really a bug at all once you look closely. Be specific about the category of mistake you want (off-by-one, wrong comparison operator, mutable default argument, whatever fits the topic) so the generation stays on-target and the validation step in `ai-coding-tier-setup` has something concrete to check against.
