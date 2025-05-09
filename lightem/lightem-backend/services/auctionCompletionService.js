const Auction = require('../models/Auction');
const { completeAuctionOnChain } = require('./blockchainAuctionService');

// Check and mark expired auctions
async function checkAndMarkExpiredAuctions() {
    try {
        const expiredAuctions = await Auction.find({
            status: 'ACTIVE',
            endTime: { $lte: new Date() }
        });

        for (const auction of expiredAuctions) {
            try {
                if (auction.bids.length === 0) {
                    // Mark as expired if no bids
                    auction.status = 'EXPIRED';
                    auction.completionTime = new Date();
                    await auction.save();
                    console.log(`Auction ${auction._id} marked as expired - no bids`);
                } else {
                    // Complete auction if it has bids
                    try {
                        // Find winning bid (lowest price)
                        const winningBid = auction.bids.reduce((lowest, current) => {
                            return current.basePrice < lowest.basePrice ? current : lowest;
                        });

                        // Complete on blockchain
                        await completeAuctionOnChain({ 
                            auctionId: auction.auctionId, 
                            buyer: auction.buyer 
                        });

                        // Update auction in MongoDB
                        auction.status = 'COMPLETED';
                        auction.winner = winningBid.bidder;
                        auction.finalPrice = winningBid.basePrice;
                        auction.completionTime = new Date();
                        auction.completionMethod = 'AUTOMATIC';
                        await auction.save();

                        console.log(`Auction ${auction._id} automatically completed`);
                    } catch (error) {
                        console.error(`Error completing auction ${auction._id}:`, error);
                        // Mark as expired if completion fails
                        auction.status = 'EXPIRED';
                        auction.completionTime = new Date();
                        await auction.save();
                    }
                }
            } catch (error) {
                console.error(`Error processing auction ${auction._id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error checking expired auctions:', error);
    }
}

// Start the automatic expiration check
function startAuctionExpirationCheck() {
    // Check every minute
    setInterval(checkAndMarkExpiredAuctions, 60000);
    // Initial check
    checkAndMarkExpiredAuctions();
}

module.exports = {
    startAuctionExpirationCheck,
    checkAndMarkExpiredAuctions
}; 