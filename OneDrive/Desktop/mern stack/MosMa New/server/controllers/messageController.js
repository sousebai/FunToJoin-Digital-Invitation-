// ─── messageController.js ─────────────────────────────────────────────────────
// Handles logging messages to the database, fetching historical chat logs,
// uploading chat attachments (images), and managing read receipts.
// ─────────────────────────────────────────────────────────────────────────────

import Message from '../models/Message.js';
import ChatRoom from '../models/ChatRoom.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

/**
 * Send a new message to a chat room.
 * POST /api/messages
 * Private
 */
export const sendMessage = async (req, res) => {
  try {
    const { room, content, type, replyTo } = req.body;

    if (!room) {
      return errorResponse(res, 'Room ID is required', 400);
    }

    // Verify room exists and user is a member
    const chatRoom = await ChatRoom.findById(room);
    if (!chatRoom) {
      return errorResponse(res, 'Chat room not found', 404);
    }

    if (!chatRoom.members.some((m) => m.toString() === req.user._id.toString())) {
      return errorResponse(res, 'Access denied, you are not a member of this room', 403);
    }

    let imageUrl = '';

    // Handle image attachments via Cloudinary upload
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'mosma/attachments');
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error(`❌ Cloudinary attachment upload failed: ${uploadError.message}`);
        return errorResponse(res, 'Failed to upload image attachment', 500);
      }
    }

    // Create the message in database
    const message = await Message.create({
      sender: req.user._id,
      room,
      content: content || '',
      type: type || (imageUrl ? 'image' : 'text'),
      imageUrl,
      replyTo: replyTo || null,
      readBy: [req.user._id], // Sender has read their own message
    });

    // Populate sender details for return payload
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar status')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name' }
      });

    // Update last message in ChatRoom
    chatRoom.lastMessage = message._id;
    await chatRoom.save();

    return successResponse(res, populatedMessage, 'Message sent successfully', 201);
  } catch (error) {
    console.error(`❌ SendMessage error: ${error.message}`);
    return errorResponse(res, 'Server Error sending message', 500);
  }
};

/**
 * Get historical messages for a chat room.
 * GET /api/messages/:roomId
 * Private
 */
export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is member of this room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return errorResponse(res, 'Chat room not found', 404);
    }

    if (!chatRoom.members.some((m) => m.toString() === req.user._id.toString())) {
      return errorResponse(res, 'Access denied, you are not a member of this room', 403);
    }

    // Fetch messages sorted newest first (for skip pagination)
    const messages = await Message.find({ room: roomId, isDeleted: false })
      .populate('sender', 'name email avatar status')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Return in chronological order (oldest to newest) for frontend timeline rendering
    const chronologicalMessages = messages.reverse();

    // Calculate total pages for pagination
    const totalMessages = await Message.countDocuments({ room: roomId, isDeleted: false });
    const totalPages = Math.ceil(totalMessages / limit);

    return successResponse(
      res,
      {
        messages: chronologicalMessages,
        totalPages,
        currentPage: page,
      },
      'Messages fetched successfully'
    );
  } catch (error) {
    console.error(`❌ GetRoomMessages error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching messages', 500);
  }
};

/**
 * Mark message as read (add user to readBy array).
 * PUT /api/messages/:id/read
 * Private
 */
export const markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }

    // Add user to readBy if not already present
    if (!message.readBy.includes(req.user._id)) {
      message.readBy.push(req.user._id);
      await message.save();
    }

    return successResponse(res, null, 'Message marked as read');
  } catch (error) {
    console.error(`❌ MarkRead error: ${error.message}`);
    return errorResponse(res, 'Server Error marking message read', 500);
  }
};
