# Phase 3: Deployment Guide - Celebria MERN App

This guide explains step-by-step how to configure environment variables and deploy **Celebria** to free cloud hosting platforms for your software development graduation defense.

---

## 1. Cloud Database: MongoDB Atlas (Free Tier M0)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Click **Create a New Cluster** → select **M0 Free (Shared)**.
3. **Database Access:**
   - Under *Security* > *Database Access*, click **Add New Database User**.
   - Set Authentication Method: `Password`.
   - Username: `celebria_admin`
   - Password: `<your_secure_password>` (e.g. `CelebriaDb2026!`)
   - Role: `Read and write to any database`.
4. **Network Access (IP Whitelist):**
   - Under *Security* > *Network Access*, click **Add IP Address**.
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so cloud servers (Render/Railway) can connect.
5. **Get Connection String:**
   - Click **Connect** on your cluster → **Drivers** (Node.js).
   - Copy the URI:
     ```
     mongodb+srv://celebria_admin:<password>@cluster0.xxxxx.mongodb.net/celebria_db?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password.

---

## 2. Backend Deployment: Render.com (Web Service)

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Celebria MERN app"
   git branch -M main
   git remote add origin https://github.com/your-username/celebria-mern.git
   git push -u origin main
   ```
2. Log into [Render.com](https://render.com) with GitHub.
3. Click **New +** → **Web Service** → Connect your `celebria-mern` repository.
4. Configure service settings:
   - **Name:** `celebria-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. **Environment Variables:**
   Under *Advanced* or *Environment*, add:
   | Key | Value |
   |---|---|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | `mongodb+srv://celebria_admin:...` (From MongoDB Atlas) |
   | `JWT_SECRET` | `your_super_strong_random_jwt_secret_key` |
   | `JWT_EXPIRES_IN` | `30d` |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` (Add after Vercel deploy) |
6. Click **Deploy Web Service**.
7. Once deployed, note your backend URL: e.g. `https://celebria-backend.onrender.com`.
8. *Optional Seed on Cloud:* Under Render Shell, run `node seed/seedData.js` to seed sample celebrations to your Atlas database.

---

## 3. Frontend Deployment: Vercel

1. Log into [Vercel.com](https://vercel.com) with GitHub.
2. Click **Add New...** → **Project** → Import your `celebria-mern` repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and select `frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   Add:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://celebria-backend.onrender.com/api` |
5. Click **Deploy**.
6. In ~60 seconds, your frontend will be live with a production HTTPS URL (e.g. `https://celebria-frontend.vercel.app`).
7. Update Render's `FRONTEND_URL` environment variable with this URL for strict CORS compliance.

---

## 4. Single-Server Monolithic Hosting (Alternative)

If you prefer deploying both Frontend & Backend together on a single cloud instance:

1. Build the frontend into static assets:
   ```bash
   cd frontend
   npm run build
   ```
2. In `backend/server.js`, add static serving before the error handler:
   ```javascript
   const path = require('path');
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../frontend/dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
     });
   }
   ```
3. Deploy root to Render as a Web Service with Build Command:
   ```bash
   cd frontend && npm install && npm run build && cd ../backend && npm install
   ```
   Start Command: `node backend/server.js`.
