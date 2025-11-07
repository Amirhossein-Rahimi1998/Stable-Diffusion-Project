# Stable Diffusion Project

This repository contains a React frontend and a Node.js backend for generating images using a Stable Diffusion API.

Important: the `ComfyUI/` directory is intentionally excluded from this repository because it can contain large model files and binaries. To keep the repo lightweight, download or clone ComfyUI and its models separately following the instructions below.

## What's included
- `frontend/` — React app (UI for prompt input and image display)
- `backend/` — Express server that calls the Stable Diffusion API

## What is ignored
The following are ignored via `.gitignore`:
- `ComfyUI/` (not tracked)
- `node_modules/`
- `*.env`, `local.env` (environment files)
- `dist/`, `build/`, and other build outputs

## How to obtain ComfyUI and models
Clone or download ComfyUI in a separate location, or follow the official project instructions in their README. Do not copy large model files into this Git repository.

## Local development
1. Backend

```powershell
cd backend
npm install
# add your API key to local.env (do NOT commit it)
# STABILITY_API_KEY=your_key_here
npm start
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev   # or the project's start command
```

Open the frontend in your browser (usually http://localhost:3000). The frontend posts prompts to `http://localhost:5000/generate` by default.

## Pushing to GitHub (tips)
Option A — HTTPS with Personal Access Token (PAT):
- Create a PAT at https://github.com/settings/tokens with `repo` scope.
- Then push with HTTPS; when prompted, use your GitHub username and the PAT as the password.

Option B — SSH (recommended for frequent pushes):
- Generate an SSH key if you don't have one:
  ```powershell
  ssh-keygen -t ed25519 -C "your_email@example.com"
  type $env:USERPROFILE\.ssh\id_ed25519.pub | clip
  ```
- Add the public key (`~/.ssh/id_ed25519.pub`) to GitHub (https://github.com/settings/ssh/new).
- Change remote to SSH and push:
  ```powershell
  git remote set-url origin git@github.com:ahrsmaplecode-code/Stable-Diffusion-Project.git
  git push -u origin main
  ```

If you get a 403 error when pushing over HTTPS, ensure your credentials are correct and clear any cached invalid credentials (Windows Credential Manager).

## Security
- Never commit `local.env` or your API keys. Add them to `.gitignore` (already done).

---
If you'd like, I can also add a small GitHub Actions workflow to run tests or lint on pushes. Let me know which authentication method you'll use and I can help you complete the push step-by-step.