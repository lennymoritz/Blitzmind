# Deploying BlitzMind to Vercel

This guide takes you from "I have the ZIP file" to "I have a live URL" in under 10
minutes. Two paths — pick whichever feels right.

---

## Path A — GitHub + Vercel (recommended)

This is the standard path. Once set up, every `git push` auto-deploys a new
version. Best for ongoing iteration.

### Prerequisites
- A GitHub account
- A Vercel account (free; sign in with GitHub when prompted)
- Git installed locally (https://git-scm.com/downloads)

### Steps

**1. Unzip the project somewhere stable**

Don't deploy from `Downloads/` — move it to a real working folder.

```bash
# Example for macOS / Linux
mv ~/Downloads/blitzmind-site ~/projects/blitzmind-site
cd ~/projects/blitzmind-site
```

```powershell
# Example for Windows
move "$env:USERPROFILE\Downloads\blitzmind-site" "$env:USERPROFILE\projects\blitzmind-site"
cd "$env:USERPROFILE\projects\blitzmind-site"
```

**2. Initialize git and make your first commit**

```bash
git init
git add .
git commit -m "Initial commit: BlitzMind"
```

**3. Create a new GitHub repo**

- Go to https://github.com/new
- Repository name: `blitzmind` (or whatever you want — public or private both work)
- **Do NOT initialize with a README, .gitignore, or license** — we already have those
- Click "Create repository"

**4. Push your code to the new repo**

GitHub will show you a couple of commands on the empty-repo page. The ones you want
are under "…or push an existing repository from the command line". Copy and run those
in your terminal. They look like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/blitzmind.git
git branch -M main
git push -u origin main
```

**5. Deploy to Vercel**

- Go to https://vercel.com/new
- Sign in with GitHub if you haven't already (Vercel will ask for repo access — grant it)
- You'll see your `blitzmind` repo in the list. Click **Import**
- Vercel will auto-detect Next.js. Don't change any settings.
  - Framework Preset: **Next.js** ← should be auto-selected
  - Build command: `next build` ← auto
  - Output directory: leave default
  - Install command: `npm install` ← auto
- Click **Deploy**

Wait ~2 minutes. Vercel will install dependencies, build, and deploy. You'll get a
URL like `blitzmind-xxxx.vercel.app`. Copy it. That's your live site.

**6. (Optional) Add a custom domain**

In the Vercel project dashboard → Settings → Domains. Add your domain, follow the DNS
instructions. Takes ~5 minutes to propagate.

---

## Path B — Vercel CLI (fastest path)

Skip GitHub entirely. Good for "I just want a URL right now" but no auto-deploy.

```bash
# In the project root
npm install -g vercel
vercel login    # opens browser, authenticate
vercel          # follow prompts; pick "Link to existing project? No"
                # accept all defaults
```

You'll get a preview URL. To promote to production:

```bash
vercel --prod
```

---

## What to do if the build fails

The project builds clean as of packaging — `npm run build` runs with zero warnings.
If Vercel's build fails, almost always it's one of:

- **Node version mismatch.** Vercel defaults to Node 22.x which is fine. If you see
  a Node-version error, go to Project Settings → General → Node.js Version and pick
  22.x explicitly.
- **Missing dependency.** Run `npm install` locally, then `npm run build` — if it
  works locally, the deploy will work. Commit any new `package-lock.json` changes
  and push.
- **TypeScript error.** Same — run `npm run build` locally first. Errors are clearer
  on your machine than on Vercel's logs.

---

## Things that are NOT a problem

- **No environment variables needed.** The app doesn't use any `process.env.X` at
  runtime. No `.env` files to configure on Vercel.
- **No database.** All data is mocked in `src/app/app/_lib/mockData.ts`. Nothing to
  provision.
- **No image optimization config.** Next.js `<Image>` works on Vercel out of the box.
- **The static assets** (controller-front.png, controller-back.png) are in `public/`
  and will deploy automatically.

---

## After deploy — verification checklist

Once you have your live URL, click through these in order:

1. `/` — marketing site loads, hero renders
2. `/app/home` — dashboard, sidebar nav works
3. `/app/sessions` — match list with ambient calm traces
4. `/app/sessions/m_001` — drills into a match detail report
5. `/app/live` — click "Start session", watch the HRV chart draw live for 3 minutes
6. `/app/adaptive/video` — drag the brightness slider, watch the preview dim
7. `/onboarding/welcome` — full onboarding flow works

If all 7 are good, you're shipped.
