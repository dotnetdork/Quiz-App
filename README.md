# Quiz App

A full-stack quiz application featuring Parsons Problems with drag-and-drop functionality.

## Features

- **FastAPI Backend**: RESTful API with Python
- **React Frontend**: Modern UI built with React and Vite
- **GitHub OAuth**: Secure authentication via GitHub
- **SQLite Database**: Lightweight database for user data and quiz attempts
- **Parsons Problems**: Interactive coding puzzles using dnd-kit for drag-and-drop
- **YAML-based Questions**: Easy-to-edit question format

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy (ORM)
- SQLite
- PyYAML
- python-jose (JWT)
- httpx (HTTP client)

### Frontend
- React 18
- React Router
- dnd-kit (drag-and-drop)
- Axios
- Vite

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- GitHub OAuth App credentials

### 1. Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: Quiz App
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:8000/api/auth/github/callback
4. Save the Client ID and Client Secret

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your GitHub OAuth credentials
# GITHUB_CLIENT_ID=your_client_id
# GITHUB_CLIENT_SECRET=your_client_secret
# SECRET_KEY=generate_a_random_secret_key

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Click "Login with GitHub" to authenticate
3. Select a question from the list
4. Drag and drop code lines to arrange them in the correct order
5. Click "Submit Answer" to check your solution

## Project Structure

```
Quiz-App/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── requirements.txt        # Python dependencies
│   ├── questions.yaml          # Quiz questions
│   ├── routers/
│   │   ├── auth.py            # Authentication routes
│   │   ├── questions.py       # Question routes
│   │   └── quiz.py            # Quiz submission routes
│   └── utils/
│       ├── auth.py            # JWT utilities
│       └── questions.py       # Question parsing utilities
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # Application entry point
│   │   ├── App.jsx            # Main app component
│   │   ├── components/
│   │   │   ├── Header.jsx     # Navigation header
│   │   │   ├── ParsonsProblem.jsx  # Drag-and-drop UI
│   │   │   └── SortableItem.jsx    # Draggable code line
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Questions list
│   │   │   ├── QuizPage.jsx   # Quiz interface
│   │   │   └── AuthCallback.jsx    # OAuth callback handler
│   │   ├── utils/
│   │   │   └── api.js         # API client
│   │   └── styles/
│   │       └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Adding Questions

Edit `backend/questions.yaml` to add new Parsons problems:

```yaml
questions:
  - id: "parsons-1"
    type: "parsons"
    title: "Your Question Title"
    description: "Describe what the code should do"
    code_lines:
      - "line 1 of code"
      - "line 2 of code"
      - "line 3 of code"
    correct_order:
      - "line 1 of code"
      - "line 2 of code"
      - "line 3 of code"
```

## API Endpoints

### Authentication
- `GET /api/auth/github` - Get GitHub OAuth URL
- `GET /api/auth/github/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user info

### Questions
- `GET /api/questions/` - List all questions
- `GET /api/questions/{id}` - Get specific question

### Quiz
- `POST /api/quiz/submit` - Submit an answer
- `GET /api/quiz/history` - Get user's quiz history

## Development

### Backend Development

The backend uses FastAPI with hot reload enabled. Changes to Python files will automatically reload the server.

### Frontend Development

The frontend uses Vite with hot module replacement (HMR). Changes to React components will be reflected immediately.

## Production Deployment

### Backend

```bash
# Set production environment variables
export GITHUB_CLIENT_ID=your_client_id
export GITHUB_CLIENT_SECRET=your_client_secret
export SECRET_KEY=your_secret_key
export FRONTEND_URL=https://your-frontend-domain.com

# Run with gunicorn (install first: pip install gunicorn)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

```bash
# Build for production
npm run build

# Serve the dist/ folder with any static file server
```

## License

MIT