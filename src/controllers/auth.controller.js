const passport = require("passport");
const { generateToken } = require("../utils/jwt");

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// exports.googleAuthCallback = (req, res, next) => {
//   passport.authenticate(
//     "google",
//     { failureRedirect: "/login" },
//     (err, data) => {
//       if (err || !data)
//         return res.status(401).json({ message: "Google login failed" });

//       const { user } = data;
//       const token = generateToken(user); // Tạo JWT token

//       res.json({
//         userId: user._id,
//         name: user.name,
//         email: user.email,
//         picture: user.picture,
//         accessToken: token, // Trả về JWT
//       });
//     }
//   )(req, res, next);
// };

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err || !user)
        return res.redirect("http://localhost:3001/auth_failed");

      const token = generateToken(user); // Tạo JWT token

      // Redirect về Flutter với token trong URL
      res.redirect(`http://localhost:3001/auth_success?token=${token}`);
    }
  )(req, res, next);
};

const User = require("../models/User");

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Lấy ID từ middleware
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
