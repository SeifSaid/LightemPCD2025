const Auction = require('../models/Auction');
const Transaction = require('../models/Transaction');
const { ReverseAuctionMarket, web3 } = require('../config/web3');

// Create a new auction
exports.createAuction = async (req, res) => {
    try {
        const { amount, maxBasePrice, duration } = req.body;
        const buyer = req.user.address;

        // Create auction in smart contract
        const reverseAuctionMarket = await ReverseAuctionMarket.deployed();
        const tx = await reverseAuctionMarket.createAuction(
            amount,
            maxBasePrice,
            duration,
            { from: buyer }
        );

        // Get auction ID from event
        const auctionCreatedEvent = tx.logs.find(log => log.event === 'AuctionCreated');
        const auctionId = auctionCreatedEvent.args.auctionId;

        // Create auction in MongoDB
        const auction = new Auction({
            buyer,
            amount,
            maxBasePrice,
            endTime: new Date(Date.now() + duration * 1000),
            bids: []
        });

        await auction.save();

        // Create transaction record
        const transaction = new Transaction({
            type: 'AUCTION',
            from: buyer,
            to: reverseAuctionMarket.address,
            amount,
            price: maxBasePrice,
            transactionHash: tx.tx,
            status: 'COMPLETED'
        });

        await transaction.save();

        res.status(201).json({
            message: 'Auction created successfully',
            auction,
            transaction
        });
    } catch (error) {
        console.error('Error creating auction:', error);
        res.status(500).json({ message: 'Error creating auction', error: error.message });
    }
};

// Place a bid on an auction
exports.placeBid = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const { basePrice } = req.body;
        const bidder = req.user.address;

        // Place bid in smart contract
        const reverseAuctionMarket = await ReverseAuctionMarket.deployed();
        const tx = await reverseAuctionMarket.placeBid(
            auctionId,
            basePrice,
            { from: bidder }
        );

        // Get bid ID from event
        const bidPlacedEvent = tx.logs.find(log => log.event === 'BidPlaced');
        const bidId = bidPlacedEvent.args.bidId;

        // Update auction in MongoDB
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        auction.bids.push({
            bidder,
            basePrice,
            timestamp: new Date()
        });

        await auction.save();

        // Create transaction record
        const transaction = new Transaction({
            type: 'AUCTION',
            from: bidder,
            to: reverseAuctionMarket.address,
            amount: auction.amount,
            price: basePrice,
            transactionHash: tx.tx,
            status: 'COMPLETED'
        });

        await transaction.save();

        res.json({
            message: 'Bid placed successfully',
            auction,
            transaction
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
};

// Get active auctions
exports.getActiveAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({
            isActive: true,
            endTime: { $gt: new Date() }
        }).populate('buyer', 'name address');

        res.json(auctions);
    } catch (error) {
        console.error('Error getting active auctions:', error);
        res.status(500).json({ message: 'Error getting active auctions', error: error.message });
    }
};

// Complete an auction
exports.completeAuction = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const buyer = req.user.address;

        // Complete auction in smart contract
        const reverseAuctionMarket = await ReverseAuctionMarket.deployed();
        const tx = await reverseAuctionMarket.selectWinner(
            auctionId,
            { from: buyer }
        );

        // Get winner from event
        const auctionWonEvent = tx.logs.find(log => log.event === 'AuctionWon');
        const winner = auctionWonEvent.args.winner;
        const finalPrice = auctionWonEvent.args.totalPrice;

        // Update auction in MongoDB
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        auction.isActive = false;
        auction.winner = winner;
        auction.finalPrice = finalPrice;
        await auction.save();

        // Create transaction record
        const transaction = new Transaction({
            type: 'AUCTION',
            from: buyer,
            to: winner,
            amount: auction.amount,
            price: finalPrice,
            transactionHash: tx.tx,
            status: 'COMPLETED'
        });

        await transaction.save();

        res.json({
            message: 'Auction completed successfully',
            auction,
            transaction
        });
    } catch (error) {
        console.error('Error completing auction:', error);
        res.status(500).json({ message: 'Error completing auction', error: error.message });
    }
};

// Get auction by ID
exports.getAuction = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const auction = await Auction.findById(auctionId)
            .populate('buyer', 'name address')
            .populate('winner', 'name address');

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        res.json(auction);
    } catch (error) {
        console.error('Error getting auction:', error);
        res.status(500).json({ message: 'Error getting auction', error: error.message });
    }
}; 