# Quiz Files

This directory contains individual quiz files in YAML format. Each quiz is stored in a separate file for easy editing and management.

## File Structure

Each quiz file (`*.yaml`) contains:

```yaml
id: unique_quiz_id
title: "Quiz Title"
description: "Brief description of the quiz"
category: "python" | "java" | "technology"
questions:
  - id: q1
    type: "multiple_choice" | "parsons"
    prompt: "The question text"
    # For multiple_choice:
    options:
      - "Option A"
      - "Option B"
      - "Option C"
      - "Option D"
    answer: "Correct Option"
    # For parsons (drag-and-drop code):
    blocks:
      - "Line 1 of code"
      - "Line 2 of code"
    answer: [0, 1]  # Correct order by index
```

## Available Quizzes

- `python_basics_01.yaml` - Python Fundamentals
- `python_data_structures.yaml` - Python Data Structures
- `java_basics_01.yaml` - Java Fundamentals
- `java_oop_01.yaml` - Java Object-Oriented Programming
- `tech_concepts_01.yaml` - Technology Concepts
- `robotics_01.yaml` - Robotics Fundamentals
- `cybersecurity_01.yaml` - Cybersecurity Fundamentals

## Adding a New Quiz

1. Create a new YAML file in this directory (e.g., `my_new_quiz.yaml`)
2. Follow the structure above
3. Ensure the `id` is unique
4. Set the appropriate `category` (python, java, or technology)
5. The quiz will automatically appear in the app

## Question Types

### Multiple Choice
- Present 2-4 options to the user
- User selects one answer
- `answer` field contains the exact text of the correct option

### Parsons Problems
- Present code blocks in random order
- User drags and drops to arrange them correctly
- `blocks` contains the code lines
- `answer` contains the correct order as an array of indices (starting from 0)

## Editing Guidelines

- Keep questions clear and concise
- For code blocks, maintain proper indentation using spaces
- Test your quiz in the application after editing
- Use descriptive prompts that clearly state what is being asked
