require("dotenv").config();
require("./src/config/passport");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

const { initSocket } = require("./src/config/socket");
const authRoutes = require("./src/routes/auth.routes");
const chatRoutes = require("./src/routes/chat.routes");
const mediaRoutes = require("./src/routes/media.routes");
const userRoutes = require("./src/routes/user.routes");
const friendRoutes = require("./src/routes/friend.routes");

const app = express();
const server = http.createServer(app); // Server chạy cả API và WebSocket

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.static("public"));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friend", friendRoutes);

// Khởi tạo WebSocket
initSocket(server);

// Khởi động server
const PORT = process.env.PORT || 443;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
