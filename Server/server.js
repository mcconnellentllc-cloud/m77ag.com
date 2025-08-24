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
