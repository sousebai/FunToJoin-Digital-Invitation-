// ─── roomController.js ────────────────────────────────────────────────────────
// Handles creating, listing, joining, leaving, and deleting chat rooms,
// as well as starting or retrieving 1-on-1 direct message conversations.
// ─────────────────────────────────────────────────────────────────────────────

import ChatRoom from '../models/ChatRoom.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

/**
 * Create a new chat room (public or private).
 * POST /api/rooms
 * Private
 */
export const createRoom = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    if (!name) {
      return errorResponse(res, 'Room name is required', 400);
    }

    let avatarUrl = '';

    // Handle room icon upload to Cloudinary if provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'mosma/rooms');
        avatarUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error(`❌ Cloudinary upload failed: ${uploadError.message}`);
        return errorResponse(res, 'Failed to upload room icon', 500);
      }
    }

    // Create the room with the creator as admin and first member
    const room = await ChatRoom.create({
      name,
      description: description || '',
      type: type || 'public',
      avatar: avatarUrl,
      admin: req.user._id,
      members: [req.user._id],
    });

    return successResponse(res, room, 'Chat room created successfully', 201);
  } catch (error) {
    console.error(`❌ CreateRoom error: ${error.message}`);
    return errorResponse(res, 'Server Error creating chat room', 500);
  }
};

/**
 * List all browseable public chat rooms.
 * GET /api/rooms
 * Private
 */
export const getRooms = async (req, res) => {
  try {
    // Return only public rooms that the user is NOT already in (for room discovery)
    const rooms = await ChatRoom.find({
      type: 'public',
      members: { $ne: req.user._id },
    })
      .populate('admin', 'name email avatar')
      .sort({ createdAt: -1 });

    return successResponse(res, rooms, 'Public rooms fetched successfully');
  } catch (error) {
    console.error(`❌ GetRooms error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching public rooms', 500);
  }
};

/**
 * List all rooms/DMs joined by the current user.
 * GET /api/rooms/joined
 * Private
 */
export const getJoinedRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      members: req.user._id,
    })
      .populate('members', 'name email avatar status')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name' },
      })
      .sort({ updatedAt: -1 }); // Sort by most recently updated (new messages)

    return successResponse(res, rooms, 'Joined rooms fetched successfully');
  } catch (error) {
    console.error(`❌ GetJoinedRooms error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching joined rooms', 500);
  }
};

/**
 * Retrieve detailed room metadata & member profiles.
 * GET /api/rooms/:id
 * Private
 */
export const getRoomDetails = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id)
      .populate('members', 'name email avatar status bio')
      .populate('admin', 'name email avatar');

    if (!room) {
      return errorResponse(res, 'Chat room not found', 404);
    }

    // Verify current user is a member of the room
    if (!room.members.some((member) => member._id.toString() === req.user._id.toString())) {
      return errorResponse(res, 'Access denied, you are not a member of this room', 403);
    }

    return successResponse(res, room, 'Room details fetched successfully');
  } catch (error) {
    console.error(`❌ GetRoomDetails error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching room details', 500);
  }
};

/**
 * Join a public chat room.
 * POST /api/rooms/:id/join
 * Private
 */
export const joinRoom = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);

    if (!room) {
      return errorResponse(res, 'Chat room not found', 404);
    }

    if (room.type !== 'public') {
      return errorResponse(res, 'Access denied, this room is invite-only', 403);
    }

    // Check if already in the room
    if (room.members.includes(req.user._id)) {
      return errorResponse(res, 'You are already a member of this chat room', 400);
    }

    // Add user to members
    room.members.push(req.user._id);
    await room.save();

    return successResponse(res, room, 'Joined room successfully');
  } catch (error) {
    console.error(`❌ JoinRoom error: ${error.message}`);
    return errorResponse(res, 'Server Error joining chat room', 500);
  }
};

/**
 * Leave a chat room.
 * POST /api/rooms/:id/leave
 * Private
 */
export const leaveRoom = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);

    if (!room) {
      return errorResponse(res, 'Chat room not found', 404);
    }

    // Direct messages cannot be "left" in the same way, users can just hide them
    if (room.type === 'direct') {
      return errorResponse(res, 'Direct conversations cannot be left', 400);
    }

    // Check if in the room
    if (!room.members.includes(req.user._id)) {
      return errorResponse(res, 'You are not a member of this room', 400);
    }

    // Remove user from members list
    room.members = room.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    // If no members left in a public/private room, delete it
    if (room.members.length === 0) {
      await ChatRoom.findByIdAndDelete(room._id);
      return successResponse(res, null, 'Left room, room deleted because it was empty');
    }

    // If admin left, assign the first member as new admin
    if (room.admin.toString() === req.user._id.toString()) {
      room.admin = room.members[0];
    }

    await room.save();
    return successResponse(res, null, 'Left room successfully');
  } catch (error) {
    console.error(`❌ LeaveRoom error: ${error.message}`);
    return errorResponse(res, 'Server Error leaving chat room', 500);
  }
};

/**
 * Delete a chat room.
 * DELETE /api/rooms/:id
 * Private
 */
export const deleteRoom = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);

    if (!room) {
      return errorResponse(res, 'Chat room not found', 404);
    }

    // Verify admin privileges
    if (room.admin.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Only the room creator can delete this room', 403);
    }

    await ChatRoom.findByIdAndDelete(room._id);

    // TODO: Also delete all messages in this room (Step 4)

    return successResponse(res, null, 'Room deleted successfully');
  } catch (error) {
    console.error(`❌ DeleteRoom error: ${error.message}`);
    return errorResponse(res, 'Server Error deleting chat room', 500);
  }
};

/**
 * Start or retrieve a 1-on-1 direct message conversation with another user.
 * POST /api/rooms/direct
 * Private
 */
export const getOrCreateDirectMessageRoom = async (req, res) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return errorResponse(res, 'Target user ID is required', 400);
    }

    if (targetUserId === req.user._id.toString()) {
      return errorResponse(res, 'You cannot start a direct message with yourself', 400);
    }

    // Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return errorResponse(res, 'Target user not found', 404);
    }

    // Check if a direct message room between these two users already exists
    let dmRoom = await ChatRoom.findOne({
      type: 'direct',
      members: { $all: [req.user._id, targetUserId] },
    }).populate('members', 'name email avatar status');

    if (dmRoom) {
      return successResponse(res, dmRoom, 'Direct conversation retrieved');
    }

    // Otherwise, create a new direct message room
    dmRoom = await ChatRoom.create({
      name: `${req.user.name} & ${targetUser.name}`, // Fallback naming
      type: 'direct',
      admin: req.user._id, // Set creator as admin by default
      members: [req.user._id, targetUserId],
    });

    const populatedDmRoom = await ChatRoom.findById(dmRoom._id).populate(
      'members',
      'name email avatar status'
    );

    return successResponse(res, populatedDmRoom, 'Direct conversation started successfully', 201);
  } catch (error) {
    console.error(`❌ GetOrCreateDM error: ${error.message}`);
    return errorResponse(res, 'Server Error starting direct conversation', 500);
  }
};
