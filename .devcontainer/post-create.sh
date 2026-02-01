#!/bin/bash
# Post-create script for Quiz App devcontainer

set -e

echo "🚀 Setting up Quiz App development environment..."

# Install uv (Python package manager)
echo "📦 Installing uv..."
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# Create Python virtual environment and install dependencies
echo "🐍 Setting up Python environment with uv..."
cd /workspaces/Quiz-App
uv venv
source .venv/bin/activate
uv pip install -r backend/requirements.txt

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build the frontend for production (so backend can serve it)
echo "🔨 Building frontend..."
npm run build

cd ..

# Create .env file from template if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env-template .env
    echo ""
    echo "⚠️  Please update the .env file with your GitHub OAuth credentials!"
    echo "   - GITHUB_CLIENT_ID"
    echo "   - GITHUB_CLIENT_SECRET"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Update .env with your GitHub OAuth credentials"
echo "  2. Run: cd backend && source ../.venv/bin/activate && uvicorn main:app --reload --port 8000"
echo ""
echo "The app will be available at the forwarded port 8000"
