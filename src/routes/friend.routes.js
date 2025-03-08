const express = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
} = require("../controllers/friend.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
router.post("/send", authMiddleware, sendFriendRequest);
router.post("/accept", authMiddleware, acceptFriendRequest);
module.exports = router;
