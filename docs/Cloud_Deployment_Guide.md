# Cloud Deployment Guide: Render vs. Vercel
## Shri Vaishnav Vidyapeeth Vishwavidyalaya (SVVV) — Major Project (BTCS706N)
**Case Management Hearing e-Portal (Order XV-A CPC)**

---

## 1. Quick Verdict: Render vs. Vercel

| Platform | Best For | Supports FastAPI ASGI? | Supports WebSockets (`/ws`)? | Persistent Database? | Cost |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Render** (`render.com`) | **Full Stack (Backend + Frontend)** |  **Native** |  **Native** |  SQLite / Postgres | **100% Free** |
| **Vercel** (`vercel.com`) | **Frontend Only (React 19 SPA)** | ⚠️ Serverless only (15s timeout) | ❌ Not supported | ❌ Ephemeral (wiped on reset) | **100% Free** |

### 🏆 Recommendation for Your Evaluation:
1. **Option 1 (Easiest — 100% on Render via Blueprint):**
   - Host **both** Backend and Frontend on Render.
   - Use our pre-configured [render.yaml](file:///Users/mukulbhamgare/Desktop/case-management-eportal/render.yaml) for a 1-click automatic deployment.
2. **Option 2 (Hybrid Architecture — Industry Standard):**
   - **Backend on Render:** `https://cmh-backend.onrender.com` (Python FastAPI, WebSockets, SQLite, Swagger).
   - **Frontend on Vercel:** `https://cmh-portal.vercel.app` (React 19 SPA on edge CDN).

---

## 2. Option 1: Complete 1-Click Deployment on Render

Render reads our [render.yaml](file:///Users/mukulbhamgare/Desktop/case-management-eportal/render.yaml) blueprint to create both services automatically.

### Steps:
1. Sign up / Log in to [render.com](https://render.com) using your GitHub account (`mukul3004`).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your repository: `mukul3004/e-portal-for-CHM`.
4. Render will parse `render.yaml` and show:
   - `cmh-eportal-backend` (Web Service, Python 3.11)
   - `cmh-eportal-frontend` (Static Site, React 19)
5. Click **Apply**.
6. Render builds both services automatically!
   - Your live Web App will be at: `https://cmh-eportal-frontend.onrender.com`
   - Your live Swagger API Docs will be at: `https://cmh-eportal-backend.onrender.com/docs`

---

## 3. Option 2: Hybrid Deployment (Render Backend + Vercel Frontend)

### Step A: Deploy Backend on Render
1. Log in to [render.com](https://render.com) -> Click **New +** -> **Web Service**.
2. Select `mukul3004/e-portal-for-CHM`.
3. Configure settings:
   - **Name:** `case-management-backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   - `PYTHONPATH`: `.`
   - `DATABASE_URL`: `sqlite:///./cmh_portal.db`
   - `JWT_SECRET_KEY`: `any-secure-random-key-for-svvv-chm-portal`
5. Click **Create Web Service**. Note your backend URL (e.g. `https://case-management-backend.onrender.com`).

### Step B: Deploy Frontend on Vercel
1. Log in to [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select `mukul3004/e-portal-for-CHM`.
4. In **Project Settings**:
   - **Root Directory:** Edit and select `frontend`.
   - **Framework Preset:** `Vite` (automatically detected).
5. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://case-management-backend.onrender.com` (your Render backend URL from Step A without trailing slash).
6. Click **Deploy**.
7. In ~30 seconds, your site is live with a global SSL certificate (e.g., `https://case-management-eportal.vercel.app`)!

---

## 4. Free Tier Cold-Start Note (Important for Viva Voce)
> [!NOTE]
> On Render's free tier, backend instances "spin down" to sleep after 15 minutes of inactivity. When someone first visits the site, the backend takes ~30 to 45 seconds to spin up ("cold start").
> **Tip for Viva Day:** Open your live backend URL in a browser tab 5 minutes before your presentation so the instance is warm and responds with sub-second speed during your demonstration!
