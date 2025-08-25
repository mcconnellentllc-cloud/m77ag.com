$serverContent = @"
// Server Configuration
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Import routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Create admin user if doesn't exist
const User = require('./models/User');

async function createAdminUser() {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@m77ag.com' });
    
    if (!adminExists) {
      // Create salt & hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('M77admin2024!', salt);
      
      // Create admin user
      const newAdmin = new User({
        name: 'M77 Administrator',
        email: 'admin@m77ag.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('Admin user created successfully');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
}

// Call the function to create admin user
createAdminUser();

// Serve static assets
app.use(express.static(path.join(__dirname, '../docs')));

// For any route not matching API routes, serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../docs', 'index.html'));
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
"@

Set-Content -Path "server\server.js" -Value $serverContent