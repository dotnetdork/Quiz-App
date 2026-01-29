"""
Database setup using SQLAlchemy.
Creates the SQLite database and defines the schema.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from config import DATABASE_URL

# ----------------------------
# Create the database engine
# ----------------------------
# SQLite needs check_same_thread=False for FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# ----------------------------
# Create a session factory
# ----------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ----------------------------
# Base class for models
# ----------------------------
Base = declarative_base()


def get_db():
    """
    Dependency function for FastAPI.
    Creates a new database session for each request.
    Closes the session when the request is done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize the database.
    Creates all tables if they don't exist.
    """
    # Import models so they are registered with Base
    import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
