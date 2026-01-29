# Testing Guide for Quiz App

This guide provides step-by-step instructions for testing the Quiz App application.

## Table of Contents
1. [Quick Start Testing](#quick-start-testing)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Testing Without GitHub OAuth](#testing-without-github-oauth)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start Testing

### Option 1: Full Application Test (With GitHub OAuth)

**Prerequisites:**
- Python 3.8+ installed
- Node.js 16+ installed
- GitHub OAuth App created (see README.md section 1)

**Steps:**

1. **Clone and navigate to the repository:**
   ```bash
   cd Quiz-App
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

3. **Configure GitHub OAuth:**
   Edit `backend/.env` and add your credentials:
   ```
   GITHUB_CLIENT_ID=your_actual_github_client_id
   GITHUB_CLIENT_SECRET=your_actual_github_client_secret
   SECRET_KEY=any_random_string_at_least_32_characters
   ```

4. **Start Backend:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   Backend should be running at http://localhost:8000

5. **Setup Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend should be running at http://localhost:3000

6. **Test the Application:**
   - Open http://localhost:3000 in your browser
   - Click "Login with GitHub"
   - Complete GitHub OAuth flow
   - Click on any question card
   - Drag and drop code lines to reorder them
   - Click "Submit Answer" to check your solution

---

### Option 2: Quick Backend API Test (No GitHub OAuth Required)

Test just the backend API without authentication:

1. **Start Backend:**
   ```bash
   cd backend
   source venv/bin/activate  # if not already activated
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Test API Endpoints:**
   ```bash
   # Health check
   curl http://localhost:8000/api/health

   # Get all questions
   curl http://localhost:8000/api/questions/

   # Get specific question
   curl http://localhost:8000/api/questions/parsons-1

   # View interactive API documentation
   # Open in browser: http://localhost:8000/docs
   ```

---

## Backend Testing

### 1. Manual API Testing

**Test Health Endpoint:**
```bash
curl http://localhost:8000/api/health
# Expected: {"status":"ok"}
```

**Test Questions Endpoint:**
```bash
curl http://localhost:8000/api/questions/ | python -m json.tool
# Expected: JSON array with 3 questions
```

**Test Specific Question:**
```bash
curl http://localhost:8000/api/questions/parsons-1 | python -m json.tool
# Expected: JSON object with question details
```

### 2. Automated Backend Tests

Run the included test script:

```bash
cd backend
source venv/bin/activate
pip install requests  # if not already installed
python test_api.py
```

Expected output:
```
============================================================
Quiz App Backend Tests
============================================================

Testing health endpoint...
✓ Health check passed

Testing questions endpoint...
✓ Found 3 questions

  - Sort a List in Python (parsons)
  - Find Maximum Value (parsons)
  - Calculate Sum (parsons)

Testing specific question endpoint...
✓ Retrieved question successfully
  Title: Sort a List in Python
  Code lines: 3

============================================================
All tests passed! ✓
============================================================
```

### 3. Interactive API Documentation

FastAPI provides automatic interactive documentation:

1. Start the backend server
2. Open http://localhost:8000/docs in your browser
3. You can test all endpoints directly from this interface
4. Click "Try it out" on any endpoint to test it

---

## Frontend Testing

### 1. Visual Testing

**Homepage Test:**
1. Navigate to http://localhost:3000
2. Verify you see:
   - "Quiz App" header with dark background
   - "Login with GitHub" button in the top right
   - Welcome message
   - Three question cards displayed in a grid
   - Each card shows title, description, and "PARSONS" badge

**Navigation Test:**
1. Without logging in, try clicking on a question card
2. Verify the card appears disabled (no navigation occurs)

**Login Button Test:**
1. Click "Login with GitHub"
2. If GitHub OAuth is configured:
   - You should be redirected to GitHub login
3. If not configured:
   - Check browser console for errors (expected)

### 2. Drag-and-Drop UI Test (Requires Login)

After logging in with GitHub:

1. Click on any question card
2. You should see:
   - Question title and description
   - Code lines in a sortable container
   - Drag handles (⋮⋮) on each line
   - "Submit Answer" button

3. Test drag-and-drop:
   - Hover over a code line (cursor should change)
   - Click and drag a code line up or down
   - Release to drop in new position
   - Verify the line moved correctly

4. Test answer submission:
   - Arrange lines in any order
   - Click "Submit Answer"
   - Verify feedback message appears (Correct/Incorrect)

### 3. Browser Console Test

1. Open browser DevTools (F12)
2. Navigate the application
3. Check for:
   - No errors in Console tab
   - Successful API requests in Network tab
   - Proper state updates in React DevTools (if installed)

---

## End-to-End Testing

### Complete User Journey Test

1. **Start both servers** (backend on 8000, frontend on 3000)

2. **Initial Load:**
   - Open http://localhost:3000
   - Verify homepage loads without errors
   - Verify 3 questions are displayed

3. **Authentication Flow:**
   - Click "Login with GitHub"
   - Complete GitHub OAuth (enter credentials if needed)
   - Verify redirect back to homepage
   - Verify "Login with GitHub" button changes to user info with avatar

4. **Question Selection:**
   - Click on "Sort a List in Python" question
   - Verify navigation to quiz page
   - Verify code lines are displayed

5. **Quiz Interaction:**
   - Drag the third line to the first position
   - Drag the first line to the second position
   - Click "Submit Answer"
   - Verify "Incorrect" message appears (wrong order)

6. **Correct Answer:**
   - Arrange lines in correct order:
     1. `def sort_numbers(numbers):`
     2. `    sorted_list = sorted(numbers)`
     3. `    return sorted_list`
   - Click "Submit Answer"
   - Verify "Correct!" message appears

7. **Navigation:**
   - Click "← Back to Questions"
   - Verify return to homepage
   - Try another question

8. **Logout:**
   - Click "Logout" button
   - Verify return to logged-out state

---

## Testing Without GitHub OAuth

If you don't want to set up GitHub OAuth, you can still test most features:

### Backend-Only Testing

```bash
cd backend
source venv/bin/activate

# Test without .env file (uses defaults)
uvicorn main:app --reload

# Access API documentation
# Open: http://localhost:8000/docs
```

You can test all non-authenticated endpoints:
- Health check
- Get questions
- Get specific question

### Frontend Mock Testing

To test the frontend UI without backend:

1. Start only the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. The frontend will show errors for missing backend, but you can still see:
   - UI layout and styling
   - Component structure
   - Responsive design

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn main:app --reload --port 8001
```

**Database errors:**
```bash
# Delete the database and let it recreate
rm quiz.db
# Restart the backend
```

**Import errors:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or Vite will offer to use port 3001
```

**API connection errors:**
- Verify backend is running on port 8000
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.js`

**npm install errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### GitHub OAuth Issues

**"Authorization callback URL mismatch":**
- Verify your GitHub OAuth app callback URL is exactly:
  `http://localhost:8000/api/auth/github/callback`

**"Invalid client credentials":**
- Double-check your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env`
- Ensure no extra spaces or quotes

**Redirect loop:**
- Clear browser cookies and localStorage
- Verify `FRONTEND_URL` in `.env` is `http://localhost:3000`

---

## Test Checklist

Use this checklist to ensure complete testing:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Homepage loads and displays 3 questions
- [ ] API endpoints return correct data
- [ ] Login with GitHub works (if configured)
- [ ] Quiz page loads for authenticated users
- [ ] Drag and drop works smoothly
- [ ] Correct answer shows "Correct!" message
- [ ] Incorrect answer shows "Incorrect" message
- [ ] Back button returns to homepage
- [ ] Logout works correctly
- [ ] No console errors during navigation
- [ ] Responsive design works on mobile view

---

## Additional Testing Resources

**API Documentation:**
- Interactive docs: http://localhost:8000/docs
- OpenAPI schema: http://localhost:8000/openapi.json

**Database Inspection:**
```bash
# View database contents
cd backend
sqlite3 quiz.db

# List tables
.tables

# View users
SELECT * FROM users;

# View quiz attempts
SELECT * FROM quiz_attempts;

# Exit
.quit
```

**Frontend Build Test:**
```bash
cd frontend
npm run build
# Check dist/ folder for production build
```

---

## Questions?

If you encounter issues not covered in this guide:
1. Check the main README.md for setup instructions
2. Review SECURITY.md for security-related concerns
3. Check browser console and terminal output for error messages
4. Verify all prerequisites are installed and correct versions
