"""
Quiz Routes - YAML parsing and quiz submission.

This module handles:
- Loading questions from questions.yaml
- Saving student progress as Base64 encoded file
- Submitting quiz answers
"""
import base64
import json
import os
from datetime import datetime
from typing import List, Any

import yaml
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from config import QUIZFILES_PATH
from database import get_db
from models import User, Score

# ----------------------------
# Router setup
# ----------------------------
router = APIRouter()

# Path to quizzes directory (uses QUIZFILES_PATH from config)
QUIZZES_DIR = os.path.join(
    QUIZFILES_PATH,
    "quizzes"
)

# Fallback to old questions.yaml if quizzes directory doesn't exist
QUESTIONS_FILE = os.path.join(
    QUIZFILES_PATH,
    "questions.yaml"
)

# Path for student progress output
PROGRESS_FILE = os.path.join(
    os.path.dirname(__file__),
    "student_progress.txt"
)


# ----------------------------
# Helper: Load questions from individual quiz files or YAML
# ----------------------------
def load_questions():
    """
    Load quiz questions from individual quiz files in the quizzes/ directory,
    or fall back to the old questions.yaml file.
    
    Returns:
        dict containing quiz data
    """
    # Try loading from individual quiz files first
    if os.path.isdir(QUIZZES_DIR):
        try:
            quizzes = []
            for filename in sorted(os.listdir(QUIZZES_DIR)):
                if filename.endswith('.yaml') or filename.endswith('.yml'):
                    filepath = os.path.join(QUIZZES_DIR, filename)
                    with open(filepath, 'r') as file:
                        quiz_data = yaml.safe_load(file)
                        if quiz_data:
                            quizzes.append(quiz_data)
            return {"quizzes": quizzes}
        except Exception as e:
            # Fall through to try questions.yaml
            print(f"Error loading individual quiz files: {e}")
    
    # Fallback to old questions.yaml format
    try:
        with open(QUESTIONS_FILE, "r") as file:
            data = yaml.safe_load(file)
            return data
    except FileNotFoundError:
        return {"quizzes": []}
    except yaml.YAMLError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing YAML: {str(e)}"
        )


# ----------------------------
# Helper: Save student progress
# ----------------------------
def save_student_progress(user_id: int, username: str, answers: dict):
    """
    Save student answers to a Base64 encoded file.
    
    Args:
        user_id: The student's database ID
        username: The student's GitHub username
        answers: Dictionary of their answers
    """
    # Create progress data
    progress_data = {
        "user_id": user_id,
        "username": username,
        "timestamp": datetime.utcnow().isoformat(),
        "answers": answers
    }
    
    # Convert to JSON string
    json_string = json.dumps(progress_data, indent=2)
    
    # Encode to Base64
    encoded = base64.b64encode(json_string.encode()).decode()
    
    # Write to file
    with open(PROGRESS_FILE, "w") as file:
        file.write(encoded)
    
    return encoded


def decode_student_progress(encoded_data: str):
    """
    Decode Base64 student progress data.
    
    Args:
        encoded_data: Base64 encoded string
    
    Returns:
        dict with decoded progress data
    """
    decoded = base64.b64decode(encoded_data.encode()).decode()
    return json.loads(decoded)


# ----------------------------
# Pydantic models for requests
# ----------------------------
class AnswerSubmission(BaseModel):
    """Model for submitting a single answer."""
    question_id: str
    # String for multiple choice, list of ints for Parsons
    answer: Any  # Using Any for compatibility with Python 3.8+


class QuizSubmission(BaseModel):
    """Model for submitting a complete quiz."""
    quiz_id: str
    answers: List[AnswerSubmission]


# ----------------------------
# Quiz Endpoints
# ----------------------------
@router.get("/questions")
def get_questions():
    """
    Get all available quizzes and questions.
    Returns the parsed YAML data.
    """
    return load_questions()


@router.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: str):
    """
    Get a specific quiz by ID.
    """
    data = load_questions()
    
    for quiz in data.get("quizzes", []):
        if quiz["id"] == quiz_id:
            return quiz
    
    raise HTTPException(status_code=404, detail="Quiz not found")


@router.post("/submit")
def submit_quiz(
    submission: QuizSubmission,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Submit answers for a quiz.
    Calculates score and saves progress.
    """
    # Get current user from session
    github_id = request.session.get("user_id")
    if not github_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = db.query(User).filter(User.github_id == str(github_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Load the quiz
    data = load_questions()
    quiz = None
    for q in data.get("quizzes", []):
        if q["id"] == submission.quiz_id:
            quiz = q
            break
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Calculate score
    score = 0
    total = len(quiz["questions"])
    results = []
    
    for question in quiz["questions"]:
        # Find the submitted answer
        submitted = None
        for ans in submission.answers:
            if ans.question_id == question["id"]:
                submitted = ans.answer
                break
        
        # Check if answer is correct
        correct = False
        if question["type"] == "multiple_choice":
            correct = submitted == question["answer"]
        elif question["type"] == "parsons":
            # For Parsons, compare list of indices
            correct = submitted == question["answer"]
        
        if correct:
            score += 1
        
        results.append({
            "question_id": question["id"],
            "submitted": submitted,
            "correct": correct
        })
    
    # Save score to database
    new_score = Score(
        user_id=user.id,
        quiz_id=submission.quiz_id,
        score=score
    )
    db.add(new_score)
    db.commit()
    
    # Save progress to Base64 file
    save_student_progress(
        user_id=user.id,
        username=user.username,
        answers={
            "quiz_id": submission.quiz_id,
            "results": results,
            "score": score,
            "total": total
        }
    )
    
    return {
        "score": score,
        "total": total,
        "percentage": round((score / total) * 100, 1) if total > 0 else 0,
        "results": results
    }
