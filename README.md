# Quiz App

A full-stack Quiz Application for GitHub Codespaces with support for multiple-choice questions and Parsons Problems (drag-and-drop code ordering).

## Features

- 📝 **Multiple Choice Questions** - Standard MCQ with visual feedback
- 🧩 **Parsons Problems** - Drag-and-drop code block ordering using dnd-kit
- 🔐 **GitHub OAuth** - Login with your GitHub account
- 🏆 **Leaderboard** - Global high scores (top 10 players)
- 👨‍🏫 **Teacher Dashboard** - Admin view for teachers to monitor students
- ♿ **Dyslexia-Friendly** - High contrast colors, large fonts, clean spacing
- 🐳 **Docker Support** - Easy deployment with Docker and Docker Compose
- ☁️ **Codespaces Ready** - Development container configuration included

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React (Plain JavaScript/JSX) - served by the backend
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: GitHub OAuth
- **Drag & Drop**: @dnd-kit library
- **Package Management**: uv (Python), npm (Node.js)

## Project Structure

```
Quiz-App/
├── .devcontainer/           # GitHub Codespaces configuration
│   ├── devcontainer.json
│   └── post-create.sh
├── docker/                  # Docker deployment files
│   ├── Dockerfile
│   └── docker-compose.yml
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment configuration (python-dotenv)
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # User and Score models
│   ├── auth.py              # GitHub OAuth logic
│   ├── quiz_routes.py       # Quiz endpoints + YAML parsing
│   ├── leaderboard_routes.py # Leaderboard endpoints
│   ├── admin_routes.py      # Teacher dashboard endpoints
│   ├── questions.yaml       # Quiz questions data
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main app with routing
│   │   ├── App.css          # App-specific styles
│   │   ├── index.css        # Dyslexia-friendly theme
│   │   ├── api.js           # API helper functions
│   │   ├── pages/           # Page components
│   │   └── components/      # Reusable components
│   └── package.json
├── .env-template            # Environment variables template
└── pyproject.toml           # Python project configuration (uv)
```

## Quick Start

### Option 1: GitHub Codespaces (Recommended)

1. Click **"Code"** → **"Open with Codespaces"** → **"New codespace"**
2. Wait for the container to build (installs all dependencies automatically)

Unix / macOS (bash):
```bash
# Create .env and add credentials
cp .env-template .env

# Build frontend
cd frontend && npm install && npm run build && cd ..

# Run backend (serves built frontend)
cd backend
python -m uvicorn main:app --reload --host localhost --port 8000
```

Windows (PowerShell):
```powershell
# Create .env and add credentials
copy .env-template .env

# Build frontend
cd frontend; npm install; npm run build; cd ..

# Start backend (use venv python directly from backend folder)
cd backend
& "..\.venv\Scripts\python.exe" -m uvicorn main:app --reload --host localhost --port 8000
```

### Option 2: Docker (Production)

```bash
# Clone the repository
git clone https://github.com/dotnetdork/Quiz-App.git
cd Quiz-App

# Create .env file with your credentials
cp .env-template .env
# Edit .env with your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

# Build and run with Docker Compose
cd docker
docker-compose up --build
```

The app will be available at `http://localhost:8000`

### Option 3: Local Development with uv

Unix / macOS (bash):
```bash
# Install uv (if not installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone and setup
git clone https://github.com/dotnetdork/Quiz-App.git
cd Quiz-App

# Create .env file
cp .env-template .env
# Edit .env with your credentials

# Setup Python environment
uv venv
source .venv/bin/activate
uv pip install -r backend/requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Run the backend (serves both API and frontend)
cd backend
python -m uvicorn main:app --reload --host localhost --port 8000
```

Windows (PowerShell):
```powershell
# Clone and setup
git clone https://github.com/dotnetdork/Quiz-App.git
cd "Quiz-App"

# Create .env file
copy .env-template .env
# Edit .env with your credentials

# Create venv and install dependencies using venv python directly
uv venv
& ".\.venv\Scripts\python.exe" -m pip install -r backend/requirements.txt

# Build frontend
cd frontend; npm install; npm run build; cd ..

# Run backend
cd backend
& "..\.venv\Scripts\python.exe" -m uvicorn main:app --reload --host localhost --port 8000
```

### Option 4: Development with Separate Frontend Server

Unix / macOS (bash):
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn main:app --reload --host localhost --port 8000

# Terminal 2: Frontend (development server)
cd frontend
npm start
```

Windows (PowerShell):
```powershell
# Terminal 1: Backend (run using venv python)
cd backend
& "..\.venv\Scripts\python.exe" -m uvicorn main:app --reload --host localhost --port 8000

# Terminal 2: Frontend (development server)
cd frontend
npm start
```

## Configuration

All configuration is done via environment variables. Copy `.env-template` to `.env` and update the values:

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | (required) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | (required) |
| `GITHUB_REDIRECT_URI` | OAuth callback URL | `http://localhost:8000/auth/callback` |
| `SECRET_KEY` | Session signing key | (generate a random string) |
| `DATABASE_PATH` | SQLite database file path | `./quiz_app.db` |
| `QUIZFILES_PATH` | Directory containing quiz YAML files | `./backend` |
| `FRONTEND_URL` | Frontend URL (leave empty when backend serves frontend) | `` |

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create a new OAuth App with:
   - **Homepage URL**: `http://localhost:8000` (or your deployment URL)
   - **Authorization callback URL**: `http://localhost:8000/auth/callback`
3. Copy the Client ID and Client Secret to your `.env` file

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

Edit `backend/questions.yaml` (or files in your `QUIZFILES_PATH`) to add new quizzes:

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

## Support & Contact

If you encounter any issues with the quiz platform or need assistance with the Teacher Dashboard, please contact the lead developer:

* **Developer:** Jay Sausa
* **Organization:** League of Amazing Programmers
* **Issues:** Please open a "New Issue" in this GitHub repository.

## Copyright & Ownership

© 2026 The LEAGUE of Amazing Programmers. All Rights Reserved.

This software and all associated files are the property of the League of Amazing Programmers. Unauthorized copying, modification, or distribution of this code via any medium is strictly prohibited. This project is for internal and educational use only.