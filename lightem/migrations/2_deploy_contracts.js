const UserRegistry = artifacts.require("UserRegistry");
const EnergyToken = artifacts.require("EnergyToken");
const FixedPriceMarket = artifacts.require("FixedPriceMarket");
const ReverseAuctionMarket = artifacts.require("ReverseAuctionMarket");

module.exports = function (deployer) {
  // Deploy UserRegistry first
  deployer.deploy(UserRegistry)
    .then(() => {
      // Deploy EnergyToken with UserRegistry address
      return deployer.deploy(EnergyToken, UserRegistry.address);
    })
    .then(() => {
      // Deploy markets with EnergyToken address
      return Promise.all([
        deployer.deploy(FixedPriceMarket, EnergyToken.address),
        deployer.deploy(ReverseAuctionMarket, EnergyToken.address)
      ]);
    });
};
