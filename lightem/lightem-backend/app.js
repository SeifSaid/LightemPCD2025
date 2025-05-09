const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Lightem API is running!' });
});

// MongoDB Connection with enhanced logging
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/lightem', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📦 Database: ${conn.connection.name}`);
        console.log(`🔌 Host: ${conn.connection.host}`);
        console.log(`🔑 Port: ${conn.connection.port}`);
        
        // List all collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('📚 Available Collections:');
        collections.forEach(collection => {
            console.log(`   - ${collection.name}`);
        });

        // Enable mongoose debug mode
        mongoose.set('debug', true);
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // Exit if cannot connect to database
    }
};

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

module.exports = app; 