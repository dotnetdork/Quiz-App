# Database Design and Schema

This document describes the database structure, relationships, and operations for Quiz-App.

## Database Technology

**SQLite 3** is used for data persistence:
- **File-based**: Single file (`quiz_app.db`) contains entire database
- **Zero configuration**: No server setup required
- **ACID compliant**: Supports transactions
- **Async support**: via aiosqlite driver
- **Production ready**: Suitable for low-to-medium traffic applications

### Why SQLite?

✅ **Advantages**:
- Simple deployment (single file)
- No separate database server needed
- Perfect for Docker containers
- Fast for read-heavy workloads
- Built-in to Python

⚠️ **Limitations**:
- Limited concurrent writes
- No built-in replication
- File size practical limit ~140TB

💡 **Migration Path**: For high-traffic applications, migrate to PostgreSQL with minimal code changes (SQLAlchemy makes this easy).

## Schema Overview

### Entity-Relationship Diagram

```
┌──────────────────┐
│      users       │
│                  │
│  id (PK)         │
│  github_id       │◄─────┐
│  username        │      │
│  role            │      │
└──────────────────┘      │
                          │ (1)
                          │
                          │
                     (Many)│
                          │
              ┌───────────┴──────────┐
              │                      │
    ┌─────────▼─────────┐  ┌────────▼─────────┐
    │      scores        │  │   quiz_history   │
    │                    │  │                  │
    │  id (PK)           │  │  id (PK)         │
    │  user_id (FK)      │  │  user_id (FK)    │
    │  quiz_id           │  │  quiz_id         │
    │  score             │  │  question_id     │
    │  timestamp         │  │  user_answer     │
    └────────────────────┘  │  correct_answer  │
                            │  is_correct      │
                            │  timestamp       │
                            └──────────────────┘
```

## Table Definitions

### users

Stores user profiles from GitHub OAuth authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Internal user ID |
| github_id | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED | GitHub user ID (unique identifier) |
| username | VARCHAR(255) | NOT NULL | GitHub username |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'user' | User role (user/admin) |

**Indexes:**
- `idx_users_github_id` on `github_id` (unique)

**SQLAlchemy Model:**
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    github_id = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")
    
    # Relationships
    scores = relationship("Score", back_populates="user")
    quiz_history = relationship("QuizHistory", back_populates="user")
```

**Example Data:**
```sql
id | github_id | username     | role
---|-----------|--------------|------
1  | 12345678  | johndoe      | user
2  | 87654321  | janedoe      | admin
3  | 11223344  | codingpro    | user
```

### scores

Stores quiz attempt results (aggregate score per quiz attempt).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Score record ID |
| user_id | INTEGER | FOREIGN KEY → users.id, NOT NULL, INDEXED | User who took the quiz |
| quiz_id | VARCHAR(255) | NOT NULL, INDEXED | Quiz identifier |
| score | INTEGER | NOT NULL | Number of correct answers |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When quiz was completed |

**Indexes:**
- `idx_scores_user_id` on `user_id`
- `idx_scores_quiz_id` on `quiz_id`
- `idx_scores_timestamp` on `timestamp`

**SQLAlchemy Model:**
```python
class Score(Base):
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quiz_id = Column(String(255), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="scores")
```

**Example Data:**
```sql
id | user_id | quiz_id          | score | timestamp
---|---------|------------------|-------|--------------------
1  | 1       | python-basics-1  | 8     | 2026-02-14 10:30:00
2  | 1       | java-basics-1    | 7     | 2026-02-14 11:00:00
3  | 2       | python-basics-1  | 10    | 2026-02-14 11:30:00
```

### quiz_history

Stores detailed question-by-question results for each quiz attempt.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | History record ID |
| user_id | INTEGER | FOREIGN KEY → users.id, NOT NULL, INDEXED | User who answered |
| quiz_id | VARCHAR(255) | NOT NULL, INDEXED | Quiz identifier |
| question_id | VARCHAR(255) | NOT NULL | Question identifier |
| user_answer | TEXT | NULLABLE | User's answer (JSON for complex answers) |
| correct_answer | TEXT | NOT NULL | Correct answer |
| is_correct | BOOLEAN | NOT NULL | Whether answer was correct |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When answered |

**Indexes:**
- `idx_quiz_history_user_id` on `user_id`
- `idx_quiz_history_quiz_id` on `quiz_id`

**SQLAlchemy Model:**
```python
class QuizHistory(Base):
    __tablename__ = "quiz_history"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quiz_id = Column(String(255), nullable=False, index=True)
    question_id = Column(String(255), nullable=False)
    user_answer = Column(Text, nullable=True)
    correct_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="quiz_history")
```

**Example Data:**
```sql
id | user_id | quiz_id         | question_id | user_answer | correct_answer | is_correct | timestamp
---|---------|-----------------|-------------|-------------|----------------|------------|-------------------
1  | 1       | python-basics-1 | pybasic-1   | "0"         | "0"            | TRUE       | 2026-02-14 10:30
2  | 1       | python-basics-1 | pybasic-2   | "1"         | "0"            | FALSE      | 2026-02-14 10:30
3  | 1       | python-basics-1 | pybasic-3   | "2"         | "2"            | TRUE       | 2026-02-14 10:30
```

## Database Operations

### Common Queries

#### 1. Get User by GitHub ID

```python
user = db.query(User).filter(User.github_id == github_id).first()
```

```sql
SELECT * FROM users WHERE github_id = ?
```

#### 2. Get User's Quiz Scores

```python
scores = db.query(Score).filter(Score.user_id == user.id).order_by(Score.timestamp.desc()).all()
```

```sql
SELECT * FROM scores 
WHERE user_id = ? 
ORDER BY timestamp DESC
```

#### 3. Calculate Total Points for User

```python
total_points = db.query(func.sum(Score.score)).filter(Score.user_id == user.id).scalar() or 0
```

```sql
SELECT SUM(score) FROM scores WHERE user_id = ?
```

#### 4. Get Global Leaderboard (Top 10)

```python
leaderboard = (
    db.query(
        User.username,
        func.sum(Score.score).label("total_points")
    )
    .join(Score, User.id == Score.user_id)
    .group_by(User.id, User.username)
    .order_by(func.sum(Score.score).desc())
    .limit(10)
    .all()
)
```

```sql
SELECT 
    u.username, 
    SUM(s.score) as total_points
FROM users u
JOIN scores s ON u.id = s.user_id
GROUP BY u.id, u.username
ORDER BY total_points DESC
LIMIT 10
```

#### 5. Save Quiz Attempt

```python
# Transaction to ensure atomicity
try:
    # Save aggregate score
    score = Score(
        user_id=user.id,
        quiz_id=quiz_id,
        score=total_correct,
        timestamp=datetime.utcnow()
    )
    db.add(score)
    
    # Save detailed history
    for question in questions:
        history = QuizHistory(
            user_id=user.id,
            quiz_id=quiz_id,
            question_id=question.id,
            user_answer=question.user_answer,
            correct_answer=question.correct_answer,
            is_correct=question.is_correct,
            timestamp=datetime.utcnow()
        )
        db.add(history)
    
    db.commit()
except Exception as e:
    db.rollback()
    raise
```

## Database Initialization

### Creating Tables

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# Create database engine
engine = create_engine('sqlite:///quiz_app.db', echo=False)

# Create all tables
Base.metadata.create_all(engine)
```

### Seeding Data

Quiz questions are loaded from `questions.yaml`, not stored in database:
```yaml
# questions.yaml
- id: "python-basics-1"
  title: "Python Basics"
  category: "python"
  questions:
    - id: "pybasic-1"
      type: "multiple-choice"
      question: "What is 2 + 2?"
      options: ["3", "4", "5"]
      correct_answer: 1
```

## Database Migrations

### Migration Script

```python
# migrate_db.py
from alembic import context
from sqlalchemy import engine_from_config, pool
from models import Base

# Migration logic here
```

### Manual Migration

For schema changes:

```bash
cd backend
python migrate_db.py
```

### Backup and Restore

```bash
# Backup
cp quiz_app.db quiz_app_backup_$(date +%Y%m%d).db

# Restore
cp quiz_app_backup_20260214.db quiz_app.db

# Export to SQL
sqlite3 quiz_app.db .dump > backup.sql

# Import from SQL
sqlite3 quiz_app.db < backup.sql
```

## Performance Considerations

### Indexes

All foreign keys and frequently queried columns are indexed:
- `users.github_id` - Used in every authentication check
- `scores.user_id` - Used in leaderboard queries
- `scores.quiz_id` - Used in quiz statistics
- `scores.timestamp` - Used for recent scores

### Query Optimization

1. **Use indexes**: All WHERE and JOIN columns are indexed
2. **Limit results**: Use LIMIT for leaderboards and lists
3. **Aggregate efficiently**: Use database SUM/COUNT instead of application logic
4. **Connection pooling**: SQLAlchemy pools connections
5. **Prepared statements**: All queries use parameterized statements

### Scaling Strategies

**Current: SQLite**
- ✅ Supports current load
- ✅ Simple deployment
- ⚠️ Limited concurrent writes

**Migration to PostgreSQL** (when needed):
```python
# Change engine URL only
engine = create_engine('postgresql://user:pass@localhost/quizapp')
```

Benefits:
- Better concurrent write performance
- Replication and clustering support
- Advanced query optimization
- Production-grade features

## Troubleshooting

### Common Issues

**1. Database locked errors**
- **Cause**: Multiple concurrent writes
- **Solution**: Use connection pooling, implement retry logic

**2. Foreign key constraint violations**
- **Cause**: Referencing non-existent user
- **Solution**: Ensure user exists before creating scores

**3. Database file not found**
- **Cause**: Incorrect working directory
- **Solution**: Use absolute paths or ensure correct CWD

**4. Migration failures**
- **Cause**: Schema conflicts
- **Solution**: Backup database, drop tables, recreate

### Diagnostic Queries

```sql
-- Check database size
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();

-- List all tables
SELECT name FROM sqlite_master WHERE type='table';

-- Show table schema
PRAGMA table_info(users);

-- Check indexes
SELECT * FROM sqlite_master WHERE type='index';

-- Query performance analysis
EXPLAIN QUERY PLAN SELECT * FROM scores WHERE user_id = 1;
```

## Security

### SQL Injection Prevention

All queries use parameterized statements via SQLAlchemy ORM:

```python
# ✅ Safe - Parameterized
user = db.query(User).filter(User.github_id == github_id).first()

# ❌ Unsafe - String concatenation (NEVER DO THIS)
user = db.execute(f"SELECT * FROM users WHERE github_id = '{github_id}'")
```

### Data Privacy

- **Minimal data storage**: Only GitHub ID and username
- **No sensitive data**: Passwords, emails, tokens not stored
- **User control**: Users can delete account via GitHub OAuth revocation

### Database Permissions

```bash
# Set appropriate file permissions
chmod 640 quiz_app.db  # Owner can read/write, group can read
chown appuser:appgroup quiz_app.db
```

---

For more information, see:
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/14/orm/)
- [Database Performance Guide](https://www.sqlite.org/optoverview.html)
