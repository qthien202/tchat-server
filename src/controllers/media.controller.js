const cloudinary = require("../config/cloudinary");
const Media = require("../models/media.model"); // Model để lưu thông tin media nếu cần

// Xử lý upload media lên Cloudinary (Ảnh, Video, Tài liệu...)
exports.uploadMedia = async (req, res) => {
  try {
    // Kiểm tra nếu file có được upload
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Dựa trên loại media, Cloudinary sẽ xử lý tự động
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto" }, // Tự động xử lý ảnh, video, tài liệu, v.v.
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Failed to upload media" });
          }

          // Lưu thông tin media vào cơ sở dữ liệu (nếu bạn cần)
          const media = new Media({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type, // Loại file (ảnh, video, tài liệu)
          });
          await media.save();

          // Trả về URL của media đã upload
          res.status(200).json({
            message: "Media uploaded successfully",
            mediaUrl: result.secure_url,
            resource_type: result.resource_type, // Loại media (image, video, raw)
          });
        }
      )
      .end(req.file.buffer); // Upload buffer từ Multer
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
