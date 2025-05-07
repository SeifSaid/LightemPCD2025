const jwt = require('jsonwebtoken');
const { web3 } = require('../config/web3');
const User = require('../models/User');

// Middleware to verify Web3 wallet signature
const verifySignature = async (req, res, next) => {
    try {
        const { address, signature, message } = req.headers;

        if (!address || !signature || !message) {
            return res.status(401).json({ message: 'Missing authentication parameters' });
        }

        // Verify the signature
        const recoveredAddress = web3.eth.accounts.recover(message, signature);
        
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        // Check if user exists
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

        // Add user and token to request
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findOne({ address: decoded.address });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

module.exports = {
    verifySignature,
    auth
}; 