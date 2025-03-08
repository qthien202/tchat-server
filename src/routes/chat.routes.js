const express = require("express");
const { sendMessage } = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// Gửi tin nhắn qua API
router.post("/send", authMiddleware, sendMessage);

module.exports = router;
