# Quiz-App Architecture Design

This document provides a comprehensive overview of the Quiz-App architecture, covering the frontend, backend, database, authentication flow, and deployment strategies.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [Authentication Flow](#authentication-flow)
7. [Database Design](#database-design)
8. [API Design](#api-design)
9. [Security Considerations](#security-considerations)
10. [Performance Optimizations](#performance-optimizations)

## System Overview

Quiz-App is a full-stack web application that provides interactive coding quizzes with the following key features:

- **User Authentication**: GitHub OAuth 2.0 integration
- **Quiz Management**: Multiple quiz categories with various question types
- **Progress Tracking**: Personal dashboards and global leaderboards
- **Real-time Updates**: Dynamic UI updates without page refreshes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Architecture Pattern

The application follows a **client-server architecture** with:
- **Frontend**: React Single Page Application (SPA)
- **Backend**: FastAPI RESTful API server
- **Database**: SQLite for data persistence
- **Authentication**: OAuth 2.0 with GitHub as the provider

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           React SPA (Port 3000/Served by 8000)         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │  Login   │  │Dashboard │  │   Quiz   │             │ │
│  │  │   Page   │  │   Page   │  │   Page   │             │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘             │ │
│  │       │             │             │                     │ │
│  │       └─────────────┴─────────────┘                     │ │
│  │                     │                                   │ │
│  │              ┌──────▼──────┐                           │ │
│  │              │ API Client  │                           │ │
│  │              │  (api.js)   │                           │ │
│  │              └──────┬──────┘                           │ │
│  └─────────────────────┼────────────────────────────────┘ │
└────────────────────────┼──────────────────────────────────┘
                         │ HTTPS/HTTP
                         │
┌────────────────────────▼──────────────────────────────────┐
│                      Server Layer                          │
│  ┌────────────────────────────────────────────────────────┐│
│  │              FastAPI Server (Port 8000)                ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐││
│  │  │   Auth       │  │    Quiz      │  │  Leaderboard │││
│  │  │   Routes     │  │   Routes     │  │    Routes    │││
│  │  │  (auth.py)   │  │(quiz_routes) │  │(leaderboard) │││
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘││
│  │         │                 │                 │         ││
│  │         └─────────────────┴─────────────────┘         ││
│  │                           │                            ││
│  │                  ┌────────▼────────┐                  ││
│  │                  │   Database      │                  ││
│  │                  │   Layer         │                  ││
│  │                  │ (database.py)   │                  ││
│  │                  └────────┬────────┘                  ││
│  └───────────────────────────┼───────────────────────────┘│
└────────────────────────────┼─────────────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │   SQLite Database  │
                   │   (quiz_app.db)    │
                   │                    │
                   │  ┌──────────────┐  │
                   │  │    users     │  │
                   │  │    scores    │  │
                   │  │quiz_history  │  │
                   │  └──────────────┘  │
                   └────────────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼─────────┐              ┌───────────▼────────┐
│  GitHub OAuth API │              │  Quiz Questions    │
│  (OAuth 2.0)      │              │  (questions.yaml)  │
└───────────────────┘              └────────────────────┘
```

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI framework |
| React Router | 7.13.0 | Client-side routing |
| @dnd-kit | 6.3.1+ | Drag-and-drop for Parsons problems |
| Mermaid | 11.12.2 | Diagram rendering |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.128.0 | Web framework |
| SQLAlchemy | 2.0.36 | ORM for database |
| Authlib | 1.6.6 | OAuth 2.0 client |
| Uvicorn | 0.32.0 | ASGI server |
| PyYAML | 6.0.1 | Quiz configuration parsing |
| aiosqlite | 0.19.0 | Async SQLite driver |

### Infrastructure

- **Database**: SQLite 3
- **Containerization**: Docker & Docker Compose
- **Web Server**: Uvicorn (ASGI)
- **Development Server**: React Scripts (Webpack)

## Component Architecture

### Frontend Components

```
src/
├── components/              # Reusable components
│   ├── MultipleChoice.js   # Multiple choice question component
│   ├── ParsonsProblem.js   # Drag-and-drop code ordering
│   └── ProtectedRoute.js   # Route guard for authentication
├── pages/                   # Page-level components
│   ├── Login.js            # Login page with space animation
│   ├── Dashboard.js        # User dashboard with tabs
│   ├── Quiz.js             # Quiz taking interface
│   └── Leaderboard.js      # Global leaderboard
├── utils/                   # Utility functions and hooks
│   ├── rankUtils.js        # Rank badge/emoji helpers
│   └── useAuth.js          # Custom authentication hook
├── App.js                   # Root component with routing
└── api.js                   # API client configuration
```

#### Component Hierarchy

```
App
├── Navigation (conditional)
├── Routes
│   ├── Login (public)
│   ├── ProtectedRoute
│   │   ├── Dashboard
│   │   │   ├── UserProfileCard
│   │   │   ├── StatsGrid
│   │   │   └── TabsContainer
│   │   │       ├── QuizzesTab
│   │   │       ├── HistoryTab
│   │   │       └── LeaderboardTab
│   │   └── Quiz
│   │       ├── MultipleChoice (conditional)
│   │       └── ParsonsProblem (conditional)
└── Footer (conditional)
```

### Backend Architecture

```
backend/
├── main.py                  # FastAPI app & route registration
├── auth.py                  # OAuth configuration & helpers
├── database.py              # Database session & ORM models
├── models.py                # SQLAlchemy table definitions
├── quiz_routes.py           # Quiz API endpoints
├── leaderboard_routes.py    # Leaderboard API endpoints
├── config.py                # Configuration management
└── questions.yaml           # Quiz content definition
```

#### Backend Modules

1. **main.py**: Application entry point
   - Configures FastAPI app
   - Registers route modules
   - Serves static frontend files
   - Handles CORS and sessions

2. **auth.py**: Authentication module
   - GitHub OAuth client setup
   - Token exchange functions
   - User info retrieval

3. **database.py**: Data persistence
   - SQLAlchemy session management
   - Database initialization
   - ORM model definitions

4. **quiz_routes.py**: Quiz logic
   - Quiz listing and retrieval
   - Quiz submission and grading
   - Question randomization

5. **leaderboard_routes.py**: Scoring system
   - Global leaderboard calculation
   - User score history
   - Statistics aggregation

## Data Flow

### Quiz Taking Flow

```
User Action → Frontend → Backend → Database → Backend → Frontend → UI Update

1. User clicks "Start Quiz"
   └→ GET /api/quiz/quiz/{id}
      └→ Load quiz from questions.yaml
         └→ Return quiz data with shuffled options
            └→ Render quiz questions

2. User selects answers
   └→ State update in React (no API call)

3. User clicks "Submit"
   └→ POST /api/quiz/submit
      └→ Grade answers
         └→ Save score to database
            └→ Return results
               └→ Display score and correct answers
```

### Authentication Flow

See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed authentication flow.

### Dashboard Loading Flow

```
1. User navigates to /dashboard
   └→ ProtectedRoute checks authentication
      └→ GET /auth/me
         └→ If authenticated, proceed
            └→ Dashboard loads in parallel:
               ├→ GET /auth/me (user data)
               ├→ GET /api/leaderboard/user/{username} (scores)
               ├→ GET /api/quiz/questions (quiz list)
               └→ GET /api/leaderboard/ (global leaderboard)
```

## Authentication Flow

The application uses OAuth 2.0 with GitHub as the identity provider. The flow is documented in detail in [AUTHENTICATION.md](./AUTHENTICATION.md).

### Session Management

- **Session Storage**: Server-side sessions using Starlette's SessionMiddleware
- **Session Cookie**: HTTP-only, secure cookies
- **Session Data**: Stores `user_id` and `username`
- **Session Expiry**: Controlled by cookie max-age (default: 14 days)

### Loading State Synchronization

To prevent blank pages during authentication:

1. Login page shows animated loading bar
2. Session storage flag tracks OAuth flow
3. ProtectedRoute shows consistent loading bar
4. Dashboard shows skeleton loader while fetching data
5. Smooth transition to fully loaded dashboard

## Database Design

See [DATABASE.md](./DATABASE.md) for complete database schema and relationships.

### Key Tables

1. **users**: GitHub user profiles
2. **scores**: Quiz attempt records
3. **quiz_history**: Detailed question results

### Database Operations

- **Read-heavy workload**: Most operations are reads (leaderboard, quiz loading)
- **Write operations**: User creation, score submission
- **Indexes**: Applied on user_id, quiz_id for performance
- **Transactions**: Used for score submission to ensure data consistency

## API Design

See [API.md](./API.md) for complete API reference.

### API Patterns

- **RESTful endpoints**: Resource-based URLs
- **JSON responses**: All responses in JSON format
- **Error handling**: Consistent error response format
- **Authentication**: Cookie-based session authentication
- **CORS**: Configured for local development

### Key Endpoints

```
Auth:
  GET  /auth/login        - Start OAuth flow
  GET  /auth/callback     - OAuth callback
  GET  /auth/logout       - Clear session
  GET  /auth/me           - Get current user

Quizzes:
  GET  /api/quiz/questions       - List all quizzes
  GET  /api/quiz/quiz/{id}       - Get specific quiz
  POST /api/quiz/submit          - Submit quiz answers

Leaderboard:
  GET  /api/leaderboard/         - Global leaderboard
  GET  /api/leaderboard/user/{username} - User scores
```

## Security Considerations

### Authentication Security

- OAuth 2.0 with GitHub (industry standard)
- Server-side session management
- HTTP-only cookies (not accessible to JavaScript)
- CSRF protection via SameSite cookies
- Secure token exchange

### Data Security

- No storage of GitHub access tokens after initial auth
- User passwords never handled (delegated to GitHub)
- SQL injection prevention via SQLAlchemy ORM
- Input validation on all endpoints

### Frontend Security

- No sensitive data in client-side storage
- API credentials only on server
- CORS configuration for allowed origins
- XSS prevention via React's built-in escaping

### Secrets Management

- Environment variables for sensitive config
- `.env-template` for documentation (no secrets)
- `.gitignore` prevents committing secrets
- Separate production secrets

## Performance Optimizations

### Frontend Optimizations

1. **Code Splitting**: React lazy loading for routes
2. **Memoization**: React.memo for expensive components
3. **Custom Hooks**: useAuth hook prevents duplicate API calls
4. **Efficient State**: Local state for UI, server state for data
5. **Optimistic Updates**: Immediate UI feedback before API response
6. **Parallel Loading**: Promise.all() for independent data fetches
7. **O(1) Lookups**: Map-based data structures instead of array.find()

### Backend Optimizations

1. **Async/Await**: Non-blocking I/O operations
2. **Connection Pooling**: SQLAlchemy connection pool
3. **Query Optimization**: Indexed columns for common queries
4. **Response Caching**: Browser caching headers for static files
5. **Efficient Queries**: Avoid N+1 queries with proper joins
6. **Batch Operations**: Promise.all() for parallel API calls

### Database Optimizations

1. **Indexes**: On user_id, quiz_id, timestamp columns
2. **Efficient Schema**: Normalized design with minimal joins
3. **Query Planning**: Analyzed and optimized slow queries
4. **Connection Reuse**: Session pooling for concurrent requests

### Loading Performance

- **Skeleton Loaders**: Perceived performance improvement
- **Progressive Loading**: Show partial UI while data loads
- **Loading State Management**: Smooth transitions between states
- **Optimized Bundle**: React production build with minification

## Deployment Considerations

### Development Environment

- Frontend dev server on port 3000
- Backend dev server on port 8000
- Hot reload enabled for both
- CORS configured for cross-origin requests

### Production Environment

- Frontend built and served by backend
- Single port (8000) for entire application
- Static file serving from FastAPI
- Environment-based configuration

### Scaling Considerations

Current architecture is suitable for small to medium traffic. For scaling:

1. **Database**: Migrate to PostgreSQL for better concurrency
2. **Caching**: Add Redis for session storage and caching
3. **Load Balancing**: Multiple backend instances behind load balancer
4. **CDN**: Serve static assets from CDN
5. **API Gateway**: Rate limiting and request throttling

---

For more detailed information, see:
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Authentication flow details
- [DATABASE.md](./DATABASE.md) - Database schema and operations
- [API.md](./API.md) - Complete API reference
- [FRONTEND.md](./FRONTEND.md) - Frontend architecture details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
