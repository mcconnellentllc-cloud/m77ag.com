$apiRoutesContent = @"
const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/test
// @desc    Test API route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// @route   GET /api/protected
// @desc    Protected route example
// @access  Private
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// @route   GET /api/admin
// @desc    Admin only route example
// @access  Admin
router.get('/admin', auth, adminOnly, (req, res) => {
  res.json({ message: 'This is an admin only route', user: req.user });
});

module.exports = router;
"@

Set-Content -Path "server\routes\api.js" -Value $apiRoutesContent