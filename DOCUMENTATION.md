# Quiz-App: Complete Technical Documentation

## 🏗️ Architecture Overview

The app follows a **3-tier architecture** with a **single server deployment**:
1. **Frontend (React)** - Built and served as static files by the backend
2. **Backend API (FastAPI)** - Server running on port 8000 (serves both API and frontend)
3. **Database (SQLite)** - File-based database (`quiz_app.db`)

---

### Quick Start (Unix/macOS and Windows)

Follow the commands below from the project root. Commands differ between Unix-like shells and PowerShell; both are provided in separate blocks.

Unix / macOS (bash):
```bash
# Create .env
cp .env-template .env

# Create venv, activate, install deps
uv venv
source .venv/bin/activate
uv pip install -r backend/requirements.txt

# Build frontend
cd frontend && npm install && npm run build && cd ..

# Run backend (serves built frontend)
cd backend
python -m uvicorn main:app --reload --host localhost --port 8000
```

Windows (PowerShell):
```powershell
# Create .env
copy .env-template .env

# Create venv and install deps (use venv python directly)
uv venv
& ".\.venv\Scripts\python.exe" -m pip install -r backend/requirements.txt

# Build frontend
cd frontend; npm install; npm run build; cd ..

# Run backend (from backend folder)
cd backend
& "..\.venv\Scripts\python.exe" -m uvicorn main:app --reload --host localhost --port 8000
```

Docker Compose (works on Unix and Windows command line):
```bash
cd docker
docker compose -f docker-compose.yml --env-file ../.env up -d --build
```

Codespaces notes:
- If you run the backend inside a Codespace, start the server on `0.0.0.0` and port `8000` and forward the port in the Codespaces UI. Update `GITHUB_REDIRECT_URI` and `FRONTEND_URL` to the forwarded URL when testing OAuth in Codespaces.

## 📊 STEP 1: Database Layer

**File:** `backend/database.py`

### Core Concepts:

### 1. SQLAlchemy ORM (Object-Relational Mapping)
- Converts Python classes to database tables
- `Base = declarative_base()` - Creates base class for all models
- `engine = create_engine(DATABASE_URL)` - Connects to SQLite database
- `SessionLocal = sessionmaker()` - Creates database session factory

### 2. Dependency Injection Pattern
```python
def get_db():
    db = SessionLocal()
    try:
        yield db  # Provides DB session to route
    finally:
        db.close()  # Always closes connection
```
- Used with `Depends(get_db)` in routes
- Ensures DB connections are properly managed

### 3. Database Tables (defined in `models.py`)

**Users Table:**
```python
class User(Base):
    id          # Primary key (auto-increment)
    github_id   # Unique GitHub user ID (from OAuth)
    username    # GitHub username
    role        # "Student", "Teacher", or "Developer"
    scores      # Relationship to Score table
```

**Scores Table:**
```python
class Score(Base):
    id         # Primary key
    user_id    # Foreign key → User.id
    quiz_id    # Which quiz was taken
    score      # Points earned
    timestamp  # When it was completed
```

---

## 🔐 STEP 2: Authentication (OAuth Flow)

**Files:** `auth.py`, `main.py` (lines 110-180)

### OAuth 2.0 Flow with GitHub:

**1. User clicks "Login"** → Frontend redirects to `/auth/login`

**2. Backend redirects to GitHub**
```python
@app.get("/auth/login")
async def login(request: Request):
    return await oauth.github.authorize_redirect(request, redirect_uri)
```
- GitHub shows "Authorize Quiz-App" page

**3. User authorizes** → GitHub redirects back to `/auth/callback?code=ABC123`

**4. Backend exchanges code for token**
```python
token = await oauth.github.authorize_access_token(request)
github_user = await get_github_user(token)  # Fetches user info
```

**5. Create/update user in database**
```python
user = User(
    github_id=github_user["id"],
    username=github_user["login"],
    role="Student"
)
db.add(user)
db.commit()
```

**6. Store session cookie**
```python
request.session["user_id"] = github_id
```
- Uses `SessionMiddleware` (stores encrypted cookie in browser)
- Cookie sent with every subsequent request

**7. Redirect to Dashboard**

### Session Management:
- `SessionMiddleware` encrypts session data using `SECRET_KEY`
- Cookie named `session` stored in browser
- Backend checks `request.session.get("user_id")` to verify login

---

## 🎯 STEP 3: API Routes (Backend Endpoints)

**Main Application Setup** (`main.py`):

### 1. CORS Middleware
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,  # Allows cookies
)
```
- Allows frontend (port 3000) to call backend (port 8000)
- `allow_credentials=True` enables session cookies

### 2. Dependency Functions
```python
def require_user(request, db):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(401)  # Unauthorized
    return db.query(User).filter_by(github_id=user_id).first()
```
- Used in routes: `user = Depends(require_user)`
- Automatically checks if logged in

---

## 📝 STEP 4: Quiz System

**File:** `quiz_routes.py`

### Question Storage:
- Questions stored in `questions.yaml`
- YAML structure:
  ```yaml
  quizzes:
    - id: python_basics_01
      title: "Python Fundamentals"
      questions:
        - id: q1
          type: "multiple_choice"
          prompt: "What is 2+2?"
          options: ["3", "4", "5"]
          answer: "4"
        
        - id: q2
          type: "parsons"
          prompt: "Order these blocks"
          blocks: ["line 1", "line 2"]
          answer: [0, 1]  # Correct order by index
  ```

### Quiz Loading:
```python
def load_questions():
    with open(QUESTIONS_FILE, "r") as file:
        return yaml.safe_load(file)  # Parses YAML to Python dict
```

### Quiz Submission:
```python
@router.post("/submit")
def submit_quiz(submission: QuizSubmission, user: User = Depends(require_user)):
    # 1. Load correct answers
    quiz = load_questions()
    
    # 2. Calculate score
    for answer in submission.answers:
        if answer.answer == correct_answer:
            score += 1
    
    # 3. Save to database
    new_score = Score(
        user_id=user.id,
        quiz_id=submission.quiz_id,
        score=score
    )
    db.add(new_score)
    db.commit()
    
    # 4. Return results
    return {"score": score, "total": total}
```

---

## ⚛️ STEP 5: Frontend (React)

**File:** `App.js`

### Routing with React Router:
```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/quiz/:quizId" element={<Quiz />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/leaderboard" element={<Leaderboard />} />
    <Route path="/admin" element={<Admin />} />
  </Routes>
</BrowserRouter>
```
- Each `<Route>` maps URL to a component
- `:quizId` is a URL parameter (e.g., `/quiz/python_basics_01`)

### API Communication (`api.js`):
```javascript
export async function apiCall(endpoint, options) {
  const response = await fetch(`http://localhost:8000${endpoint}`, {
    credentials: 'include',  // CRITICAL: Sends session cookie
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return response.json();
}
```

---

## 🎮 STEP 6: Quiz Taking Flow

**File:** `Quiz.js`

### Component State:
```javascript
const [quiz, setQuiz] = useState(null);  // Quiz data from API
const [answers, setAnswers] = useState({});  // User's answers
const [results, setResults] = useState(null);  // Score results
```

### Loading Quiz:
```javascript
useEffect(() => {
  const quizData = await apiCall(`/api/quiz/quiz/${quizId}`);
  setQuiz(quizData);
  
  // Initialize answers
  const initialAnswers = {};
  quizData.questions.forEach((q) => {
    if (q.type === 'parsons') {
      initialAnswers[q.id] = shuffleArray([0, 1, 2]);  // Shuffle blocks
    } else {
      initialAnswers[q.id] = null;  // No answer yet
    }
  });
  setAnswers(initialAnswers);
}, [quizId]);
```

### Answering Questions:
```javascript
function handleAnswerChange(questionId, answer) {
  setAnswers(prev => ({
    ...prev,
    [questionId]: answer  // Updates specific question
  }));
}
```

### Submitting:
```javascript
const formattedAnswers = Object.entries(answers).map(([qId, answer]) => ({
  question_id: qId,
  answer: answer
}));

const results = await apiCall('/api/quiz/submit', {
  method: 'POST',
  body: JSON.stringify({
    quiz_id: quizId,
    answers: formattedAnswers
  })
});
```

---

## 🧩 STEP 7: Parsons Problems (Drag & Drop)

**File:** `ParsonsProblem.js`

**Library:** `@dnd-kit` - Accessible drag-and-drop

### Core Concepts:

1. **DndContext** - Manages drag state
2. **SortableContext** - Makes items sortable
3. **useSortable** - Hook for individual items

### How it works:
```javascript
function ParsonsProblem({ blocks, order, onOrderChange }) {
  // order = [2, 0, 1] means blocks are in positions: block[2], block[0], block[1]
  
  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = order.indexOf(active.id);
      const newIndex = order.indexOf(over.id);
      
      // Swap positions
      const newOrder = arrayMove(order, oldIndex, newIndex);
      onOrderChange(newOrder);  // Updates parent state
    }
  }
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={order}>
        {order.map((blockIndex, position) => (
          <SortableBlock
            key={blockIndex}
            id={blockIndex}
            code={blocks[blockIndex]}
            position={position + 1}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### Answer Format:
- User sees blocks in order: `[2, 0, 1]`
- Submits: `[2, 0, 1]` to backend
- Backend checks if `[2, 0, 1] == [0, 1, 2]` (correct answer)

---

## 🎯 Key Technical Patterns

### 1. REST API Design
- GET `/api/quiz/questions` - Read data
- POST `/api/quiz/submit` - Create data
- Stateless (uses session cookies for auth)

### 2. React Hooks
- `useState` - Component state
- `useEffect` - Side effects (API calls)
- `useParams` - Get URL parameters

### 3. Middleware Pattern
- CORS → Session → Routes
- Each request passes through middleware chain

### 4. Dependency Injection
- `user = Depends(require_user)` 
- FastAPI automatically calls function and passes result

### 5. ORM Relationships
- `User.scores` automatically loads all scores for a user
- Lazy loading (only queries when accessed)

---

## 🔄 Complete Request Flow Example

### User takes a quiz:

1. **Frontend**: User navigates to `/quiz/python_basics_01`
2. **React Router**: Matches route, renders `<Quiz>` component
3. **useEffect**: Triggers on mount
4. **API Call**: `fetch('http://localhost:8000/api/quiz/quiz/python_basics_01')`
5. **Browser**: Sends request with session cookie
6. **Backend CORS**: Checks origin, allows request
7. **Backend Session**: Reads cookie (user logged in?)
8. **Backend Route**: `/api/quiz/quiz/{quiz_id}` handler executes
9. **YAML Parser**: Loads `questions.yaml`, parses to dict
10. **Response**: JSON sent back to frontend
11. **React State**: `setQuiz(quizData)` updates component
12. **Render**: Questions displayed to user

### User submits quiz:

1. **Frontend**: User clicks "Submit"
2. **API Call**: `POST /api/quiz/submit` with answers
3. **Backend**: `require_user` dependency checks session
4. **Database Query**: Loads user from database
5. **Scoring**: Compares answers with correct answers from YAML
6. **Database Insert**: Creates new `Score` record
7. **Response**: Returns score and results
8. **React State**: `setResults(data)` shows results to user

---

## 🗄️ Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    role TEXT DEFAULT 'Student'
);

-- Scores Table
CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quiz_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔒 Security Considerations

1. **Session Security**
   - Sessions encrypted with `SECRET_KEY`
   - HttpOnly cookies prevent XSS access
   - CORS restricts which origins can make requests

2. **OAuth Security**
   - GitHub validates redirect URIs
   - Access tokens never exposed to client
   - State parameter prevents CSRF attacks

3. **SQL Injection Prevention**
   - SQLAlchemy ORM escapes all queries
   - No raw SQL execution with user input

4. **Role-Based Access Control**
   - `require_Teacher` dependency for admin routes
   - Database stores user roles
   - Frontend hides admin UI for non-Teachers

---

## 📦 Dependencies

### Backend:
- **FastAPI** - Modern async web framework
- **SQLAlchemy** - ORM for database operations
- **Authlib** - OAuth implementation
- **PyYAML** - YAML file parsing
- **Uvicorn** - ASGI server

### Frontend:
- **React** - UI library
- **React Router** - Client-side routing
- **@dnd-kit** - Drag and drop functionality

---

## 🚀 Deployment Considerations

### Environment Variables:
```bash
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SECRET_KEY=random_secret_key
DATABASE_URL=sqlite:///./quiz_app.db
FRONTEND_URL=http://localhost:3000
```

### Production Changes Needed:
1. Switch from SQLite to PostgreSQL
2. Use Redis for session storage
3. Set up HTTPS/SSL certificates
4. Update OAuth redirect URIs
5. Enable production build for React
6. Add rate limiting
7. Implement logging and monitoring

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy ORM Tutorial](https://docs.sqlalchemy.org/en/20/orm/)
- [OAuth 2.0 Explained](https://oauth.net/2/)
- [dnd-kit Documentation](https://docs.dndkit.com/)
