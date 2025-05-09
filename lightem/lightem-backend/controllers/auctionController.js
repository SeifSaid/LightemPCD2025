const Auction = require('../models/Auction');
const Transaction = require('../models/Transaction');
const {
    createAuctionOnChain,
    placeBidOnChain,
    completeAuctionOnChain
} = require('../services/blockchainAuctionService');

// Helper to extract event data robustly
function extractEvent(tx, eventName) {
    // Truffle/legacy: tx.logs
    if (tx && tx.logs && Array.isArray(tx.logs)) {
        const event = tx.logs.find(log => log.event === eventName);
        if (event && event.args) return event.args;
    }
    // Web3 1.x: tx.events
    if (tx && tx.events && tx.events[eventName] && tx.events[eventName].returnValues) {
        return tx.events[eventName].returnValues;
    }
    return null;
}

// Create a new auction
exports.createAuction = async (req, res) => {
    try {
        const { amount, maxBasePrice, duration } = req.body;
        const buyer = req.user?.address || req.body.buyer;
        const User = require('../models/User');
        const user = await User.findOne({ address: buyer.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (user.isProducer) {
            return res.status(403).json({ message: 'Only consumers can create auctions' });
        }
        const city = user.city || '';
        const latitude = user.latitude;
        const longitude = user.longitude;
        const location = city && latitude && longitude ? `${city} (${latitude}, ${longitude})` : '';
        // 1. Save auction in MongoDB as PENDING
        let auction = new Auction({
            buyer,
            amount,
            maxBasePrice,
            endTime: new Date(Date.now() + duration * 1000),
            status: 'PENDING',
            bids: [],
            city,
            latitude,
            longitude,
            location
        });
        await auction.save();
        // 2. Attempt blockchain call
        try {
            const { tx, contractAddress } = await createAuctionOnChain({ amount, maxBasePrice, duration, buyer });
            const args = extractEvent(tx, 'AuctionCreated');
            const blockchainAuctionId = args ? args.auctionId.toString() : null;
            if (!blockchainAuctionId) {
                throw new Error('Failed to get blockchain auction ID from event');
            }
            // 3. Update auction with blockchain info and set status ACTIVE
            auction.auctionId = blockchainAuctionId;
            auction.status = 'ACTIVE';
            await auction.save();
            // Create transaction record
            const transaction = new Transaction({
                type: 'AUCTION',
                from: buyer,
                to: contractAddress,
                amount,
                price: maxBasePrice,
                transactionHash: tx.tx || tx.transactionHash,
                status: 'COMPLETED'
            });
            await transaction.save();
            const auctionObj = auction.toObject();
            auctionObj.buyerName = user.name;
            return res.status(201).json({
                message: 'Auction created successfully',
                auction: auctionObj,
                transaction,
                auctionId: blockchainAuctionId
            });
        } catch (blockchainError) {
            // 4. If blockchain fails, set status FAILED
            auction.status = 'FAILED';
            await auction.save();
            return res.status(500).json({ message: 'Blockchain error during auction creation', error: blockchainError.message, auction });
        }
    } catch (error) {
        console.error('Error creating auction:', error);
        res.status(500).json({ message: 'Error creating auction', error: error.message });
    }
};

// Place a bid on an auction
exports.placeBid = async (req, res) => {
    try {
        const { auctionId: mongoAuctionId } = req.params;
        const { basePrice } = req.body;
        const bidder = req.user?.address || req.body.bidder;
        // Find auction in MongoDB by _id
        const auction = await Auction.findById(mongoAuctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        if (auction.status !== 'ACTIVE') {
            return res.status(400).json({ message: 'Auction is not active' });
        }
        if (!auction.auctionId) {
            return res.status(500).json({ message: 'Blockchain auctionId not found in DB' });
        }
        // Place bid on-chain
        const { tx, contractAddress } = await placeBidOnChain({ 
            auctionId: auction.auctionId, 
            basePrice, 
            bidder 
        });
        // Extract bidId from event
        const args = extractEvent(tx, 'BidPlaced');
        const bidId = args ? args.bidId : null;
        // Update auction in MongoDB
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
            to: contractAddress,
            amount: auction.amount,
            price: basePrice,
            transactionHash: tx.tx || tx.transactionHash,
            status: 'COMPLETED'
        });
        await transaction.save();
        res.json({
            message: 'Bid placed successfully',
            auction,
            transaction,
            bidId
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
};

// Get active auctions
exports.getActiveAuctions = async (req, res) => {
    try {
        const User = require('../models/User');
        const auctions = await Auction.find({
            status: 'ACTIVE',
            endTime: { $gt: new Date() }
        }).lean();
        // Populate buyerName and bidderName for each auction
        for (const auction of auctions) {
            const buyerUser = await User.findOne({ address: auction.buyer.toLowerCase() });
            auction.buyerName = buyerUser ? buyerUser.name : auction.buyer;
            if (auction.bids && auction.bids.length > 0) {
                for (const bid of auction.bids) {
                    const bidderUser = await User.findOne({ address: bid.bidder.toLowerCase() });
                    bid.bidderName = bidderUser ? bidderUser.name : bid.bidder;
                }
            }
        }
        res.json(auctions);
    } catch (error) {
        console.error('Error getting active auctions:', error);
        res.status(500).json({ message: 'Error getting active auctions', error: error.message });
    }
};

// Complete an auction
exports.completeAuction = async (req, res) => {
    try {
        const { auctionId: mongoAuctionId } = req.params;
        const buyer = req.user?.address || req.body.buyer;

        // Find auction in MongoDB
        const auction = await Auction.findById(mongoAuctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (auction.status !== 'ACTIVE') {
            return res.status(400).json({ 
                message: `Auction is ${auction.status.toLowerCase()}` 
            });
        }

        if (auction.bids.length === 0) {
            auction.status = 'CANCELLED';
            auction.completionTime = new Date();
            auction.completionMethod = 'MANUAL';
            await auction.save();
            return res.json({
                message: 'Auction cancelled - no bids received',
                auction
            });
        }

        // Find winning bid (lowest price)
        const winningBid = auction.bids.reduce((lowest, current) => {
            return current.basePrice < lowest.basePrice ? current : lowest;
        });

        // Complete auction on-chain
        const tx = await completeAuctionOnChain({ 
            auctionId: auction.auctionId, 
            buyer 
        });

        // Update auction in MongoDB
        auction.status = 'COMPLETED';
        auction.winner = winningBid.bidder;
        auction.finalPrice = winningBid.basePrice;
        auction.completionTime = new Date();
        auction.completionMethod = 'MANUAL';
        await auction.save();

        // Create transaction record
        const transaction = new Transaction({
            type: 'AUCTION',
            from: buyer,
            to: winningBid.bidder,
            amount: auction.amount,
            price: winningBid.basePrice,
            transactionHash: tx.tx || tx.transactionHash,
            status: 'COMPLETED'
        });

        await transaction.save();

        res.json({
            message: 'Auction completed successfully',
            auction,
            transaction,
            winner: winningBid.bidder,
            finalPrice: winningBid.basePrice
        });
    } catch (error) {
        console.error('Error completing auction:', error);
        res.status(500).json({ message: 'Error completing auction', error: error.message });
    }
};

// Get completed auctions
exports.getCompletedAuctions = async (req, res) => {
    try {
        const User = require('../models/User');
        const auctions = await Auction.find({
            status: { $in: ['COMPLETED', 'EXPIRED', 'CANCELLED'] }
        }).sort({ completionTime: -1 }).lean();
        // Populate buyerName and bidderName for each auction
        for (const auction of auctions) {
            const buyerUser = await User.findOne({ address: auction.buyer.toLowerCase() });
            auction.buyerName = buyerUser ? buyerUser.name : auction.buyer;
            if (auction.bids && auction.bids.length > 0) {
                for (const bid of auction.bids) {
                    const bidderUser = await User.findOne({ address: bid.bidder.toLowerCase() });
                    bid.bidderName = bidderUser ? bidderUser.name : bid.bidder;
                }
            }
        }
        res.json(auctions);
    } catch (error) {
        console.error('Error getting completed auctions:', error);
        res.status(500).json({ message: 'Error getting completed auctions', error: error.message });
    }
};

// Get auction by ID
exports.getAuction = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const User = require('../models/User');
        const auction = await Auction.findById(auctionId).lean();
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        const buyerUser = await User.findOne({ address: auction.buyer.toLowerCase() });
        auction.buyerName = buyerUser ? buyerUser.name : auction.buyer;
        if (auction.bids && auction.bids.length > 0) {
            for (const bid of auction.bids) {
                const bidderUser = await User.findOne({ address: bid.bidder.toLowerCase() });
                bid.bidderName = bidderUser ? bidderUser.name : bid.bidder;
            }
        }
        res.json(auction);
    } catch (error) {
        console.error('Error getting auction:', error);
        res.status(500).json({ message: 'Error getting auction', error: error.message });
    }
}; 