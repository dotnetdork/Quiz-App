# Development Guide

This guide covers everything you need to know to work on the Quiz-App.

## Project Structure

```
Quiz-App/
├── backend/                 # Python FastAPI server
│   ├── main.py              # App entry point
│   ├── config.py            # Environment config
│   ├── database.py          # Database setup
│   ├── models.py            # User and Score models
│   ├── auth.py              # OAuth helpers
│   ├── quiz_routes.py       # Quiz API endpoints
│   ├── leaderboard_routes.py
│   ├── admin_routes.py
│   ├── questions.yaml       # Quiz questions
│   └── requirements.txt     # Python dependencies
│
├── frontend/                # React app
│   ├── src/
│   │   ├── App.js           # Main component with routing
│   │   ├── api.js           # API helper functions
│   │   ├── pages/           # Page components
│   │   └── components/      # Reusable components
│   └── package.json         # JS dependencies
│
├── dev/                     # Helper scripts
│   └── startup/             # Platform-specific scripts
│
├── docker/                  # Docker deployment
├── .devcontainer/           # Codespaces config
└── docs/                    # Documentation (you are here)
```

---

## Running in Development Mode

### Single Server (Recommended)

Build frontend once, then run backend:

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Run backend (auto-reloads on changes)
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Dual Server (Frontend Hot Reload)

For active frontend development:

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm start  # Runs on port 3000, proxies API to 8000
```

---

## Adding Dependencies

### Python (Backend)

1. Add to `backend/requirements.txt`:
   ```
   new-library==1.2.3
   ```

2. Install:
   ```bash
   uv pip install -r backend/requirements.txt
   # or: pip install -r backend/requirements.txt
   ```

### JavaScript (Frontend)

```bash
cd frontend
npm install new-library
```

---

## Adding a New API Endpoint

1. **Choose the right file** (or create a new one):
   - `quiz_routes.py` - Quiz-related endpoints
   - `leaderboard_routes.py` - Score-related endpoints
   - `admin_routes.py` - Teacher-only endpoints

2. **Add your endpoint:**

   ```python
   @router.get("/my-endpoint")
   def my_endpoint(user: User = Depends(require_user), db: Session = Depends(get_db)):
       # Your logic here
       return {"result": "data"}
   ```

3. **If you created a new file**, register it in `main.py`:

   ```python
   from my_routes import router as my_router
   app.include_router(my_router, prefix="/api/my")
   ```

---

## Adding a New Page

1. **Create the page** in `frontend/src/pages/MyPage.js`:

   ```javascript
   import { useState, useEffect } from 'react';
   import { apiCall } from '../api';

   function MyPage() {
       const [data, setData] = useState(null);

       useEffect(() => {
           async function loadData() {
               const result = await apiCall('/api/my-endpoint');
               setData(result);
           }
           loadData();
       }, []);

       return (
           <div className="page-container">
               <h1>My Page</h1>
               {data && <p>{data.result}</p>}
           </div>
       );
   }

   export default MyPage;
   ```

2. **Add the route** in `frontend/src/App.js`:

   ```javascript
   import MyPage from './pages/MyPage';

   // Inside <Routes>:
   <Route path="/my-page" element={<MyPage />} />
   ```

3. **Rebuild** (if not using dev server):
   ```bash
   cd frontend && npm run build
   ```

---

## Adding Quiz Questions

Edit `backend/questions.yaml`:

### Multiple Choice

```yaml
quizzes:
  - id: my_quiz
    title: "My Quiz"
    description: "A sample quiz"
    questions:
      - id: q1
        type: "multiple_choice"
        prompt: "What is 2 + 2?"
        options: ["3", "4", "5", "6"]
        answer: "4"
```

### Parsons Problem (Drag & Drop)

```yaml
      - id: q2
        type: "parsons"
        prompt: "Arrange to print Hello World"
        blocks:
          - "def main():"
          - "    print('Hello World')"
          - "main()"
        answer: [0, 1, 2]  # Correct order by index
```

---

## Adding a New Question Type

1. **Define the structure** in `questions.yaml`:

   ```yaml
   - id: q1
     type: "fill_blank"
     prompt: "The capital of France is ___"
     answer: "Paris"
   ```

2. **Create a component** in `frontend/src/components/FillBlank.js`:

   ```javascript
   function FillBlank({ question, value, onChange }) {
       return (
           <div>
               <p>{question.prompt.replace('___', '')}</p>
               <input
                   type="text"
                   value={value || ''}
                   onChange={(e) => onChange(e.target.value)}
               />
           </div>
       );
   }
   export default FillBlank;
   ```

3. **Use it in Quiz.js**:

   ```javascript
   import FillBlank from '../components/FillBlank';

   // In the render:
   {question.type === 'fill_blank' && (
       <FillBlank
           question={question}
           value={answers[question.id]}
           onChange={(val) => handleAnswerChange(question.id, val)}
       />
   )}
   ```

4. **Score it** in `backend/quiz_routes.py`:

   ```python
   if question['type'] == 'fill_blank':
       if answer.lower().strip() == correct_answer.lower().strip():
           score += 1
   ```

---

## User Roles

| Role | Access |
|------|--------|
| Student | Take quizzes, view leaderboard |
| Teacher | All student access + admin dashboard |

### Promoting a User to Teacher

```sql
UPDATE users SET role='teacher' WHERE username='github_username';
```

---

## Code Style

### Python

- Follow PEP 8
- Use type hints when helpful
- Keep functions small and focused

### JavaScript

- Use functional components with hooks
- Use the `apiCall()` helper for API requests
- Keep components in appropriate folders

### CSS

- Global styles in `index.css`
- Component styles in `App.css`
- Follow the dyslexia-friendly theme

---

## Testing

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm test
```

---

## Helper Scripts

Located in `dev/startup/`:

| Script | Description |
|--------|-------------|
| `start-local.sh/ps1` | Local development |
| `start-codespaces.sh/ps1` | GitHub Codespaces |
| `start-docker.sh/ps1` | Docker deployment |

```bash
# Linux/macOS
./dev/startup/unix/start-local.sh

# Windows
.\dev\startup\windows\start-local.ps1
```

---

## Common Tasks

### Reset the Database

```bash
rm backend/quiz_app.db
# Restart the server - it creates a new database
```

### Clear Frontend Build

```bash
cd frontend
rm -rf build node_modules
npm install
npm run build
```

### View API Documentation

Run the server and visit: `http://localhost:8000/docs`

---

## Next Steps

- [Architecture Overview](architecture/overview.md) - How the app works
- [API Reference](architecture/api-reference.md) - All endpoints
