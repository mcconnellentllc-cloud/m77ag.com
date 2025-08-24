// Add debugging information
console.log('Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 3000);

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create Admin User function
const createAdminUser = async () => {
  try {
    // Check if we have a User model, if not we'll create a simple one
    let User;
    try {
      User = mongoose.model('User');
    } catch (error) {
      // Define a simple User schema if it doesn't exist
      const userSchema = new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, default: 'Admin' },
        role: { type: String, default: 'admin' },
        createdAt: { type: Date, default: Date.now }
      });
      
      User = mongoose.model('User', userSchema);
    }
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@m77ag.com' });
    
    if (!adminExists) {
      // Create admin user
      const adminUser = new User({
        email: 'admin@m77ag.com',
        password: 'M77admin2024!', // In production, you'd want to hash this
        name: 'Admin',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/m77ag', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    createAdminUser(); // Create admin user after connection
})
.catch(err => console.error('MongoDB connection error:', err));

// Test route to verify API is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Serve static files from the docs directory
app.use(express.static(path.join(__dirname, '../docs')));

// Handle SPA routing, return all requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../docs', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});