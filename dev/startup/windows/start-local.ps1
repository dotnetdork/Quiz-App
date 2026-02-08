# =============================================================================
# Quiz-App Local Development Startup Script (Windows PowerShell)
# =============================================================================
# This script sets up and starts the Quiz-App for local development.
# It handles Python virtual environment, frontend build, and server startup.
#
# Usage: .\start-local.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host "🚀 Quiz-App Local Development Startup" -ForegroundColor Blue
Write-Host "=============================================="

# Get the repository root directory (3 levels up from this script)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Get-Item "$ScriptDir\..\..\..").FullName

Write-Host "📁 Repository root: $RepoRoot" -ForegroundColor Blue
Set-Location $RepoRoot

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env-template" ".env"
    Write-Host "⚠️  Please update .env with your GitHub OAuth credentials before running again!" -ForegroundColor Red
    Write-Host "   - GITHUB_CLIENT_ID"
    Write-Host "   - GITHUB_CLIENT_SECRET"
    exit 1
}

# Check for uv
$UseUv = $false
if (Get-Command "uv" -ErrorAction SilentlyContinue) {
    Write-Host "✓ uv found" -ForegroundColor Green
    $UseUv = $true
} else {
    Write-Host "⚠️  uv not found, will use pip" -ForegroundColor Yellow
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path ".venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Blue
    if ($UseUv) {
        uv venv
    } else {
        python -m venv .venv
    }
}

# Install Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Blue
if ($UseUv) {
    uv pip install -r backend/requirements.txt
} else {
    & ".\.venv\Scripts\pip.exe" install -r backend/requirements.txt
}

# Check if frontend needs to be built
if (-not (Test-Path "frontend\build")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
    Set-Location frontend
    npm install
    
    Write-Host "🔨 Building frontend..." -ForegroundColor Blue
    npm run build
    Set-Location $RepoRoot
} else {
    Write-Host "✓ Frontend build exists" -ForegroundColor Green
}

# Start the backend server
Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "🚀 Starting Quiz-App server..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:8000"
Write-Host "Press Ctrl+C to stop the server"
Write-Host ""

Set-Location backend
& "..\\.venv\\Scripts\\python.exe" -m uvicorn main:app --reload --host localhost --port 8000
