# =============================================================================
# Quiz-App GitHub Codespaces Startup Script (Windows PowerShell)
# =============================================================================
# This script starts the Quiz-App in GitHub Codespaces environment.
# Note: Codespaces typically uses Linux, but this script is provided for
# Windows-based development environments that may connect to Codespaces.
#
# Usage: .\start-codespaces.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host "🚀 Quiz-App Codespaces Startup" -ForegroundColor Blue
Write-Host "=============================================="

# Get the repository root directory (3 levels up from this script)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Get-Item "$ScriptDir\..\..\..").FullName

# Check if running in Codespaces (though typically Linux)
if ($env:CODESPACES) {
    Write-Host "✓ Running in GitHub Codespaces" -ForegroundColor Green
    $RepoRoot = "/workspaces/$($env:RepositoryName ?? 'Quiz-App')"
}

Write-Host "📁 Repository root: $RepoRoot" -ForegroundColor Blue
Set-Location $RepoRoot

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env-template" ".env"
    Write-Host "⚠️  Please update .env with your GitHub OAuth credentials!" -ForegroundColor Red
    Write-Host ""
    Write-Host "For Codespaces, update GITHUB_REDIRECT_URI to:"
    Write-Host '  https://${CODESPACE_NAME}-8000.app.github.dev/auth/callback'
    Write-Host ""
    exit 1
}

# Check for virtual environment
if (Test-Path ".venv") {
    Write-Host "🐍 Activating virtual environment..." -ForegroundColor Blue
} else {
    Write-Host "⚠️  No virtual environment found. Creating one..." -ForegroundColor Yellow
    if (Get-Command "uv" -ErrorAction SilentlyContinue) {
        uv venv
        uv pip install -r backend/requirements.txt
    } else {
        python -m venv .venv
        & ".\.venv\Scripts\pip.exe" install -r backend/requirements.txt
    }
}

# Rebuild frontend if needed
if (-not (Test-Path "frontend\build")) {
    Write-Host "🔨 Building frontend..." -ForegroundColor Blue
    Set-Location frontend
    npm install
    npm run build
    Set-Location $RepoRoot
}

# Start the backend server
Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "🚀 Starting Quiz-App server in Codespaces..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at the forwarded port 8000"
Write-Host "Press Ctrl+C to stop the server"
Write-Host ""

Set-Location backend
# Activate venv
& "..\.venv\Scripts\Activate.ps1"
# Run uvicorn
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
