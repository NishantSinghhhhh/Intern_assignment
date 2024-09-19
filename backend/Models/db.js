const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.MONGO_CONN;

const db1 = mongoose.createConnection(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
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

// Reconnect when the connection is lost
db1.on('reconnectFailed', () => {
    console.error('Reconnection failed. Attempting to reconnect...');
    // Optionally, you could implement a reconnection strategy here
});

// Handle process termination
process.on('SIGINT', async () => {
    await db1.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = { db1 };
