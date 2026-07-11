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

# ----------------------------
# AI Course Extension ("Build Real Stuff") Configuration
# ----------------------------
# We call DeepSeek's models through OpenRouter (openrouter.ai), not
# DeepSeek's own API directly. OpenRouter is a unified, OpenAI-compatible
# gateway that proxies to many providers under one key and one billing
# account. This project's available key is an OpenRouter key -- the same
# one already configured in the project's Continue.dev config.yaml for
# in-IDE coding -- not a DeepSeek-issued key. An earlier draft of this file
# pointed the `openai` client straight at DeepSeek's own API, which
# correctly rejected that key as invalid (401 "api key ... is invalid"),
# since DeepSeek has no way to recognize a credential issued by OpenRouter.
#
# Left blank by default rather than a fake placeholder, so ai_routes.py can
# give a clear error the first time something tries to use it instead of
# silently sending requests with a bogus key.
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# OpenRouter's OpenAI-compatible base URL, confirmed via
# openrouter.ai/docs/quickstart.
OPENROUTER_API_BASE = os.getenv("OPENROUTER_API_BASE", "https://openrouter.ai/api/v1")

# Two-tier model split (docs/AI-COURSE-EXTENSION-PLAN.md section 6):
# "fast" (DeepSeek V4 Flash) for high-volume tutor chat and rubric grading,
# "agent" (DeepSeek V4 Pro) for debug_rescue bug generation and real
# coding-agent work. Model slugs use OpenRouter's own "<provider>/<model>"
# naming convention (confirmed via openrouter.ai/deepseek), which differs
# from DeepSeek's native slugs ("deepseek-v4-flash" with no prefix) -- the
# "agent" tier here matches the model already in the project's Continue.dev
# config.yaml. Read from env rather than hardcoded so a future model-name
# or provider change is a config edit, not a code change.
AI_MODEL_BY_TIER = {
    "fast": os.getenv("OPENROUTER_MODEL_FAST", "deepseek/deepseek-v4-flash"),
    "agent": os.getenv("OPENROUTER_MODEL_AGENT", "deepseek/deepseek-v4-pro"),
}

# Simple per-user rate limit for /api/ai/* endpoints -- insurance sitting
# in front of the credit-budget check, not a replacement for it. Protects
# against a bug or a fast client-side loop burning through calls faster
# than the budget check alone would catch.
AI_RATE_LIMIT_MAX_CALLS = int(os.getenv("AI_RATE_LIMIT_MAX_CALLS", "6"))
AI_RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("AI_RATE_LIMIT_WINDOW_SECONDS", "60"))
