// server/middleware/adminOnly.js
module.exports = (req, res, next) => {
  // Check if user has admin role
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  
  next();
};