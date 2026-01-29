"""
Leaderboard Routes - High score display.

Shows the top 10 users by total points.
Abstracts private data for privacy.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import User, Score

# ----------------------------
# Router setup
# ----------------------------
router = APIRouter()


# ----------------------------
# Leaderboard Endpoints
# ----------------------------
@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):
    """
    Get the top 10 high scores.
    
    Returns a list of:
    - rank (1-10)
    - username (GitHub username)
    - total_points (sum of all quiz scores)
    
    Note: We only show username, not GitHub ID or other private data.
    """
    # Query to get total scores per user
    results = (
        db.query(
            User.username,
            func.sum(Score.score).label("total_points")
        )
        .join(Score, User.id == Score.user_id)
        .group_by(User.id)
        .order_by(func.sum(Score.score).desc())
        .limit(10)
        .all()
    )
    
    # Format results with ranks
    leaderboard = []
    for rank, (username, points) in enumerate(results, start=1):
        leaderboard.append({
            "rank": rank,
            "username": username,
            "total_points": points or 0
        })
    
    return {"leaderboard": leaderboard}


@router.get("/user/{username}")
def get_user_scores(username: str, db: Session = Depends(get_db)):
    """
    Get scores for a specific user by username.
    """
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        return {"scores": [], "total_points": 0}
    
    scores = (
        db.query(Score)
        .filter(Score.user_id == user.id)
        .order_by(Score.timestamp.desc())
        .all()
    )
    
    total = sum(s.score for s in scores)
    
    return {
        "username": username,
        "scores": [
            {
                "quiz_id": s.quiz_id,
                "score": s.score,
                "timestamp": s.timestamp.isoformat()
            }
            for s in scores
        ],
        "total_points": total
    }
