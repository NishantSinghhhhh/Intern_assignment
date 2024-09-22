const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Import the dotenv module
const app = express();
const authRoutes = require('./Routes/authRoutes');

dotenv.config();

const PORT = process.env.PORT || 8080;

// Import the database connection
require('./Models/db');


app.use(express.json());
app.use('/auth', authRoutes);
app.use(cors());

app.use(cors({
    origin: 'https://intern-assignment-trl3.vercel.app', // Allow only this origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Add appropriate HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow necessary headers
    credentials : true
}))

app.get('/', (req, res) => {
    res.json("PONG");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});





app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
