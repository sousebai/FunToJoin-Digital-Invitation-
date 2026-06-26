// ─── userController.js ────────────────────────────────────────────────────────
// Handles retrieving user profiles, user listing/searching,
// modifying profiles, and managing friend requests/friends.
// ─────────────────────────────────────────────────────────────────────────────

import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

/**
 * Get all users or search users by name/email.
 * GET /api/users
 * Private
 */
export const getUsers = async (req, res) => {
  try {
    const search = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
          _id: { $ne: req.user._id }, // Exclude current user from searches
        }
      : { _id: { $ne: req.user._id } };

    const users = await User.find(search).limit(20);
    return successResponse(res, users, 'Users fetched successfully');
  } catch (error) {
    console.error(`❌ GetUsers error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching users', 500);
  }
};

/**
 * Get public profile of a user by ID.
 * GET /api/users/profile/:id
 * Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('friends', 'name email avatar status')
      .populate('friendRequests', 'name email avatar status');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'User profile fetched successfully');
  } catch (error) {
    console.error(`❌ GetUserProfile error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching user profile', 500);
  }
};

/**
 * Update current user's profile details.
 * PUT /api/users/profile
 * Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update name if provided
    if (name) user.name = name;
    // Update bio if provided (allows clearing by sending empty string)
    if (bio !== undefined) user.bio = bio;

    // Handle avatar upload if file is provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'mosma/avatars');
        user.avatar = uploadResult.secure_url;
      } catch (uploadError) {
        console.error(`❌ Cloudinary avatar upload failed: ${uploadError.message}`);
        return errorResponse(res, 'Failed to upload new profile picture', 500);
      }
    }

    const updatedUser = await user.save();

    return successResponse(
      res,
      {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        status: updatedUser.status,
      },
      'Profile updated successfully'
    );
  } catch (error) {
    console.error(`❌ UpdateProfile error: ${error.message}`);
    return errorResponse(res, 'Server Error updating profile', 500);
  }
};

/**
 * Send or accept a friend request.
 * POST /api/users/friend-request/:id
 * Private
 */
export const manageFriendRequest = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return errorResponse(res, 'You cannot send a friend request to yourself', 400);
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return errorResponse(res, 'User not found', 404);
    }

    // Check if they are already friends
    if (currentUser.friends.some((id) => id.toString() === targetUserId)) {
      return errorResponse(res, 'You are already friends with this user', 400);
    }

    // Scenario A: Accept friend request
    // If the target user had sent a request to the current user
    if (currentUser.friendRequests.some((id) => id.toString() === targetUserId)) {
      // Add each other as friends
      currentUser.friends.push(targetUserId);
      targetUser.friends.push(currentUserId);

      // Remove from friend requests list
      currentUser.friendRequests = currentUser.friendRequests.filter(
        (id) => id.toString() !== targetUserId
      );

      await currentUser.save();
      await targetUser.save();

      return successResponse(res, currentUser, 'Friend request accepted successfully');
    }

    // Scenario B: Cancel friend request
    // If request already sent by current user to target user, cancel it
    if (targetUser.friendRequests.some((id) => id.toString() === currentUserId.toString())) {
      targetUser.friendRequests = targetUser.friendRequests.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      await targetUser.save();
      return successResponse(res, currentUser, 'Friend request cancelled successfully');
    }

    // Scenario C: Send friend request
    // Add current user to target user's friend requests list
    targetUser.friendRequests.push(currentUserId);
    await targetUser.save();

    return successResponse(res, currentUser, 'Friend request sent successfully');
  } catch (error) {
    console.error(`❌ FriendRequest error: ${error.message}`);
    return errorResponse(res, 'Server Error managing friend request', 500);
  }
};

/**
 * Unfriend/remove a friend.
 * DELETE /api/users/friend/:id
 * Private
 */
export const unfriendUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return errorResponse(res, 'User not found', 404);
    }

    // Check if they are friends
    if (!currentUser.friends.some((id) => id.toString() === targetUserId)) {
      return errorResponse(res, 'You are not friends with this user', 400);
    }

    // Remove from friends arrays
    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.friends = targetUser.friends.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    return successResponse(res, currentUser, 'User unfriended successfully');
  } catch (error) {
    console.error(`❌ Unfriend error: ${error.message}`);
    return errorResponse(res, 'Server Error unfriending user', 500);
  }
};
