const friendRequest = require("../models/friend.request.model");
const user = require("../models/user.model");

const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (senderId === receiverId)
      return res.status(400).json({ error: "Không thể tự kết bạn" });
    const existingRequest = await friendRequest.findOne({
      senderId,
      receiverId,
    });
    if (existingRequest)
      return res.status(400).json({ error: "Đã gửi lời mời kết bạn" });
    const request = new friendRequest({ senderId, receiverId });
    await request.save();
    res.status(200).json({ message: "Đã gửi yêu cầu kết bạn thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi gửi yêu cầu kết bạn" });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await friendRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ error: "Không tìm thấy yêu cầu kết bạn" });
    request.status = "accepted";
    request.save();
    await user.findByIdAndUpdate(senderId, { $push: { friends: receiverId } });
    await user.findByIdAndUpdate(receiverId, { $push: { friends: senderId } });
    // await request.remove();
    res.status(200).json({ message: "Đã chấp nhận yêu cầu kết bạn" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi chấp nhận yêu cầu kết bạn" });
  }
};

module.exports = { sendFriendRequest, acceptFriendRequest };
