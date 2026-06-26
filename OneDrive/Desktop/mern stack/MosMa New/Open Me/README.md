# MosMa Social App — README

## What is MosMa?
A full-featured social media web application inspired by Instagram, Facebook, WhatsApp, and Discord.
Built with the MERN stack: MongoDB, Express.js, React.js, Node.js.

## Features
- 🔐 JWT authentication (secure httpOnly cookies)
- 💬 Real-time chat with Socket.IO
- 🏠 Public & private chat rooms (Discord-style)
- 📨 1-on-1 Direct Messages (WhatsApp-style)
- 📸 Social Feed with posts, likes, comments (Instagram/Facebook-style)
- 👤 User profiles and avatars
- ⌨️ Typing indicators & read receipts
- 🟢 Online/offline presence tracking
- 📱 Fully responsive (mobile-friendly)
- ☁️ Cloud image storage (Cloudinary)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20.x |
| Backend | Express.js 4.x |
| Database | MongoDB (Atlas) + Mongoose |
| Real-time | Socket.IO 4.x |
| Auth | JWT + bcryptjs + httpOnly cookies |
| Frontend | React 18 + Vite |
| Routing | React Router DOM 6 |
| HTTP | Axios |
| Images | Cloudinary |
| Deploy Backend | Render.com |
| Deploy Frontend | Vercel |

---

## Local Development Setup

### Prerequisites
- Node.js 20.x or higher
- MongoDB Atlas account (free) OR local MongoDB
- Cloudinary account (free)
- Git

### 1. Clone the project
```bash
git clone <your-repo-url>
cd "MosMa New"
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Open `.env` and fill in your values:
- `MONGO_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — A random 64-character string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — From Cloudinary dashboard
- `CLIENT_URL` — http://localhost:5173 for local dev

```bash
npm run dev
```
Backend runs at: http://localhost:5000
Health check: http://localhost:5000/api/health

### 3. Frontend Setup (new terminal)
```bash
cd client
npm install
cp .env.example .env
```
Open `.env` and fill in:
- `VITE_API_URL=http://localhost:5000`
- `VITE_SOCKET_URL=http://localhost:5000`

```bash
npm run dev
```
Frontend runs at: http://localhost:5173

---

## Project Structure
```
MosMa New/
├── Open Me/        ← All documentation
├── server/         ← Node.js + Express backend
└── client/         ← React.js + Vite frontend
```

See IMPLEMENTATION_PLAN.md for full file structure.
See DEPLOYMENT_GUIDE.md for production deployment steps.

---

## Environment Variables

> ⚠️ NEVER commit .env files. They are listed in .gitignore.
> Use .env.example as a template.

### Backend (server/.env)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| NODE_ENV | development or production |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for JWT signing (64+ chars) |
| JWT_EXPIRES_IN | Token expiry (default: 7d) |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| CLIENT_URL | Frontend URL for CORS |

### Frontend (client/.env)
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |
| VITE_SOCKET_URL | Backend Socket.IO URL |
