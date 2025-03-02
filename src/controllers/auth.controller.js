const verifyGoogleToken = require("../config/googleAuth");
const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

async function googleAuth(req, res) {
  const { idToken } = req.body;
  const googleUser = await verifyGoogleToken(idToken);

  if (!googleUser)
    return res.status(401).json({ message: "Invalid Google token" });
  let user = await User.findOne({ googleId: googleUser.sub });
  if (!user) {
    user = new User({
      googleId: googleUser.sub,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
    });
    await user.save();
  }
  const token = generateToken(user);
  res.json({
    userId: user.sub,
    name: user.name,
    email: user.email,
    picture: user.picture,
    accessToken: token,
  });
}

module.exports = { googleAuth };
