"""
Quiz App Backend - Main FastAPI Application

This is the main entry point for the Quiz App API.
It includes:
- GitHub OAuth authentication
- Quiz endpoints (YAML parsing)
- Leaderboard endpoints
- Admin/Teacher dashboard endpoints
"""
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session

from config import SECRET_KEY, FRONTEND_URL
from database import get_db, init_db
from models import User, Score
from auth import oauth, get_github_user

# ----------------------------
# Create FastAPI app
# ----------------------------
app = FastAPI(
    title="Quiz App API",
    description="A quiz application with GitHub OAuth",
    version="1.0.0"
)

# ----------------------------
# Add middleware
# ----------------------------
# Session middleware for OAuth state
app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Initialize database on startup
# ----------------------------
@app.on_event("startup")
def startup_event():
    """Create database tables on startup."""
    init_db()


# ----------------------------
# Helper: Get current user from session
# ----------------------------
def get_current_user(request: Request, db: Session = Depends(get_db)):
    """
    Get the current logged-in user from the session.
    Returns None if not logged in.
    """
    github_id = request.session.get("user_id")
    if not github_id:
        return None
    
    user = db.query(User).filter(User.github_id == str(github_id)).first()
    return user


def require_user(request: Request, db: Session = Depends(get_db)):
    """
    Dependency that requires a logged-in user.
    Raises 401 if not logged in.
    """
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


def require_teacher(request: Request, db: Session = Depends(get_db)):
    """
    Dependency that requires a teacher role.
    Raises 403 if not a teacher.
    """
    user = require_user(request, db)
    if user.role != "teacher":
        raise HTTPException(status_code=403, detail="Teacher access required")
    return user


# ----------------------------
# Root endpoint
# ----------------------------
@app.get("/")
def read_root():
    """Welcome message and API info."""
    return {
        "message": "Welcome to Quiz App API",
        "docs": "/docs",
        "version": "1.0.0"
    }


# ----------------------------
# Authentication Endpoints
# ----------------------------
@app.get("/auth/login")
async def login(request: Request):
    """
    Start GitHub OAuth flow.
    Redirects to GitHub's authorization page.
    """
    redirect_uri = request.url_for("auth_callback")
    return await oauth.github.authorize_redirect(request, redirect_uri)


@app.get("/auth/callback")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    """
    GitHub OAuth callback.
    Receives the code from GitHub, exchanges for token,
    and creates/updates user in database.
    """
    try:
        # Exchange code for token
        token = await oauth.github.authorize_access_token(request)
        
        # Get user info from GitHub
        github_user = await get_github_user(token)
        
        github_id = str(github_user["id"])
        username = github_user["login"]
        
        # Check if user exists
        user = db.query(User).filter(User.github_id == github_id).first()
        
        if not user:
            # Create new user as student
            user = User(
                github_id=github_id,
                username=username,
                role="student"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update username if changed
            if user.username != username:
                user.username = username
                db.commit()
        
        # Store user ID in session
        request.session["user_id"] = github_id
        request.session["username"] = username
        
        # Redirect to frontend
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard")
        
    except Exception as e:
        # Handle OAuth errors
        raise HTTPException(status_code=400, detail=f"OAuth error: {str(e)}")


@app.get("/auth/logout")
def logout(request: Request):
    """
    Log out the current user.
    Clears the session and redirects to home.
    """
    request.session.clear()
    return RedirectResponse(url=FRONTEND_URL)


@app.get("/auth/me")
def get_me(user: User = Depends(require_user)):
    """
    Get the current logged-in user's info.
    """
    return {
        "id": user.id,
        "github_id": user.github_id,
        "username": user.username,
        "role": user.role
    }


# ----------------------------
# Quiz Endpoints (imported from routes)
# ----------------------------
from quiz_routes import router as quiz_router
app.include_router(quiz_router, prefix="/api/quiz", tags=["quiz"])

# ----------------------------
# Leaderboard Endpoints
# ----------------------------
from leaderboard_routes import router as leaderboard_router
app.include_router(leaderboard_router, prefix="/api/leaderboard", tags=["leaderboard"])

# ----------------------------
# Admin Endpoints (Teacher Only)
# ----------------------------
from admin_routes import router as admin_router
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
