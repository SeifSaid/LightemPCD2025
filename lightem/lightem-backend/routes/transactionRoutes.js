const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth } = require('../middleware/auth');

// Get all transactions
router.get('/', auth, async (req, res) => {
    try {
        await transactionController.getAllTransactions(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting transactions', error: error.message });
    }
});

// Get transactions by user
router.get('/user/:address', auth, async (req, res) => {
    try {
        await transactionController.getUserTransactions(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting user transactions', error: error.message });
    }
});

// Get transaction by ID
router.get('/:transactionId', auth, async (req, res) => {
    try {
        await transactionController.getTransaction(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting transaction', error: error.message });
    }
});

// Get transaction by hash
router.get('/hash/:hash', auth, async (req, res) => {
    try {
        await transactionController.getTransactionByHash(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting transaction by hash', error: error.message });
    }
});

// Get transaction statistics
router.get('/stats/overview', auth, async (req, res) => {
    try {
        await transactionController.getTransactionStats(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting transaction stats', error: error.message });
    }
});

module.exports = router; 