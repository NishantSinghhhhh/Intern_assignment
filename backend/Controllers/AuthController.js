const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../Models/User'); // Adjust path as necessary
const { Todo } = require("../Models/Task");
const mongoose = require('mongoose');

const updateStatus = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters
  const { status } = req.body; // Get the status from the request body

  console.log('Updating Todo Status:', { id, status });

  try {
    // Use the ID to find and update the status in the database
    const updatedTodo = await Todo.findByIdAndUpdate(
      id, // Use the ID from the parameters
      { status }, // Update the status field
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      console.log('Todo not found for ID:', id);
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log('Todo status updated successfully:', updatedTodo);
    res.status(200).json({ message: 'Todo status updated successfully', todo: updatedTodo });
  } catch (error) {
    console.error('Error updating todo status:', error);
    res.status(500).json({ message: 'Error updating todo status', error: error.message });
  }
};



const deleteTodo = async (req, res) => {
  const todoData = req.body; // Get the todo data from request body
  const { _id } = todoData; // Extract the _id from the data

  console.log('Received request to delete Todo with data:', todoData);

  try {
    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      console.error('Invalid todo ID format:', _id);
      return res.status(400).json({ message: 'Invalid todo ID' });
    }

    console.log('Valid Todo ID format. Proceeding to find and delete...');

    // Find and delete the todo
    const deletedTodo = await Todo.findByIdAndDelete(_id);

    if (!deletedTodo) {
      console.error('Todo not found for ID:', _id);
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log('Todo deleted successfully:', deletedTodo);
    res.status(200).json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
};


const updateTodo = async (req, res) => {
  const updatedData = req.body;

  console.log('Updating Todo:', { updatedData });

  try {
    // Use _id to find and update the todo in the database
    const updatedTodo = await Todo.findByIdAndUpdate(
      updatedData._id, // Use the _id from the updatedData
      updatedData,
      { new: true }
    );

    if (!updatedTodo) {
      console.log('Todo not found for ID:', updatedData._id);
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log('Todo updated successfully:', updatedTodo);
    res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
  } catch (error) {
    console.error('Error updating todo:', error);
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
  console.log('SignIn function triggered'); 

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Email or password not provided'); 
      return res.status(400).json({
        message: "Email and password are required",
        success: false
      });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? user.email : 'No user found'); // Log user search result

    if (!user) {
      console.log('Authentication failed: user not found'); 
      return res.status(403).json({
        message: "Authentication failed, email or password is wrong",
        success: false
      });
    }

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
    console.log('JWT token generated:', jwtToken); 

res.status(200).json({
  message: "Login successful",
  success: true,
  jwtToken,
  email,
  name: user.name,
  userId: user._id 
});

    

  } catch (err) {
    console.error('Login error:', err); 
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

const signup = async (req, res) => {
    try {
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

        const user = new User({
            name,
            email,
            password,
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

module.exports = { signup, signIn, addTodo, fetchTasksByUserId, updateTodo, deleteTodo, updateStatus};
