const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Import the dotenv module
const app = express();
const authRoutes = require('./Routes/authRoutes');

dotenv.config();

const PORT = process.env.PORT || 8080;

// Import the database connection
require('./Models/db');

// Middleware to parse JSON and URL-encoded data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(cors({
    origin: 'https://intern-assignment-trl3.vercel.app', // Allow only this origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Add appropriate HTTP methods
    credentials : true
}));

// Routes
app.use('/auth', authRoutes);

// Simple route for testing
app.get('/', (req, res) => {
    res.json("PONG");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
