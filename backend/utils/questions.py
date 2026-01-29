import yaml
from typing import List, Dict, Any
import os

def load_questions(file_path: str = "questions.yaml") -> List[Dict[str, Any]]:
    """Load questions from YAML file."""
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r') as file:
        data = yaml.safe_load(file)
        return data.get('questions', [])

def get_question_by_id(question_id: str, file_path: str = "questions.yaml") -> Dict[str, Any]:
    """Get a specific question by ID."""
    questions = load_questions(file_path)
    for question in questions:
        if question.get('id') == question_id:
            return question
    return None

def validate_parsons_answer(question: Dict[str, Any], user_answer: List[str]) -> bool:
    """Validate a Parsons problem answer."""
    if question.get('type') != 'parsons':
        return False
    
    correct_order = question.get('correct_order', [])
    return user_answer == correct_order
