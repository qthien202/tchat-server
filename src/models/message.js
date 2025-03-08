const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    mediaUrls: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "messages" }
);

module.exports = mongoose.model("Message", messageSchema);
