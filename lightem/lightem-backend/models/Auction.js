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
    status: {
        type: String,
        enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED', 'FAILED'],
        default: 'PENDING'
    },
    bids: [bidSchema],
    winner: {
        type: String,
        ref: 'User'
    },
    finalPrice: {
        type: Number
    },
    auctionId: {
        type: String,
        required: false
    },
    completionMethod: {
        type: String,
        enum: ['MANUAL', 'AUTOMATIC', null],
        default: null
    },
    completionTime: {
        type: Date
    },
    city: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    location: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for efficient querying
auctionSchema.index({ status: 1, endTime: 1 });

module.exports = mongoose.model('Auction', auctionSchema); 