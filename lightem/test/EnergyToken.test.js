const EnergyToken = artifacts.require("EnergyToken");
const UserRegistry = artifacts.require("UserRegistry");

contract("EnergyToken", accounts => {
    let energyToken;
    let userRegistry;
    const [owner, producer, consumer] = accounts;
    const name = "Test User";
    const latitude = 123456;
    const longitude = 789012;
    const amount = 100;
    const price = web3.utils.toWei("1", "ether");

    beforeEach(async () => {
        userRegistry = await UserRegistry.new();
        energyToken = await EnergyToken.new(userRegistry.address);
        await userRegistry.registerUser("Producer", latitude, longitude, true, { from: producer });
        await userRegistry.registerUser("Consumer", latitude, longitude, false, { from: consumer });
    });

    it("should mint tokens to producer", async () => {
        const tx = await energyToken.mint(amount, price, { from: producer });
        
        // Check Transfer event (from ERC20)
        assert.equal(tx.logs[0].event, "Transfer");
        assert.equal(tx.logs[0].args.from, "0x0000000000000000000000000000000000000000");
        assert.equal(tx.logs[0].args.to, producer);
        assert.equal(tx.logs[0].args.value.toString(), web3.utils.toWei(amount.toString(), "ether"));
        
        // Check NewBatch event
        assert.equal(tx.logs[1].event, "NewBatch");
        assert.equal(tx.logs[1].args.producer, producer);
        assert.equal(tx.logs[1].args.price.toString(), price);
        
        const balance = await energyToken.balanceOf(producer);
        assert.equal(balance.toString(), web3.utils.toWei(amount.toString(), "ether"));
    });

    it("should transfer tokens between users", async () => {
        // First mint tokens
        await energyToken.mint(amount, price, { from: producer });
        
        // Then transfer
        const transferAmount = 50;
        const tx = await energyToken.transfer(consumer, web3.utils.toWei(transferAmount.toString(), "ether"), { from: producer });
        
        assert.equal(tx.logs[0].event, "Transfer");
        assert.equal(tx.logs[0].args.from, producer);
        assert.equal(tx.logs[0].args.to, consumer);
        assert.equal(tx.logs[0].args.value.toString(), web3.utils.toWei(transferAmount.toString(), "ether"));
        
        const producerBalance = await energyToken.balanceOf(producer);
        const consumerBalance = await energyToken.balanceOf(consumer);
        assert.equal(producerBalance.toString(), web3.utils.toWei((amount - transferAmount).toString(), "ether"));
        assert.equal(consumerBalance.toString(), web3.utils.toWei(transferAmount.toString(), "ether"));
    });

    it("should get batch information", async () => {
        const tx = await energyToken.mint(amount, price, { from: producer });
        const batchId = tx.logs[1].args.batchId;
        
        const batch = await energyToken.getBatch(batchId);
        assert.equal(batch.producer, producer);
        assert.equal(batch.price.toString(), price);
    });

    it("should get average price", async () => {
        // Mint first batch
        await energyToken.mint(amount, price, { from: producer });
        
        // Mint second batch with different price
        const secondPrice = web3.utils.toWei("2", "ether");
        await energyToken.mint(amount, secondPrice, { from: producer });
        
        const averagePrice = await energyToken.getAveragePrice(86400); // 1 day in seconds
        const expectedAverage = web3.utils.toBN(price).add(web3.utils.toBN(secondPrice)).div(web3.utils.toBN(2));
        assert.equal(averagePrice.toString(), expectedAverage.toString());
    });
}); 