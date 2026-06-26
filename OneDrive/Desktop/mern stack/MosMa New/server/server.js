// ─── server.js ────────────────────────────────────────────────────────────────
// MosMa Social App — Express.js Server Entry Point
// Initializes: Express, HTTP server, Socket.IO, CORS, middleware, routes.
//
// DEPLOYMENT NOTES:
//   1. CORS: CLIENT_URL env var controls which frontend domain is allowed.
//            Must be set to exact Vercel URL in production (no trailing slash).
//   2. Socket.IO CORS must mirror Express CORS settings exactly.
//   3. cookie-parser is required for reading httpOnly JWT cookies.
//   4. Rate limiting is applied to /api/auth routes to prevent brute-force.
//   5. /api/health endpoint is required by Render.com for health checks.
//   6. Error middleware MUST be registered last (after all routes).
//
// RUN LOCALLY:
//   npm run dev   → starts with nodemon (auto-restart on file changes)
//   npm start     → starts with node (used by Render.com in production)
// ─────────────────────────────────────────────────────────────────────────────

// ─── CRITICAL: Load .env FIRST before any other imports ───────────────────────
// In ESM (type: "module"), all static imports are hoisted and evaluated before
// any module-level code runs. Using 'import dotenv/config' ensures env vars are
// available when cloudinary.js, authMiddleware.js etc. read process.env at load time.
import 'dotenv/config';

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ─── Import Routes ─────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import postRoutes from './routes/postRoutes.js';

import socketHandler from './socket/socketHandler.js';

// ─── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ─── Initialize Express App ────────────────────────────────────────────────────
const app = express();
const httpServer = http.createServer(app); // Required for Socket.IO

// ─── CORS Configuration ────────────────────────────────────────────────────────
// DEPLOYMENT NOTE: Add your Vercel URL to this list.
// CLIENT_URL is read from environment variables.
// Never hardcode production URLs in this file.
const allowedOrigins = [
  process.env.CLIENT_URL,       // From .env — primary frontend URL
  process.env.CLIENT_URL_ALT,   // Fallback when Vite bumps to next port (5174, etc.)
  'http://localhost:5173',      // Vite dev server default
  'http://localhost:5174',      // Vite fallback port
  'http://localhost:3000',      // Fallback for CRA if needed
].filter(Boolean); // Remove undefined/null values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked origin: ${origin}`));
    }
  },
  credentials: true, // REQUIRED: allows cookies (httpOnly JWT) to be sent cross-domain
};

app.use(cors(corsOptions));

// ─── Socket.IO Server ──────────────────────────────────────────────────────────
// CORS config must mirror Express CORS exactly
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Reconnection ping interval — keep connections alive
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Initialize all socket event handlers
socketHandler(io);

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));           // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse form data
app.use(cookieParser());                             // Parse cookies (reads mosma_token)

// HTTP request logger — only in development (too noisy in production)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting (Auth Routes) ──────────────────────────────────────────────
// Prevents brute-force attacks on login/register endpoints.
// Limits: 20 requests per 15 minutes per IP address.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Health Check Endpoint ─────────────────────────────────────────────────────
// Required by Render.com to verify the server is running.
// Test after deployment: GET https://your-app.onrender.com/api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);   // Auth routes get rate limited
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);

// ─── Error Handling (MUST be last) ────────────────────────────────────────────
app.use(notFound);       // 404 for unregistered routes
app.use(errorHandler);   // Global error handler

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 ─────────────────────────────────────────────');
  console.log(`🟢 MosMa Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('─────────────────────────────────────────────────');
  console.log('');
});

export { io }; // Export io so it can be used in controllers if needed
