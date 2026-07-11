# spec_sprint

Wraps the UA Framework `specification` skill's five-part screen description exercise in a scored, timed activity. Graded by `/api/ai/grade-response` (fast tier) plus a structural check that all five parts are present.

## Schema

```yaml
- id: dashboard_screen_description
  type: spec_sprint
  stage: "Stage 3 — Screen descriptions"
  credit_budget: 1200
  screen_name: "Student Dashboard"
  prompt: >
    Write the five-part description for the Student Dashboard screen:
    purpose, key elements, primary actions, states, and constraints.
  required_parts:
    - purpose
    - key_elements
    - primary_actions
    - states
    - constraints
  rubric:
    - "Purpose ties back to a clause in the positioning statement, not a generic statement"
    - "At least one state beyond the default happy path is described (empty, loading, error)"
    - "Primary actions are specific UI actions, not vague verbs like 'interact'"
    - "Constraints name a real limitation (technical, content, or scope), not a placeholder"
```

## Writing tips

The structural check (`required_parts` all present) should run before the rubric check — a submission missing a whole part shouldn't earn partial credit on the parts it does have without the student knowing something's missing. Keep the rubric grounded in this specific screen; a generic "describes the screen well" rubric can't tell a strong five-part description from five vague sentences.
