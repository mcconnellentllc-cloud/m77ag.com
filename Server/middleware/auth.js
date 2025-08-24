const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token from request headers and attaches user to request object
 */
const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with correct ID and token
    const user = await User.findOne({ 
      _id: decoded._id, 
      'tokens.token': token 
    });

    if (!user) {
      throw new Error();
    }

    // Attach token and user to request object
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

/**
 * Admin authorization middleware
 * Checks if authenticated user has admin role
 * Must be used after auth middleware
 */
const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

<<<<<<< HEAD
module.exports = { auth, adminOnly };
=======
module.exports = { auth, adminOnly };
>>>>>>> 10490b0f01f649cdb35d46571afe1dde14507755
