const express = require("express");
const multer = require("multer");
const mediaController = require("../controllers/media.controller");

const router = express.Router();

// Cấu hình multer để xử lý file
const storage = multer.memoryStorage(); // Sử dụng memoryStorage để lưu file vào bộ nhớ tạm
const upload = multer({ storage: storage });

// Route để upload media (bao gồm ảnh, video, tài liệu)
router.post("/upload", upload.single("media"), mediaController.uploadMedia);

module.exports = router;
