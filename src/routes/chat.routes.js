const express = require("express");
const { sendMessage } = require("../controllers/chat.controller");

const router = express.Router();

// Gửi tin nhắn qua API
router.post("/send", sendMessage);

module.exports = router;
