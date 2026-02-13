"""
SQLAlchemy models for the Quiz App database.
Defines Users and Scores tables.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    """
    Users table.
    Stores GitHub user information and their role.
    
    Columns:
    - id: Primary key (auto-increment)
    - github_id: Unique GitHub user ID
    - username: GitHub username
    - role: Either 'Student', 'Teacher', or 'Developer'
    """
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # GitHub ID (unique identifier from GitHub)
    github_id = Column(String, unique=True, index=True, nullable=False)
    
    # GitHub username (display name)
    username = Column(String, nullable=False)
    
    # Role: 'Student' (default), 'Teacher', or 'Developer'
    role = Column(String, default="Student", nullable=False)
    
    # Relationship to scores
    scores = relationship("Score", back_populates="user")


class Score(Base):
    """
    Scores table.
    Stores quiz attempt results for each user.
    
    Columns:
    - id: Primary key (auto-increment)
    - user_id: Foreign key to Users table
    - quiz_id: ID of the quiz taken
    - score: Points earned (only newly correct answers on retakes)
    - timestamp: When the quiz was completed
    - correct_questions: JSON string of question IDs answered correctly
    """
    __tablename__ = "scores"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key to users table
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Quiz identifier
    quiz_id = Column(String, nullable=False)
    
    # Score achieved (only points for newly correct answers)
    score = Column(Integer, nullable=False)
    
    # When the quiz was taken
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # JSON string of question IDs answered correctly (for tracking retakes)
    correct_questions = Column(Text, default="[]")
    
    # Relationship to user
    user = relationship("User", back_populates="scores")
