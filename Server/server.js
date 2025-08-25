// server.js - Main server file for M77 AG website

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Define port (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import route files
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the 'docs' directory
app.use(express.static(path.join(__dirname, '../docs')));

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const User = require('./models/User');
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Create new admin user
      const adminUser = new User({
        name: 'M77 Administrator',
        email: 'admin@m77ag.com',
        password: 'M77admin2024!', // This will be hashed by the pre-save hook
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

// Function to create necessary database collections and indexes
const initializeDatabase = async () => {
  try {
    // Initialize database collections here if needed
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Handle all other routes by serving index.html (for SPA routing)
app.get('*', (req, res) => {
  // Check if request is for an admin page
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '../docs/admin/index.html'));
  } 
  // Check if request is for an account page
  else if (req.path.startsWith('/account')) {
    res.sendFile(path.join(__dirname, '../docs/account/index.html'));
  }
  // Otherwise serve the main index page
  else {
    res.sendFile(path.join(__dirname, '../docs/index.html'));
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize database and create admin user
  await initializeDatabase();
  await createAdminUser();
  
  console.log(`M77 AG server is ready! Visit: http://localhost:${PORT}`);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});