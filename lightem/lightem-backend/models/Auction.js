const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    bidder: {
        type: String,
        required: true,
        ref: 'User'
    },
    basePrice: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const auctionSchema = new mongoose.Schema({
    buyer: {
        type: String,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    maxBasePrice: {
        type: Number,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    bids: [bidSchema],
    winner: {
        type: String,
        ref: 'User'
    },
    finalPrice: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Auction', auctionSchema); 