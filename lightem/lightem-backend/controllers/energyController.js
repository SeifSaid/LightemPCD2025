const EnergyBatch = require('../models/EnergyBatch');
const { EnergyToken, web3 } = require('../config/web3');

// Mint new energy tokens
exports.mintEnergy = async (req, res) => {
    try {
        const { address, amount, price } = req.body;

        // Mint tokens in smart contract
        const energyToken = await EnergyToken.deployed();
        await energyToken.mint(
            amount,
            price,
            { from: address }
        );

        // Get the latest batch
        const totalBatches = await energyToken.getTotalBatches();
        const batchId = totalBatches - 1;
        const batch = await energyToken.getBatch(batchId);

        // Create energy batch in MongoDB
        const energyBatch = new EnergyBatch({
            producer: address.toLowerCase(),
            amount,
            latitude: batch.latitude,
            longitude: batch.longitude,
            price,
            timestamp: new Date(batch.timestamp * 1000)
        });

        await energyBatch.save();

        res.status(201).json({
            message: 'Energy tokens minted successfully',
            energyBatch
        });
    } catch (error) {
        console.error('Error minting energy:', error);
        res.status(500).json({ message: 'Error minting energy', error: error.message });
    }
};

// Get all energy batches
exports.getEnergyBatches = async (req, res) => {
    try {
        const batches = await EnergyBatch.find({ isActive: true });
        res.json(batches);
    } catch (error) {
        console.error('Error getting energy batches:', error);
        res.status(500).json({ message: 'Error getting energy batches', error: error.message });
    }
};

// Get energy batches by producer
exports.getProducerBatches = async (req, res) => {
    try {
        const { address } = req.params;
        const batches = await EnergyBatch.find({
            producer: address.toLowerCase(),
            isActive: true
        });
        res.json(batches);
    } catch (error) {
        console.error('Error getting producer batches:', error);
        res.status(500).json({ message: 'Error getting producer batches', error: error.message });
    }
};

// Get price history
exports.getPriceHistory = async (req, res) => {
    try {
        const energyToken = await EnergyToken.deployed();
        const [prices, timestamps] = await energyToken.getPriceHistory();

        const priceHistory = prices.map((price, index) => ({
            price: price.toString(),
            timestamp: new Date(timestamps[index] * 1000)
        }));

        res.json(priceHistory);
    } catch (error) {
        console.error('Error getting price history:', error);
        res.status(500).json({ message: 'Error getting price history', error: error.message });
    }
};

// Get average price
exports.getAveragePrice = async (req, res) => {
    try {
        const { duration } = req.query; // Duration in seconds
        const energyToken = await EnergyToken.deployed();
        const averagePrice = await energyToken.getAveragePrice(duration || 86400); // Default 24 hours

        res.json({ averagePrice: averagePrice.toString() });
    } catch (error) {
        console.error('Error getting average price:', error);
        res.status(500).json({ message: 'Error getting average price', error: error.message });
    }
}; 