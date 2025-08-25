$authRoutesContent = @"
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone
    });

    // Save user to database
    await user.save();

    // Generate authentication token
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by credentials
    const user = await User.findByCredentials(email, password);
    
    // Generate new auth token
    const token = await user.generateAuthToken();

    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Invalid login credentials' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (current device)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // Remove current token from tokens array
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/user
// @desc    Get current user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
"@

Set-Content -Path "server\routes\auth.js" -Value $authRoutesContent