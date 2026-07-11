"""
Course Routes - quest loading, quest detail, and quest completion for the
"Build Real Stuff" AI/SDLC course extension.

Mirrors quiz_routes.py's role for quizzes: this module owns auto-discovery
of course content (backend/courses/<course-slug>/*.yaml, the same
walk-the-directory pattern quiz_routes.load_questions() uses for
backend/quizzes/<category>/*.yaml) and the endpoints for listing quests,
fetching one, and recording a completion. AI-model-calling endpoints
(tutor-chat, grade-response) live in ai_routes.py instead, which imports
get_quest() from here rather than duplicating quest-loading logic --
see docs/AI-COURSE-EXTENSION-PLAN.md section 7 and
.claude/skills/course-quest-authoring/SKILL.md for the content schema.
"""
import os
from datetime import datetime, timedelta
from typing import Optional

import yaml
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from config import QUIZFILES_PATH
from database import get_db
from deps import require_user
from models import CourseProgress, QuestCompletion, User

router = APIRouter()

# Path to the courses directory (parallel to quiz_routes.py's QUIZZES_DIR).
COURSES_DIR = os.path.join(QUIZFILES_PATH, "courses")

# Flat XP award per completed quest and the streak window, for now. Both
# are deliberately simple starting points (like Milestone 1's rate-limit
# defaults) -- tune once real students are generating real data rather
# than guessing at the "right" numbers up front.
XP_AWARD_PER_QUEST = 10
STREAK_WINDOW = timedelta(hours=24)


# ----------------------------
# Helper: Load quests from course YAML files
# ----------------------------
def load_quests(course_slug: Optional[str] = None) -> list:
    """
    Load quest definitions auto-discovered from backend/courses/, parsed
    fresh on every call -- no caching, matching quiz_routes.load_questions()
    so a content edit shows up without a server restart.

    Each YAML file's top-level structure is a list of one or more quest
    dicts (see course-quest-authoring skill), not a single dict the way
    quiz files are -- so files are flattened together with `.extend()`
    rather than appended as one item per file.

    If course_slug is given, only that course's subdirectory is walked.
    Otherwise every course is flattened together, which is what
    get_quest() below relies on for a global-by-id lookup (the same way
    quiz_routes.get_quiz() doesn't require the caller to know a quiz's
    category).
    """
    base_dir = os.path.join(COURSES_DIR, course_slug) if course_slug else COURSES_DIR
    quests = []
    if os.path.isdir(base_dir):
        for root, dirs, files in os.walk(base_dir):
            for filename in sorted(files):
                if filename.endswith(('.yaml', '.yml')):
                    filepath = os.path.join(root, filename)
                    with open(filepath, 'r') as file:
                        quest_list = yaml.safe_load(file)
                        if quest_list:
                            quests.extend(quest_list)
    return quests


def get_quest(quest_id: str) -> Optional[dict]:
    """Find a single quest by id, searching across all courses."""
    for quest in load_quests():
        if quest.get("id") == quest_id:
            return quest
    return None


# ----------------------------
# Pydantic models for requests/responses
# ----------------------------
class QuestCompleteRequest(BaseModel):
    # Optional reference to a related artifact -- e.g. a student's
    # ua6-specification.md or wireframe project when the quest is backed
    # by the UA Framework plugin (see models.QuestCompletion's docstring).
    artifact_ref: Optional[str] = None


class QuestCompleteResponse(BaseModel):
    quest_id: str
    xp: int
    streak_count: int
    completed_at: datetime


class CourseProgressResponse(BaseModel):
    course_slug: str
    xp: int
    streak_count: int
    current_quest: Optional[str] = None
    completed_quest_ids: list[str] = []


# ----------------------------
# Endpoints
# ----------------------------
@router.get("/{course_slug}/quests")
def get_course_quests(course_slug: str):
    """List all quests for a course."""
    return {"quests": load_quests(course_slug)}


@router.get("/{course_slug}/quests/{quest_id}")
def get_course_quest(course_slug: str, quest_id: str):
    """Get a single quest by id within a course."""
    for quest in load_quests(course_slug):
        if quest.get("id") == quest_id:
            return quest
    raise HTTPException(status_code=404, detail="Quest not found")


@router.get("/{course_slug}/progress", response_model=CourseProgressResponse)
def get_course_progress(
    course_slug: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """
    Current XP/streak/completed-quests snapshot for the frontend CourseMap
    page, so a student can see where they stand before completing anything
    in the current session (complete_quest's response only reflects state
    *after* an attempt).

    Note: QuestCompletion rows aren't scoped by course_slug (only by
    quest_id/user_id), matching get_quest()'s global-by-id lookup -- fine
    while there's a single course, but worth revisiting if a second course
    is ever added.
    """
    progress = (
        db.query(CourseProgress)
        .filter(CourseProgress.user_id == user.id, CourseProgress.course_slug == course_slug)
        .first()
    )
    completed_ids = sorted({
        row.quest_id
        for row in db.query(QuestCompletion.quest_id).filter(QuestCompletion.user_id == user.id).distinct()
    })

    if progress is None:
        return CourseProgressResponse(
            course_slug=course_slug, xp=0, streak_count=0, current_quest=None,
            completed_quest_ids=completed_ids,
        )

    return CourseProgressResponse(
        course_slug=course_slug,
        xp=progress.xp,
        streak_count=progress.streak_count,
        current_quest=progress.current_quest,
        completed_quest_ids=completed_ids,
    )


@router.post("/{course_slug}/quests/{quest_id}/complete", response_model=QuestCompleteResponse)
def complete_quest(
    course_slug: str,
    quest_id: str,
    payload: QuestCompleteRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
):
    """
    Record a quest completion and update the student's course progress
    (xp/streak) -- the course-scoped equivalent of what
    quiz_routes.submit_quiz does for `scores`.

    A quest can be completed more than once (mirrors Score allowing
    quiz retakes); each attempt gets its own QuestCompletion row, with
    the most recent one reflecting the latest attempt.
    """
    quest = get_quest(quest_id)
    if quest is None:
        raise HTTPException(status_code=404, detail=f"Quest not found: {quest_id!r}")

    now = datetime.utcnow()

    completion = QuestCompletion(
        user_id=user.id,
        quest_id=quest_id,
        completed_at=now,
        artifact_ref=payload.artifact_ref,
    )
    db.add(completion)

    progress = (
        db.query(CourseProgress)
        .filter(CourseProgress.user_id == user.id, CourseProgress.course_slug == course_slug)
        .first()
    )

    if progress is None:
        progress = CourseProgress(
            user_id=user.id,
            course_slug=course_slug,
            current_quest=quest_id,
            xp=XP_AWARD_PER_QUEST,
            streak_count=1,
            last_activity_at=now,
        )
        db.add(progress)
    else:
        # Simplest possible streak rule: bump if the last activity was
        # within the streak window, reset to 1 otherwise. Tune once real
        # usage patterns are visible (see Milestone 1's rate-limit note
        # for the same "simple default, revisit later" reasoning).
        if progress.last_activity_at and (now - progress.last_activity_at) <= STREAK_WINDOW:
            progress.streak_count += 1
        else:
            progress.streak_count = 1
        progress.xp += XP_AWARD_PER_QUEST
        progress.current_quest = quest_id
        progress.last_activity_at = now

    db.commit()
    db.refresh(progress)

    return QuestCompleteResponse(
        quest_id=quest_id,
        xp=progress.xp,
        streak_count=progress.streak_count,
        completed_at=completion.completed_at,
    )
