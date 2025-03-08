const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // ID ứng dụng Google của bạn
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Google token verification failed:", error);
    return null;
  }
}

module.exports = verifyGoogleToken;
