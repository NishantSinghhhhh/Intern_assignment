const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Import the database connection
require('./Models/db');

// Apply CORS middleware
app.use(cors({
  origin: 'https://intern-assignment-frontend.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'], // Add OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/auth', authRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
