"""
Shared FastAPI dependencies.

Session-based "who is making this request" logic used to be defined once
in main.py and then re-implemented separately (slightly differently) inside
quiz_routes.py's submit_quiz endpoint. This module is the single copy both
routers (and any future router, including the AI course extension's
ai_routes.py) import from, so there is one place that knows how to read the
logged-in user out of the session cookie.
"""
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models import User


def get_current_user(request: Request, db: Session = Depends(get_db)):
    """
    Get the current logged-in user from the session, or None if not logged in.

    "Session" here means the signed cookie Starlette's SessionMiddleware
    manages (see main.py) -- it stores the GitHub user id after OAuth login,
    not a database-backed session table.
    """
    github_id = request.session.get("user_id")
    if not github_id:
        return None

    user = db.query(User).filter(User.github_id == str(github_id)).first()
    return user


def require_user(request: Request, db: Session = Depends(get_db)):
    """
    Dependency that requires a logged-in user, raising 401 if not.

    Use this (via `user: User = Depends(require_user)` in a route's
    signature) instead of re-reading request.session.get("user_id")
    directly in a new endpoint -- that inline pattern is exactly what led
    to two slightly different auth checks existing side by side before
    this module existed.
    """
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
