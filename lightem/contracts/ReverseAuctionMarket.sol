// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";  
import "./EnergyToken.sol";
import "./UserRegistry.sol";

contract ReverseAuctionMarket is ReentrancyGuard {
    struct Bid {
        address bidder;
        uint256 basePrice;  // in wei
        bool isActive;
    }
    
    struct Auction {
        address buyer;
        uint256 amount;
        uint256 maxBasePrice;  // in wei
        uint256 endTime;
        bool isActive;
        uint256 bidCount;
    }
    
    struct PriceBreakdown {
        uint256 basePrice;
        uint256 distanceFee;
        uint256 platformFee;
        uint256 totalPrice;
    }
    
    EnergyToken public energyToken;
    UserRegistry public userRegistry;
    
    uint256 public auctionCount;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(uint256 => Bid)) public bids; // auctionId => bidId => Bid
    mapping(address => uint256[]) public buyerAuctions;
    
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 100;  // 1% (in basis points)
    uint256 public constant DISTANCE_FEE_MULTIPLIER = 100;  // 0.01 wei per unit of distance
    
    event AuctionCreated(uint256 indexed auctionId, address buyer, uint256 amount, uint256 maxBasePrice);
    event BidPlaced(uint256 indexed auctionId, address bidder, uint256 basePrice);
    event AuctionWon(uint256 indexed auctionId, address winner, uint256 totalPrice);
    event AuctionCancelled(uint256 indexed auctionId);

    constructor(address _energyToken) {
        energyToken = EnergyToken(_energyToken);
        userRegistry = UserRegistry(energyToken.userRegistry());
    }

    function createAuction(uint256 amount, uint256 maxBasePrice, uint256 duration) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(maxBasePrice > 0, "Max base price must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(userRegistry.isRegistered(msg.sender), "User not registered");
        
        (, , , bool isProducer, ) = userRegistry.getUser(msg.sender);
        require(!isProducer, "Only consumers can create auctions");
        
        uint256 auctionId = auctionCount++;
        auctions[auctionId] = Auction({
            buyer: msg.sender,
            amount: amount,
            maxBasePrice: maxBasePrice,
            endTime: block.timestamp + duration,
            isActive: true,
            bidCount: 0
        });
        
        buyerAuctions[msg.sender].push(auctionId);
        emit AuctionCreated(auctionId, msg.sender, amount, maxBasePrice);
    }

    function calculatePrice(
        uint256 auctionId,
        uint256 bidId
    ) public view returns (PriceBreakdown memory) {
        Auction storage auction = auctions[auctionId];
        Bid storage bid = bids[auctionId][bidId];
        require(auction.isActive && bid.isActive, "Auction or bid is not active");
        
        uint256 distance = userRegistry.calculateDistance(auction.buyer, bid.bidder);
        uint256 distanceFee = distance * DISTANCE_FEE_MULTIPLIER;
        uint256 platformFee = (bid.basePrice * PLATFORM_FEE_PERCENTAGE) / 10000;
        
        return PriceBreakdown({
            basePrice: bid.basePrice,
            distanceFee: distanceFee,
            platformFee: platformFee,
            totalPrice: bid.basePrice + distanceFee + platformFee
        });
    }

    function placeBid(uint256 auctionId, uint256 basePrice) external nonReentrant {
        require(userRegistry.isRegistered(msg.sender), "User not registered");
        
        Auction storage auction = auctions[auctionId];
        require(auction.isActive, "Auction is not active");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(basePrice <= auction.maxBasePrice, "Price exceeds maximum");
        
        (, , , bool isProducer, ) = userRegistry.getUser(msg.sender);
        require(isProducer, "Only producers can place bids");
        
        require(
            energyToken.balanceOf(msg.sender) >= auction.amount * 1e18,
            "Insufficient token balance"
        );
        
        uint256 bidId = auction.bidCount++;
        bids[auctionId][bidId] = Bid({
            bidder: msg.sender,
            basePrice: basePrice,
            isActive: true
        });
        
        emit BidPlaced(auctionId, msg.sender, basePrice);
    }

    function selectWinner(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(auction.isActive, "Auction is not active");
        require(auction.buyer == msg.sender, "Not the auction creator");
        require(block.timestamp >= auction.endTime, "Auction has not ended");
        
        uint256 lowestBasePrice = type(uint256).max;
        uint256 winningBidId = type(uint256).max;
        
        for (uint256 i = 0; i < auction.bidCount; i++) {
            Bid storage bid = bids[auctionId][i];
            if (bid.isActive && bid.basePrice < lowestBasePrice) {
                lowestBasePrice = bid.basePrice;
                winningBidId = i;
            }
        }
        
        require(winningBidId != type(uint256).max, "No valid bids");
        
        Bid storage winningBid = bids[auctionId][winningBidId];
        PriceBreakdown memory price = calculatePrice(auctionId, winningBidId);
        
        // Transfer tokens
        require(
            energyToken.transferWithBatch(
                msg.sender,
                auctionId,
                auction.amount
            ),
            "Token transfer failed"
        );
        
        // Transfer payment to winner (minus platform fee)
        (bool success, ) = winningBid.bidder.call{value: price.totalPrice - price.platformFee}("");
        require(success, "Payment transfer failed");
        
        // Update auction
        auction.isActive = false;
        
        // Record transaction
        userRegistry.recordTransaction(msg.sender, true);
        userRegistry.recordTransaction(winningBid.bidder, true);
        
        emit AuctionWon(auctionId, winningBid.bidder, price.totalPrice);
    }

    function cancelAuction(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(auction.buyer == msg.sender, "Not the auction creator");
        require(auction.isActive, "Auction is not active");
        
        auction.isActive = false;
        emit AuctionCancelled(auctionId);
    }

    function getActiveAuctions() external view returns (
        uint256[] memory auctionIds,
        address[] memory buyers,
        uint256[] memory amounts,
        uint256[] memory maxBasePrices,
        uint256[] memory endTimes
    ) {
        uint256 activeCount = 0;
        
        // Count active auctions
        for (uint256 i = 0; i < auctionCount; i++) {
            if (auctions[i].isActive) {
                activeCount++;
            }
        }
        
        // Initialize arrays
        auctionIds = new uint256[](activeCount);
        buyers = new address[](activeCount);
        amounts = new uint256[](activeCount);
        maxBasePrices = new uint256[](activeCount);
        endTimes = new uint256[](activeCount);
        
        // Fill arrays
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < auctionCount; i++) {
            if (auctions[i].isActive) {
                auctionIds[currentIndex] = i;
                buyers[currentIndex] = auctions[i].buyer;
                amounts[currentIndex] = auctions[i].amount;
                maxBasePrices[currentIndex] = auctions[i].maxBasePrice;
                endTimes[currentIndex] = auctions[i].endTime;
                currentIndex++;
            }
        }
        
        return (auctionIds, buyers, amounts, maxBasePrices, endTimes);
    }

    function getAuctionsByBuyer(address buyer) external view returns (uint256[] memory) {
        return buyerAuctions[buyer];
    }

    function getBidsForAuction(uint256 auctionId) external view returns (
        address[] memory bidders,
        uint256[] memory basePrices,
        bool[] memory active
    ) {
        Auction storage auction = auctions[auctionId];
        uint256 bidCount = auction.bidCount;
        
        bidders = new address[](bidCount);
        basePrices = new uint256[](bidCount);
        active = new bool[](bidCount);
        
        for (uint256 i = 0; i < bidCount; i++) {
            Bid storage bid = bids[auctionId][i];
            bidders[i] = bid.bidder;
            basePrices[i] = bid.basePrice;
            active[i] = bid.isActive;
        }
        
        return (bidders, basePrices, active);
    }

    function getSuggestedPrice() external view returns (uint256) {
        return energyToken.getAveragePrice(1 days); 
    }
}
