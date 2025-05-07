const Transaction = require('../models/Transaction');
const { EnergyToken, web3 } = require('../config/web3');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('from', 'name address')
            .populate('to', 'name address')
            .sort({ timestamp: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({ message: 'Error getting transactions', error: error.message });
    }
};

// Get transactions by user
exports.getUserTransactions = async (req, res) => {
    try {
        const { address } = req.params;
        const transactions = await Transaction.find({
            $or: [{ from: address }, { to: address }]
        })
            .populate('from', 'name address')
            .populate('to', 'name address')
            .sort({ timestamp: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Error getting user transactions:', error);
        res.status(500).json({ message: 'Error getting user transactions', error: error.message });
    }
};

// Get transaction by ID
exports.getTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await Transaction.findById(transactionId)
            .populate('from', 'name address')
            .populate('to', 'name address');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ message: 'Error getting transaction', error: error.message });
    }
};

// Get transaction by hash
exports.getTransactionByHash = async (req, res) => {
    try {
        const { hash } = req.params;
        const transaction = await Transaction.findOne({ transactionHash: hash })
            .populate('from', 'name address')
            .populate('to', 'name address');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error getting transaction by hash:', error);
        res.status(500).json({ message: 'Error getting transaction by hash', error: error.message });
    }
};

// Get transaction statistics
exports.getTransactionStats = async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalValue: { $sum: { $multiply: ['$amount', '$price'] } }
                }
            }
        ]);

        const totalStats = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalVolume: { $sum: { $multiply: ['$amount', '$price'] } },
                    averagePrice: { $avg: '$price' }
                }
            }
        ]);

        res.json({
            byType: stats,
            total: totalStats[0]
        });
    } catch (error) {
        console.error('Error getting transaction stats:', error);
        res.status(500).json({ message: 'Error getting transaction stats', error: error.message });
    }
}; 