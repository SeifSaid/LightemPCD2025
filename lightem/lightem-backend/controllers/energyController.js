const EnergyBatch = require('../models/EnergyBatch');
const {
    mintEnergyOnChain,
    transferEnergyOnChain,
    getEnergyBalance
} = require('../services/blockchainEnergyService');
const Transaction = require('../models/Transaction');
const { EnergyToken } = require('../config/web3');

// Mint new energy tokens
exports.mintEnergy = async (req, res) => {
    try {
        const { address, amount, latitude, longitude, price, timestamp } = req.body;

        // Mint tokens on-chain
        await mintEnergyOnChain({ address, amount });

        // Create energy batch in MongoDB
        const energyBatch = new EnergyBatch({
            producer: address.toLowerCase(),
            amount,
            latitude,
            longitude,
            price,
            timestamp: timestamp || Date.now(),
            status: 'available'
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

// Get energy balance
exports.getBalance = async (req, res) => {
    try {
        const { address } = req.params;
        const balance = await getEnergyBalance(address);
        const humanReadable = Number(balance) / 1e18;
        res.json({ 
            balance: balance.toString(),
            humanReadable 
        });
    } catch (error) {
        console.error('Error getting balance:', error);
        res.status(500).json({ message: 'Error getting balance', error: error.message });
    }
};

// Transfer energy tokens
exports.transferEnergy = async (req, res) => {
    try {
        const { from, to, amount } = req.body;

        // Transfer tokens on-chain
        const tx = await transferEnergyOnChain({ from, to, amount });

        // Update energy batch status in MongoDB
        await EnergyBatch.findOneAndUpdate(
            { producer: from.toLowerCase(), isActive: true },
            { isActive: false, transferredTo: to.toLowerCase() }
        );

        // Create transaction record
        const transaction = new Transaction({
            type: 'ENERGY_TRANSFER',
            from,
            to,
            amount,
            price: 0, // or use the batch price if you want
            transactionHash: tx.tx || tx.transactionHash, // Use the actual hash from the blockchain tx
            status: 'COMPLETED'
        });
        await transaction.save();

        res.json({
            message: 'Energy tokens transferred successfully',
            transaction
        });
    } catch (error) {
        console.error('Error transferring energy:', error);
        res.status(500).json({ message: 'Error transferring energy', error: error.message });
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
        const result = await energyToken.getPriceHistory();
        const prices = result.prices;
        const timestamps = result.timestamps;

        const priceHistory = prices
            .map((price, index) => ({
                price: price.toString(),
                timestamp: new Date(Number(timestamps[index]) * 1000)
            }))
            .filter(entry => entry.price !== "0");

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