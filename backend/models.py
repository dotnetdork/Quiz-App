"""
SQLAlchemy models for the Quiz App database.
Defines Users and Scores tables, plus the AI course extension's
CreditLedger, CourseProgress, and QuestCompletion tables
(see docs/AI-COURSE-EXTENSION-PLAN.md section 7).
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, UniqueConstraint
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


class CreditLedger(Base):
    """
    Credit ledger table -- the AI course extension's spend record.

    One row per successful AI call. This is the source of truth for how
    many tokens a student has spent on a given quest; remaining budget is
    always computed live as (quest_budget - SUM(tokens_spent)), never
    stored as a running balance, so it can't silently drift out of sync
    with what was actually spent (see the credit-ledger-integration skill).

    Columns:
    - id: Primary key (auto-increment)
    - user_id: Foreign key to Users table
    - quest_id: String identifier matching a quest YAML file's `id` field
      (not a hard foreign key -- quests are content files, not database rows)
    - model_tier: 'fast' (DeepSeek V4 Flash) or 'agent' (DeepSeek V4 Pro).
      Matters because cost-per-token differs ~3x between the two tiers.
    - tokens_spent: Tokens used by this specific call
    - budget: Snapshot of the quest's total credit budget at the time of
      this call (an audit-trail value, not the live remaining balance)
    - timestamp: When the call happened
    """
    __tablename__ = "credit_ledger"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quest_id = Column(String, nullable=False, index=True)
    model_tier = Column(String, nullable=False)
    tokens_spent = Column(Integer, nullable=False)
    budget = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", backref="credit_transactions")


class CourseProgress(Base):
    """
    Course progress table -- one row per (user, course), tracking XP,
    streak, and where the student currently is in the campaign map.
    The course-scoped equivalent of what Score tracks per quiz.

    Columns:
    - id: Primary key (auto-increment)
    - user_id: Foreign key to Users table
    - course_slug: Identifier for the course (e.g. "build-real-stuff")
    - current_quest: The quest id the student is currently on (nullable
      until they start their first quest)
    - xp: Accumulated experience points
    - streak_count: Consecutive-activity streak counter
    - last_activity_at: Timestamp of the student's last quest activity,
      used to determine whether a streak continues or resets
    """
    __tablename__ = "course_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "course_slug", name="uq_course_progress_user_course"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    course_slug = Column(String, nullable=False, index=True)
    current_quest = Column(String, nullable=True)
    xp = Column(Integer, nullable=False, default=0)
    streak_count = Column(Integer, nullable=False, default=0)
    last_activity_at = Column(DateTime, nullable=True)

    user = relationship("User", backref="course_progress_entries")


class QuestCompletion(Base):
    """
    Quest completion table -- one row per completed attempt at a quest.
    Mirrors how Score allows multiple attempts per quiz (retakes); a quest
    can likewise be completed more than once, with the most recent row
    reflecting the latest attempt.

    Columns:
    - id: Primary key (auto-increment)
    - user_id: Foreign key to Users table
    - quest_id: String identifier matching a quest YAML file's `id` field
    - completed_at: When this attempt was completed
    - artifact_ref: Optional path/reference to a related artifact, e.g. a
      student's ua6-specification.md or wireframe project when the quest
      is backed by the UA Framework plugin
    """
    __tablename__ = "quest_completions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quest_id = Column(String, nullable=False, index=True)
    completed_at = Column(DateTime, default=datetime.utcnow)
    artifact_ref = Column(String, nullable=True)

    user = relationship("User", backref="quest_completions")
