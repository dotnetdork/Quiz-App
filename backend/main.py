"""
Quiz App Backend - Main FastAPI Application

This is the main entry point for the Quiz App API.
It includes:
- GitHub OAuth authentication
- Quiz endpoints (YAML parsing)
- Leaderboard endpoints
- Admin/Teacher dashboard endpoints
- Static file serving for the frontend (React build)
"""
import os
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session

from config import SECRET_KEY, FRONTEND_URL
from database import get_db, init_db
from models import User, Score
from auth import authorize_redirect, authorize_access_token, get_github_user
from deps import get_current_user, require_user

# ----------------------------
# Determine static files path
# ----------------------------
# The frontend build directory (relative to this file)
BACKEND_DIR = Path(__file__).parent
PROJECT_ROOT = BACKEND_DIR.parent
STATIC_DIR = PROJECT_ROOT / "frontend" / "build"

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

# CORS middleware for frontend (needed for development with separate servers)
# Build allowed origins list based on FRONTEND_URL configuration
cors_origins = ["http://localhost:3000", "http://localhost:3456"]
if FRONTEND_URL:
    cors_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
# Root endpoint
# ----------------------------
@app.get("/")
def read_root():
    """
    Root endpoint.
    If frontend build exists, serve it. Otherwise, show API info.
    """
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))

    return {
        "message": "Welcome to Quiz App API",
        "docs": "/docs",
        "version": "1.0.0",
        "note": "Build the frontend with 'npm run build' in the frontend directory to serve the React app"
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
    response = await authorize_redirect(request, redirect_uri)
    # TEMP DEBUG (2026-07-10): tracking down a recurring mismatching_state
    # CSRF error -- logging what got stored in the session right after
    # Authlib sets its state, plus the cookie header the browser will
    # actually receive, so we can tell whether the state made it into the
    # cookie at all. Remove once the root cause is confirmed.
    print(f"[oauth-debug] /auth/login session after redirect setup: {dict(request.session)}")
    print(f"[oauth-debug] /auth/login outgoing Set-Cookie: {response.headers.get('set-cookie')}")
    return response


@app.get("/auth/callback")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    """
    GitHub OAuth callback.
    Receives the code from GitHub, exchanges for token,
    and creates/updates user in database.
    """
    # TEMP DEBUG (2026-07-10): see note above -- logging what session data
    # (if any) and cookies actually arrived on this request, before Authlib
    # gets a chance to raise on the state mismatch.
    print(f"[oauth-debug] /auth/callback incoming cookies: {request.cookies}")
    print(f"[oauth-debug] /auth/callback session as seen by server: {dict(request.session)}")
    print(f"[oauth-debug] /auth/callback query params: {dict(request.query_params)}")
    try:
        # Exchange code for token
        token = await authorize_access_token(request)

        # Get user info from GitHub
        github_user = await get_github_user(token)

        github_id = str(github_user["id"])
        username = github_user["login"]

        # Check if user exists
        user = db.query(User).filter(User.github_id == github_id).first()

        if not user:
            # Create new user as Student (TitleCase)
            user = User(
                github_id=github_id,
                username=username,
                role="Student"
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

        # Redirect to frontend dashboard
        # If FRONTEND_URL is set, redirect there; otherwise redirect to local /dashboard
        redirect_url = f"{FRONTEND_URL}/dashboard" if FRONTEND_URL else "/dashboard"
        return RedirectResponse(url=redirect_url)

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
    redirect_url = FRONTEND_URL if FRONTEND_URL else "/"
    return RedirectResponse(url=redirect_url)


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
# AI Course Extension Endpoints ("Build Real Stuff")
# ----------------------------
# course_routes owns quest content (loading, detail, completion/progress);
# ai_routes owns the AI-model-calling endpoints and imports get_quest()
# from course_routes rather than duplicating quest-loading logic.
from course_routes import router as course_router
app.include_router(course_router, prefix="/api/courses", tags=["courses"])

from ai_routes import router as ai_router
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])

# ----------------------------
# Static File Serving (Frontend)
# ----------------------------
# Serve the React frontend build if it exists
# This allows the backend to serve the frontend without a separate server
#
# NOTE: This catch-all route is registered AFTER all API routes.
# FastAPI matches routes in registration order, so API routes (/api/*, /auth/*, /docs, etc.)
# will be matched first. The catch-all only handles unmatched routes.
if STATIC_DIR.exists():
    # Mount static files (JS, CSS, images) at /static
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR / "static")), name="static")

    @app.get("/{path:path}")
    async def serve_frontend(path: str):
        """
        Serve the React frontend.
        This catches all non-API routes and serves the React app.
        React Router handles client-side routing.
        """
        # Don't serve frontend for API or auth routes (they should 404 if not found)
        if path.startswith("api/") or path.startswith("auth/"):
            raise HTTPException(status_code=404, detail="Not found")

        # Check if the requested file exists
        file_path = STATIC_DIR / path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))

        # For all other paths, serve index.html (React Router will handle)
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))

        raise HTTPException(status_code=404, detail="Not found")
