# Architecture Overview

This document explains how the Quiz-App works at a technical level.

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Browser                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    React Frontend                       │  │
│  │              (served from /build folder)                │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP Requests (port 8000)
┌──────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Auth Routes │  │ Quiz Routes │  │ Admin/Leaderboard   │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
│                              │                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   SQLAlchemy ORM                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     SQLite Database                           │
│                      (quiz_app.db)                            │
└──────────────────────────────────────────────────────────────┘
```

## Key Components

### Backend (FastAPI)

| File | Purpose |
|------|---------|
| `main.py` | App entry point, middleware, OAuth routes |
| `config.py` | Loads environment variables |
| `database.py` | Database connection setup |
| `models.py` | User and Score database models |
| `auth.py` | GitHub OAuth helper functions |
| `quiz_routes.py` | Quiz endpoints, YAML parsing |
| `leaderboard_routes.py` | Score display endpoints |
| `admin_routes.py` | Teacher-only endpoints |

### Frontend (React)

| File/Folder | Purpose |
|-------------|---------|
| `App.js` | Main component, routing |
| `api.js` | API helper (fetch wrapper) |
| `pages/` | Full page components |
| `components/` | Reusable UI components |
| `index.css` | Global styles (dyslexia-friendly) |

---

## Request Flow

### Example: User Takes a Quiz

```
1. User navigates to /quiz/python_basics
   └─> React Router renders <Quiz> component

2. Quiz component loads
   └─> useEffect calls apiCall('/api/quiz/quiz/python_basics')

3. Browser sends GET request
   └─> Includes session cookie automatically

4. Backend receives request
   └─> CORS middleware checks origin
   └─> Session middleware reads cookie
   └─> Route handler executes

5. quiz_routes.py handles request
   └─> Loads questions.yaml
   └─> Returns quiz data as JSON

6. Frontend receives response
   └─> setQuiz(data) updates state
   └─> Questions render on screen

7. User answers questions and clicks Submit

8. Frontend sends POST /api/quiz/submit
   └─> Body contains quiz_id and answers

9. Backend scores the quiz
   └─> Compares answers to correct answers
   └─> Saves score to database
   └─> Returns results

10. Frontend shows score
```

---

## Authentication (OAuth)

### Flow Diagram

```
User          Frontend         Backend           GitHub
 │               │                │                 │
 │ Click Login   │                │                 │
 │──────────────>│                │                 │
 │               │ GET /auth/login│                 │
 │               │───────────────>│                 │
 │               │                │ Redirect        │
 │<──────────────┼────────────────┼────────────────>│
 │               │                │                 │
 │         [User sees GitHub auth page]             │
 │               │                │                 │
 │ Authorize     │                │                 │
 │──────────────────────────────────────────────────>
 │               │                │                 │
 │               │                │<────────────────│
 │               │                │  code=ABC123    │
 │               │                │                 │
 │               │                │ Exchange code   │
 │               │                │────────────────>│
 │               │                │ Access token    │
 │               │                │<────────────────│
 │               │                │                 │
 │               │  Set cookie    │                 │
 │<──────────────┼────────────────│                 │
 │               │                │                 │
 │               │  Redirect to / │                 │
 │<──────────────┼────────────────│                 │
```

### Session Management

- Sessions stored in encrypted cookies
- `SECRET_KEY` used for encryption
- Cookie sent with every request
- Backend checks `request.session.get("user_id")`

---

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| github_id | TEXT | Unique GitHub user ID |
| username | TEXT | GitHub username |
| role | TEXT | "Student" or "Teacher" |

### Scores Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key → Users.id |
| quiz_id | TEXT | Quiz identifier |
| score | INTEGER | Points earned |
| timestamp | DATETIME | When completed |

---

## Quiz Data Format

Quizzes are stored in `backend/questions.yaml`:

```yaml
quizzes:
  - id: quiz_identifier
    title: "Quiz Title"
    description: "Description shown to user"
    questions:
      - id: q1
        type: "multiple_choice"
        prompt: "Question text"
        options: ["A", "B", "C", "D"]
        answer: "B"
      
      - id: q2
        type: "parsons"
        prompt: "Arrange the code"
        blocks:
          - "line 1"
          - "line 2"
        answer: [0, 1]
```

---

## Drag & Drop (Parsons Problems)

Uses `@dnd-kit` library:

| Component | Purpose |
|-----------|---------|
| `DndContext` | Manages drag state |
| `SortableContext` | Makes list sortable |
| `useSortable` | Hook for draggable items |

### How It Works

1. User drags a block
2. `handleDragEnd` fires with old/new positions
3. `arrayMove` reorders the array
4. State updates, UI re-renders
5. On submit, order array sent to backend

---

## Security

| Feature | Implementation |
|---------|----------------|
| Session encryption | `SECRET_KEY` + SessionMiddleware |
| CORS | Only allows configured origins |
| SQL injection | SQLAlchemy ORM escapes queries |
| OAuth | GitHub validates redirects |
| Role-based access | `require_Teacher` dependency |

---

## Libraries

### Backend

| Library | Purpose |
|---------|---------|
| FastAPI | Web framework |
| Uvicorn | ASGI server |
| SQLAlchemy | Database ORM |
| Authlib | OAuth client |
| PyYAML | YAML parsing |
| python-dotenv | Environment variables |

### Frontend

| Library | Purpose |
|---------|---------|
| React | UI components |
| React Router | Client-side routing |
| @dnd-kit | Drag and drop |

---

## Next Steps

- [API Reference](api-reference.md) - All endpoints
- [Development Guide](../development-guide.md) - Making changes
