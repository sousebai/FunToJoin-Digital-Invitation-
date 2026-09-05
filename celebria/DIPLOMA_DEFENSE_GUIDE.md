# Diploma Graduation Defense Guide: Celebria MERN Application

This guide prepares you to present your diploma workshop project with confidence, clarity, and technical mastery before the academic jury/examiners.

---

## 1. Project Overview & Context

- **Application Name:** Celebria Studio
- **Domain:** Luxury Digital Ceremony & Event Invitations (inspired by Invitio.io)
- **Target Users:** Event hosts (weddings, graduations, gender reveals, birthdays) and their guests.
- **Problem Solved:** Traditional paper invitations are expensive, non-interactive, and make headcount/dietary tracking slow and error-prone. Celebria provides interactive digital invitations with animated envelope opening, live countdowns, real-time RSVP with plus-ones and dietary restrictions tracking, music ambiance, QR codes, and instant CSV export for event caterers.

---

## 2. Technical Architecture Walkthrough (MERN)

### A. MongoDB & Mongoose (Database Layer)
- **Why MongoDB?** Event invitations require flexible, hierarchical schemas (e.g., custom schedules with time/descriptions, dress code color swatches, dynamic registry links). A document-oriented NoSQL database represents these structures natively as BSON/JSON without complex relational JOIN overhead.
- **Data Models:**
  1. `User`: Manages host accounts (`name`, unique lowercase `email`, `password` hashed with bcrypt).
  2. `Invitation`: Contains event metadata, unique URL `slug`, `theme` configuration, `schedule` array, and RSVP configuration. Indexed on `slug` and `user` for $O(1)$ query speed.
  3. `Rsvp`: Stores guest responses (`guestName`, `status`, `plusOnes`, `dietaryRestrictions`, `wishesMessage`). Indexed on `invitation` foreign key.

### B. Express.js & Node.js (Back-end Layer)
- **MVC Architectural Pattern:** Clear separation of concerns:
  - `routes/`: Define API endpoints and apply middleware.
  - `controllers/`: Business logic, request processing, error formatting.
  - `models/`: Schema definitions, data validation, and pre-save hooks.
  - `middleware/`: Reusable request pipelines (`auth.js` for JWT verification, `errorHandler.js` for structured JSON errors).
- **RESTful Endpoints:**
  - `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
  - `GET /api/invitations` (List user events with calculated headcount & RSVP stats)
  - `POST /api/invitations` (Create invitation with auto-generated slug)
  - `GET /api/invitations/public/:slug` (Public guest view, increments view counter)
  - `POST /api/rsvps/public/:slug` (Public RSVP submission with plus-one limits)
  - `GET /api/rsvps/event/:id` (Host analytics & dietary summary)
  - `GET /api/rsvps/event/:id/export` (Streamlined CSV download engine)

### C. React.js & Vite (Front-end Layer)
- **Single Page Application (SPA):** Instant client-side routing via `react-router-dom` v6 without page reloads.
- **State Management & Authentication:** Context API (`AuthContext`) manages token persistence (`localStorage`) and active user state.
- **Styling:** Tailwind CSS with responsive mobile-first utility classes, glassmorphism, and custom gold luxury palette.
- **Component Architecture:** Modular, reusable components (`EnvelopeAnimation`, `CountdownTimer`, `QRCodeModal`, `ShareModal`, `Navbar`, `Footer`).
- **User Experience (UX):** Confetti animation (`canvas-confetti`) on RSVP submission, animated envelope opening, live ticking countdown, dynamic theme preview.

---

## 3. Recommended 5-Minute Defense Demonstration Script

### Step 1: Introduction (1 minute)
> *"Good morning respected jury members. For my software development diploma capstone workshop, I designed and built **Celebria**, a full-stack MERN application for digital ceremony and event invitations, inspired by platforms like Invitio.io."*

### Step 2: The Guest Experience (1.5 minutes)
1. Open browser to `/invite/sophia-alexandre-wedding`.
2. Show the **animated digital envelope** with the wax seal. Click the wax seal to open the card.
3. Highlight:
   - Live **ticking countdown timer**.
   - Event **timeline/itinerary**.
   - **Dress code** color palette swatches.
   - **Wishing well** registry information.
4. Click **"RSVP Now"**:
   - Fill in a guest name (e.g. *"Jury Member"*), select *"Joyfully Accept"*, add 1 plus-one, specify dietary restriction (*"Gluten-Free"*), and leave a congratulatory wish.
   - Click **"Confirm RSVP"** → Point out the instant confetti celebration and confirmation message!
   - Show how the message appears on the **Guest Wishes Wall**.

### Step 3: The Host Dashboard & Guest List Management (1.5 minutes)
1. Navigate to `/login`. Click the **"Auto-Fill Demo Account"** button and log in as `demo@celebria.com`.
2. Show the **Host Dashboard**:
   - Total invitations, total RSVPs, and attending headcount.
   - The 4 seeded ceremonies (Wedding, Graduation, Gender Reveal, 30th Birthday).
3. Click **"Guest List"** on the Wedding:
   - Show how the RSVP just submitted by the guest appears in real-time.
   - Show the **Caterer Dietary Summary** (e.g. *"3x Vegetarian, 2x Gluten-free, 1x Halal"*).
   - Filter by Attending/Declined or search by name.
   - Click **"Export Guest List (CSV)"** to show how caterers receive an Excel-ready spreadsheet.
4. Show the **QR Code Modal** and **WhatsApp Share Modal**.

### Step 4: Code Architecture & Security Highlights (1 minute)
1. Open code editor.
2. Briefly highlight:
   - `backend/models/Invitation.js` (Mongoose schema, slug generation).
   - `backend/middleware/auth.js` (JWT bearer token protection).
   - Password encryption with `bcrypt.hash` before saving.
   - Responsive React components and Tailwind styling.

---

## 4. Typical Examiner Questions & Model Answers

### Q1: Why did you choose JWT (JSON Web Tokens) over traditional cookie sessions?
> **Answer:** *"JWT provides a stateless authentication mechanism. The server does not need to store active session IDs in server memory or a Redis cache. The token is cryptographically signed using a secret key and sent via the HTTP `Authorization: Bearer <token>` header. This makes the architecture horizontally scalable and decoupled for client applications."*

### Q2: How do you handle password security in the database?
> **Answer:** *"Passwords are never stored in plaintext. In `backend/models/User.js`, I implemented a Mongoose `pre('save')` hook. Whenever a password is created or updated, bcrypt generates a cryptographic salt (10 rounds) and hashes the password. In addition, the password field is marked with `select: false` so that it is excluded by default in query results."*

### Q3: How do you handle database relationships in MongoDB since it is NoSQL?
> **Answer:** *"In MongoDB, we use document references via `mongoose.Schema.Types.ObjectId` with `ref: 'User'` and `ref: 'Invitation'`. For instance, each RSVP document stores an `invitation` ObjectId, which is indexed for quick retrieval. When an invitation is deleted, our controller cascades the deletion to remove all associated RSVPs."*

### Q4: How is responsive design achieved for guests opening invites on smartphones?
> **Answer:** *"I implemented a mobile-first approach using Tailwind CSS. Core layout components adapt using responsive breakpoints (`sm:`, `md:`, `lg:`). The invitation layout is capped at `max-w-3xl`, optimizing readability on mobile screens where over 85% of guests view digital invitations via WhatsApp or QR codes."*

### Q5: How do you prevent invalid plus-ones or unauthorized RSVP manipulation?
> **Answer:** *"Validation is enforced on both client and server. The backend controller checks whether `allowPlusOnes` is enabled in the invitation settings and validates that `plusOnes` does not exceed the host's configured `maxPlusOnes`. We also check if the `rsvpDeadline` has passed before accepting responses."*
