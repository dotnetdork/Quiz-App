# reflection_journal

A short written reflection required before advancing a stage — mirrors UA Framework's "Known gaps" and mandatory falsification commitments. Not auto-graded; unlocking the next quest is based on submission, not correctness, but the entry is visible on the teacher dashboard.

## Schema

```yaml
- id: post_interview_reflection
  type: reflection_journal
  stage: "Stage 1 — Pass 4"
  credit_budget: 0
  prompt: >
    You just ran a user interview. What's one thing you heard that
    contradicted what you expected? What are you going to do about it
    in your positioning statement?
  min_length_words: 40
  unlock_condition: "submission"
```

## Writing tips

`credit_budget` is `0` because this type never calls a model — that's a meaningful signal in itself; if a `reflection_journal` quest ever needs an AI call, it's probably actually a different activity type. Keep the prompt specific to what the student just did (the interview they ran, the bug they just fixed, the credits they just ran out of) rather than a generic "how do you feel" — a reflection tied to a concrete recent event produces a real answer instead of a platitude, and it's the same discipline UA Framework already enforces with its falsification commitments: the point is the writing, not the box being checked.
