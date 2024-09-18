const bcrypt = require('bcrypt');
const User = require('../Models/User'); // Adjust path as necessary

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
    await user.save();

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

module.exports = { signup };
