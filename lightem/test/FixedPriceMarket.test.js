const FixedPriceMarket = artifacts.require("FixedPriceMarket");
const EnergyToken = artifacts.require("EnergyToken");
const UserRegistry = artifacts.require("UserRegistry");

contract("FixedPriceMarket", accounts => {
    let fixedPriceMarket;
    let energyToken;
    let userRegistry;
    const [owner, producer, consumer] = accounts;
    const name = "Test User";
    const latitude = 123456;
    const longitude = 789012;
    const amount = 100;
    const basePrice = web3.utils.toWei("1", "ether");

    beforeEach(async () => {
        userRegistry = await UserRegistry.new();
        energyToken = await EnergyToken.new(userRegistry.address);
        fixedPriceMarket = await FixedPriceMarket.new(energyToken.address);
        await userRegistry.registerUser("Producer", latitude, longitude, true, { from: producer });
        await userRegistry.registerUser("Consumer", latitude, longitude, false, { from: consumer });
        await energyToken.mint(amount, basePrice, { from: producer });
    });

    it("should create a new listing", async () => {
        const tx = await fixedPriceMarket.createListing(amount, basePrice, { from: producer });
        
        assert.equal(tx.logs[0].event, "ListingCreated");
        assert.equal(tx.logs[0].args.seller, producer);
        assert.equal(tx.logs[0].args.amount.toString(), amount.toString());
        assert.equal(tx.logs[0].args.basePrice.toString(), basePrice);
        
        const listing = await fixedPriceMarket.listings(0);
        assert.equal(listing.seller, producer);
        assert.equal(listing.amount.toString(), amount.toString());
        assert.equal(listing.basePrice.toString(), basePrice);
        assert.equal(listing.isActive, true);
    });

    it("should calculate price with distance", async () => {
        // Create listing
        await fixedPriceMarket.createListing(amount, basePrice, { from: producer });
        
        // Calculate price
        const priceBreakdown = await fixedPriceMarket.calculatePrice(0, consumer);
        assert(web3.utils.toBN(priceBreakdown.totalPrice).gt(web3.utils.toBN(0)), "Total price should be greater than 0");
        assert(web3.utils.toBN(priceBreakdown.basePrice).gt(web3.utils.toBN(0)), "Base price should be greater than 0");
        assert(web3.utils.toBN(priceBreakdown.distanceFee).gte(web3.utils.toBN(0)), "Distance fee should be greater than or equal to 0");
        assert(web3.utils.toBN(priceBreakdown.platformFee).gt(web3.utils.toBN(0)), "Platform fee should be greater than 0");
    });

    it("should purchase energy", async () => {
        // Create listing
        await fixedPriceMarket.createListing(amount, basePrice, { from: producer });
        
        // Approve market to spend tokens
        await energyToken.approve(fixedPriceMarket.address, web3.utils.toWei(amount.toString(), "ether"), { from: producer });
        
        // Transfer tokens to market
        await energyToken.transfer(fixedPriceMarket.address, web3.utils.toWei(amount.toString(), "ether"), { from: producer });
        
        // Purchase
        const priceBreakdown = await fixedPriceMarket.calculatePrice(0, consumer);
        const tx = await fixedPriceMarket.purchaseListing(0, { from: consumer, value: priceBreakdown.totalPrice });
        
        assert.equal(tx.logs[0].event, "ListingPurchased");
        assert.equal(tx.logs[0].args.buyer, consumer);
        assert.equal(tx.logs[0].args.seller, producer);
        assert.equal(tx.logs[0].args.amount.toString(), amount.toString());
    });

    it("should cancel listing", async () => {
        // Create listing
        await fixedPriceMarket.createListing(amount, basePrice, { from: producer });
        
        // Cancel listing
        const tx = await fixedPriceMarket.cancelListing(0, { from: producer });
        
        assert.equal(tx.logs[0].event, "ListingCancelled");
        assert.equal(tx.logs[0].args.listingId.toString(), "0");
        
        const listing = await fixedPriceMarket.listings(0);
        assert.equal(listing.isActive, false);
    });
}); 