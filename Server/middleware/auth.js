// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user id from payload to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};