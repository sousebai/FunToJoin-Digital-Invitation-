# MosMa Social App — Deployment-Ready MERN Implementation Plan

> **Purpose:** This document is the single source of truth for building and deploying the MosMa social media application.
> Any developer or AI assistant working on this project MUST read this entire file before writing any code.
> Following this plan exactly will prevent bugs, environment mismatches, and deployment failures.

---

## ⚡ Tech Stack (Locked)

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20.x LTS |
| Backend | Express.js | 4.x |
| Database | MongoDB via Mongoose | 7.x |
| Real-time | Socket.IO | 4.x |
| Auth | JWT + bcryptjs | - |
| Frontend | React.js (Vite) | 18.x |
| Routing | React Router DOM | 6.x |
| HTTP Client | Axios | 1.x |
| Image Storage | Cloudinary | Free tier |
| Deployment — Backend | Render.com | Free tier |
| Deployment — Frontend | Vercel | Free tier |
| Deployment — Database | MongoDB Atlas | Free 512MB |

---

## 📁 Full Project Structure

```
MosMa New/
├── Open Me/                         ← All documentation lives here
│   ├── IMPLEMENTATION_PLAN.md       ← This file
│   ├── README.md                    ← Setup instructions
│   ├── DEPLOYMENT_GUIDE.md          ← Step-by-step deployment
│   └── STEP_PROGRESS.md             ← Track which steps are done
├── server/                          ← Node.js + Express backend
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── ChatRoom.js
│   │   └── Post.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── messageRoutes.js
│   │   └── postRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── roomController.js
│   │   ├── messageController.js
│   │   └── postController.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── apiResponse.js
│   ├── .env                         ← NEVER COMMIT
│   ├── .env.example                 ← Safe to commit
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── client/                          ← React.js (Vite) frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   ├── services/
    │   ├── styles/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env                         ← NEVER COMMIT
    ├── .env.example                 ← Safe to commit
    ├── vercel.json
    ├── vite.config.js
    └── package.json
```

---

## Step 1 — Project Setup & Database Configuration ✅

### What gets built:
- server.js (Express app + HTTP server + Socket.IO + CORS)
- config/db.js (MongoDB Atlas connection)
- config/cloudinary.js (Cloudinary setup)
- All 4 data models (User, Message, ChatRoom, Post)
- middleware/errorMiddleware.js (Global error handler)
- utils/apiResponse.js (Standardized responses)
- utils/generateToken.js (JWT + httpOnly cookie)
- .env.example, .gitignore, package.json

---

## Step 2 — User Authentication

### What gets built:
- middleware/authMiddleware.js (JWT from cookie)
- routes/authRoutes.js + controllers/authController.js
- routes/userRoutes.js + controllers/userController.js
- client: AuthContext, LoginPage, RegisterPage, PrivateRoute, api.js

---

## Step 3 — Chat Room Creation & Management

### What gets built:
- routes/roomRoutes.js + controllers/roomController.js
- client: RoomsPage, RoomList, RoomCard, CreateRoomModal, Sidebar

---

## Step 4 — Real-Time Messaging

### What gets built:
- socket/socketHandler.js (All Socket.IO events)
- routes/messageRoutes.js + controllers/messageController.js
- client: SocketContext, ChatPage, MessageList, MessageInput, ChatBubble, TypingIndicator

---

## Step 5 — User Interface & Styling

### What gets built:
- All UI components (Button, Input, Modal, Avatar, Badge, Spinner)
- FeedPage, PostCard, CreatePost, ProfilePage, Navbar
- index.css design tokens, animations.css
- Framer Motion transitions
- Responsive mobile design

---

## Step 6 — Deployment

### Platforms:
- **Backend** → Render.com (Free Web Service)
- **Frontend** → Vercel (Free)
- **Database** → MongoDB Atlas (Free 512MB)
- **Images** → Cloudinary (Free 25GB)

See DEPLOYMENT_GUIDE.md for step-by-step instructions.

---

## ⚠️ Common Bugs to Avoid

| Bug | Cause | Fix |
|-----|-------|-----|
| CORS error in production | CLIENT_URL not set or has trailing slash | Set exact URL, no trailing `/` |
| Cookie not sent cross-domain | Missing sameSite:'None' + secure:true | Already in generateToken.js |
| Socket.IO connection fails | Wrong VITE_SOCKET_URL | Must equal backend URL |
| MongoDB connection timeout | Atlas IP not whitelisted | Whitelist 0.0.0.0/0 |
| Routes return 404 on Vercel refresh | SPA routing not configured | vercel.json with rewrites |
| JWT secret weak | Short/simple secret | Use 64+ random characters |
| process.env undefined in React | Used process.env instead of import.meta.env | Use import.meta.env.VITE_* |
| Images not loading | Cloudinary not configured | Set all 3 Cloudinary env vars |

---

## ✅ Security Checklist

- [ ] .env files in .gitignore, never committed
- [ ] JWT in httpOnly cookies (not localStorage)
- [ ] secure:true on cookies in production
- [ ] sameSite:'None' for cross-domain cookies
- [ ] CORS only allows CLIENT_URL in production
- [ ] Passwords hashed with bcryptjs
- [ ] All mutating routes protected by authMiddleware
- [ ] Error handler hides stack traces in production
- [ ] File uploads limited to 10MB
- [ ] No hardcoded secrets in source files
