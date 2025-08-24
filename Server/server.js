const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import User model (create this file first)
const User = require('./models/User');

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    // Create default users after successful connection
    createAdminUser();
    createDemoUser();
})
.catch(err => console.error('MongoDB connection error:', err));

// Create default admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Create demo user if it doesn't exist
const createDemoUser = async () => {
  try {
    const demoExists = await User.findOne({ email: 'demo@m77ag.com' });
    
    if (!demoExists) {
      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@m77ag.com',
        password: 'password123', // This will be hashed by the pre-save middleware
        role: 'user'
      });
      
      await demoUser.save();
      console.log('Demo user created');
    }
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
};

// Import route files (uncomment when files are created)
// const authRoutes = require('./routes/auth');
// const apiRoutes = require('./routes/api');
// const adminRoutes = require('./routes/admin');
// const publicRoutes = require('./routes/public');

// Use routes (uncomment when files are created)
// app.use('/api/auth', authRoutes);
// app.use('/api', apiRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/', publicRoutes);

// Test route to verify API is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle SPA routing, return all requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
