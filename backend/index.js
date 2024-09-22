const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Import the dotenv module
const app = express();
const authRoutes = require('./Routes/authRoutes');

dotenv.config();

const PORT = process.env.PORT || 8080;

// Import the database connection
require('./Models/db');

app.use(cors({
    origin: 'https://intern-assignment-trl3.vercel.app', // Allow only this origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Add appropriate HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow necessary headers
    credentials : true
}))
app.use(express.json());
app.use('/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
