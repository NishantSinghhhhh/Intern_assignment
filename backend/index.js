const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Import the dotenv module
const app = express();
const authRoutes = require('./Routes/authRoutes');

dotenv.config();

const PORT = process.env.PORT || 8080;

// Import the database connection
require('./Models/db');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
