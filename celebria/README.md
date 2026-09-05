# Celebria - Luxury Digital Ceremony & Event Invitations (MERN App)

Celebria is a modern, full-stack MERN application (MongoDB, Express, React, Node.js) inspired by **Invitio.io**, created for the Software Development Diploma graduation capstone workshop.

---

## 🌟 Key Features

### Phase 1: Front-end (React.js + Tailwind CSS)
- **Interactive Landing Page**: Ceremony categories, live interactive preview cards, and platform highlights.
- **Digital Wax Seal Envelope Animation**: Guests click the wax seal stamp to open the envelope with 3D elevation.
- **Live Countdown Timer**: Real-time ticker counting down to the celebration day.
- **Event Itinerary Timeline**: Elegant visual breakdown of the ceremony, reception, and dance party.
- **Dress Code Guide**: Visual color swatches and style recommendations.
- **Interactive RSVP Modal**: Plus-ones counter, dietary restrictions tracker, song request, and guest blessings.
- **Celebration Confetti**: Physics-based confetti shower upon submitting an RSVP.
- **Atmospheric Audio**: Play/pause background ceremony melody.
- **QR Code & WhatsApp Share Modals**: Instant sharing with high-res QR code download.
- **Host Dashboard & Guest List Management**: Filter by status, dietary summary for caterers, and 1-click **Export to CSV**.

### Phase 2: Back-end (Node.js + Express + MongoDB)
- **RESTful API**: Clean MVC architecture (`routes/`, `controllers/`, `models/`, `middleware/`).
- **JWT Authentication**: Secure user registration, password hashing using bcrypt (10 salt rounds), and protected routes.
- **Slug Generation Engine**: Clean, unique URL slugs for invitations.
- **RSVP Validation**: Deadline checks and host plus-one limits.
- **CSV Generator**: Streams formatted guest rosters for caterers and event planners.
- **Pre-populated Database Seed**: 4 realistic ceremony invitations (Wedding, Graduation, Gender Reveal, 30th Birthday) with pre-filled RSVPs.

### Phase 3: Deployment & Defense
- Ready for cloud hosting on **MongoDB Atlas**, **Render**, and **Vercel**.
- Complete step-by-step guides in `DEPLOYMENT.md` and `DIPLOMA_DEFENSE_GUIDE.md`.

---

## 🚀 Quick Start Guide (Local Setup)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed      # Seeds demo user, 4 celebrations, and sample RSVPs
npm run dev       # Starts backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Starts frontend on http://localhost:5173
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Credentials (For Evaluation & Defense)

- **Host Email:** `demo@celebria.com`
- **Password:** `Password123!`
*(Or use the 1-click "Auto-Fill Demo Account" button on the login screen)*

### Sample Live Invitation URLs
- Royal Wedding: `/invite/sophia-alexandre-wedding`
- Masters Graduation: `/invite/ethan-brooks-graduation-2026`
- Gender Reveal: `/invite/maya-lucas-gender-reveal`
- 30th Birthday Soirée: `/invite/liam-turns-30`

---

## 📁 Project Structure

```
celebria-mern/
├── backend/
│   ├── config/db.js             # Mongoose connection
│   ├── controllers/            # Auth, Invitation, and RSVP logic
│   ├── models/                 # User, Invitation, and Rsvp schemas
│   ├── routes/                 # Express API routes
│   ├── middleware/             # JWT auth & error handling
│   ├── seed/seedData.js        # Realistic demo data seeder
│   ├── server.js               # Server entrypoint
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/         # Envelope, Countdown, QR, Share, Nav, Footer
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/              # Home, Login, Register, Dashboard, Builder, Guest List, Public Invite
│   │   ├── services/api.js     # API service
│   │   └── App.jsx             # Router and layout configuration
│   └── vite.config.js          # Vite config with API proxy
├── DEPLOYMENT.md               # Cloud hosting step-by-step guide
├── DIPLOMA_DEFENSE_GUIDE.md    # Jury presentation script & Q&A cheat-sheet
└── README.md
```
