# Quiz App Frontend

React-based frontend for the Quiz App. Built with Create React App.

## Development

### Option 1: Served by Backend (Production)

The frontend is built and served by the FastAPI backend as static files:

```bash
# Build for production
npm install
npm run build

# The backend will serve the `build/` directory
```

### Option 2: Development Server (Hot Reload)

For active frontend development with instant updates:

**Linux/Mac:**
```bash
# Make sure backend is running first
cd frontend
npm start
```

**Windows (PowerShell):**
```powershell
# Make sure backend is running first
cd frontend
npm start
```

This runs on `http://localhost:3000` with hot reloading. API requests are automatically proxied to `http://localhost:8000` (configured in `package.json`).

> **Important:** The backend must be running for API calls to work.

## Project Structure

```
src/
├── App.js              # Main app with React Router
├── App.css             # App-specific styles
├── index.css           # Dyslexia-friendly theme
├── api.js              # API helper (handles fetch calls)
├── pages/
│   ├── Home.js         # Landing page
│   ├── Quiz.js         # Quiz taking page
│   ├── Dashboard.js    # Student dashboard
│   ├── Leaderboard.js  # High scores
│   └── Admin.js        # Teacher dashboard
└── components/
    ├── MultipleChoice.js   # MCQ component
    └── ParsonsProblem.js   # Drag-and-drop code ordering
```

## API Configuration

The `api.js` file configures the backend URL:

- **Production (served by backend):** `API_URL = ''` (empty, uses same origin)
- **Development (separate servers):** Set `REACT_APP_API_URL=http://localhost:8000` or rely on the proxy setting

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server with hot reload |
| `npm run build` | Build for production (output in `build/`) |
| `npm test` | Run tests |

## Styling

The app uses a dyslexia-friendly design defined in `index.css`:
- Cream background with dark text
- Clean sans-serif fonts
- Large line spacing (1.8)
- High contrast colors
