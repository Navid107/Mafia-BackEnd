const jwt = require('jsonwebtoken');
require('dotenv').config();
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;

exports.refreshToken = (req, res) => {
  // Retrieve the "jwt" cookie
  const jwtToken = req.cookies.refreshToken;
  if (!jwtToken) {
    return res.status(401).json({ message: 'JWT token not found' });
  }

  // Verify the JWT token using the refresh token secret key
  jwt.verify(jwtToken, refreshSecretKey, (err, decoded) => {
    console.log("refresh token line 15","decoded", decoded, "err", err);
    if (err) {
      return res.status(403).json({ message: 'JWT token is invalid' });
    }

    // You can use the decoded user information here if needed
    console.log(decoded);
    const user = decoded;

    // Generate a new access token if needed (using the access token secret key)
    const newAccessToken = jwt.sign(user, accessSecretKey);

    // Return the protected resource
    res.json({ message: 'Authenticated User Profile', user, accessToken: newAccessToken });
  });
};
