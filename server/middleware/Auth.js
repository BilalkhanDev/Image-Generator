// authMiddleware.js

const jwt = require("jsonwebtoken");
const SECRET_KEY = 'your-secret-key'; // Replace this with a secure random string

const Auth=(req, res, next)=> {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId;
    console.log(decoded.userId) // Add the user ID to the request object for future use
    next();
  });
}

module.exports = Auth;
