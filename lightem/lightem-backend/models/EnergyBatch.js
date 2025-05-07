const mongoose = require('mongoose');

const energyBatchSchema = new mongoose.Schema({
    producer: {
        type: String,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('EnergyBatch', energyBatchSchema); 