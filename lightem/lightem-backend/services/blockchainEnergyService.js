const { EnergyToken } = require('../config/web3');

async function mintEnergyOnChain({ address, amount }) {
    const energyToken = await EnergyToken.deployed();
    return energyToken.mint(address, amount, { from: address });
}

async function transferEnergyOnChain({ from, to, amount }) {
    const energyToken = await EnergyToken.deployed();
    return energyToken.transfer(to, amount, { from });
}

async function getEnergyBalance(address) {
    const energyToken = await EnergyToken.deployed();
    return energyToken.balanceOf(address);
}

module.exports = {
    mintEnergyOnChain,
    transferEnergyOnChain,
    getEnergyBalance
};
