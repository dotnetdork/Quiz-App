#!/bin/bash
# =============================================================================
# Quiz-App GitHub Codespaces Startup Script (Unix)
# =============================================================================
# This script starts the Quiz-App in GitHub Codespaces environment.
# Assumes dependencies are already installed via post-create.sh
#
# Usage: ./start-codespaces.sh
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Quiz-App Codespaces Startup${NC}"
echo "=============================================="

# Get the repository root directory (3 levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# In Codespaces, the workspace might be in /workspaces/
if [ -n "${CODESPACES}" ]; then
    REPO_ROOT="/workspaces/${RepositoryName:-Quiz-App}"
    echo -e "${GREEN}✓ Running in GitHub Codespaces${NC}"
fi

echo -e "${BLUE}📁 Repository root: ${REPO_ROOT}${NC}"
cd "$REPO_ROOT"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp .env-template .env
    echo -e "${RED}⚠️  Please update .env with your GitHub OAuth credentials!${NC}"
    echo ""
    echo "For Codespaces, update GITHUB_REDIRECT_URI to:"
    echo "  https://\${CODESPACE_NAME}-8000.app.github.dev/auth/callback"
    echo ""
    exit 1
fi

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    echo -e "${BLUE}🐍 Activating virtual environment...${NC}"
    source .venv/bin/activate
else
    echo -e "${YELLOW}⚠️  No virtual environment found. Running post-create setup...${NC}"
    bash .devcontainer/post-create.sh
    source .venv/bin/activate
fi

# Rebuild frontend if needed
if [ ! -d "frontend/build" ]; then
    echo -e "${BLUE}🔨 Building frontend...${NC}"
    cd frontend
    npm install
    npm run build
    cd "$REPO_ROOT"
fi

# Start the backend server
echo ""
echo -e "${GREEN}=============================================="
echo -e "🚀 Starting Quiz-App server in Codespaces..."
echo -e "=============================================="
echo -e "${NC}"
echo "Server will be available at the forwarded port 8000"
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
