const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { db2 } = require('./db');

// Define the Todo schema
const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
    trim: true // Remove leading/trailing whitespace
  },
  description: {
    type: String,
    maxlength: 500, // Optional, with a maximum length
    trim: true // Remove leading/trailing whitespace
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'], // Restrict to these values
    default: 'To Do', // Default status if not provided
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Restrict to these values
    default: 'Low', // Default priority if not provided
    required: true
  },
  dueDate: {
    type: Date, // Store the date in ISO format
    required: false, // Not required, can be left empty
  },
  user: {
    type: Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', // Establish relationship with User schema
    required: true // Every task must be associated with a user
  }
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

// Create and export the Todo model
const Todo = db2.model('Todo', TodoSchema);
module.exports = { Todo };
