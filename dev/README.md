# Development Scripts

This folder contains scripts to simplify starting and testing the Quiz-App in different environments.

## Directory Structure

```
dev/
└── startup/
    ├── windows/           # Windows PowerShell scripts (.ps1)
    │   ├── start-local.ps1
    │   ├── start-codespaces.ps1
    │   └── start-docker.ps1
    └── unix/              # Unix/macOS Bash scripts (.sh)
        ├── start-local.sh
        ├── start-codespaces.sh
        └── start-docker.sh
```

## Quick Start

### Unix/macOS (Bash)

```bash
# Local Development
./dev/startup/unix/start-local.sh

# GitHub Codespaces
./dev/startup/unix/start-codespaces.sh

# Docker
./dev/startup/unix/start-docker.sh
./dev/startup/unix/start-docker.sh --build      # Rebuild image
./dev/startup/unix/start-docker.sh --detach     # Run in background
```

### Windows (PowerShell)

```powershell
# Local Development
.\dev\startup\windows\start-local.ps1

# GitHub Codespaces
.\dev\startup\windows\start-codespaces.ps1

# Docker
.\dev\startup\windows\start-docker.ps1
.\dev\startup\windows\start-docker.ps1 -Build     # Rebuild image
.\dev\startup\windows\start-docker.ps1 -Detach    # Run in background
```

## Scripts Description

### `start-local` (Local Development)

- Creates/activates Python virtual environment
- Installs Python dependencies (using `uv` if available, otherwise `pip`)
- Builds the frontend if not already built
- Starts the backend server with hot reload
- **Server URL**: `http://localhost:8000`

**Prerequisites:**
- Python 3.12+ installed
- Node.js 18+ installed
- npm installed

### `start-codespaces` (GitHub Codespaces)

- Designed for GitHub Codespaces environment
- Activates the virtual environment created by devcontainer
- Rebuilds frontend if necessary
- Starts the server listening on all interfaces (0.0.0.0)
- **Server URL**: Accessible via forwarded port 8000

**Note:** In Codespaces, you'll need to update the `GITHUB_REDIRECT_URI` in your `.env` file to match your Codespace URL:
```
GITHUB_REDIRECT_URI=https://<codespace-name>-8000.app.github.dev/auth/callback
```

### `start-docker` (Docker Compose)

- Checks for Docker and Docker Compose installation
- Validates `.env` file exists
- Starts the application using Docker Compose
- **Server URL**: `http://localhost:8000`

**Options:**
- `--build` / `-Build`: Force rebuild of the Docker image
- `--detach` / `-Detach`: Run containers in the background

**Prerequisites:**
- Docker Desktop installed and running
- Docker Compose available

## First-Time Setup

1. **Copy the environment template:**
   ```bash
   cp .env-template .env
   ```

2. **Edit `.env` with your GitHub OAuth credentials:**
   - `GITHUB_CLIENT_ID` - From your GitHub OAuth App
   - `GITHUB_CLIENT_SECRET` - From your GitHub OAuth App
   - Update `GITHUB_REDIRECT_URI` if needed for your environment

3. **Run the appropriate script for your environment**

## Troubleshooting

### Script Permission Denied (Unix)

Make the scripts executable:
```bash
chmod +x dev/startup/unix/*.sh
```

### PowerShell Execution Policy (Windows)

If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Missing Dependencies

- **Python not found**: Install Python 3.12+
- **npm not found**: Install Node.js 18+
- **Docker not running**: Start Docker Desktop

### Port Already in Use

If port 8000 is already in use:
1. Stop any running servers on that port
2. Or modify the scripts to use a different port
