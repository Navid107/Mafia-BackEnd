const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.ACCESS_TOKEN_SECRET;


exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.accessToken;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh token is invalid' });
    }
    
    // You can use the decoded user information here if needed
    const user = decoded;

    // Generate a new access token if needed
    const newAccessToken = jwt.sign(user, secretKey, { expiresIn: '15m' });

    // Return the protected resource
    res.json({ message: 'Authenticated User Profile', user, accessToken: newAccessToken });
  });
}


