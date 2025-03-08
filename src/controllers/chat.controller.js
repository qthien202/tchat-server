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

module.exports = { sendMessage };
