const UserRegistry = artifacts.require("UserRegistry");

contract("UserRegistry", accounts => {
    let userRegistry;
    const [owner, user1] = accounts;
    const name = "Test User";
    const latitude = 123456;
    const longitude = 789012;

    beforeEach(async () => {
        userRegistry = await UserRegistry.new();
    });

    it("should register a new user", async () => {
        const tx = await userRegistry.registerUser(name, latitude, longitude, true, { from: user1 });
        
        assert.equal(tx.logs[0].event, "UserRegistered");
        assert.equal(tx.logs[0].args.user, user1);
        assert.equal(tx.logs[0].args.isProducer, true);
        
        const isRegistered = await userRegistry.isRegistered(user1);
        assert.equal(isRegistered, true);
    });
}); 