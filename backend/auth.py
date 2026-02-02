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
github = oauth.register(
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


from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from typing import Any, cast

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
github = oauth.register(
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

# Cast to Any so static analyzers accept dynamic attributes
"""
GitHub OAuth authentication module.
Handles login, callback, and session management.
"""
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from typing import Any, cast

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
github = oauth.register(
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

# Cast to Any so static analyzers accept dynamic attributes
_oauth_any: Any = cast(Any, oauth)


async def authorize_redirect(request, redirect_uri):
    """Start the OAuth authorization redirect (wrapper).

    We call through the dynamic `oauth` object (cast to Any) to avoid
    static-analysis warnings about optional attributes.
    """
    return await _oauth_any.github.authorize_redirect(request, redirect_uri)


async def authorize_access_token(request):
    """Exchange the authorization code for an access token (wrapper)."""
    return await _oauth_any.github.authorize_access_token(request)


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
