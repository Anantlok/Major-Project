const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
    // 🛑 NEW FIELD: Add the role definition
    role: {
        type: String,
        enum: ['user', 'admin'], // Restricts values to 'user' or 'admin'
        default: 'user' // Every new user starts as a regular user
    }

});

// ✅ SAFE MODEL CREATION
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
