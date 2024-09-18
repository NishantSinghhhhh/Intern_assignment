const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.MONGO_CONN;

const db1 = mongoose.createConnection(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Listen for connection events
db1.once('open', () => {
    console.log('Connected to MongoDB successfully');
});

db1.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err.message);
});

db1.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
});

module.exports = { db1 };
