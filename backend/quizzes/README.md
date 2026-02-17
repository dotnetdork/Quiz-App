# Quiz Files

This directory contains individual quiz files in YAML format, organized by category. Each quiz is stored in a separate file for easy editing and management.

## Directory Structure

Quizzes are organized into subdirectories by category:
- `python/` - Python programming quizzes
- `java/` - Java programming quizzes
- `technology/` - General technology and computer science quizzes

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

### Python (`python/`)
- `functions_collections.yaml` - Functions and Collections
- `loops_iteration.yaml` - Loops and Iteration
- `turtle_graphics.yaml` - Turtle Graphics
- `types_logic.yaml` - Types and Logic

### Java (`java/`)
- `java_basics_01.yaml` - Java Fundamentals
- `java_oop_01.yaml` - Java Object-Oriented Programming
- `java_collections_01.yaml` - Java Collections Framework
- `java_advanced_01.yaml` - Java Advanced Programming

### Technology (`technology/`)
- `tech_concepts_01.yaml` - Technology Concepts
- `robotics_01.yaml` - Robotics Fundamentals
- `cybersecurity_01.yaml` - Cybersecurity Fundamentals
- `ai_fundamentals_01.yaml` - Artificial Intelligence Fundamentals

## Adding a New Quiz

1. Determine the appropriate category directory (python, java, or technology)
2. Create a new YAML file in that directory (e.g., `python/my_new_quiz.yaml`)
3. Follow the structure above
4. Ensure the `id` is unique
5. Set the appropriate `category` (python, java, or technology)
6. The quiz will automatically appear in the app

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

### Output Prediction
- Show code and ask user to predict its output
- User selects from multiple choice options
- `code` field contains the code snippet
- `options` contains possible outputs
- `answer` contains the correct output

### Debugging Questions
- Show buggy code and ask user to identify the bug or fix
- User selects from multiple choice options
- `code` field contains the buggy code
- `options` contains possible fixes or bug descriptions
- `answer` contains the correct fix/description

### Fill in the Blank
- Show code with blanks (marked as `___`)
- User selects what should replace the blank
- `code` field contains the code with blanks
- `options` contains possible values
- `answer` contains the correct value

### Free Response
- User types their answer
- Supports exact or case-insensitive matching
- `answer` contains the correct answer
- `case_sensitive` (optional, default: false) controls matching
- `placeholder` (optional) provides hint text

### Faded Parsons
- Variant of Parsons where some lines are fixed in position
- User only arranges the remaining blocks
- `blocks` contains all code lines
- `fixed_indices` contains array of indices for fixed blocks
- `answer` contains correct order of movable blocks only

## Editing Guidelines

- Keep questions clear and concise
- For code blocks, maintain proper indentation using spaces
- Test your quiz in the application after editing
- Use descriptive prompts that clearly state what is being asked
