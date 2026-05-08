# 🌐 Translate & Flip — PowerPoint Add-in (Vercel Hosted)

Translate PowerPoint slides between **English ↔ Arabic** with RTL/LTR layout mirroring.
Hosted on Vercel — always online, no local server, multiple users supported.
OpenAI API key is stored securely on the server and never exposed to users.

---

## 📁 Project Structure

```
pptx-translate-vercel/
├── api/
│   └── translate.js       ← Serverless function (proxies OpenAI, hides API key)
├── public/
│   ├── taskpane.html      ← The add-in UI
│   └── manifest.xml       ← Load this into PowerPoint (after updating URL)
├── vercel.json            ← Routing config
└── README.md
```

---

## 🚀 Deployment (Step by Step)

### Step 1 — Create a Vercel account
Go to https://vercel.com and sign up for free (use GitHub login for easiest setup).

### Step 2 — Install Vercel CLI
```bash
npm install -g vercel
```

### Step 3 — Deploy
Open a terminal in this folder and run:
```bash
vercel
```
Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (pick your account)
- Link to existing project? **N**
- Project name: `pptx-translate-flip` (or anything you like)
- In which directory is your code? **./public** → type `./` actually, root
- Override settings? **N**

Vercel will give you a URL like: `https://pptx-translate-flip.vercel.app`

### Step 4 — Add your OpenAI API key as an environment variable
```bash
vercel env add OPENAI_API_KEY
```
When prompted, paste your key (`sk-...`) and select **Production + Preview + Development**.

Then redeploy to apply it:
```bash
vercel --prod
```

### Step 5 — Update manifest.xml
Open `public/manifest.xml` and replace ALL instances of:
```
https://YOUR-APP.vercel.app
```
with your actual Vercel URL, e.g.:
```
https://pptx-translate-flip.vercel.app
```
There are 6 places to update. Save the file.

### Step 6 — Redeploy with updated manifest
```bash
vercel --prod
```

---

## 📥 Installing the Add-in in PowerPoint

### Windows (Desktop)
1. Open PowerPoint
2. Go to **Insert → Get Add-ins → Upload My Add-in**
3. Browse to `public/manifest.xml`
4. The "Translate & Flip" button appears in the **Home** ribbon

### Mac
1. Copy `manifest.xml` to:
   `~/Library/Containers/com.microsoft.Powerpoint/Data/Documents/wef/`
2. Restart PowerPoint → **Insert → My Add-ins**

### PowerPoint Online
1. **Insert → Add-ins → Upload My Add-in**
2. Upload `manifest.xml`

---

## 🔄 Sharing with Multiple Users

Once deployed, share the `manifest.xml` file with your team.
Each person uploads it to their own PowerPoint once — that's it.
They all hit your Vercel URL, no local server needed.

For organizations, you can also distribute via **Microsoft 365 Admin Center**:
- Admin Center → Settings → Integrated Apps → Upload custom app → upload manifest.xml
- It deploys to all users in your tenant automatically.

---

## 🛠️ Updating the App

Make changes to files, then run:
```bash
vercel --prod
```
All users get the update instantly — no reinstall needed on their end.

---

## 🔑 Getting an OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Copy the key (starts with `sk-...`)
4. Add it via `vercel env add OPENAI_API_KEY`

Uses **gpt-4o-mini** — fast and cost-effective (~$0.15/million tokens).
A full 50-slide deck costs less than $0.01 to translate.

---

## 🛡️ Security

- The OpenAI key lives only in Vercel's encrypted environment variables
- Users never see or touch the key
- The `/api/translate` endpoint only accepts POST requests with text payloads
- No user data is stored — translations are processed and discarded
