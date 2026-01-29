"""
GitHub OAuth authentication module.
Handles login, callback, and session management.
"""
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

from config import (
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI
)

# ----------------------------
# OAuth Configuration
# ----------------------------
# Create OAuth instance
oauth = OAuth()

# Register GitHub as OAuth provider
oauth.register(
    name="github",
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    access_token_url="https://github.com/login/oauth/access_token",
    access_token_params=None,
    authorize_url="https://github.com/login/oauth/authorize",
    authorize_params=None,
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email read:user"},
)


async def get_github_user(token):
    """
    Fetch the GitHub user info using the access token.
    
    Args:
        token: OAuth access token from GitHub
    
    Returns:
        dict with user info (id, login, etc.)
    """
    import httpx
    
    # Make request to GitHub API
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {token['access_token']}",
                "Accept": "application/json"
            }
        )
        return response.json()
