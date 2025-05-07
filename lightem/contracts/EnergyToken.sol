// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./UserRegistry.sol";

contract EnergyToken is ERC20 {
    struct EnergyBatch {
        address producer;
        int256 latitude;
        int256 longitude;
        uint256 timestamp;
        uint256 price;  // Price in wei
    }
    
    struct PriceHistory {
        uint256[] prices;
        uint256[] timestamps;
        uint256 lastIndex;
    }
    
    UserRegistry public immutable userRegistry;
    EnergyBatch[] public energyBatches;
    mapping(address => uint256[]) public producerBatches;
    PriceHistory public priceHistory;
    uint256 public constant MAX_PRICE_HISTORY = 100;  // Keep last 100 prices
    
    event NewBatch(uint256 indexed batchId, address producer, uint256 price);
    event EnergyTransferred(address indexed from, address indexed to, uint256 batchId, uint256 amount);
    event PriceUpdated(uint256 newPrice);

    constructor(address _userRegistry) ERC20("GreenEnergyToken", "GET") {
        require(_userRegistry != address(0), "Invalid user registry address");
        userRegistry = UserRegistry(_userRegistry);
        priceHistory.prices = new uint256[](MAX_PRICE_HISTORY);
        priceHistory.timestamps = new uint256[](MAX_PRICE_HISTORY);
    }

    function mint(
        uint256 amount,
        uint256 price
    ) external {
        require(amount > 0, "Amount must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(userRegistry.isRegistered(msg.sender), "User not registered");
        
        (, , , bool isProducer, ) = userRegistry.getUser(msg.sender);
        require(isProducer, "Not a producer");
        
        _mint(msg.sender, amount * 1e18);
        uint256 batchId = energyBatches.length;
        
        (, int256 lat, int256 long, , ) = userRegistry.getUser(msg.sender);
        energyBatches.push(EnergyBatch(msg.sender, lat, long, block.timestamp, price));
        producerBatches[msg.sender].push(batchId);
        
        // Update price history
        priceHistory.prices[priceHistory.lastIndex] = price;
        priceHistory.timestamps[priceHistory.lastIndex] = block.timestamp;
        priceHistory.lastIndex = (priceHistory.lastIndex + 1) % MAX_PRICE_HISTORY;
        
        emit NewBatch(batchId, msg.sender, price);
        emit PriceUpdated(price);
    }

    function transferWithBatch(
        address recipient,
        uint256 batchId,
        uint256 amount
    ) external returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");
        require(batchId < energyBatches.length, "Invalid batch");
        require(
            balanceOf(msg.sender) >= amount * 1e18, 
            "Insufficient balance"
        );
        
        _transfer(msg.sender, recipient, amount * 1e18);
        emit EnergyTransferred(msg.sender, recipient, batchId, amount);
        return true;
    }

    function getBatch(uint256 batchId) external view returns (
        address producer,
        int256 latitude,
        int256 longitude,
        uint256 timestamp,
        uint256 price
    ) {
        require(batchId < energyBatches.length, "Invalid batch");
        EnergyBatch storage batch = energyBatches[batchId];
        return (
            batch.producer,
            batch.latitude,
            batch.longitude,
            batch.timestamp,
            batch.price
        );
    }

    function getBatchesByProducer(address producer) external view returns (uint256[] memory) {
        require(userRegistry.isRegistered(producer), "Producer not registered");
        return producerBatches[producer];
    }

    function getTotalBatches() external view returns (uint256) {
        return energyBatches.length;
    }

    function getAveragePrice(uint256 duration) external view returns (uint256) {
        require(duration > 0, "Duration must be greater than 0");
        uint256 sum = 0;
        uint256 count = 0;
        uint256 currentTime = block.timestamp;
        
        for (uint256 i = 0; i < MAX_PRICE_HISTORY; i++) {
            uint256 index = (priceHistory.lastIndex + MAX_PRICE_HISTORY - i - 1) % MAX_PRICE_HISTORY;
            if (currentTime - priceHistory.timestamps[index] <= duration) {
                sum += priceHistory.prices[index];
                count++;
            }
        }
        
        return count > 0 ? sum / count : 0;
    }

    function getPriceHistory() external view returns (
        uint256[] memory prices,
        uint256[] memory timestamps
    ) {
        prices = new uint256[](MAX_PRICE_HISTORY);
        timestamps = new uint256[](MAX_PRICE_HISTORY);
        
        for (uint256 i = 0; i < MAX_PRICE_HISTORY; i++) {
            uint256 index = (priceHistory.lastIndex + MAX_PRICE_HISTORY - i - 1) % MAX_PRICE_HISTORY;
            prices[i] = priceHistory.prices[index];
            timestamps[i] = priceHistory.timestamps[index];
        }
        
        return (prices, timestamps);
    }
}