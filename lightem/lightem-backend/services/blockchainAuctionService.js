const { ReverseAuctionMarket } = require('../config/web3');

async function createAuctionOnChain({ amount, maxBasePrice, duration, buyer }) {
    try {
        const reverseAuctionMarket = await ReverseAuctionMarket.deployed();
        const tx = await reverseAuctionMarket.createAuction(
            amount,
            maxBasePrice,
            duration,
            { from: buyer }
        );
        return { tx, contractAddress: reverseAuctionMarket.address };
    } catch (error) {
        console.error('Error creating auction on chain:', error);
        throw new Error(`Failed to create auction on chain: ${error.message}`);
    }
}

async function placeBidOnChain({ auctionId, basePrice, bidder }) {
    try {
        const reverseAuctionMarket = await ReverseAuctionMarket.deployed();
        const tx = await reverseAuctionMarket.placeBid(
            auctionId,
            basePrice,
            { from: bidder }
        );
        return { tx, contractAddress: reverseAuctionMarket.address };
    } catch (error) {
        console.error('Error placing bid on chain:', error);
        throw new Error(`Failed to place bid on chain: ${error.message}`);
    }
}

async function completeAuctionOnChain({ auctionId, buyer }) {
    try {
        const reverseAuctionMarket = await ReverseAuctionMarket.deployed();
        const tx = await reverseAuctionMarket.selectWinner(
            auctionId,
            { from: buyer }
        );
        return tx;
    } catch (error) {
        console.error('Error completing auction on chain:', error);
        throw new Error(`Failed to complete auction on chain: ${error.message}`);
    }
}

module.exports = {
    createAuctionOnChain,
    placeBidOnChain,
    completeAuctionOnChain
};
