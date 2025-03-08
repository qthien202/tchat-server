const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  resource_type: { type: String, required: true }, // Ảnh, video, tài liệu, v.v.
});

module.exports = mongoose.model("Media", mediaSchema);
