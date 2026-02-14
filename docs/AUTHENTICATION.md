# Authentication Flow

This document details the OAuth 2.0 authentication flow used in Quiz-App with GitHub as the identity provider.

## Overview

Quiz-App uses **GitHub OAuth 2.0** for user authentication. This approach:
- Eliminates the need to store user passwords
- Leverages GitHub's secure authentication infrastructure
- Provides a seamless login experience for developers
- Allows access to public GitHub profile information

## Authentication Flow Diagram

```
┌─────────┐                                           ┌──────────┐
│ Browser │                                           │  GitHub  │
│ (User)  │                                           │   OAuth  │
└────┬────┘                                           └────┬─────┘
     │                                                      │
     │  1. Click "Login with GitHub"                       │
     ├──────────────────────────────────────────────┐      │
     │                                               │      │
     │              ┌──────────────┐                 │      │
     │              │   Frontend   │                 │      │
     │              │   (React)    │                 │      │
     │              └──────┬───────┘                 │      │
     │                     │                         │      │
     │  2. Redirect to /auth/login                  │      │
     │─────────────────────▼──────────┐              │      │
     │                                │              │      │
     │                     ┌──────────▼─────────┐    │      │
     │                     │    Backend         │    │      │
     │                     │    (FastAPI)       │    │      │
     │                     └──────────┬─────────┘    │      │
     │                                │              │      │
     │  3. Redirect to GitHub with    │              │      │
     │     client_id & redirect_uri   │              │      │
     │◄───────────────────────────────┘              │      │
     │                                               │      │
     │  4. Redirect to GitHub authorization          │      │
     ├───────────────────────────────────────────────┼──────▶
     │                                               │      │
     │  5. User authorizes application               │      │
     │◄──────────────────────────────────────────────┼──────┤
     │                                               │      │
     │  6. Redirect to /auth/callback?code=...       │      │
     ├───────────────────────────────────────────────┼──────┐
     │                                               │      │
     │                                ┌──────────────▼──┐   │
     │                                │    Backend      │   │
     │                                │    /callback    │   │
     │                                └──────────┬──────┘   │
     │                                           │          │
     │  7. Exchange code for token               │          │
     │                                           ├──────────▶
     │                                           │          │
     │  8. Return access_token                   │          │
     │                                           ◄──────────┤
     │                                           │          │
     │  9. Fetch user info with token            │          │
     │                                           ├──────────▶
     │                                           │          │
     │ 10. Return user data                      │          │
     │                                           ◄──────────┤
     │                                           │          │
     │ 11. Create/update user in database        │          │
     │                                           │          │
     │ 12. Set session cookie & redirect         │          │
     │◄──────────────────────────────────────────┘          │
     │                                                       │
     │ 13. Load dashboard with session                       │
     └───────────────────────────────────────────────────────┘
```

## Step-by-Step Process

### Step 1: User Initiates Login

User clicks the "Login with GitHub" button on the login page.

**Frontend Action:**
```javascript
// Login.js
const handleLoginClick = (e) => {
  e.preventDefault();
  setIsTransitioning(true);
  sessionStorage.setItem('isAuthenticating', 'true');
  
  // Show loading bar animation
  setTimeout(() => {
    setShowLoadingBar(true);
  }, 400);
  
  // Redirect to backend auth endpoint
  setTimeout(() => {
    window.location.href = `${API_URL}/auth/login`;
  }, 1500);
};
```

### Step 2: Backend Redirects to GitHub

**Backend Endpoint:**
```python
# main.py
@app.get("/auth/login")
async def login(request: Request):
    """Start GitHub OAuth flow"""
    redirect_uri = request.url_for("auth_callback")
    return await authorize_redirect(request, redirect_uri)
```

**OAuth Configuration:**
```python
# auth.py
github = oauth.register(
    name="github",
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email read:user"},
)
```

### Step 3: GitHub Authorization

User is redirected to GitHub's authorization page:
```
https://github.com/login/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:8000/auth/callback&
  scope=user:email+read:user
```

User sees:
- Application name and logo
- Requested permissions (read user profile and email)
- "Authorize" or "Cancel" buttons

### Step 4: GitHub Callback with Authorization Code

After user authorizes, GitHub redirects back:
```
http://localhost:8000/auth/callback?code=AUTHORIZATION_CODE
```

### Step 5: Token Exchange

**Backend processes the callback:**
```python
@app.get("/auth/callback")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    # Exchange authorization code for access token
    token = await authorize_access_token(request)
    
    # Get user info from GitHub
    user_info = await get_github_user(token)
    github_id = str(user_info['id'])
    username = user_info['login']
    
    # Find or create user in database
    user = db.query(User).filter(User.github_id == github_id).first()
    
    if not user:
        user = User(
            github_id=github_id,
            username=username,
            role="user"
        )
        db.add(user)
        db.commit()
    
    # Set session
    request.session["user_id"] = github_id
    request.session["username"] = username
    
    # Redirect to dashboard
    return RedirectResponse(url="/dashboard")
```

### Step 6: Session Management

**Session Cookie:**
- Set by backend after successful authentication
- HTTP-only (not accessible to JavaScript)
- Secure flag in production (HTTPS only)
- SameSite=Lax for CSRF protection
- Contains encrypted session data

**Session Data Structure:**
```python
{
    "user_id": "123456789",  # GitHub user ID
    "username": "johndoe"     # GitHub username
}
```

### Step 7: Protected Routes

All subsequent API requests include the session cookie automatically.

**Authentication Check:**
```python
def get_current_user(request: Request, db: Session):
    """Get current user from session"""
    user_id = request.session.get("user_id")
    if not user_id:
        return None
    
    user = db.query(User).filter(User.github_id == user_id).first()
    return user

def require_user(request: Request, db: Session = Depends(get_db)):
    """Require authenticated user (raises 401 if not authenticated)"""
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
```

**Frontend Auth Check:**
```javascript
// ProtectedRoute.js
useEffect(() => {
  async function checkAuth() {
    try {
      await apiCall('/auth/me');
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }
  checkAuth();
}, []);
```

## Loading State Synchronization

To provide a seamless experience without blank pages:

### 1. Login Page Flow
```javascript
// Set flag when starting OAuth
sessionStorage.setItem('isAuthenticating', 'true');

// Show animated loading bar
setShowLoadingBar(true);

// Redirect to GitHub
window.location.href = '/auth/login';
```

### 2. Protected Route Check
```javascript
// Check if coming from OAuth flow
const isAuthenticating = sessionStorage.getItem('isAuthenticating') === 'true';

if (loading && isAuthenticating) {
  // Show consistent loading bar
  return <LoadingBar />;
}
```

### 3. Dashboard Loading
```javascript
useEffect(() => {
  async function loadData() {
    try {
      // Load user data and dashboard content
      const userData = await apiCall('/auth/me');
      // ... load other data
      
      // Clear authentication flag
      sessionStorage.removeItem('isAuthenticating');
    } catch (err) {
      sessionStorage.removeItem('isAuthenticating');
    }
  }
  loadData();
}, []);
```

## Security Measures

### 1. OAuth Security
- **State parameter**: Prevents CSRF attacks (handled by Authlib)
- **HTTPS required**: In production, all OAuth traffic uses HTTPS
- **Short-lived tokens**: Access tokens expire and are not stored

### 2. Session Security
- **HTTP-only cookies**: Cannot be accessed by JavaScript
- **Secure flag**: Cookies only sent over HTTPS in production
- **SameSite attribute**: Prevents CSRF attacks
- **Server-side storage**: Session data stored on server, not client

### 3. Token Handling
- **No token storage**: Access tokens not stored after initial auth
- **Minimal scope**: Only request necessary permissions
- **Token validation**: GitHub validates tokens on each API call

### 4. User Data Privacy
- **Minimal data**: Only store GitHub ID and username
- **No sensitive info**: Email, repos, etc. not stored
- **User control**: Users can revoke access in GitHub settings

## Logout Process

```javascript
// Frontend
@app.get("/auth/logout")
def logout(request: Request):
    """Clear session and redirect to login"""
    request.session.clear()
    redirect_url = FRONTEND_URL if FRONTEND_URL else "/"
    return RedirectResponse(url=redirect_url)
```

**Logout Flow:**
1. User clicks "Logout"
2. Frontend triggers fade-out animation
3. Request sent to `/auth/logout`
4. Backend clears session cookie
5. User redirected to login page

## Troubleshooting

### Common Issues

**1. "Not authenticated" errors**
- **Cause**: Session cookie not sent or expired
- **Solution**: Check cookie settings, ensure credentials: 'include' in API calls

**2. OAuth redirect issues**
- **Cause**: Redirect URI mismatch
- **Solution**: Verify GITHUB_REDIRECT_URI matches GitHub OAuth app settings

**3. Blank page after login**
- **Cause**: Loading state not synchronized
- **Solution**: Implemented skeleton loader and session storage flags

**4. Session expires too quickly**
- **Cause**: Short max-age on session cookie
- **Solution**: Adjust SESSION_MAX_AGE in configuration

## Configuration

### Environment Variables

```bash
# Required
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:8000/auth/callback

# Optional
SECRET_KEY=your_secret_key_here  # For session encryption
SESSION_MAX_AGE=1209600  # 14 days in seconds
```

### GitHub OAuth App Settings

1. **Authorization callback URL**: Must match GITHUB_REDIRECT_URI exactly
2. **Homepage URL**: Your application's public URL
3. **Application name**: Displayed to users during authorization
4. **Scopes**: `user:email` and `read:user` for profile access

## Testing Authentication

### Manual Testing

1. Start backend: `uvicorn main:app --reload`
2. Start frontend: `npm start`
3. Navigate to http://localhost:3000
4. Click "Login with GitHub"
5. Authorize the application
6. Verify redirect to dashboard
7. Check session cookie in browser DevTools
8. Test protected routes (should work)
9. Clear cookies (should redirect to login)

### Testing Checklist

- [ ] Login flow completes successfully
- [ ] Session cookie is set
- [ ] Dashboard loads after login
- [ ] Protected routes require authentication
- [ ] Logout clears session
- [ ] Session persists across browser refresh
- [ ] Multiple tabs share same session
- [ ] Session expires appropriately

---

For more information, see:
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Starlette SessionMiddleware](https://www.starlette.io/middleware/#sessionmiddleware)
