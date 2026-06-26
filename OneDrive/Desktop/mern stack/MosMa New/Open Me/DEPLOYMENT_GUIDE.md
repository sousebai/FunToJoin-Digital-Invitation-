# MosMa Social App — Deployment Guide

> Read this AFTER you have finished all 6 development steps locally and the app works on your machine.

---

## 🗂️ Pre-Deployment Checklist

Before deploying, confirm ALL of these are done:

- [ ] App runs locally without errors
- [ ] All .env files are in .gitignore
- [ ] All 6 steps are complete
- [ ] MongoDB Atlas cluster is created
- [ ] Cloudinary account is created
- [ ] Code is pushed to a GitHub repository

---

## Step A — MongoDB Atlas Setup

1. Go to https://www.mongodb.com/atlas and sign up (free)
2. Create a new **Free Cluster** (M0 tier)
3. Go to **Database Access** → Add a new database user
   - Username: `mosma_admin`
   - Password: generate a strong password and save it
4. Go to **Network Access** → Add IP Address → `0.0.0.0/0` (allow all)
   > ⚠️ This is required for Render.com to connect to your database
5. Go to **Clusters** → Click **Connect** → **Connect your application**
6. Copy the connection string. It looks like:
   ```
   mongodb+srv://mosma_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password
8. Add `mosma_db` as the database name:
   ```
   mongodb+srv://mosma_admin:<password>@cluster0.xxxxx.mongodb.net/mosma_db?retryWrites=true&w=majority
   ```
9. Save this — you will paste it into Render as `MONGO_URI`

---

## Step B — Cloudinary Setup

1. Go to https://cloudinary.com and sign up (free)
2. Go to your **Dashboard**
3. Copy these 3 values:
   - Cloud Name
   - API Key
   - API Secret
4. Save these — you will paste them into Render

---

## Step C — Deploy Backend to Render.com

1. Go to https://render.com and sign up (free, use GitHub login)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   | Setting | Value |
   |---------|-------|
   | Name | mosma-api |
   | Root Directory | server |
   | Environment | Node |
   | Build Command | npm install |
   | Start Command | node server.js |
   | Instance Type | Free |

5. Scroll down to **Environment Variables** and add ALL of these:
   | Key | Value |
   |-----|-------|
   | PORT | 5000 |
   | NODE_ENV | production |
   | MONGO_URI | (your Atlas connection string) |
   | JWT_SECRET | (generate 64 random chars — use https://generate-secret.vercel.app/64) |
   | JWT_EXPIRES_IN | 7d |
   | CLOUDINARY_CLOUD_NAME | (from Cloudinary dashboard) |
   | CLOUDINARY_API_KEY | (from Cloudinary dashboard) |
   | CLOUDINARY_API_SECRET | (from Cloudinary dashboard) |
   | CLIENT_URL | https://mosma.vercel.app (fill in AFTER Vercel deploy) |

6. Click **Create Web Service**
7. Wait for deployment (~3-5 minutes)
8. Test: Visit `https://mosma-api.onrender.com/api/health`
   - You should see: `{"status":"ok","environment":"production"}`
9. Copy your Render URL: `https://mosma-api.onrender.com`

---

## Step D — Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up (free, use GitHub login)
2. Click **New Project** → Import your GitHub repo
3. Configure:
   | Setting | Value |
   |---------|-------|
   | Root Directory | client |
   | Framework Preset | Vite |
   | Build Command | npm run build |
   | Output Directory | dist |

4. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | VITE_API_URL | https://mosma-api.onrender.com |
   | VITE_SOCKET_URL | https://mosma-api.onrender.com |

5. Click **Deploy**
6. Wait (~2 minutes)
7. Copy your Vercel URL: `https://mosma.vercel.app`

---

## Step E — Update CORS on Render

After you have your Vercel URL:

1. Go to Render.com → Your Service → **Environment**
2. Update `CLIENT_URL` = `https://mosma.vercel.app` (your exact Vercel URL, NO trailing slash)
3. Click **Save Changes** → Render will auto-redeploy
4. Wait for redeploy (~2 minutes)

---

## Step F — Final Verification

Test these in order:

1. **Health check**: `https://mosma-api.onrender.com/api/health` → should return `{"status":"ok"}`
2. **Frontend loads**: Open `https://mosma.vercel.app` → Login page should appear
3. **Register**: Create a new account
4. **Login**: Login with that account
5. **Create a room**: Go to Rooms → Create a room
6. **Send a message**: Open the room and send a message
7. **Open another browser tab**: Login with a different account → Join same room → Messages should appear in real-time
8. **Upload an image**: Try uploading a profile picture

---

## ⚠️ Important Notes

### Render Free Tier Spin-Down
Render's free tier spins down your server after 15 minutes of inactivity.
The first request after sleep takes ~30 seconds.
**Solution**: Either upgrade to Render Starter ($7/mo) for always-on, or add a cron job (e.g., UptimeRobot) to ping your health endpoint every 10 minutes.

### Custom Domain (Optional)
- On Vercel: Go to Settings → Domains → Add your domain
- On Render: Go to Settings → Custom Domain
- Remember to update `CLIENT_URL` on Render to match your custom domain

### HTTPS
Both Render and Vercel provide free HTTPS automatically. Never use HTTP URLs for production.

---

## 🔧 Environment Variable Quick Reference

### server/.env.example
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mosma_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_64_characters_long_random_string
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### client/.env.example
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```
