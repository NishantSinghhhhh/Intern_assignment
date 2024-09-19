const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {db1} = require('./db')

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true // Remove leading/trailing whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate emails
    lowercase: true, // Store email in lowercase for case-insensitive queries
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    
  },
 
}, {
  timestamps: true 
});

const User = db1.model('User', UserSchema);
module.exports = {User};