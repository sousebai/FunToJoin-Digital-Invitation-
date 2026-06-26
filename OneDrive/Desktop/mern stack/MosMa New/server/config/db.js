// ─── db.js ────────────────────────────────────────────────────────────────────
// MongoDB Atlas connection via Mongoose.
//
// DEPLOYMENT NOTE:
//   - Local dev:  Set MONGO_URI in server/.env (copy from .env.example)
//   - Production: Set MONGO_URI in Render.com → Environment Variables
//   - Atlas IP whitelist MUST include 0.0.0.0/0 for Render to connect
//
// If the connection fails, the process exits immediately (process.exit(1)).
// This is intentional — a server without a DB is useless and should not start.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options prevent Mongoose deprecation warnings
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit so Render auto-restarts the service
  }
};

export default connectDB;
