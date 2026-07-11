"""
Tests for backend/course_routes.py -- quest auto-discovery from
backend/courses/, quest detail lookup, and quest completion/progress
recording (Milestone 2, see docs/AI-COURSE-BUILD-PLAN.md).

These tests exercise the REAL quest YAML files under
backend/courses/build-real-stuff/ (kickoff_ux_reflection,
pressure_test_target_customer) rather than fixtures, since proving those
two files actually parse and load correctly is exactly what Milestone 2's
first quests are for (see the course-quest-authoring skill's testing
checklist).
"""
from datetime import datetime, timedelta

import course_routes
from models import CourseProgress, QuestCompletion

REFLECTION_QUEST_ID = "kickoff_ux_reflection"
CHALLENGE_QUEST_ID = "pressure_test_target_customer"
COURSE_SLUG = "build-real-stuff"


def test_load_quests_finds_real_quest_files():
    quests = course_routes.load_quests()
    ids = {q["id"] for q in quests}
    assert REFLECTION_QUEST_ID in ids
    assert CHALLENGE_QUEST_ID in ids


def test_load_quests_scoped_to_course_slug():
    quests = course_routes.load_quests(COURSE_SLUG)
    ids = {q["id"] for q in quests}
    assert REFLECTION_QUEST_ID in ids

    # A course slug that doesn't exist should return an empty list, not
    # raise -- mirrors quiz_routes.load_questions()'s fallback behavior.
    assert course_routes.load_quests("does-not-exist-course") == []


def test_get_quest_by_id():
    quest = course_routes.get_quest(CHALLENGE_QUEST_ID)
    assert quest is not None
    assert quest["type"] == "ai_chat_challenge"
    assert quest["credit_budget"] == 1500
    assert len(quest["rubric"]) == 4

    assert course_routes.get_quest("does-not-exist-quest-id") is None


def test_get_course_quests_endpoint(client):
    response = client.get(f"/api/courses/{COURSE_SLUG}/quests")
    assert response.status_code == 200
    ids = {q["id"] for q in response.json()["quests"]}
    assert REFLECTION_QUEST_ID in ids
    assert CHALLENGE_QUEST_ID in ids


def test_get_course_quest_detail_endpoint(client):
    response = client.get(f"/api/courses/{COURSE_SLUG}/quests/{REFLECTION_QUEST_ID}")
    assert response.status_code == 200
    assert response.json()["id"] == REFLECTION_QUEST_ID

    response = client.get(f"/api/courses/{COURSE_SLUG}/quests/does-not-exist")
    assert response.status_code == 404


def test_get_course_progress_defaults_when_no_progress_row(client):
    response = client.get(f"/api/courses/{COURSE_SLUG}/progress")
    assert response.status_code == 200
    body = response.json()
    assert body["xp"] == 0
    assert body["streak_count"] == 0
    assert body["current_quest"] is None
    assert body["completed_quest_ids"] == []


def test_get_course_progress_requires_auth(unauth_client):
    response = unauth_client.get(f"/api/courses/{COURSE_SLUG}/progress")
    assert response.status_code == 401


def test_get_course_progress_reflects_completion(client):
    client.post(f"/api/courses/{COURSE_SLUG}/quests/{REFLECTION_QUEST_ID}/complete", json={})
    response = client.get(f"/api/courses/{COURSE_SLUG}/progress")
    assert response.status_code == 200
    body = response.json()
    assert body["xp"] == course_routes.XP_AWARD_PER_QUEST
    assert body["streak_count"] == 1
    assert body["current_quest"] == REFLECTION_QUEST_ID
    assert REFLECTION_QUEST_ID in body["completed_quest_ids"]


def test_complete_quest_requires_auth(unauth_client):
    response = unauth_client.post(
        f"/api/courses/{COURSE_SLUG}/quests/{REFLECTION_QUEST_ID}/complete",
        json={},
    )
    assert response.status_code == 401


def test_complete_quest_unknown_quest_404(client):
    response = client.post(
        f"/api/courses/{COURSE_SLUG}/quests/does-not-exist/complete",
        json={},
    )
    assert response.status_code == 404


def test_complete_quest_creates_completion_and_progress(client, test_engine, test_user):
    response = client.post(
        f"/api/courses/{COURSE_SLUG}/quests/{REFLECTION_QUEST_ID}/complete",
        json={},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["quest_id"] == REFLECTION_QUEST_ID
    assert body["xp"] == course_routes.XP_AWARD_PER_QUEST
    assert body["streak_count"] == 1

    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=test_engine)
    db = Session()

    completions = db.query(QuestCompletion).filter(QuestCompletion.user_id == test_user["id"]).all()
    assert len(completions) == 1
    assert completions[0].quest_id == REFLECTION_QUEST_ID

    progress = db.query(CourseProgress).filter(
        CourseProgress.user_id == test_user["id"], CourseProgress.course_slug == COURSE_SLUG
    ).first()
    assert progress is not None
    assert progress.xp == course_routes.XP_AWARD_PER_QUEST
    assert progress.streak_count == 1
    assert progress.current_quest == REFLECTION_QUEST_ID
    db.close()


def test_complete_quest_twice_increments_xp_and_streak(client, test_engine, test_user):
    client.post(f"/api/courses/{COURSE_SLUG}/quests/{REFLECTION_QUEST_ID}/complete", json={})
    response = client.post(
        f"/api/courses/{COURSE_SLUG}/quests/{CHALLENGE_QUEST_ID}/complete", json={}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["xp"] == course_routes.XP_AWARD_PER_QUEST * 2
    assert body["streak_count"] == 2

    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=test_engine)
    db = Session()
    completions = db.query(QuestCompletion).filter(QuestCompletion.user_id == test_user["id"]).all()
    assert len(completions) == 2
    db.close()


def test_complete_quest_streak_resets_after_window(client, test_engine, test_user):
    """
    If the student's last activity was outside the streak window, the
    streak should reset to 1 rather than keep incrementing -- simulated
    here by seeding a stale CourseProgress row directly rather than
    waiting 24 real hours.
    """
    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=test_engine)
    db = Session()
    stale_time = datetime.utcnow() - course_routes.STREAK_WINDOW - timedelta(hours=1)
    db.add(CourseProgress(
        user_id=test_user["id"],
        course_slug=COURSE_SLUG,
        current_quest=REFLECTION_QUEST_ID,
        xp=50,
        streak_count=7,
        last_activity_at=stale_time,
    ))
    db.commit()
    db.close()

    response = client.post(
        f"/api/courses/{COURSE_SLUG}/quests/{CHALLENGE_QUEST_ID}/complete", json={}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["streak_count"] == 1
    assert body["xp"] == 50 + course_routes.XP_AWARD_PER_QUEST
