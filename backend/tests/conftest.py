"""
Shared pytest fixtures for backend tests.

Sets up an isolated in-memory SQLite database per test, overrides the
app's get_db and require_user dependencies so tests don't need a real
session cookie or a real GitHub login, and provides a TestClient wired to
those overrides.

This is the first test infrastructure in this repo (see
docs/AI-COURSE-BUILD-PLAN.md Milestone 1) -- add to this file rather than
duplicating fixtures in individual test modules as more tests are added.
"""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure backend/ is importable the same way it is when the app actually
# runs (main.py etc. use bare `from config import ...` style imports that
# assume backend/ is on sys.path, not `from backend.config import ...`).
sys.path.insert(0, str(Path(__file__).parent.parent))

import models  # noqa: E402  (registers all tables on database.Base)
from database import Base, get_db  # noqa: E402
from deps import require_user  # noqa: E402
from models import User  # noqa: E402


@pytest.fixture()
def test_engine():
    """Fresh in-memory SQLite database for each test."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def test_user(test_engine):
    """Insert a single test user and return it (detached-safe fields only)."""
    TestingSessionLocal = sessionmaker(bind=test_engine)
    db = TestingSessionLocal()
    user = User(github_id="12345", username="testkid", role="Student")
    db.add(user)
    db.commit()
    db.refresh(user)
    user_id, username, role = user.id, user.username, user.role
    db.close()
    return {"id": user_id, "username": username, "role": role}


@pytest.fixture()
def client(test_engine, test_user):
    """
    TestClient with get_db and require_user overridden -- every request
    made through this client is "logged in" as test_user without needing
    a real session cookie or GitHub OAuth flow.
    """
    # Import main lazily, after sys.path is set up, and reset ai_routes'
    # in-memory rate-limit state so tests don't bleed into each other.
    import ai_routes
    from main import app

    ai_routes._reset_rate_limit_state()

    TestingSessionLocal = sessionmaker(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    def override_require_user():
        db = TestingSessionLocal()
        try:
            return db.query(User).filter(User.id == test_user["id"]).first()
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[require_user] = override_require_user

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture()
def unauth_client(test_engine):
    """
    TestClient with get_db overridden but require_user left as the real
    dependency -- no session cookie is set, so the real auth check should
    fail with 401 the same way it would for any not-logged-in request.
    """
    import ai_routes
    from main import app

    ai_routes._reset_rate_limit_state()

    TestingSessionLocal = sessionmaker(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
