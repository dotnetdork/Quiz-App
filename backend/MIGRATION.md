# Database Migration Instructions

## Issue: `no such column: scores.correct_questions` Error

If you're experiencing an error about missing `scores.correct_questions` column after pulling recent updates, you need to migrate your existing database.

### Why is this needed?

PR #15 added a new column `correct_questions` to the `scores` table to track which questions were answered correctly on each quiz attempt. This prevents point farming from retaking quizzes.

Existing databases don't have this column, which causes the application to fail when trying to query user scores.

### Solution

Run the database migration script:

```bash
cd backend
python migrate_db.py
```

The script will:
1. Check if your database exists
2. Check if the `correct_questions` column is already present
3. Add the column if it's missing
4. Verify the migration was successful

### Alternative: Fresh Start

If you don't need to preserve your existing quiz data, you can simply delete the database file and let the application recreate it with the correct schema:

```bash
# From the backend directory
rm quiz_app.db

# Then start the application - it will create a new database with the correct schema
python -m uvicorn main:app --reload --host localhost --port 8000
```

### Verification

After migration, you should be able to:
1. Log in with GitHub successfully
2. View your dashboard without 500 errors
3. See your quiz history and scores
4. Take quizzes and have them tracked correctly

The application logs should no longer show `sqlite3.OperationalError: no such column: scores.correct_questions` errors.
