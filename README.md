# Quiz-App

A modern, interactive quiz platform built with React and FastAPI. Test your knowledge in Python, Java, and Technology with engaging quizzes featuring multiple-choice questions and Parsons problems (code ordering challenges).

![Quiz-App Banner](Images/screenshot.png)

## ✨ Features

- 🔐 **GitHub OAuth Authentication** - Secure login with your GitHub account
- 📚 **Multiple Quiz Categories** - Python, Java, and Technology quizzes
- 🎯 **Interactive Question Types** 
  - Multiple choice questions
  - Parsons problems (drag-and-drop code ordering)
- 🏆 **Leaderboard System** - Track your progress and compete globally
- 📊 **Personal Dashboard** - View your stats, quiz history, and skills profile
- 🎨 **Modern UI/UX** - Space-themed login with animated backgrounds
- ♿ **Accessibility** - Built with accessibility best practices
- 🐳 **Docker Support** - Easy deployment with Docker Compose

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **GitHub OAuth App** (for authentication)

### Option 1: Docker Compose (Recommended)

The easiest way to run the entire application:

```bash
# 1. Clone the repository
git clone https://github.com/dotnetdork/Quiz-App.git
cd Quiz-App

# 2. Copy environment template and configure
cp .env-template .env
# Edit .env with your GitHub OAuth credentials

# 3. Start all services
docker-compose up --build

# Access the app at http://localhost:8000
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GITHUB_CLIENT_ID="your_github_client_id"
export GITHUB_CLIENT_SECRET="your_github_client_secret"
export GITHUB_REDIRECT_URI="http://localhost:8000/auth/callback"
export SECRET_KEY="your_secret_key_here"  # Generate with: python -c "import secrets; print(secrets.token_hex(32))"

# Run database migrations (if needed)
python migrate_db.py

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start

# The app will open at http://localhost:3000
```

## 🔑 Setting Up GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps → [New OAuth App](https://github.com/settings/applications/new)
2. Fill in the application details:
   - **Application name**: Quiz-App (or your preferred name)
   - **Homepage URL**: `http://localhost:8000` (for local development)
   - **Authorization callback URL**: `http://localhost:8000/auth/callback`
3. Click "Register application"
4. Copy the **Client ID** and generate a **Client Secret**
5. Add these credentials to your `.env` file or environment variables

## 📊 Database

The application uses SQLite for data storage with the following tables:

- **users** - User profiles from GitHub OAuth
- **scores** - Quiz attempt records with timestamps
- **quiz_history** - Detailed question-by-question results

### Database Location

- Development: `backend/quiz_app.db`
- Docker: Persisted in `quiz_data` volume

### Accessing the Database

```bash
# Using SQLite CLI
sqlite3 backend/quiz_app.db

# View tables
.tables

# Query users
SELECT * FROM users;

# Query scores
SELECT * FROM scores ORDER BY timestamp DESC LIMIT 10;
```

### Database Migrations

If schema changes are needed:

```bash
cd backend
python migrate_db.py
```

## 🏗️ Project Structure

```
Quiz-App/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (Login, Dashboard, Quiz)
│   │   ├── utils/           # Utility functions and custom hooks
│   │   ├── App.js           # Main application component
│   │   └── api.js           # API client configuration
│   └── package.json
├── backend/                 # FastAPI backend application
│   ├── main.py              # FastAPI application entry point
│   ├── auth.py              # GitHub OAuth authentication
│   ├── database.py          # Database models and session management
│   ├── models.py            # SQLAlchemy ORM models
│   ├── quiz_routes.py       # Quiz API endpoints
│   ├── leaderboard_routes.py # Leaderboard API endpoints
│   ├── questions.yaml       # Quiz questions database
│   └── requirements.txt
├── docker/                  # Docker configuration files
├── docs/                    # Documentation
├── .env-template           # Environment variables template
└── docker-compose.yml      # Docker Compose configuration
```

## 🧪 Running Tests

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
pytest
```

## 🛠️ Development

### Frontend Development

The frontend uses **React 19** with React Router for navigation. Key technologies:

- **React Router** - Client-side routing
- **@dnd-kit** - Drag and drop for Parsons problems
- **Mermaid** - Diagram rendering

Hot reload is enabled for development:

```bash
cd frontend
npm start
```

### Backend Development

The backend uses **FastAPI** with async support. Key features:

- **SQLAlchemy** - ORM for database operations
- **Authlib** - OAuth 2.0 client
- **PyYAML** - Quiz configuration parsing

Enable auto-reload during development:

```bash
cd backend
uvicorn main:app --reload
```

### API Documentation

FastAPI provides interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 Adding New Quizzes

Quizzes are defined in `backend/questions.yaml`. Example structure:

```yaml
- id: "python-basics-1"
  title: "Python Basics - Variables and Types"
  description: "Test your knowledge of Python variables, data types, and basic operations"
  category: "python"
  questions:
    - id: "pybasic-1"
      type: "multiple-choice"
      question: "What is the output of: print(type(42))?"
      options:
        - "<class 'int'>"
        - "<class 'float'>"
        - "<class 'str'>"
        - "42"
      correct_answer: 0
    - id: "pybasic-2"
      type: "parsons"
      question: "Arrange these lines to create a function that returns the square of a number:"
      blocks:
        - "def square(n):"
        - "    result = n * n"
        - "    return result"
```

After adding quizzes, restart the backend server.

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# The build output is in frontend/build/
# FastAPI will automatically serve this if the build directory exists
```

### Environment Variables for Production

```bash
# Required environment variables
GITHUB_CLIENT_ID=your_production_client_id
GITHUB_CLIENT_SECRET=your_production_client_secret
GITHUB_REDIRECT_URI=https://yourdomain.com/auth/callback
SECRET_KEY=your_production_secret_key
FRONTEND_URL=https://yourdomain.com  # Optional, for CORS
```

### Docker Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Frontend**: Follow ESLint rules configured in the project
- **Backend**: Follow PEP 8 style guide
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 👥 Authors

- **The League of Amazing Programmers** - [jointheleague.org](https://www.jointheleague.org/)

## 🐛 Issues and Support

Found a bug or need help? 

- Open an issue on [GitHub Issues](https://github.com/dotnetdork/Quiz-App/issues)
- Check existing issues first to avoid duplicates
- Provide detailed information about the problem

## 🎓 Learning Resources

This project demonstrates:

- React hooks and modern React patterns
- FastAPI async programming
- OAuth 2.0 authentication flow
- RESTful API design
- SQLAlchemy ORM usage
- Docker containerization
- Frontend-backend integration

## 🔗 Related Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

---

**Built with ❤️ by The League of Amazing Programmers**
