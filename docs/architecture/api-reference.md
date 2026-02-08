# API Reference

Complete list of Quiz-App API endpoints.

## Base URL

- **Local:** `http://localhost:8000`
- **Codespaces:** Your forwarded port URL

---

## Authentication

### Start Login

```
GET /auth/login
```

Redirects to GitHub OAuth authorization page.

**Response:** Redirect to GitHub

---

### OAuth Callback

```
GET /auth/callback
```

GitHub redirects here after authorization. Creates/updates user and sets session cookie.

**Query Parameters:**
- `code` - Authorization code from GitHub

**Response:** Redirect to `/`

---

### Logout

```
GET /auth/logout
```

Clears the session cookie.

**Response:** Redirect to `/`

---

### Get Current User

```
GET /auth/me
```

Returns the currently logged-in user.

**Response:**
```json
{
  "id": 1,
  "username": "github_username",
  "role": "Student"
}
```

**Errors:**
- `401` - Not logged in

---

## Quiz

### List All Quizzes

```
GET /api/quiz/questions
```

Returns all available quizzes with their questions.

**Response:**
```json
{
  "quizzes": [
    {
      "id": "python_basics",
      "title": "Python Basics",
      "description": "Test your Python knowledge",
      "questions": [...]
    }
  ]
}
```

---

### Get Single Quiz

```
GET /api/quiz/quiz/{quiz_id}
```

Returns a specific quiz by ID.

**Parameters:**
- `quiz_id` - Quiz identifier (e.g., "python_basics")

**Response:**
```json
{
  "id": "python_basics",
  "title": "Python Basics",
  "description": "Test your Python knowledge",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "prompt": "What is 2+2?",
      "options": ["3", "4", "5", "6"]
    },
    {
      "id": "q2",
      "type": "parsons",
      "prompt": "Arrange the code",
      "blocks": ["line 1", "line 2", "line 3"]
    }
  ]
}
```

**Note:** The `answer` field is not included in the response.

---

### Submit Quiz

```
POST /api/quiz/submit
```

Submit answers and get score.

**Request Body:**
```json
{
  "quiz_id": "python_basics",
  "answers": [
    {
      "question_id": "q1",
      "answer": "4"
    },
    {
      "question_id": "q2",
      "answer": [0, 1, 2]
    }
  ]
}
```

**Response:**
```json
{
  "score": 2,
  "total": 2,
  "results": [
    {
      "question_id": "q1",
      "correct": true
    },
    {
      "question_id": "q2",
      "correct": true
    }
  ]
}
```

**Errors:**
- `401` - Not logged in
- `404` - Quiz not found

---

## Leaderboard

### Get Top Scores

```
GET /api/leaderboard/
```

Returns the top 10 scores.

**Response:**
```json
{
  "scores": [
    {
      "username": "top_player",
      "score": 100,
      "quiz_id": "python_basics",
      "timestamp": "2024-01-15T10:30:00"
    }
  ]
}
```

---

## Admin (Teacher Only)

### Get All Students

```
GET /api/admin/students
```

Returns all registered students with their scores.

**Response:**
```json
{
  "students": [
    {
      "id": 1,
      "username": "student1",
      "role": "Student",
      "scores": [
        {
          "quiz_id": "python_basics",
          "score": 8,
          "timestamp": "2024-01-15T10:30:00"
        }
      ]
    }
  ]
}
```

**Errors:**
- `401` - Not logged in
- `403` - Not a teacher

---

### Get Statistics

```
GET /api/admin/stats
```

Returns overall quiz statistics.

**Response:**
```json
{
  "total_students": 25,
  "total_quizzes_taken": 150,
  "average_score": 7.5
}
```

**Errors:**
- `401` - Not logged in
- `403` - Not a teacher

---

## Making API Calls

### From Frontend (React)

Use the `apiCall` helper:

```javascript
import { apiCall } from './api';

// GET request
const quizzes = await apiCall('/api/quiz/questions');

// POST request
const result = await apiCall('/api/quiz/submit', {
  method: 'POST',
  body: JSON.stringify({
    quiz_id: 'python_basics',
    answers: [...]
  })
});
```

### From Command Line (curl)

```bash
# Get quizzes
curl http://localhost:8000/api/quiz/questions

# Submit quiz (with session cookie)
curl -X POST http://localhost:8000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -b "session=YOUR_SESSION_COOKIE" \
  -d '{"quiz_id":"python_basics","answers":[...]}'
```

---

## Interactive API Docs

FastAPI provides auto-generated documentation:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

These include all endpoints with request/response schemas and allow testing directly in the browser.
