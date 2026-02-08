#!/bin/bash
# =============================================================================
# Quiz-App Docker Startup Script (Unix/macOS)
# =============================================================================
# This script starts the Quiz-App using Docker Compose.
#
# Usage: ./start-docker.sh [--build] [--detach]
#   --build   Force rebuild of the Docker image
#   --detach  Run containers in background
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Quiz-App Docker Startup${NC}"
echo "=============================================="

# Parse arguments
BUILD_FLAG=""
DETACH_FLAG=""
for arg in "$@"; do
    case $arg in
        --build)
            BUILD_FLAG="--build"
            ;;
        --detach|-d)
            DETACH_FLAG="-d"
            ;;
    esac
done

# Get the repository root directory (3 levels up from this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo -e "${BLUE}📁 Repository root: ${REPO_ROOT}${NC}"
cd "$REPO_ROOT"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available. Please install Docker Compose.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp .env-template .env
    echo -e "${RED}⚠️  Please update .env with your GitHub OAuth credentials before running again!${NC}"
    echo "   - GITHUB_CLIENT_ID"
    echo "   - GITHUB_CLIENT_SECRET"
    exit 1
fi

# Change to docker directory
cd docker

echo ""
echo -e "${GREEN}=============================================="
echo -e "🐳 Starting Quiz-App with Docker Compose..."
echo -e "=============================================="
echo -e "${NC}"

# Use docker compose (v2) if available, otherwise fall back to docker-compose
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Start the containers
if [ -n "$DETACH_FLAG" ]; then
    echo "Starting in detached mode..."
    $COMPOSE_CMD up $BUILD_FLAG $DETACH_FLAG
    echo ""
    echo -e "${GREEN}✓ Quiz-App is running in the background${NC}"
    echo "Server is available at: http://localhost:8000"
    echo ""
    echo "Useful commands:"
    echo "  View logs:     cd docker && $COMPOSE_CMD logs -f"
    echo "  Stop server:   cd docker && $COMPOSE_CMD down"
else
    echo "Server will be available at: http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    $COMPOSE_CMD up $BUILD_FLAG
fi
