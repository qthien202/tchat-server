const { getIo, users } = require("../config/socket"); // Import users từ socket
const Message = require("../models/message");

const sendMessage = async (req, res) => {
  const { senderId, receiverId, message, mediaUrls } = req.body;

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      mediaUrls,
    });
    await newMessage.save();

    // Gửi tin nhắn qua WebSocket nếu receiver đang online
    const io = getIo(); // Lấy io từ socket module
    const receiverSocketId = users[receiverId]; // Lấy socketId của người nhận
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Lỗi gửi tin nhắn" });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const userId = req.user.id; //decoded token
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 });
    const conversations = new Map();
    messages.forEach((msg) => {
      const friend =
        msg.senderId._id.toString() === userId ? msg.receiverId : msg.senderId;
      const friendId = friend._id.toString();
      if (!conversations.has(friendId)) {
        conversations.set(friendId, {
          friend,
          lastMessage: msg,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy tin nhắn" });
  }
};
const getConversation = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy tin nhắn" });
  }
};
module.exports = { sendMessage, getAllConversations, getConversation };
