# GB Nagar e-Seva Portal — Deployment Guide

## Quick Deploy to Vercel (Recommended — Fastest in India)

### Option A: Deploy via GitHub (Easiest)

1. **Create a GitHub account** (if you don't have one): https://github.com/signup
2. **Create a new repository**:
   - Go to https://github.com/new
   - Name it `gbngov-eseva-portal`
   - Click "Create repository"
3. **Upload this entire `gbngov-deploy` folder** to the repo:
   - Click "uploading an existing file" on the repo page
   - Drag & drop ALL files from this folder (keep the folder structure)
   - Commit the files
4. **Go to Vercel**: https://vercel.com
   - Sign up / log in with GitHub
   - Click "Add New → Project"
   - Select your `gbngov-eseva-portal` repo
   - Framework: Vite (auto-detected)
   - Click "Deploy"
5. **Done!** You'll get a URL like: `gbngov-eseva-portal.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
cd gbngov-deploy
npm install
vercel
```
Follow the prompts. Done in 2 minutes.

---

## Alternative Hosting Options

### Netlify (Also Free, Also Has India CDN)
1. Go to https://app.netlify.com/drop
2. Run `npm install && npm run build` locally first
3. Drag & drop the `dist/` folder
4. Get a live URL instantly

### Railway / Render (If You Need a Backend Later)
- Good for when you add real APIs
- Free tier available
- Railway: https://railway.app
- Render: https://render.com

---

## Run Locally

```bash
cd gbngov-deploy
npm install
npm run dev
```
Opens at http://localhost:5173

## Build for Production

```bash
npm run build
```
Output in `dist/` folder — static files you can host anywhere.

---

## Performance Notes for India

- **Vercel Mumbai/Delhi edge** = ~20ms latency for most Indian users
- The app is ~200KB gzipped (loads in <2s on 4G)
- No backend API calls = works offline after first load
- Hindi fonts use system fonts (pre-installed on all Indian devices)
