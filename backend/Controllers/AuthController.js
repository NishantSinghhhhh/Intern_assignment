const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../Models/User'); // Adjust path as necessary
const { Todo } = require("../Models/Task");
const mongoose = require('mongoose');

// Inside AuthController.js

const updateTodo = async (req, res) => {
  const { id } = req.params; // Get todo ID from the request parameters
  const updatedData = req.body; // Get updated data from the request body

  try {
    // Assuming you have a Todo model and a method to find and update a todo
    const updatedTodo = await Todo.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error: error.message });
  }
};


const fetchTasksByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request parameters
    console.log('Fetching tasks for user ID:', userId);

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch tasks for the user using the correct field
    const tasks = await Todo.find({ user: userId }).exec();
    console.log('Fetched tasks:', tasks);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message,
    });
  }
};


const addTodo = async (req, res) => {
  try {
    // Log the request body
    console.log('Request body:', req.body);

    const { title, description, status, priority, dueDate, userId } = req.body;

    // Validate that all necessary fields are provided
    if (!title || !status || !priority || !userId) {
      return res.status(400).json({
        message: 'Title, status, priority, and user ID are required',
        success: false,
      });
    }

    // Create a new todo instance
    const todo = new Todo({
      title,
      description, // Optional, can be left empty
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null, // Ensure dueDate is a valid date or null
      user: userId, // Reference to the user
    });

    console.log('Todo object before saving:', todo);

    // Save the new todo to the database
    const savedTodo = await todo.save();

    console.log('Saved todo:', savedTodo);

    res.status(201).json({
      message: 'Todo added successfully',
      success: true,
      todo: savedTodo, // Optionally, return the saved todo
    });
  } catch (err) {
    console.error('Error during adding todo:', err.stack);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message,
    });
  }
};



const signIn = async (req, res) => {
  console.log('SignIn function triggered'); // Log function entry

  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      console.log('Email or password not provided'); // Log missing fields
      return res.status(400).json({
        message: "Email and password are required",
        success: false
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? user.email : 'No user found'); // Log user search result

    if (!user) {
      console.log('Authentication failed: user not found'); // Log authentication failure
      return res.status(403).json({
        message: "Authentication failed, email or password is wrong",
        success: false
      });
    }

    // Compare provided password with stored hashed password
    const isPassEqual = await bcrypt.compare(password, user.password);
    console.log('Password match status:', isPassEqual); // Log password comparison result

    if (!isPassEqual) {
      console.log('Authentication failed: password mismatch'); // Log authentication failure
      return res.status(403).json({
        message: "Authentication failed, email or password is wrong",
        success: false
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT token generated:', jwtToken); // Log token generation

    // Send success response
   // Send success response
res.status(200).json({
  message: "Login successful",
  success: true,
  jwtToken,
  email,
  name: user.name,
  userId: user._id // Ensure this is being sent
});

    

  } catch (err) {
    console.error('Login error:', err); // Log the error for debugging
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

const signup = async (req, res) => {
    try {
        // Log the request body
        console.log('Request body:', req.body);

        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        console.log('Existing user:', existingUser);

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists',
                success: false,
            });
        }

        // Create a new user instance
        const user = new User({
            name,
            email,
            password, // Will be hashed before saving
        });

        console.log('User object before hashing:', user);

        // Hash the password
        user.password = await bcrypt.hash(password, 10);

        console.log('User object after hashing:', user);

        // Save the new user to the database
        const savedUser = await user.save();

        console.log('Saved user:', savedUser);

        res.status(201).json({
            message: 'SignUp Successful',
            success: true,
        });
    } catch (err) {
        console.error('Error during signup:', err.stack);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message,
        });
    }
};

module.exports = { signup, signIn, addTodo, fetchTasksByUserId, updateTodo};
