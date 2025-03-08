const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);

module.exports = router;
