# ai_chat_challenge

The student must get a specific outcome out of the AI tutor within a turn or token budget — the point is practicing how to ask, not just asking. Graded by `/api/ai/grade-response` (fast tier).

## Schema

```yaml
- id: pitch_clause_pressure_test
  type: ai_chat_challenge
  stage: "Stage 1 — Pass 1"
  credit_budget: 1500
  prompt: >
    Use the AI tutor to pressure-test your positioning statement's
    "primary competitive alternative" clause. Get it to name at least
    one alternative you hadn't already considered, without pasting
    your whole positioning statement into the chat.
  target_outcome: >
    Student asks a targeted question about their specific clause
    rather than dumping the full document; the tutor's response
    surfaces a genuinely new alternative.
  rubric:
    - "Student's message references the specific clause, not the whole document"
    - "Student's message is under ~3 sentences (targeted ask, not a wall of text)"
    - "The AI's response names an alternative the student didn't already list"
    - "Student did not simply ask the AI to rewrite the clause for them"
  max_turns: 4
```

## Writing tips

Keep `target_outcome` concrete enough that a grader can check for it in the transcript — "student learns something" is not checkable, "the AI's response names an alternative the student didn't already list" is. The rubric should reward efficient, targeted questions and penalize the "paste everything and ask the AI to do the thinking" pattern this whole course extension exists to discourage.
