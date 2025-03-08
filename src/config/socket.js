const { Server } = require("socket.io");
const Message = require("../models/message");

let io;
const users = {}; // Lưu danh sách user online

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // User tham gia vào socket
    socket.on("join", (userId) => {
      users[userId] = socket.id; // Lưu user với socketId mới nhất
      console.log(`📌 User ${userId} đã online với socket ${socket.id}`);
    });

    // Nhận tin nhắn từ client
    socket.on(
      "sendMessage",
      async ({ senderId, receiverId, message, mediaUrls }) => {
        console.log(`📨 Tin nhắn từ ${senderId} -> ${receiverId}: ${message}`);

        // Lưu tin nhắn vào MongoDB
        const newMessage = new Message({
          senderId,
          receiverId,
          message,
          mediaUrls,
        });
        await newMessage.save();

        // Gửi tin nhắn đến người nhận nếu họ đang online
        const receiverSocketId = users[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", newMessage);
        }
      }
    );

    // Xử lý khi user ngắt kết nối
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) delete users[userId]; // Xóa user khỏi danh sách online
    });
  });
};

module.exports = { initSocket, getIo: () => io };
