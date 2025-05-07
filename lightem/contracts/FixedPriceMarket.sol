// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./EnergyToken.sol";
import "./UserRegistry.sol";

contract FixedPriceMarket is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 amount;
        uint256 basePrice;  // in wei
        bool isActive;
    }
    
    struct PriceBreakdown {
        uint256 basePrice;
        uint256 distanceFee;
        uint256 platformFee;
        uint256 totalPrice;
    }
    
    EnergyToken public energyToken;
    UserRegistry public userRegistry;
    
    uint256 public listingCount;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public sellerListings;
    
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 100;  // 1% (in basis points)
    uint256 public constant DISTANCE_FEE_MULTIPLIER = 100;  // 0.01 wei per unit of distance
    
    event ListingCreated(uint256 indexed listingId, address seller, uint256 amount, uint256 basePrice);
    event ListingPurchased(uint256 indexed listingId, address buyer, address seller, uint256 amount, uint256 totalPrice);
    event ListingCancelled(uint256 indexed listingId);

    constructor(address _energyToken) {
        energyToken = EnergyToken(_energyToken);
        userRegistry = UserRegistry(energyToken.userRegistry());
    }

    function createListing(uint256 amount, uint256 basePrice) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(basePrice > 0, "Base price must be greater than 0");
        require(userRegistry.isRegistered(msg.sender), "User not registered");
        
        (, , , bool isProducer, ) = userRegistry.getUser(msg.sender);
        require(isProducer, "Only producers can create listings");
        
        require(
            energyToken.balanceOf(msg.sender) >= amount * 1e18,
            "Insufficient token balance"
        );
        
        uint256 listingId = listingCount++;
        listings[listingId] = Listing({
            seller: msg.sender,
            amount: amount,
            basePrice: basePrice,
            isActive: true
        });
        
        sellerListings[msg.sender].push(listingId);
        emit ListingCreated(listingId, msg.sender, amount, basePrice);
    }

    function calculatePrice(
        uint256 listingId,
        address buyer
    ) public view returns (PriceBreakdown memory) {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        
        uint256 distance = userRegistry.calculateDistance(listing.seller, buyer);
        uint256 distanceFee = distance * DISTANCE_FEE_MULTIPLIER;
        uint256 platformFee = (listing.basePrice * PLATFORM_FEE_PERCENTAGE) / 10000;
        
        return PriceBreakdown({
            basePrice: listing.basePrice,
            distanceFee: distanceFee,
            platformFee: platformFee,
            totalPrice: listing.basePrice + distanceFee + platformFee
        });
    }

    function purchaseListing(uint256 listingId) external payable nonReentrant {
        require(userRegistry.isRegistered(msg.sender), "User not registered");
        
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        
        PriceBreakdown memory price = calculatePrice(listingId, msg.sender);
        require(msg.value >= price.totalPrice, "Insufficient payment");
        
        // Transfer tokens
        require(
            energyToken.transferWithBatch(
                msg.sender,
                listingId,
                listing.amount
            ),
            "Token transfer failed"
        );
        
        // Transfer payment to seller (minus platform fee)
        (bool success, ) = listing.seller.call{value: price.totalPrice - price.platformFee}("");
        require(success, "Payment transfer failed");
        
        // Update listing
        listing.isActive = false;
        
        // Record transaction
        userRegistry.recordTransaction(msg.sender, true);
        userRegistry.recordTransaction(listing.seller, true);
        
        emit ListingPurchased(listingId, msg.sender, listing.seller, listing.amount, price.totalPrice);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing is not active");
        
        listing.isActive = false;
        emit ListingCancelled(listingId);
    }

    function getActiveListings() external view returns (
        uint256[] memory listingIds,
        address[] memory sellers,
        uint256[] memory amounts,
        uint256[] memory basePrices
    ) {
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 0; i < listingCount; i++) {
            if (listings[i].isActive) {
                activeCount++;
            }
        }
        
        // Initialize arrays
        listingIds = new uint256[](activeCount);
        sellers = new address[](activeCount);
        amounts = new uint256[](activeCount);
        basePrices = new uint256[](activeCount);
        
        // Fill arrays
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < listingCount; i++) {
            if (listings[i].isActive) {
                listingIds[currentIndex] = i;
                sellers[currentIndex] = listings[i].seller;
                amounts[currentIndex] = listings[i].amount;
                basePrices[currentIndex] = listings[i].basePrice;
                currentIndex++;
            }
        }
        
        return (listingIds, sellers, amounts, basePrices);
    }

    function getListingsBySeller(address seller) external view returns (uint256[] memory) {
        return sellerListings[seller];
    }

    function getSuggestedPrice() external view returns (uint256) {
        return energyToken.getAveragePrice(1 days);  // Get average price over last 24 hours
    }
}