const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UserRegistry, web3 } = require('../config/web3');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { address, name, latitude, longitude, isProducer } = req.body;
        console.log('📝 Registering user:', { address, name, latitude, longitude, isProducer });

        // Check if user already exists
        let user = await User.findOne({ address: address.toLowerCase() });
        console.log('🔍 Existing user check:', user);
        
        if (user) {
            return res.status(400).json({ message: 'User already registered' });
        }

        // Create user in MongoDB only (for demo)
        user = new User({
            address: address.toLowerCase(),
            name,
            latitude,
            longitude,
            isProducer,
            reputation: 0
        });

        console.log('💾 Saving new user:', user);
        await user.save();
        console.log('✅ User saved successfully');

        // Generate JWT token
        const token = jwt.sign(
            { address: user.address },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        const { registerUserOnChain } = require('../services/blockchainUserService');
        await registerUserOnChain({ address, name, latitude, longitude, isProducer });

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    } catch (error) {
        console.error('❌ Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findOne({ address: address.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'User not registered' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { address: user.address },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get user by address
exports.getUser = async (req, res) => {
    try {
        const { address } = req.params;
        console.log('🔍 Getting user by address:', address);
        
        const user = await User.findOne({ address: address.toLowerCase() });
        console.log('✅ Found user:', user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('❌ Error getting user:', error);
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
};

// Update user location
exports.updateLocation = async (req, res) => {
    try {
        const { address } = req.params;
        const { latitude, longitude } = req.body;

        // Update location in MongoDB
        const user = await User.findOneAndUpdate(
            { address: address.toLowerCase() },
            { latitude, longitude },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Location updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Error updating location', error: error.message });
    }
};

// Get user reputation
exports.getReputation = async (req, res) => {
    try {
        const { address } = req.params;
        const userRegistry = await UserRegistry.deployed();
        
        const user = await userRegistry.getUser(address);
        const reputation = user.reputation;

        res.json({ reputation });
    } catch (error) {
        console.error('Error getting reputation:', error);
        res.status(500).json({ message: 'Error getting reputation', error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        console.log('📋 Getting all users');
        const users = await User.find();
        console.log('✅ Found users:', users);
        res.json(users);
    } catch (error) {
        console.error('❌ Error getting users:', error);
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { address } = req.params;
        const updates = req.body;

        const user = await User.findOneAndUpdate(
            { address: address.toLowerCase() },
            updates,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}; 