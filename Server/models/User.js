const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hide private data when converting to JSON
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  
  // Remove sensitive information
  delete userObject.password;
  delete userObject.tokens;
  
  return userObject;
};

// Generate auth token
UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  
  // Create JWT token with user ID
  const token = jwt.sign(
    { _id: user._id.toString() }, 
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Add token to user's tokens array
  user.tokens = user.tokens.concat({ token });
  await user.save();
  
  return token;
};

// Find user by credentials
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }
  
  return user;
};

// Hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this;
  
  // Only hash password if it's modified
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
