from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime, timezone

from database import get_db
from models import User, QuizAttempt
from utils.questions import get_question_by_id, validate_parsons_answer
from utils.auth import verify_token

router = APIRouter()

class SubmitAnswerRequest(BaseModel):
    question_id: str
    answer: List[str]
    token: str

class SubmitAnswerResponse(BaseModel):
    is_correct: bool
    message: str

@router.post("/submit", response_model=SubmitAnswerResponse)
async def submit_answer(request: SubmitAnswerRequest, db: Session = Depends(get_db)):
    """Submit an answer to a quiz question."""
    # Verify token
    payload = verify_token(request.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get question
    question = get_question_by_id(request.question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Validate answer
    is_correct = validate_parsons_answer(question, request.answer)
    
    # Save attempt
    attempt = QuizAttempt(
        user_id=user.id,
        question_id=request.question_id,
        answer=",".join(request.answer),
        is_correct=is_correct,
        completed_at=datetime.now(timezone.utc)
    )
    db.add(attempt)
    db.commit()
    
    return SubmitAnswerResponse(
        is_correct=is_correct,
        message="Correct!" if is_correct else "Incorrect. Try again!"
    )

@router.get("/history")
async def get_quiz_history(token: str, db: Session = Depends(get_db)):
    """Get quiz history for the current user."""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = int(payload.get("sub"))
    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
    
    return [
        {
            "id": attempt.id,
            "question_id": attempt.question_id,
            "is_correct": attempt.is_correct,
            "completed_at": attempt.completed_at.isoformat(),
        }
        for attempt in attempts
    ]
