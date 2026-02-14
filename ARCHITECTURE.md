# 🏗️ Quiz App Architecture Documentation

> **Comprehensive guide to the Quiz App system architecture, components, and modification guidelines**

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Component Breakdown](#component-breakdown)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Authentication Flow](#authentication-flow)
9. [Frontend Components](#frontend-components)
10. [Backend Modules](#backend-modules)
11. [How to Modify Components](#how-to-modify-components)
12. [Performance Considerations](#performance-considerations)
13. [Security Considerations](#security-considerations)

---

## 🌐 System Overview

Quiz App is a **three-tier web application** following the Model-View-Controller (MVC) architectural pattern:

- **Presentation Layer** (View): React SPA frontend
- **Business Logic Layer** (Controller): FastAPI backend
- **Data Layer** (Model): SQLite database with SQLAlchemy ORM

### Key Design Principles

1. **Separation of Concerns** - Clear boundaries between frontend, backend, and database
2. **RESTful API** - Stateless HTTP communication with JSON payloads
3. **Component-Based UI** - Reusable React components with single responsibility
4. **ORM Pattern** - Database abstraction through SQLAlchemy models
5. **OAuth 2.0** - Delegated authentication via GitHub

---

## 📐 Architecture Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    (Chrome, Firefox, Safari)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     FRONTEND (React SPA)                         │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   Login.js   │Dashboard.js  │   Quiz.js    │Leaderboard.js│ │
│  │  (GitHub     │  (Progress   │  (Quiz       │  (Rankings)  │ │
│  │   OAuth)     │   Tracking)  │   Taking)    │              │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Components: MultipleChoice, ParsonsProblem      │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API (JSON)
                         │ /api/quiz/*, /api/leaderboard/*
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   main.py    │quiz_routes.py│leaderboard_  │   auth.py    │ │
│  │ (App entry,  │  (YAML quiz  │  routes.py   │  (GitHub     │ │
│  │  middleware) │   parsing)   │ (Top scores) │   OAuth)     │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│  ┌──────────────┬──────────────┬──────────────┐                │
│  │  models.py   │ database.py  │  config.py   │                │
│  │ (ORM models) │(SQLAlchemy)  │  (.env vars) │                │
│  └──────────────┴──────────────┴──────────────┘                │
└────────────────────────┬────────────────────────────────────────┘
                         │ SQLAlchemy ORM
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    DATABASE (SQLite)                             │
│  ┌──────────────────┬──────────────────┬──────────────────┐    │
│  │   users table    │   scores table   │  sessions table  │    │
│  │  (id, username,  │  (id, user_id,   │  (session data)  │    │
│  │   github_id)     │  quiz_id, score) │                  │    │
│  └──────────────────┴──────────────────┴──────────────────┘    │
│                     File: quiz_app.db                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            GitHub OAuth API (oauth.github.com)             │ │
│  │     /login/oauth/authorize, /login/oauth/access_token     │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Request Flow Diagram

```
User Action → Frontend Component → API Call (api.js) → Backend Route
                                                          ↓
                                                    Auth Middleware
                                                          ↓
                                                    Route Handler
                                                          ↓
                                                    Database Query
                                                          ↓
                                                    JSON Response
                                                          ↓
Frontend Component ← State Update ← Parse Response ← Backend
```

---

## 🔧 Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library for building interactive components |
| **React Router** | 6.x | Client-side routing and navigation |
| **dnd-kit** | 8.x | Drag-and-drop functionality for Parsons Problems |
| **CSS3** | - | Styling with custom animations and transitions |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.9+ | Programming language |
| **FastAPI** | 0.128.0 | Modern web framework with automatic API docs |
| **SQLAlchemy** | 2.0.36 | ORM for database operations |
| **Authlib** | 1.6.6 | OAuth 2.0 authentication library |
| **PyYAML** | 6.0.1 | YAML parsing for quiz files |
| **Uvicorn** | 0.32.0 | ASGI server for running FastAPI |

### Database

| Technology | Purpose |
|------------|---------|
| **SQLite** | Lightweight, file-based relational database |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization for consistent environments |
| **GitHub Codespaces** | Cloud-based development environment |
| **npm** | JavaScript package manager |
| **pip** | Python package manager |

---

## 🧩 Component Breakdown

### 1. Frontend Components

#### Pages (Top-Level Components)

| Component | File | Responsibility |
|-----------|------|----------------|
| **Login** | `frontend/src/pages/Login.js` | Handles GitHub OAuth login flow, displays login button |
| **Dashboard** | `frontend/src/pages/Dashboard.js` | Main user interface with tabs (Overview, Browse Quizzes, History, Leaderboard) |
| **Quiz** | `frontend/src/pages/Quiz.js` | Quiz-taking interface, question rendering, answer submission |
| **Leaderboard** | `frontend/src/pages/Leaderboard.js` | Global top 10 rankings display |

#### Reusable Components

| Component | File | Responsibility |
|-----------|------|----------------|
| **MultipleChoice** | `frontend/src/components/MultipleChoice.js` | Renders MCQ with options, handles selection |
| **ParsonsProblem** | `frontend/src/components/ParsonsProblem.js` | Drag-and-drop code block ordering interface |
| **ProtectedRoute** | `frontend/src/components/ProtectedRoute.js` | Authentication guard wrapper for protected pages |

#### Utilities

| File | Purpose |
|------|---------|
| `frontend/src/api.js` | HTTP request helper with error handling and base URL config |
| `frontend/src/data/learningData.js` | Static content for the Learn Dictionary feature |
| `frontend/src/App.js` | Root component with routing configuration |
| `frontend/src/index.js` | React app entry point, DOM rendering |

### 2. Backend Modules

#### Core Application Files

| File | Responsibility | Key Functions |
|------|----------------|---------------|
| **main.py** | Application entry point, middleware, static file serving | `app` (FastAPI instance), `/auth/login`, `/auth/callback`, `/auth/me` |
| **auth.py** | GitHub OAuth implementation | `authorize_redirect()`, `authorize_access_token()`, `get_github_user()` |
| **quiz_routes.py** | Quiz API endpoints, YAML parsing, scoring | `/api/quiz/questions`, `/api/quiz/submit` |
| **leaderboard_routes.py** | Leaderboard API endpoints | `/api/leaderboard/`, `/api/leaderboard/user/{username}` |

#### Data Layer

| File | Responsibility | Key Components |
|------|----------------|----------------|
| **models.py** | SQLAlchemy ORM models | `User` class, `Score` class |
| **database.py** | Database connection and session management | `engine`, `SessionLocal`, `get_db()`, `init_db()` |
| **config.py** | Environment configuration | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SECRET_KEY` |

#### Data Files

| Directory/File | Purpose |
|----------------|---------|
| **backend/quizzes/** | YAML quiz files (auto-loaded) |
| **backend/migrate_db.py** | Database migration utility script |

---

## 🔄 Data Flow

### Authentication Flow (GitHub OAuth)

```
1. User clicks "Login with GitHub" → Frontend redirects to /auth/login
2. Backend redirects user to GitHub OAuth page (oauth.github.com)
3. User authorizes the Quiz App on GitHub
4. GitHub redirects back to /auth/callback with authorization code
5. Backend exchanges code for access token (GitHub API)
6. Backend fetches user profile (username, GitHub ID, avatar)
7. Backend creates or updates User record in database
8. Backend creates session cookie (signed with SECRET_KEY)
9. Frontend redirects to /dashboard
10. Subsequent requests include session cookie for authentication
```

### Quiz Taking Flow

```
1. User navigates to Dashboard → Browse Quizzes tab
2. Frontend fetches quiz list: GET /api/quiz/questions
3. Backend reads all YAML files from backend/quizzes/
4. Backend returns quiz metadata (id, title, category, description)
5. User clicks quiz card → Navigate to /quiz/:quizId
6. Frontend fetches full quiz: GET /api/quiz/questions/:quizId
7. Backend parses YAML file, returns questions (without answers)
8. User answers questions → Frontend collects answers
9. User submits → POST /api/quiz/submit with quiz_id and answers[]
10. Backend validates answers, calculates score
11. Backend saves Score record to database (linked to user)
12. Backend returns results (score, correct answers, breakdown)
13. Frontend displays results with visual feedback
```

### Leaderboard Update Flow

```
1. User submits quiz → Score saved to database
2. Frontend requests leaderboard: GET /api/leaderboard/
3. Backend queries database:
   SELECT user.username, SUM(score.score) as total_points
   FROM users JOIN scores
   GROUP BY user.id
   ORDER BY total_points DESC
   LIMIT 10
4. Backend returns top 10 users with rankings
5. Frontend displays leaderboard with rank emojis (🥇🥈🥉)
```

---

## 💾 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,       -- GitHub username
    github_id INTEGER NOT NULL UNIQUE,   -- GitHub user ID
    name TEXT,                            -- Full name from GitHub
    avatar_url TEXT,                      -- Profile picture URL
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store authenticated user accounts from GitHub OAuth.

### Scores Table

```sql
CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,             -- Foreign key to users.id
    quiz_id TEXT NOT NULL,                -- Quiz identifier (from YAML)
    score INTEGER NOT NULL,               -- Points earned (new correct answers)
    correct_questions TEXT,               -- JSON array of correct question IDs
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Purpose**: Track all quiz attempts with scores and timestamps.

**Note**: `correct_questions` stores a JSON array like `["q1", "q3", "q5"]` to prevent duplicate points for re-attempts.

### Relationships

- **One-to-Many**: One User can have many Scores
- **User.id → Score.user_id**: Foreign key relationship

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/auth/login` | Initiates GitHub OAuth flow | Public |
| `GET` | `/auth/callback` | OAuth callback handler | Public |
| `GET` | `/auth/me` | Returns current user info | Required |
| `GET` | `/auth/logout` | Destroys session, logs out user | Required |

### Quiz Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/quiz/questions` | List all quizzes (metadata only) | Required |
| `GET` | `/api/quiz/questions/{quiz_id}` | Get full quiz with questions | Required |
| `POST` | `/api/quiz/submit` | Submit quiz answers for grading | Required |

**Submit Request Body:**
```json
{
  "quiz_id": "python_basics_01",
  "answers": [
    {"question_id": "q1", "answer": 2},
    {"question_id": "q2", "answer": [0, 1, 2, 3]}
  ]
}
```

**Submit Response:**
```json
{
  "score": 5,
  "total": 10,
  "results": [
    {"question_id": "q1", "submitted": 2, "correct": true},
    {"question_id": "q2", "submitted": [0,1,2,3], "correct": false}
  ]
}
```

### Leaderboard Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/leaderboard/` | Get top 10 users by total score | Required |
| `GET` | `/api/leaderboard/user/{username}` | Get user's score history | Required |

---

## 🔐 Authentication Flow

### Session-Based Authentication

Quiz App uses **cookie-based sessions** managed by Starlette's `SessionMiddleware`:

1. **Login**: User authenticates via GitHub OAuth
2. **Session Creation**: Server creates a session with user ID
3. **Cookie**: Encrypted session cookie sent to browser (signed with `SECRET_KEY`)
4. **Subsequent Requests**: Browser sends cookie with each request
5. **Authentication Check**: Middleware validates session and injects user data
6. **Logout**: Session destroyed, cookie cleared

### Authentication Middleware

The `get_current_user()` dependency in backend routes checks:
- Session cookie exists
- Session contains valid user ID
- User exists in database

If any check fails → HTTP 401 Unauthorized

---

## 🎨 Frontend Components

### Component Hierarchy

```
App.js (Root)
├── Router
│   ├── / → Login.js (Public)
│   ├── /dashboard → ProtectedRoute(Dashboard.js)
│   ├── /quiz/:quizId → ProtectedRoute(Quiz.js)
│   │   ├── MultipleChoice.js
│   │   └── ParsonsProblem.js
│   └── /leaderboard → ProtectedRoute(Leaderboard.js)
```

### State Management

Quiz App uses **React Hooks** for state management:
- `useState` - Local component state
- `useEffect` - Side effects (API calls, timers)
- `useNavigate` - Programmatic navigation

**Example: Dashboard.js State**
```javascript
const [user, setUser] = useState(null);           // Current user data
const [scores, setScores] = useState([]);         // User's score history
const [quizzes, setQuizzes] = useState([]);       // Available quizzes
const [leaderboard, setLeaderboard] = useState([]);  // Top 10 rankings
const [activeTab, setActiveTab] = useState('overview');  // Active tab
```

### Styling Architecture

- **CSS Modules**: Scoped styles per component
- **Design System**: Consistent color palette and spacing
- **Accessibility**: WCAG 2.1 AA compliant (high contrast, large fonts)

---

## ⚙️ Backend Modules

### FastAPI Application Structure

```python
# main.py - Application setup
app = FastAPI(title="Quiz App API")

# Middleware
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.add_middleware(CORSMiddleware, allow_origins=[...])

# Route registration
app.include_router(quiz_routes.router, prefix="/api/quiz")
app.include_router(leaderboard_routes.router, prefix="/api/leaderboard")

# Static file serving (React build)
app.mount("/", StaticFiles(directory="frontend/build", html=True))
```

### Database Session Management

```python
# database.py - Session factory pattern
def get_db():
    db = SessionLocal()
    try:
        yield db  # Dependency injection
    finally:
        db.close()  # Automatic cleanup

# Usage in routes
@router.get("/example")
def example_route(db: Session = Depends(get_db)):
    # db is automatically provided and cleaned up
    users = db.query(User).all()
    return users
```

---

## 🛠️ How to Modify Components

### Adding a New Frontend Page

1. **Create component file**: `frontend/src/pages/MyNewPage.js`
```javascript
function MyNewPage() {
  return <div><h1>My New Page</h1></div>;
}
export default MyNewPage;
```

2. **Add route**: Edit `frontend/src/App.js`
```javascript
import MyNewPage from './pages/MyNewPage';

// Inside <Routes>
<Route path="/my-new-page" element={
  <ProtectedRoute><MyNewPage /></ProtectedRoute>
} />
```

3. **Add navigation**: Link from Dashboard or header
```javascript
<Link to="/my-new-page">Go to My New Page</Link>
```

### Adding a New API Endpoint

1. **Choose appropriate route file**: `quiz_routes.py` or create new router
2. **Define endpoint**:
```python
@router.get("/my-endpoint")
def my_endpoint(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Your logic here
    return {"message": "Hello from my endpoint"}
```

3. **Register router** (if new file): In `main.py`
```python
from my_routes import router as my_router
app.include_router(my_router, prefix="/api/my")
```

### Adding a New Quiz

1. **Create YAML file**: `backend/quizzes/my_quiz.yaml`
```yaml
id: my_quiz_01
title: "My Quiz Title"
category: "Python"
description: "Quiz description"
questions:
  - id: q1
    type: multiple_choice
    question: "What is 2 + 2?"
    options: ["3", "4", "5", "6"]
    answer: 1
```

2. **No code changes needed** - Quiz auto-detected!

### Modifying the Database Schema

1. **Update model**: Edit `backend/models.py`
```python
class User(Base):
    # ... existing fields ...
    new_field = Column(String, nullable=True)  # Add new field
```

2. **Create migration script**: `backend/migrations/add_new_field.py`
```python
from sqlalchemy import create_engine
engine = create_engine('sqlite:///quiz_app.db')
with engine.connect() as conn:
    conn.execute("ALTER TABLE users ADD COLUMN new_field TEXT")
```

3. **Run migration**: `python migrations/add_new_field.py`

### Customizing the UI Theme

1. **Edit CSS variables**: `frontend/src/index.css`
```css
:root {
  --primary-color: #3b82f6;     /* Change primary color */
  --background-color: #1a1a2e;  /* Change background */
  --text-color: #ffffff;        /* Change text color */
}
```

2. **All components will automatically use new theme** thanks to CSS variables

---

## ⚡ Performance Considerations

### Optimizations Implemented

1. **Backend**:
   - ✅ Dictionary lookups instead of nested loops (O(n²) → O(n))
   - ✅ SQL aggregation for leaderboard totals (database-side calculation)
   - ✅ Efficient quiz answer validation with `answers_dict`

2. **Frontend**:
   - ✅ Quiz map creation for O(1) lookups instead of `.find()` loops
   - ✅ Lazy tab loading (data fetched only when tab clicked)
   - ✅ React component memoization where appropriate

3. **Database**:
   - ✅ Indexed foreign keys for fast joins
   - ✅ Limited queries with `.limit(10)` for leaderboard
   - ✅ Efficient scoring with GROUP BY and SUM

### Performance Best Practices

**When adding features:**
- Avoid N+1 queries (fetch related data in single query)
- Use pagination for large result sets
- Cache static data (quiz lists) in frontend
- Minimize database writes (batch updates when possible)
- Use database indexes for frequently queried columns

---

## 🔒 Security Considerations

### Authentication & Authorization

- ✅ **OAuth 2.0**: Delegated authentication via GitHub
- ✅ **Session cookies**: HttpOnly, Secure flags (production)
- ✅ **CSRF protection**: Session middleware validates state parameter
- ✅ **Secret key**: Strong random key for session encryption

### API Security

- ✅ **Authentication required**: All API endpoints check session
- ✅ **CORS configured**: Only whitelisted origins allowed
- ✅ **Input validation**: Pydantic models validate request bodies
- ✅ **SQL injection protection**: SQLAlchemy ORM parameterizes queries

### Data Privacy

- ✅ **Minimal data collection**: Only GitHub username, ID, avatar
- ✅ **No password storage**: Authentication delegated to GitHub
- ✅ **Leaderboard privacy**: Only usernames shown, no email/personal data

### Security Best Practices

**When adding features:**
- Never expose `SECRET_KEY` or OAuth secrets
- Validate and sanitize all user inputs
- Use parameterized queries (never string concatenation)
- Check authentication on every protected endpoint
- Log security events (failed logins, unusual activity)

---

## 📦 Deployment Considerations

### Environment-Specific Configuration

| Environment | Database | OAuth Callback | HTTPS |
|-------------|----------|----------------|-------|
| **Development** | SQLite file | `http://localhost:8000/auth/callback` | Optional |
| **Production** | SQLite file (with backups) | `https://yourdomain.com/auth/callback` | Required |

### Scaling Considerations

**Current limitations** (SQLite):
- Single-server deployment only
- Limited concurrent writes
- File-based storage

**To scale beyond 1000 concurrent users:**
- Migrate to PostgreSQL or MySQL
- Update `database.py` connection string
- Deploy behind load balancer
- Add Redis for session storage

---

## 📚 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **React Documentation**: https://react.dev
- **SQLAlchemy Documentation**: https://docs.sqlalchemy.org
- **GitHub OAuth Guide**: https://docs.github.com/en/developers/apps/building-oauth-apps

---

## 🎯 Summary

Quiz App is a well-architected, maintainable web application with:
- ✅ Clear separation of concerns (frontend/backend/database)
- ✅ RESTful API design with comprehensive documentation
- ✅ Component-based frontend with reusable pieces
- ✅ Secure authentication via GitHub OAuth
- ✅ Optimized performance (no N+1 queries, efficient lookups)
- ✅ Easy extensibility (add quizzes without code changes)

**Key Takeaways for Developers:**
1. Frontend changes → Modify `frontend/src/` files
2. Backend changes → Modify `backend/*.py` files
3. Add quizzes → Create YAML files in `backend/quizzes/`
4. Database changes → Update `models.py` and run migrations
5. Authentication → Handled by `auth.py` and session middleware

For questions or contributions, see [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue on GitHub.

---

© 2026 The LEAGUE of Amazing Programmers. All Rights Reserved.
