// ─── authController.js ────────────────────────────────────────────────────────
// Handles register, login, logout, and get current user sessions.
//
// Highlights:
//   - Input validation check (valid email structure, password length).
//   - Cloudinary integration for avatar uploads on registration.
//   - Password comparison via User schema instance methods.
//   - Generates and returns JWT token stored in httpOnly cookie.
// ─────────────────────────────────────────────────────────────────────────────

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

/**
 * Register a new user.
 * POST /api/auth/register
 * Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    let avatarUrl = '';

    // Handle avatar image upload to Cloudinary if a file was provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'mosma/avatars');
        avatarUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error(`❌ Cloudinary upload failed: ${uploadError.message}`);
        return errorResponse(res, 'Failed to upload profile picture. Please try again.', 500);
      }
    }

    // Create new user in the database
    const user = await User.create({
      name,
      email,
      password, // Will be hashed via pre-save Mongoose hook
      bio: bio || '',
      avatar: avatarUrl,
      status: 'online', // Mark online on registration
    });

    if (user) {
      // Generate JWT and store in httpOnly cookie
      generateToken(res, user._id);

      // Return user data (excluding password)
      return successResponse(
        res,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          status: user.status,
          createdAt: user.createdAt,
        },
        'Registration successful',
        201
      );
    } else {
      return errorResponse(res, 'Invalid user data', 400);
    }
  } catch (error) {
    console.error(`❌ Register error: ${error.message}`);
    return errorResponse(res, error.message || 'Server Error on registration', 500);
  }
};

/**
 * Login user and start session.
 * POST /api/auth/login
 * Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    // Find user and explicitly select password field (which is excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Compare passwords using schema method
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Update status to online
    user.status = 'online';
    await user.save();

    // Generate JWT and store in httpOnly cookie
    generateToken(res, user._id);

    return successResponse(
      res,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        status: user.status,
        createdAt: user.createdAt,
      },
      'Login successful'
    );
  } catch (error) {
    console.error(`❌ Login error: ${error.message}`);
    return errorResponse(res, 'Server Error on login', 500);
  }
};

/**
 * Logout user and clear session.
 * POST /api/auth/logout
 * Public
 */
export const logoutUser = async (req, res) => {
  try {
    // If user is authenticated, set status to offline before clearing cookie
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.status = 'offline';
        await user.save();
      }
    }

    // Clear the httpOnly JWT cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('mosma_token', '', {
      httpOnly: true,
      expires: new Date(0), // Set expiry date to epoch to clear immediately
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
    });

    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    console.error(`❌ Logout error: ${error.message}`);
    return errorResponse(res, 'Server Error on logout', 500);
  }
};

/**
 * Get current user profile.
 * GET /api/auth/me
 * Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Ensure online status is set if session is active
      if (user.status !== 'online') {
        user.status = 'online';
        await user.save();
      }

      return successResponse(res, user, 'User profile fetched successfully');
    } else {
      return errorResponse(res, 'User session not found', 404);
    }
  } catch (error) {
    console.error(`❌ GetMe error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching session', 500);
  }
};
