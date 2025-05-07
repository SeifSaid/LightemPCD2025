const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { auth } = require('../middleware/auth');

// Create a new auction
router.post('/', auth, auctionController.createAuction);

// Place a bid on an auction
router.post('/:auctionId/bid', auth, auctionController.placeBid);

// Get all active auctions
router.get('/active', auctionController.getActiveAuctions);

// Get auction by ID
router.get('/:auctionId', auctionController.getAuction);

// Complete an auction
router.post('/:auctionId/complete', auth, auctionController.completeAuction);

module.exports = router; 