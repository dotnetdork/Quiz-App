#!/bin/bash
# =============================================================================
# Quiz-App Local Development Startup Script (Unix/macOS)
# =============================================================================
# This script sets up and starts the Quiz-App for local development.
# It handles Python virtual environment, frontend build, and server startup.
#
# Usage: ./start-local.sh
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Quiz-App Local Development Startup${NC}"
echo "=============================================="

# Get the repository root directory (3 levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo -e "${BLUE}📁 Repository root: ${REPO_ROOT}${NC}"
cd "$REPO_ROOT"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp .env-template .env
    echo -e "${RED}⚠️  Please update .env with your GitHub OAuth credentials before running again!${NC}"
    echo "   - GITHUB_CLIENT_ID"
    echo "   - GITHUB_CLIENT_SECRET"
    exit 1
fi

# Check for uv or pip
if command -v uv &> /dev/null; then
    echo -e "${GREEN}✓ uv found${NC}"
    USE_UV=true
else
    echo -e "${YELLOW}⚠️  uv not found, will use pip${NC}"
    USE_UV=false
fi

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo -e "${BLUE}📦 Creating Python virtual environment...${NC}"
    if [ "$USE_UV" = true ]; then
        uv venv
    else
        python3 -m venv .venv
    fi
fi

# Activate virtual environment
echo -e "${BLUE}🐍 Activating virtual environment...${NC}"
source .venv/bin/activate

# Install Python dependencies
echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
if [ "$USE_UV" = true ]; then
    uv pip install -r backend/requirements.txt
else
    pip install -r backend/requirements.txt
fi

# Check if frontend needs to be built
if [ ! -d "frontend/build" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    
    echo -e "${BLUE}🔨 Building frontend...${NC}"
    npm run build
    cd "$REPO_ROOT"
else
    echo -e "${GREEN}✓ Frontend build exists${NC}"
fi

# Start the backend server
echo ""
echo -e "${GREEN}=============================================="
echo -e "🚀 Starting Quiz-App server..."
echo -e "=============================================="
echo -e "${NC}"
echo "Server will be available at: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
python -m uvicorn main:app --reload --host localhost --port 8000
