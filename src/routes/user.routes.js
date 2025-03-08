const express = require("express");
const { searchUser, getFriends } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
router.get("/search", authMiddleware, searchUser);
router.get("/friends", authMiddleware, getFriends);
module.exports = router;
