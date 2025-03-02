const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Lấy từ Google Developer Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Lưu thông tin user vào authInfo
      const user = {
        uuid: profile.id,
        name: profile.displayName,
        avatar: profile.photos[0].value,
        email: profile.emails[0].value,
      };

      // Trả về user + accessToken
      return done(null, user, { token: accessToken });
    }
  )
);

// Serialize & Deserialize (Lưu user vào session nếu cần)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
