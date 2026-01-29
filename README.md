# Quiz App

A full-stack Quiz Application for GitHub Codespaces with support for multiple-choice questions and Parsons Problems (drag-and-drop code ordering).

## Features

- 📝 **Multiple Choice Questions** - Standard MCQ with visual feedback
- 🧩 **Parsons Problems** - Drag-and-drop code block ordering using dnd-kit
- 🔐 **GitHub OAuth** - Login with your GitHub account
- 🏆 **Leaderboard** - Global high scores (top 10 players)
- 👨‍🏫 **Teacher Dashboard** - Admin view for teachers to monitor students
- ♿ **Dyslexia-Friendly** - High contrast colors, large fonts, clean spacing

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React (Plain JavaScript/JSX)
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: GitHub OAuth
- **Drag & Drop**: @dnd-kit library

## Project Structure

```
Quiz-App/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment configuration
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # User and Score models
│   ├── auth.py              # GitHub OAuth logic
│   ├── quiz_routes.py       # Quiz endpoints + YAML parsing
│   ├── leaderboard_routes.py # Leaderboard endpoints
│   ├── admin_routes.py      # Teacher dashboard endpoints
│   ├── questions.yaml       # Quiz questions data
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── App.js           # Main app with routing
    │   ├── App.css          # App-specific styles
    │   ├── index.css        # Dyslexia-friendly theme
    │   ├── api.js           # API helper functions
    │   ├── pages/           # Page components
    │   │   ├── Home.js
    │   │   ├── Dashboard.js
    │   │   ├── Quiz.js
    │   │   ├── Leaderboard.js
    │   │   └── Admin.js
    │   └── components/      # Reusable components
    │       ├── MultipleChoice.js
    │       └── ParsonsProblem.js
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

#### Windows (PowerShell)

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Set environment variables
$env:GITHUB_CLIENT_ID = "your_github_client_id"
$env:GITHUB_CLIENT_SECRET = "your_github_client_secret"
$env:SECRET_KEY = "your_random_secret_key"

# Generate a secure SECRET_KEY (optional):
# python -c "import secrets; print(secrets.token_urlsafe(32))"

# Run the server
uvicorn main:app --reload --port 8000
```

**Note:** If you get an execution policy error when activating the virtual environment, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Mac/Linux (Bash)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GITHUB_CLIENT_ID="your_github_client_id"
export GITHUB_CLIENT_SECRET="your_github_client_secret"
export SECRET_KEY="your_random_secret_key"

# Generate a secure SECRET_KEY (optional):
# python -c "import secrets; print(secrets.token_urlsafe(32))"

# Run the server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 3. GitHub OAuth Setup

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create a new OAuth App with:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:8000/auth/callback`
3. Copy the Client ID and Client Secret to your environment variables

## User Roles

- **Student** (default): Can take quizzes and view leaderboard
- **Teacher**: Can access the admin dashboard at `/admin`

To promote a user to teacher, update the database directly:
```sql
UPDATE users SET role='teacher' WHERE username='your_username';
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | GET | Start GitHub OAuth flow |
| `/auth/callback` | GET | OAuth callback handler |
| `/auth/logout` | GET | Log out user |
| `/auth/me` | GET | Get current user info |
| `/api/quiz/questions` | GET | Get all quizzes |
| `/api/quiz/quiz/{id}` | GET | Get a specific quiz |
| `/api/quiz/submit` | POST | Submit quiz answers |
| `/api/leaderboard/` | GET | Get top 10 scores |
| `/api/admin/students` | GET | Get all students (teacher only) |
| `/api/admin/stats` | GET | Get overall stats (teacher only) |

## Adding New Questions

Edit `backend/questions.yaml` to add new quizzes and questions:

```yaml
quizzes:
  - id: my_quiz
    title: "My Quiz Title"
    description: "Quiz description"
    questions:
      - id: q1
        type: "multiple_choice"
        prompt: "Your question here?"
        options: ["A", "B", "C", "D"]
        answer: "C"
      
      - id: q2
        type: "parsons"
        prompt: "Arrange these code blocks"
        blocks:
          - "line 1"
          - "line 2"
        answer: [0, 1]  # Correct order by index
```

## Accessibility Features

This app is designed to be dyslexia-friendly:
- High contrast colors (dark text on cream background)
- Clean sans-serif fonts (Verdana/Arial)
- Large line spacing (1.8)
- Clear visual hierarchy
- Keyboard navigation support

## License

MIT License