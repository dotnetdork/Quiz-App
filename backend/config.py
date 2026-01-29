"""
Configuration settings for the Quiz App backend.
Contains GitHub OAuth settings and database configuration.
"""
import os

# ----------------------------
# GitHub OAuth Configuration
# ----------------------------
# Set these in your environment or GitHub Codespaces secrets
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "your_client_id_here")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "your_client_secret_here")

# The URL where GitHub redirects after login
GITHUB_REDIRECT_URI = os.getenv(
    "GITHUB_REDIRECT_URI",
    "http://localhost:8000/auth/callback"
)

# ----------------------------
# Database Configuration
# ----------------------------
# SQLite database file path (local file-based)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./quiz_app.db"
)

# ----------------------------
# Session Secret Key
# ----------------------------
# Used to sign session cookies (keep this secret!)
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-to-a-secure-random-string")

# ----------------------------
# Frontend URL (for CORS)
# ----------------------------
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
