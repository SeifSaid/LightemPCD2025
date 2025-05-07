const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifySignature } = require('../middleware/auth');

// Register new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', verifySignature, userController.loginUser);

// Get user by address
router.get('/:address', userController.getUser);

// Update user
router.put('/:address', userController.updateUser);

// Update user location
router.put('/:address/location', userController.updateLocation);

// Get user reputation
router.get('/:address/reputation', userController.getReputation);

// Get all users
router.get('/', userController.getAllUsers);

module.exports = router; 