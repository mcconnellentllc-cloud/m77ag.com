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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Route imports (uncomment when files are created)
// const authRoutes = require('./routes/auth');
// const apiRoutes = require('./routes/api');
// const adminRoutes = require('./routes/admin');

// Use routes (uncomment when files are created)
// app.use('/api/auth', authRoutes);
// app.use('/api', apiRoutes);
// app.use('/api/admin', adminRoutes);

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
// This is not a complete server.js file, but rather the sections to add to your existing server.js

// Add these near the top of your server.js, after other imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import route files
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', publicRoutes);

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

// Call this function after MongoDB connection is established
createAdminUser();
