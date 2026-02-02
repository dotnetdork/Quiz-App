"""
Admin Routes - Teacher Dashboard.

Protected routes that only users with 'Teacher' or 'Developer' role can access.
Shows all students and their quiz attempts.
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models import User, Score

# ----------------------------
# Router setup
# ----------------------------
router = APIRouter()


# ----------------------------
# Helper: Check teacher role
# ----------------------------
def require_teacher(request: Request, db: Session = Depends(get_db)):
    """
    Verify that the current user is a teacher.
    Raises 403 if not.
    """
    # Get user from session
    github_id = request.session.get("user_id")
    if not github_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = db.query(User).filter(User.github_id == str(github_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Allow Teacher and Developer roles
    if user.role not in ("Teacher", "Developer"):
        raise HTTPException(
            status_code=403,
            detail="Access denied. Teacher role required."
        )
    
    return user


# ----------------------------
# Admin Endpoints
# ----------------------------
@router.get("/students")
def get_all_students(
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Get a list of all students.
    
    Returns:
    - id (database ID)
    - github_id
    - username
    - total_attempts (number of quizzes taken)
    - total_points (sum of all scores)
    """
    students = db.query(User).filter(User.role == "Student").all()
    
    result = []
    for student in students:
        # Count quiz attempts
        attempts = (
            db.query(Score)
            .filter(Score.user_id == student.id)
            .count()
        )
        
        # Sum total points
        total = (
            db.query(Score)
            .filter(Score.user_id == student.id)
            .with_entities(Score.score)
            .all()
        )
        total_points = sum(s[0] for s in total) if total else 0
        
        result.append({
            "id": student.id,
            "github_id": student.github_id,
            "username": student.username,
            "total_attempts": attempts,
            "total_points": total_points
        })
    
    return {"students": result}


@router.get("/student/{student_id}/attempts")
def get_student_attempts(
    student_id: int,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Get all quiz attempts for a specific student.
    """
    student = db.query(User).filter(User.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    attempts = (
        db.query(Score)
        .filter(Score.user_id == student_id)
        .order_by(Score.timestamp.desc())
        .all()
    )
    
    return {
        "student": {
            "id": student.id,
            "github_id": student.github_id,
            "username": student.username
        },
        "attempts": [
            {
                "id": a.id,
                "quiz_id": a.quiz_id,
                "score": a.score,
                "timestamp": a.timestamp.isoformat()
            }
            for a in attempts
        ]
    }


@router.get("/stats")
def get_admin_stats(
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Get overall statistics for the teacher dashboard.
    """
    # Total students
    total_students = db.query(User).filter(User.role == "Student").count()
    
    # Total quiz attempts
    total_attempts = db.query(Score).count()
    
    # Average score (if any attempts exist)
    all_scores = db.query(Score.score).all()
    avg_score = (
        round(sum(s[0] for s in all_scores) / len(all_scores), 1)
        if all_scores else 0
    )
    
    return {
        "total_students": total_students,
        "total_attempts": total_attempts,
        "average_score": avg_score
    }
