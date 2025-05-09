const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    seller: {
        type: String,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    remainingAmount: {
        type: Number,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
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
    distanceFee: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    buyer: {
        type: String,
        ref: 'User'
    },
    finalPrice: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: function() {
            return new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from creation
        }
    }
});

module.exports = mongoose.model('Listing', listingSchema); 