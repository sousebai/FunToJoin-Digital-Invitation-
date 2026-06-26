// ─── User.js ──────────────────────────────────────────────────────────────────
// User data model.
// Stores all user account information including hashed passwords.
//
// IMPORTANT:
//   - Passwords are NEVER stored in plain text. bcryptjs hashes them before save.
//   - The `password` field is excluded from queries by default (select: false).
//     To include it (e.g., for login comparison), use .select('+password') explicitly.
//   - avatar stores a Cloudinary URL string, not a file.
//   - friends is a self-referencing array of User IDs (follow/friend system).
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries unless explicitly requested
    },
    avatar: {
      type: String,
      default: '', // Cloudinary URL — empty string means use initials avatar in frontend
    },
    bio: {
      type: String,
      default: '',
      maxlength: [160, 'Bio cannot exceed 160 characters'],
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'away'],
      default: 'offline',
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-save Hook: Hash password before saving ───────────────────────────────
// Only runs if the password field was modified (prevents re-hashing on other updates).
// IMPORTANT: Do NOT use the 'next' callback with async hooks in Mongoose.
// With async functions, Mongoose awaits the returned Promise automatically.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12); // 12 rounds = strong but not too slow
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance Method: Compare entered password with hashed password ───────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
