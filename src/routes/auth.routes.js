const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);
router.get("/user", authMiddleware, authController.getUserInfo);
module.exports = router;
