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
    origin: ["https://intern-assignment-frontend-1m0dc94jj.vercel.app/"],
    methods : ["POST", "GET", "PUT", "DELETE"],
    credentials : true
}));

app.use(express.json());
app.use('/auth', authRoutes);

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
