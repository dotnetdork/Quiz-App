from fastapi import APIRouter
from typing import List, Dict, Any
from utils.questions import load_questions, get_question_by_id

router = APIRouter()

@router.get("/")
async def get_all_questions() -> List[Dict[str, Any]]:
    """Get all questions from questions.yaml."""
    questions = load_questions()
    # Remove correct_order from response for security
    return [
        {
            "id": q.get("id"),
            "title": q.get("title"),
            "description": q.get("description"),
            "type": q.get("type"),
            "code_lines": q.get("code_lines", []),
        }
        for q in questions
    ]

@router.get("/{question_id}")
async def get_question(question_id: str) -> Dict[str, Any]:
    """Get a specific question by ID."""
    question = get_question_by_id(question_id)
    if not question:
        return {"error": "Question not found"}
    
    # Remove correct_order from response for security
    return {
        "id": question.get("id"),
        "title": question.get("title"),
        "description": question.get("description"),
        "type": question.get("type"),
        "code_lines": question.get("code_lines", []),
    }
