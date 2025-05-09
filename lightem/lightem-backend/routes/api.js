const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const energyController = require('../controllers/energyController');
const auctionController = require('../controllers/auctionController');
const transactionController = require('../controllers/transactionController');
const listingController = require('../controllers/listingController');

// User routes
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.get('/users/:address', userController.getUser);
router.put('/users/:address', userController.updateUser);
router.get('/users', userController.getAllUsers);

// Energy routes
router.post('/energy/mint', energyController.mintEnergy);
router.get('/energy/batches', energyController.getEnergyBatches);
router.get('/energy/balance/:address', energyController.getBalance);
router.post('/energy/transfer', energyController.transferEnergy);
router.get('/energy/producer/:address', energyController.getProducerBatches);
router.get('/energy/price-history', energyController.getPriceHistory);
router.get('/energy/average-price', energyController.getAveragePrice);

// Auction routes
router.post('/auctions/create', auctionController.createAuction);
router.post('/auctions/:auctionId/bid', auctionController.placeBid);
router.get('/auctions/active', auctionController.getActiveAuctions);
router.get('/auctions/completed', auctionController.getCompletedAuctions);
router.put('/auctions/:auctionId/complete', auctionController.completeAuction);
router.get('/auctions/:auctionId', auctionController.getAuction);

// Listing routes
router.post('/listings/create', listingController.createListing);
router.get('/listings/active', listingController.getActiveListings);
router.post('/listings/:id/purchase', listingController.purchaseListing);

// Transaction routes
router.get('/transactions', transactionController.getAllTransactions);
router.get('/transactions/:hash', transactionController.getTransactionByHash);
router.get('/transactions/:id', transactionController.getTransaction);

module.exports = router; 