const passport = require("passport");
const { generateToken } = require("../utils/jwt");
const User = require("../models/user.model");
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
      console.log("> user", user);
      if (err || !user)
        return res.redirect("http://localhost:3001/auth_failed");

      const { token } = user; // 🟢 Lấy token từ passport.use
      console.log("TokenUrl:", token);

      // Redirect về Flutter với token trong URL
      res.redirect(`http://localhost:3001/auth_success?token=${token}`);
    }
  )(req, res, next);
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Lấy ID từ middleware
    console.log("User info:", req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Login successfully",
      data: {
        userId: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
