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
    basePrice: {
        type: Number,
        required: true
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
    }
});

module.exports = mongoose.model('Listing', listingSchema); 