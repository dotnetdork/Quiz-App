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

- **Backend**: FastAPI (Python) - serves both API and frontend
- **Frontend**: React (Plain JavaScript/JSX) - built and served as static files by backend
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

> **Note:** Codespaces runs a Linux environment, so use Linux/Mac commands.

1. Click **"Code"** → **"Open with Codespaces"** → **"New codespace"**
2. Wait for the container to build (installs all dependencies automatically)
3. Copy `.env-template` to `.env` and add your GitHub OAuth credentials:
   ```bash
   cp .env-template .env
   ```
4. Build the frontend:
   ```bash
   cd frontend && npm install && npm run build && cd ..
   ```
5. Run the backend (serves both API and frontend):
   ```bash
   cd backend && source ../.venv/bin/activate && uvicorn main:app --reload --host localhost --port 8000
3. Copy `.env-template` to `.env` and add your GitHub OAuth credentials.

  Unix / macOS:
  ```bash
  cp .env-template .env
  ```

  Windows (PowerShell):
  ```powershell
  copy .env-template .env
  ```

```bash
# Clone the repository
git clone https://github.com/your-org/Quiz-App.git
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

**Linux/Mac:**
```bash
# Install uv (if not installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

docker compose -f docker-compose.yml --env-file ../.env up -d --build
# (or with legacy syntax)
docker-compose -f docker-compose.yml --env-file ../.env up -d --build
git clone https://github.com/your-org/Quiz-App.git
cd Quiz-App

# Create .env file
cp .env-template .env
# Edit .env with your credentials

# Setup Python environment
uv venv
source .venv/bin/activate
uv pip install -r backend/requirements.txt
```

**Windows (PowerShell):**
```powershell
# Install uv (if not installed)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Clone and setup
git clone https://github.com/your-org/Quiz-App.git
cd Quiz-App

# Create .env file
copy .env-template .env
# Edit .env with your credentials

# Setup Python environment
uv venv
.venv\Scripts\activate
uv pip install -r backend/requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Run the backend (serves both API and frontend)
cd backend
uvicorn main:app --reload --host localhost --port 8000
```

The app will be available at `http://localhost:8000`

### Option 4: Development with Separate Frontend Server

For frontend development with hot reloading (changes update instantly without rebuilding):

**Linux/Mac:**
```bash
# Terminal 1: Backend
cd backend
source ../.venv/bin/activate
uvicorn main:app --reload --host localhost --port 8000

# Terminal 2: Frontend (development server with hot reload)
cd frontend
npm start
```

**Windows (PowerShell):**
```powershell
# Terminal 1: Backend
cd backend
../.venv/Scripts/activate
uvicorn main:app --reload --host localhost --port 8000

# Terminal 2: Frontend (development server with hot reload)
cd frontend
npm start
```

The frontend dev server runs at `http://localhost:3000` and proxies API requests to the backend.

> **Note:** The `proxy` setting in `frontend/package.json` automatically forwards API calls to the backend during development.

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
- **Developer**: Full permissions (admin dashboard + system access)

### Accessing the Database

The app uses SQLite, stored in `backend/quiz_app.db`. You can access it using the `sqlite3` command-line tool or any SQLite GUI (like DB Browser for SQLite).

**Linux/Mac:**
```bash
cd backend
sqlite3 quiz_app.db
```

**Windows (PowerShell):**
```powershell
cd backend
sqlite3 quiz_app.db
```

> **Note:** If `sqlite3` is not installed on Windows, download it from [sqlite.org/download.html](https://sqlite.org/download.html) or use a GUI tool like [DB Browser for SQLite](https://sqlitebrowser.org/).

### Common Database Commands

Once inside the SQLite shell:

```sql
-- List all tables
.tables

-- View table structure
.schema users
.schema scores

-- View all users
SELECT * FROM users;

-- View all scores
SELECT * FROM scores;

-- View scores with usernames
SELECT users.username, scores.quiz_id, scores.score, scores.timestamp 
FROM scores 
JOIN users ON scores.user_id = users.id;

-- Exit SQLite
.exit
```

### Promoting a User to Teacher

To give a user teacher access (admin dashboard):

```sql
UPDATE users SET role='Teacher' WHERE username='github_username';
```

### Managing User Roles

The app supports the following roles:
- `Student` - Default role, can take quizzes and view leaderboard
- `Teacher` - Can access the admin dashboard at `/admin`
- `Developer` - Full permissions (admin dashboard + system access)

```sql
-- Change a user's role
UPDATE users SET role='Teacher' WHERE username='github_username';
UPDATE users SET role='Student' WHERE username='github_username';
UPDATE users SET role='Developer' WHERE username='github_username';

-- View all users and their roles
SELECT id, username, role FROM users;

-- Find all teachers
SELECT * FROM users WHERE role='Teacher';

-- Find all developers
SELECT * FROM users WHERE role='Developer';

-- Find all admins (teachers and developers)
SELECT * FROM users WHERE role IN ('Teacher', 'Developer');
```

### Clearing Score History

```sql
-- Clear ALL scores (reset entire leaderboard)
DELETE FROM scores;

-- Clear scores for a specific user (reset their quiz history)
DELETE FROM scores WHERE user_id = (SELECT id FROM users WHERE username='github_username');

-- Clear scores for a specific quiz
DELETE FROM scores WHERE quiz_id = 'quiz_id_here';

-- Clear a user's history for a specific quiz
DELETE FROM scores 
WHERE user_id = (SELECT id FROM users WHERE username='github_username') 
AND quiz_id = 'quiz_id_here';

-- Clear scores older than 30 days
DELETE FROM scores WHERE timestamp < datetime('now', '-30 days');

-- View a user's quiz history before clearing
SELECT scores.quiz_id, scores.score, scores.timestamp 
FROM scores 
JOIN users ON scores.user_id = users.id 
WHERE users.username = 'github_username'
ORDER BY scores.timestamp DESC;
```

### Resetting the Database

To completely reset the database (remove all users and scores):

```sql
-- Delete all data but keep tables
DELETE FROM scores;
DELETE FROM users;

-- Reset auto-increment counters (optional)
DELETE FROM sqlite_sequence WHERE name='scores';
DELETE FROM sqlite_sequence WHERE name='users';
```

Or simply delete the database file and restart the server (it will recreate the tables):

**Linux/Mac:**
```bash
rm backend/quiz_app.db
```

**Windows (PowerShell):**
```powershell
Remove-Item backend\quiz_app.db
```

### Other Useful Queries

```sql
-- Reset a user's scores
DELETE FROM scores WHERE user_id = (SELECT id FROM users WHERE username='github_username');

-- Delete a user completely
DELETE FROM scores WHERE user_id = (SELECT id FROM users WHERE username='github_username');
DELETE FROM users WHERE username='github_username';

-- View leaderboard (top 10)
SELECT users.username, SUM(scores.score) as total_score 
FROM scores 
JOIN users ON scores.user_id = users.id 
GROUP BY users.id 
ORDER BY total_score DESC 
LIMIT 10;
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
