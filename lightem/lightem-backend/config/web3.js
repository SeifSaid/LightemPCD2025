const Web3 = require('web3');
const Contract = require('@truffle/contract');
const path = require('path');
const fs = require('fs');

// Load contract ABIs
const energyTokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/EnergyToken.json'), 'utf8'));
const userRegistryABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/UserRegistry.json'), 'utf8'));
const reverseAuctionMarketABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/ReverseAuctionMarket.json'), 'utf8'));
const fixedPriceMarketABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/FixedPriceMarket.json'), 'utf8'));

// Connect to local Ganache network
const web3 = new Web3('http://localhost:7545');

// Create contract instances
const EnergyToken = Contract(energyTokenABI);
const UserRegistry = Contract(userRegistryABI);
const ReverseAuctionMarket = Contract(reverseAuctionMarketABI);
const FixedPriceMarket = Contract(fixedPriceMarketABI);

// Set provider
EnergyToken.setProvider(web3.currentProvider);
UserRegistry.setProvider(web3.currentProvider);
ReverseAuctionMarket.setProvider(web3.currentProvider);
FixedPriceMarket.setProvider(web3.currentProvider);

module.exports = {
    web3,
    EnergyToken,
    UserRegistry,
    ReverseAuctionMarket,
    FixedPriceMarket
}; 