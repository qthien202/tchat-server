const { model } = require("mongoose");
const user = require("../models/user.model");

const searchUser = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await user
      .find({
        $or: [
          { name: new RegExp(query, "i") },
          { email: new RegExp(query, "i") },
        ],
      })
      .select("name email picture");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi tìm kiếm người dùng" });
  }
};

const getFriends = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await user
      .findById(userId)
      .populate("friends", "name email picture");
    if (!user)
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy danh sách bạn bè" });
  }
};
module.exports = { searchUser, getFriends };
