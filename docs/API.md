# API Reference

Complete API documentation for Quiz-App backend endpoints.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://yourdomain.com`

## Authentication

All protected endpoints require a valid session cookie obtained through GitHub OAuth.

**Authentication Method**: Session-based (cookie)
- Cookie name: `session`
- HTTP-only: Yes
- Secure: Yes (in production)
- SameSite: Lax

## Response Format

All responses are in JSON format.

### Success Response

```json
{
  "data": { ... },
  "message": "Success"
}
```

### Error Response

```json
{
  "detail": "Error message here"
}
```

## Endpoints

### Authentication Endpoints

#### `GET /auth/login`

Start GitHub OAuth flow. Redirects to GitHub authorization page.

**Authentication**: None required

**Response**: HTTP 302 Redirect to GitHub

**Example**:
```bash
curl -X GET http://localhost:8000/auth/login
```

---

#### `GET /auth/callback`

OAuth callback endpoint. Handles GitHub's authorization response.

**Authentication**: None required (OAuth flow)

**Query Parameters**:
- `code` (string, required): Authorization code from GitHub

**Response**: HTTP 302 Redirect to `/dashboard`

**Example**:
```
GET /auth/callback?code=abc123xyz789
```

---

#### `GET /auth/me`

Get current authenticated user's information.

**Authentication**: Required

**Response**: `200 OK`
```json
{
  "id": 1,
  "github_id": "12345678",
  "username": "johndoe",
  "role": "user"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated

**Example**:
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Cookie: session=..." \
  --cookie-jar cookies.txt
```

---

#### `GET /auth/logout`

Log out current user. Clears session and redirects to home.

**Authentication**: Optional

**Response**: HTTP 302 Redirect to `/`

**Example**:
```bash
curl -X GET http://localhost:8000/auth/logout \
  -H "Cookie: session=..."
```

---

### Quiz Endpoints

#### `GET /api/quiz/questions`

Get list of all available quizzes.

**Authentication**: None required

**Response**: `200 OK`
```json
{
  "quizzes": [
    {
      "id": "python-basics-1",
      "title": "Python Basics - Variables and Types",
      "description": "Test your knowledge of Python variables...",
      "category": "python",
      "questions": [
        {
          "id": "pybasic-1",
          "type": "multiple-choice"
        }
      ]
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/quiz/questions
```

---

#### `GET /api/quiz/quiz/{quiz_id}`

Get a specific quiz with questions. Options are shuffled on each request.

**Authentication**: None required

**Path Parameters**:
- `quiz_id` (string, required): Quiz identifier

**Response**: `200 OK`
```json
{
  "id": "python-basics-1",
  "title": "Python Basics - Variables and Types",
  "description": "Test your knowledge...",
  "category": "python",
  "questions": [
    {
      "id": "pybasic-1",
      "type": "multiple-choice",
      "question": "What is the output of: print(type(42))?",
      "options": [
        "<class 'int'>",
        "<class 'float'>",
        "<class 'str'>",
        "42"
      ],
      "correct_answer": 0
    },
    {
      "id": "pybasic-2",
      "type": "parsons",
      "question": "Arrange these lines to create a function...",
      "blocks": [
        "def square(n):",
        "    result = n * n",
        "    return result"
      ]
    }
  ]
}
```

**Error Responses**:
- `404 Not Found`: Quiz not found

**Example**:
```bash
curl -X GET http://localhost:8000/api/quiz/quiz/python-basics-1
```

---

#### `POST /api/quiz/submit`

Submit quiz answers for grading.

**Authentication**: Required

**Request Body**:
```json
{
  "quiz_id": "python-basics-1",
  "answers": [
    {
      "question_id": "pybasic-1",
      "answer": 0
    },
    {
      "question_id": "pybasic-2",
      "answer": [0, 1, 2]
    }
  ]
}
```

**Answer Formats**:
- **Multiple choice**: Integer (option index)
- **Parsons problem**: Array of integers (block indices in order)

**Response**: `200 OK`
```json
{
  "score": 8,
  "total": 10,
  "results": [
    {
      "question_id": "pybasic-1",
      "user_answer": 0,
      "correct_answer": 0,
      "is_correct": true
    },
    {
      "question_id": "pybasic-2",
      "user_answer": [0, 1, 2],
      "correct_answer": [0, 1, 2],
      "is_correct": true
    }
  ],
  "message": "Quiz submitted successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `400 Bad Request`: Invalid quiz_id or answer format
- `404 Not Found`: Quiz not found

**Example**:
```bash
curl -X POST http://localhost:8000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "quiz_id": "python-basics-1",
    "answers": [
      {"question_id": "pybasic-1", "answer": 0},
      {"question_id": "pybasic-2", "answer": [0, 1, 2]}
    ]
  }'
```

---

### Leaderboard Endpoints

#### `GET /api/leaderboard/`

Get global leaderboard (top 10 users by total points).

**Authentication**: None required

**Response**: `200 OK`
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "johndoe",
      "total_points": 150
    },
    {
      "rank": 2,
      "username": "janedoe",
      "total_points": 142
    },
    {
      "rank": 3,
      "username": "codingpro",
      "total_points": 135
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/leaderboard/
```

---

#### `GET /api/leaderboard/user/{username}`

Get a specific user's quiz scores and history.

**Authentication**: None required

**Path Parameters**:
- `username` (string, required): GitHub username

**Response**: `200 OK`
```json
{
  "username": "johndoe",
  "scores": [
    {
      "quiz_id": "python-basics-1",
      "score": 8,
      "timestamp": "2026-02-14T10:30:00Z"
    },
    {
      "quiz_id": "java-basics-1",
      "score": 7,
      "timestamp": "2026-02-14T11:00:00Z"
    }
  ],
  "total_points": 15
}
```

**Error Responses**:
- `404 Not Found`: User not found

**Example**:
```bash
curl -X GET http://localhost:8000/api/leaderboard/user/johndoe
```

---

## Interactive Documentation

FastAPI provides interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interfaces allow you to:
- Browse all endpoints
- View request/response schemas
- Test endpoints directly from the browser
- See example requests and responses

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider:

- API Gateway with rate limiting
- Nginx rate limiting
- Application-level throttling

## CORS Configuration

CORS is configured to allow:
- **Development**: `http://localhost:3000`
- **Production**: Configured via `FRONTEND_URL` environment variable

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 302 | Redirect (OAuth flow, logout) |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (not authenticated) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Internal Server Error |

## Request/Response Examples

### Fetching Quizzes and Submitting

```javascript
// Fetch available quizzes
const quizzes = await fetch('http://localhost:8000/api/quiz/questions')
  .then(res => res.json());

// Get specific quiz
const quiz = await fetch('http://localhost:8000/api/quiz/quiz/python-basics-1')
  .then(res => res.json());

// Submit quiz (requires authentication)
const results = await fetch('http://localhost:8000/api/quiz/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',  // Important: includes session cookie
  body: JSON.stringify({
    quiz_id: 'python-basics-1',
    answers: [
      { question_id: 'pybasic-1', answer: 0 },
      { question_id: 'pybasic-2', answer: [0, 1, 2] }
    ]
  })
}).then(res => res.json());
```

### Authentication Flow

```javascript
// 1. Redirect to login
window.location.href = 'http://localhost:8000/auth/login';

// 2. After OAuth, check authentication
const user = await fetch('http://localhost:8000/auth/me', {
  credentials: 'include'
}).then(res => res.json());

// 3. Logout
window.location.href = 'http://localhost:8000/auth/logout';
```

### Leaderboard

```javascript
// Get global leaderboard
const leaderboard = await fetch('http://localhost:8000/api/leaderboard/')
  .then(res => res.json());

// Get user's scores
const userScores = await fetch('http://localhost:8000/api/leaderboard/user/johndoe')
  .then(res => res.json());
```

## Webhook Support

Not currently implemented. Future consideration for:
- GitHub push events for quiz updates
- Real-time leaderboard updates
- Notification systems

## API Versioning

Currently using implicit v1. For future versions, consider:
- URL versioning: `/api/v2/quiz/questions`
- Header versioning: `Accept: application/vnd.quizapp.v2+json`

## Testing

### Using curl

```bash
# Test authentication
curl -i http://localhost:8000/auth/me

# Test quiz list
curl -i http://localhost:8000/api/quiz/questions

# Test quiz submission (with session)
curl -i -X POST http://localhost:8000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{"quiz_id":"python-basics-1","answers":[{"question_id":"pybasic-1","answer":0}]}'
```

### Using Postman

1. Import the OpenAPI schema from `/docs` or `/openapi.json`
2. Set up environment variables for base URL
3. Configure cookie handling for session management
4. Test each endpoint with sample data

### Automated Testing

```python
# pytest example
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_quizzes():
    response = client.get("/api/quiz/questions")
    assert response.status_code == 200
    assert "quizzes" in response.json()

def test_submit_quiz_unauthorized():
    response = client.post("/api/quiz/submit", json={
        "quiz_id": "python-basics-1",
        "answers": []
    })
    assert response.status_code == 401
```

---

For more information, see:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [RESTful API Best Practices](https://restfulapi.net/)
