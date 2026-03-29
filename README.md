# App Idea Generator
Full-stack web app that turns a short prompt into a structured app concept (name, audience, features, monetization, stack) using the **OpenAI API**.
## Tech stack
| Layer | Technologies |
|--------|----------------|
| **Runtime** | Node.js 18+ (ES modules) |
| **Server** | Express 5 |
| **Templating** | EJS |
| **AI** | OpenAI API (`gpt-4o-mini` via official `openai` SDK) |
| **Frontend** | HTML, CSS, vanilla JavaScript (no framework) |
| **Config** | `dotenv` |
| **Development** | Built and iterated with **[Cursor](https://cursor.com)** (AI-assisted editor) |
## Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer  
- An [OpenAI API key](https://platform.openai.com/api-keys) with billing/quota for API calls  
## Run locally
```bash
cp .env.example .env
# Edit .env: set OPENAI_API_KEY
npm install
npm run dev    # watch mode — restarts on file changes
# or: npm start
```
Open **http://localhost:3000** (or the `PORT` you set in `.env`).
## Upload to GitHub
1. Create a new repository at [github.com/new](https://github.com/new) (empty repo, no README if you already have this project on disk).
2. In your project folder:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.
3. **Authentication:** GitHub no longer accepts account passwords for `git push` over HTTPS. Use a [Personal Access Token](https://github.com/settings/tokens) (scope: **repo**) as the password, [GitHub CLI](https://cli.github.com/) (`gh auth login`), or SSH.
**Do not commit secrets.** This repo ignores `.env` via `.gitignore`; only `.env.example` is tracked.
## Deploy (optional)
Host as a **Node web service** (e.g. [Render](https://render.com)): build `npm install`, start `npm start`, set environment variable **`OPENAI_API_KEY`** in the host dashboard. Use **`GET /health`** for health checks if your provider asks for a path.
</br>
## :hammer_and_wrench: Languages and Tools :
<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/github/github-original-wordmark.svg" title="Github" **alt="Github" width="60" height="60"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/git/git-original-wordmark.svg" title="Git" **alt="Git" width="60" height="60"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-plain-wordmark.svg"  title="CSS3" alt="CSS" width="60" height="60"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" title="HTML5" alt="HTML" width="60" height="60"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" width="60" 
  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original-wordmark.svg" title="NodeJS" alt="NodeJS" width="60" height="60"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/express/express-original-wordmark.svg" title="express" **alt="express" width="60" height="60"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/openapi/openapi-plain-wordmark.svg" title="openapi" **alt="openapi" width="60" height="60"/>
  <img src="https://cdn.jsdelivr.net/npm/simple-icons@16.14.0/icons/cursor.svg" **alt="cursor" width="60" height="60"/>
</div>

</br>

<img width="819" height="590" alt="image" src="https://github.com/user-attachments/assets/1c8abecf-3395-48b5-9854-fc64cd9a0ab4" />
