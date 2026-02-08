# Getting Started

This guide will help you set up and run the Quiz-App on your machine.

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.10+ | 3.12 recommended |
| Node.js | 18+ | 20 recommended |
| npm | Included with Node.js | |
| Git | Any recent version | |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/dotnetdork/Quiz-App.git
cd Quiz-App
```

---

## Step 2: Set Up Environment Variables

1. Copy the template:
   ```bash
   cp .env-template .env
   ```

2. Edit `.env` and fill in your values:

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `GITHUB_CLIENT_ID` | ✅ | Your GitHub OAuth App Client ID |
   | `GITHUB_CLIENT_SECRET` | ✅ | Your GitHub OAuth App Client Secret |
   | `SECRET_KEY` | ✅ | Random string for session encryption |
   | `GITHUB_REDIRECT_URI` | No | Default: `http://localhost:8000/auth/callback` |
   | `DATABASE_PATH` | No | Default: `./quiz_app.db` |

3. Generate a secret key:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

---

## Step 3: Set Up GitHub OAuth

1. Go to **GitHub** → **Settings** → **Developer Settings** → **OAuth Apps**
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** Quiz App
   - **Homepage URL:** `http://localhost:8000`
   - **Authorization callback URL:** `http://localhost:8000/auth/callback`
4. Click **"Register application"**
5. Copy the **Client ID** to your `.env` file
6. Click **"Generate a new client secret"** and copy it to `.env`

---

## Step 4: Install Dependencies

### Option A: Using uv (Recommended)

<details>
<summary><strong>Linux/macOS</strong></summary>

```bash
# Install uv if needed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install Python dependencies
uv venv
source .venv/bin/activate
uv pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend
npm install
npm run build
cd ..
```

</details>

<details>
<summary><strong>Windows (PowerShell)</strong></summary>

```powershell
# Create virtual environment and install Python dependencies
uv venv
& ".\.venv\Scripts\python.exe" -m pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend
npm install
npm run build
cd ..
```

</details>

### Option B: Using pip

<details>
<summary><strong>Linux/macOS</strong></summary>

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

cd frontend
npm install
npm run build
cd ..
```

</details>

<details>
<summary><strong>Windows (PowerShell)</strong></summary>

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt

cd frontend
npm install
npm run build
cd ..
```

</details>

---

## Step 5: Run the Application

```bash
cd backend
python -m uvicorn main:app --reload --host localhost --port 8000
```

Open your browser to **http://localhost:8000**

---

## Alternative: GitHub Codespaces

The easiest way to get started:

1. Click **"Code"** → **"Open with Codespaces"** → **"New codespace"**
2. Wait for setup to complete (automatic)
3. Copy `.env-template` to `.env` and add your OAuth credentials
4. Run:
   ```bash
   cd backend
   source ../.venv/bin/activate
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
5. Open the forwarded port 8000

> **Note:** Update `GITHUB_REDIRECT_URI` to your Codespace URL.

---

## Alternative: Docker

```bash
# Make sure .env is configured first
cd docker
docker-compose up --build
```

Open **http://localhost:8000**

---

## Troubleshooting

### "Module not found" error

Make sure your virtual environment is activated:
```bash
source .venv/bin/activate  # Linux/macOS
.\.venv\Scripts\Activate.ps1  # Windows
```

### Port 8000 already in use

Find and stop the process, or use a different port:
```bash
python -m uvicorn main:app --reload --port 8001
```

### OAuth redirect error

Make sure `GITHUB_REDIRECT_URI` in `.env` matches **exactly** what you configured in GitHub OAuth App settings.

### Frontend not loading

Rebuild the frontend:
```bash
cd frontend
npm run build
```

---

## Next Steps

- [Development Guide](development-guide.md) - How to make changes
- [Architecture Overview](architecture/overview.md) - How the app works
