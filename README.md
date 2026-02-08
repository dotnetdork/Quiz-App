# Quiz App

A full-stack Quiz Application for GitHub Codespaces with support for multiple-choice questions and Parsons Problems (drag-and-drop code ordering).

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Support & Contact](#support--contact)

---

## Features

| Feature | Description |
|---------|-------------|
| 📝 **Multiple Choice Questions** | Standard MCQ with visual feedback |
| 🧩 **Parsons Problems** | Drag-and-drop code block ordering using dnd-kit |
| 🔐 **GitHub OAuth** | Login with your GitHub account |
| 🏆 **Leaderboard** | Global high scores (top 10 players) |
| 👨‍🏫 **Teacher Dashboard** | Admin view for teachers to monitor students |
| ♿ **Dyslexia-Friendly** | High contrast colors, large fonts, clean spacing |
| 🐳 **Docker Support** | Easy deployment with Docker and Docker Compose |
| ☁️ **Codespaces Ready** | Development container configuration included |

---

## Quick Start

### GitHub Codespaces (Easiest)

1. Click **"Code"** → **"Open with Codespaces"** → **"New codespace"**
2. Wait for setup to complete
3. Configure environment:
   ```bash
   cp .env-template .env
   # Edit .env with your GitHub OAuth credentials
   ```
4. Start the server:
   ```bash
   cd backend && source ../.venv/bin/activate
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
5. Open the forwarded port 8000

### Local Development

```bash
# Clone and setup
git clone https://github.com/dotnetdork/Quiz-App.git
cd Quiz-App
cp .env-template .env

# Install dependencies
uv venv && source .venv/bin/activate
uv pip install -r backend/requirements.txt
cd frontend && npm install && npm run build && cd ..

# Run
cd backend && python -m uvicorn main:app --reload --host localhost --port 8000
```

### Docker

```bash
cp .env-template .env
cd docker && docker-compose up --build
```

> 📖 **Detailed instructions:** [docs/getting-started.md](docs/getting-started.md)

---

## Configuration

Copy `.env-template` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_CLIENT_ID` | ✅ | From GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | ✅ | From GitHub OAuth App |
| `SECRET_KEY` | ✅ | Random string for sessions |

### Create GitHub OAuth App

1. **GitHub** → **Settings** → **Developer Settings** → **OAuth Apps** → **New OAuth App**
2. Set **Homepage URL:** `http://localhost:8000`
3. Set **Callback URL:** `http://localhost:8000/auth/callback`
4. Copy Client ID and Client Secret to `.env`

---

## Documentation

| Document | Description |
|----------|-------------|
| 📖 [Getting Started](docs/getting-started.md) | Setup instructions for all platforms |
| 🛠️ [Development Guide](docs/development-guide.md) | How to make changes, add features |
| 🏗️ [Architecture Overview](docs/architecture/overview.md) | How the app works |
| 📡 [API Reference](docs/architecture/api-reference.md) | All API endpoints |

---

## Support & Contact

| | |
|---|---|
| **Developer** | Jay Sausa |
| **Organization** | League of Amazing Programmers |
| **Issues** | [Open an Issue](https://github.com/dotnetdork/Quiz-App/issues/new) |

---

© 2026 The LEAGUE of Amazing Programmers. All Rights Reserved.