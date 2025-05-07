const ReverseAuctionMarket = artifacts.require("ReverseAuctionMarket");
const EnergyToken = artifacts.require("EnergyToken");
const UserRegistry = artifacts.require("UserRegistry");

contract("ReverseAuctionMarket", accounts => {
    let reverseAuctionMarket;
    let energyToken;
    let userRegistry;
    const [owner, producer, consumer] = accounts;
    const name = "Test User";
    const latitude = 123456;
    const longitude = 789012;
    const amount = 100;
    const maxBasePrice = web3.utils.toWei("1", "ether");
    const duration = 2; // 2 seconds for testing

    beforeEach(async () => {
        userRegistry = await UserRegistry.new();
        energyToken = await EnergyToken.new(userRegistry.address);
        reverseAuctionMarket = await ReverseAuctionMarket.new(energyToken.address);
        await userRegistry.registerUser("Producer", latitude, longitude, true, { from: producer });
        await userRegistry.registerUser("Consumer", latitude, longitude, false, { from: consumer });
        await energyToken.mint(amount, maxBasePrice, { from: producer });
    });

    it("should create a new auction", async () => {
        const tx = await reverseAuctionMarket.createAuction(amount, maxBasePrice, duration, { from: consumer });
        
        assert.equal(tx.logs[0].event, "AuctionCreated");
        assert.equal(tx.logs[0].args.buyer, consumer);
        assert.equal(tx.logs[0].args.amount.toString(), amount.toString());
        assert.equal(tx.logs[0].args.maxBasePrice.toString(), maxBasePrice);
        
        const auction = await reverseAuctionMarket.auctions(0);
        assert.equal(auction.buyer, consumer);
        assert.equal(auction.amount.toString(), amount.toString());
        assert.equal(auction.maxBasePrice.toString(), maxBasePrice);
        assert.equal(auction.isActive, true);
    });

    it("should place a bid", async () => {
        // Create auction
        await reverseAuctionMarket.createAuction(amount, maxBasePrice, duration, { from: consumer });
        
        // Place bid
        const bidPrice = web3.utils.toWei("0.8", "ether");
        const tx = await reverseAuctionMarket.placeBid(0, bidPrice, { from: producer });
        
        assert.equal(tx.logs[0].event, "BidPlaced");
        assert.equal(tx.logs[0].args.auctionId.toString(), "0");
        assert.equal(tx.logs[0].args.bidder, producer);
        assert.equal(tx.logs[0].args.basePrice.toString(), bidPrice);
        
        const auction = await reverseAuctionMarket.auctions(0);
        const bid = await reverseAuctionMarket.bids(0, auction.bidCount - 1);
        assert.equal(bid.bidder, producer);
        assert.equal(bid.basePrice.toString(), bidPrice);
        assert.equal(bid.isActive, true);
    });

    it("should calculate price with distance", async () => {
        // Create auction
        await reverseAuctionMarket.createAuction(amount, maxBasePrice, duration, { from: consumer });
        
        // Place bid
        const bidPrice = web3.utils.toWei("0.8", "ether");
        await reverseAuctionMarket.placeBid(0, bidPrice, { from: producer });
        
        // Get bid ID
        const auction = await reverseAuctionMarket.auctions(0);
        const bidId = auction.bidCount - 1;
        
        // Calculate price
        const priceBreakdown = await reverseAuctionMarket.calculatePrice(0, bidId);
        assert(web3.utils.toBN(priceBreakdown.totalPrice).gt(web3.utils.toBN(0)), "Total price should be greater than 0");
        assert(web3.utils.toBN(priceBreakdown.basePrice).gt(web3.utils.toBN(0)), "Base price should be greater than 0");
        assert(web3.utils.toBN(priceBreakdown.distanceFee).gte(web3.utils.toBN(0)), "Distance fee should be greater than or equal to 0");
        assert(web3.utils.toBN(priceBreakdown.platformFee).gt(web3.utils.toBN(0)), "Platform fee should be greater than 0");
    });

    it("should select winner", async () => {
        // Create auction with short duration
        await reverseAuctionMarket.createAuction(amount, maxBasePrice, duration, { from: consumer });
        
        // Place bid
        const bidPrice = web3.utils.toWei("0.8", "ether");
        await reverseAuctionMarket.placeBid(0, bidPrice, { from: producer });
        
        // Approve market to spend tokens
        await energyToken.approve(reverseAuctionMarket.address, web3.utils.toWei(amount.toString(), "ether"), { from: producer });
        
        // Transfer tokens to market
        await energyToken.transfer(reverseAuctionMarket.address, web3.utils.toWei(amount.toString(), "ether"), { from: producer });
        
        // Advance blockchain time by duration + 1 second
        await new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [duration + 1],
                id: new Date().getTime()
            }, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        // Mine a new block to apply the time change
        await new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: new Date().getTime()
            }, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        
        // Select winner
        const tx = await reverseAuctionMarket.selectWinner(0, { from: consumer });
        
        assert.equal(tx.logs[0].event, "AuctionWon");
        assert.equal(tx.logs[0].args.auctionId.toString(), "0");
        assert.equal(tx.logs[0].args.winner, producer);
        
        const auction = await reverseAuctionMarket.auctions(0);
        assert.equal(auction.isActive, false);
    });
}); 