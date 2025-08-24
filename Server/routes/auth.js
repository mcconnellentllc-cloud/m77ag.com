<<<<<<< HEAD
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
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
      password, // Password will be hashed by the pre-save middleware in User model
      phone
    });
    
    // Generate JWT token
    const token = await user.generateAuthToken();
    
    // Save user to database
    await user.save();
    
    // Return user (excluding password) and token
    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = await user.generateAuthToken();
    
    // Return user (excluding password) and token
    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user / remove token
 * @access  Private
 */
router.post('/logout', auth, async (req, res) => {
  try {
    // Remove current token from user's tokens array
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    
    await req.user.save();
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post('/logout-all', auth, async (req, res) => {
  try {
    // Clear all tokens
    req.user.tokens = [];
    
    await req.user.save();
    
    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

/**
 * @route   PUT /api/auth/me
 * @desc    Update user profile
 * @access  Private
 */
router.put('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'phone'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }
  
  try {
    // Update user fields
    updates.forEach(update => req.user[update] = req.body[update]);
    
    await req.user.save();
    
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/admin-login
 * @desc    Admin login with secure credentials
 * @access  Public
 */
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    // Generate JWT token
    const token = await user.generateAuthToken();
    
    // Return admin user and token
    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
=======
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
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
      password, // Password will be hashed by the pre-save middleware in User model
      phone
    });
    
    // Generate JWT token
    const token = await user.generateAuthToken();
    
    // Save user to database
    await user.save();
    
    // Return user (excluding password) and token
    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = await user.generateAuthToken();
    
    // Return user (excluding password) and token
    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user / remove token
 * @access  Private
 */
router.post('/logout', auth, async (req, res) => {
  try {
    // Remove current token from user's tokens array
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    
    await req.user.save();
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post('/logout-all', auth, async (req, res) => {
  try {
    // Clear all tokens
    req.user.tokens = [];
    
    await req.user.save();
    
    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

/**
 * @route   PUT /api/auth/me
 * @desc    Update user profile
 * @access  Private
 */
router.put('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'phone'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }
  
  try {
    // Update user fields
    updates.forEach(update => req.user[update] = req.body[update]);
    
    await req.user.save();
    
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   POST /api/auth/admin-login
 * @desc    Admin login with secure credentials
 * @access  Public
 */
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    // Generate JWT token
    const token = await user.generateAuthToken();
    
    // Return admin user and token
    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
>>>>>>> 10490b0f01f649cdb35d46571afe1dde14507755
