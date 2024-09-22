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
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
