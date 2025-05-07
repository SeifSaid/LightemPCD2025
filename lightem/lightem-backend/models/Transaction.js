const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['AUCTION', 'LISTING', 'ENERGY_TRANSFER'],
        required: true
    },
    from: {
        type: String,
        required: true,
        ref: 'User'
    },
    to: {
        type: String,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema); 