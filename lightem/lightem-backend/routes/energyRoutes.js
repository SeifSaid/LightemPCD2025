const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energyController');
const { auth } = require('../middleware/auth');

// Mint new energy tokens
router.post('/mint', auth, async (req, res) => {
    try {
        await energyController.mintEnergy(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error minting energy', error: error.message });
    }
});

// Get all energy batches
router.get('/batches', async (req, res) => {
    try {
        await energyController.getEnergyBatches(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting energy batches', error: error.message });
    }
});

// Get energy batches by producer
router.get('/batches/:address', async (req, res) => {
    try {
        await energyController.getProducerBatches(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting producer batches', error: error.message });
    }
});

// Get price history
router.get('/price-history', async (req, res) => {
    try {
        await energyController.getPriceHistory(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting price history', error: error.message });
    }
});

// Get average price
router.get('/average-price', async (req, res) => {
    try {
        await energyController.getAveragePrice(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error getting average price', error: error.message });
    }
});

module.exports = router; 