"""
Configuration settings for the Quiz App backend.
Contains GitHub OAuth settings and database configuration.
Uses python-dotenv to load settings from .env file.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

# ----------------------------
# Load environment variables from .env file
# ----------------------------
# Look for .env file in the backend directory or project root
backend_dir = Path(__file__).parent
project_root = backend_dir.parent

# Try to load from project root first, then backend directory
env_file = project_root / ".env"
if not env_file.exists():
    env_file = backend_dir / ".env"

load_dotenv(env_file)

# ----------------------------
# GitHub OAuth Configuration
# ----------------------------
# Set these in your .env file or environment
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
# Can be set via DATABASE_PATH in .env file
DATABASE_PATH = os.getenv("DATABASE_PATH", "./quiz_app.db")
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# ----------------------------
# Quiz Files Configuration
# ----------------------------
# Path to directory containing quiz YAML files
QUIZFILES_PATH = os.getenv("QUIZFILES_PATH", str(backend_dir))

# ----------------------------
# Session Secret Key
# ----------------------------
# Used to sign session cookies (keep this secret!)
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-to-a-secure-random-string")

# ----------------------------
# Frontend URL (for CORS)
# ----------------------------
# If empty, the backend serves the frontend and uses the backend URL
FRONTEND_URL = os.getenv("FRONTEND_URL", "")
