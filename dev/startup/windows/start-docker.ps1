# =============================================================================
# Quiz-App Docker Startup Script (Windows PowerShell)
# =============================================================================
# This script starts the Quiz-App using Docker Compose.
#
# Usage: .\start-docker.ps1 [-Build] [-Detach]
#   -Build    Force rebuild of the Docker image
#   -Detach   Run containers in background
# =============================================================================

param(
    [switch]$Build,
    [switch]$Detach
)

$ErrorActionPreference = "Stop"

Write-Host "🐳 Quiz-App Docker Startup" -ForegroundColor Blue
Write-Host "=============================================="

# Get the repository root directory (3 levels up from this script)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Get-Item "$ScriptDir\..\..\..").FullName

Write-Host "📁 Repository root: $RepoRoot" -ForegroundColor Blue
Set-Location $RepoRoot

# Check if Docker is installed
if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker daemon is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker daemon is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env-template" ".env"
    Write-Host "⚠️  Please update .env with your GitHub OAuth credentials before running again!" -ForegroundColor Red
    Write-Host "   - GITHUB_CLIENT_ID"
    Write-Host "   - GITHUB_CLIENT_SECRET"
    exit 1
}

# Change to docker directory
Set-Location docker

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "🐳 Starting Quiz-App with Docker Compose..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Build arguments
$ComposeArgs = @("up")
if ($Build) {
    $ComposeArgs += "--build"
}
if ($Detach) {
    $ComposeArgs += "-d"
}

# Try docker compose (v2) first, then fall back to docker-compose
$ComposeCommand = $null
try {
    docker compose version | Out-Null
    $ComposeCommand = "compose"
} catch {
    if (Get-Command "docker-compose" -ErrorAction SilentlyContinue) {
        $ComposeCommand = "docker-compose"
    }
}

if (-not $ComposeCommand) {
    Write-Host "❌ Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

# Start the containers
if ($Detach) {
    Write-Host "Starting in detached mode..."
    if ($ComposeCommand -eq "compose") {
        docker compose @ComposeArgs
    } else {
        docker-compose @ComposeArgs
    }
    Write-Host ""
    Write-Host "✓ Quiz-App is running in the background" -ForegroundColor Green
    Write-Host "Server is available at: http://localhost:8000"
    Write-Host ""
    Write-Host "Useful commands:"
    Write-Host "  View logs:     cd docker; docker compose logs -f"
    Write-Host "  Stop server:   cd docker; docker compose down"
} else {
    Write-Host "Server will be available at: http://localhost:8000"
    Write-Host "Press Ctrl+C to stop the server"
    Write-Host ""
    if ($ComposeCommand -eq "compose") {
        docker compose @ComposeArgs
    } else {
        docker-compose @ComposeArgs
    }
}
