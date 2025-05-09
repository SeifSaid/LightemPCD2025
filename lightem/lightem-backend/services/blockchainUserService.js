const { UserRegistry } = require('../config/web3');

async function registerUserOnChain({ address, name, latitude, longitude, isProducer }) {
    const userRegistry = await UserRegistry.deployed();
    return userRegistry.registerUser(
        name,
        latitude,
        longitude,
        isProducer,
        { from: address }
    );
}

module.exports = { registerUserOnChain };
