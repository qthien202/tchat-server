const express = require("express");
const {
  sendMessage,
  getAlConversations,
  getConversation,
  getAllConversations,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// Gửi tin nhắn qua API
router.post("/send", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getAllConversations);
router.get("/conversation/:friendId", authMiddleware, getConversation);

module.exports = router;
