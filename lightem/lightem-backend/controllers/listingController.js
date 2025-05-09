const Listing = require('../models/Listing');
const { createListingOnChain, purchaseListingOnChain } = require('../services/blockchainListingService');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Create a new listing
exports.createListing = async (req, res) => {
    try {
        const { seller, amount, basePrice } = req.body;
        // Fetch seller's city and location from User
        const user = await User.findOne({ address: seller.toLowerCase() });
        const city = user ? user.city || '' : '';
        const latitude = user ? user.latitude : undefined;
        const longitude = user ? user.longitude : undefined;
        // Calculate location string
        const location = city && latitude && longitude ? `${city} (${latitude}, ${longitude})` : '';
        // Save city for cost breakdown
        let sellerCity = city;
        // Distance fee will be calculated at purchase time (when buyer is known)
        // Blockchain logic (future-proof)
        await createListingOnChain({ seller, amount, basePrice });
        // DB logic
        const listing = new Listing({ seller, amount, remainingAmount: amount, basePrice, city, latitude, longitude, location, sellerCity });
        await listing.save();
        res.status(201).json({ message: 'Listing created successfully', listing });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ message: 'Error creating listing', error: error.message });
    }
};

// Get all active listings
exports.getActiveListings = async (req, res) => {
    try {
        const now = new Date();
        const listings = await Listing.find({});
        // Mark expired listings as inactive
        await Promise.all(listings.map(async (listing) => {
            if (listing.isActive && listing.expiresAt && listing.expiresAt < now) {
                listing.isActive = false;
                await listing.save();
            }
        }));
        // Only return active and not expired listings
        const activeListings = listings.filter(l => l.isActive && (!l.expiresAt || l.expiresAt > now));
        // Populate seller's city and status for each listing
        const enrichedListings = await Promise.all(activeListings.map(async (listing) => {
            const user = await User.findOne({ address: listing.seller.toLowerCase() });
            let status = 'Active';
            if (listing.remainingAmount === 0) status = 'Sold';
            if (listing.expiresAt && listing.expiresAt < now) status = 'Expired';
            return {
                ...listing.toObject(),
                city: listing.city || (user ? user.city || '' : ''),
                originalAmount: listing.amount,
                status,
            };
        }));
        res.json(enrichedListings);
    } catch (error) {
        console.error('Error getting listings:', error);
        res.status(500).json({ message: 'Error getting listings', error: error.message });
    }
};

// Purchase a listing
exports.purchaseListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { buyer, finalPrice, purchaseAmount } = req.body;
        // Check if buyer is a registered user
        const user = await User.findOne({ address: buyer.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Buyer must be a registered user' });
        }
        // DB logic
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        if (purchaseAmount > listing.remainingAmount) {
            return res.status(400).json({ message: 'Purchase amount exceeds available energy' });
        }
        // Calculate distance fee at purchase time
        let distanceFee = 0;
        let buyerCity = user.city || '';
        if (listing.latitude && listing.longitude && user.latitude && user.longitude && listing.latitude !== 0 && listing.longitude !== 0 && user.latitude !== 0 && user.longitude !== 0) {
            function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                const R = 6371;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                return R * c;
            }
            const distance = getDistanceFromLatLonInKm(listing.latitude, listing.longitude, user.latitude, user.longitude);
            distanceFee = Math.round(distance * 0.1 * 10000) / 10000; // 0.1 wei/km, rounded
        }
        listing.remainingAmount -= purchaseAmount;
        if (listing.remainingAmount <= 0) {
            listing.isActive = false;
            listing.buyer = buyer;
            listing.finalPrice = finalPrice;
            listing.remainingAmount = 0;
        }
        await listing.save();
        // Record transaction for both buyer and seller
        const now = new Date();
        const txHash = `${listing._id}_${now.getTime()}`;
        await Transaction.create({
            type: 'LISTING',
            from: listing.seller,
            to: buyer,
            amount: purchaseAmount,
            price: finalPrice,
            transactionHash: txHash,
            status: 'COMPLETED',
            timestamp: now,
            distanceFee,
            sellerCity: listing.city,
            buyerCity,
        });
        res.json({ message: 'Listing purchased successfully', listing, distanceFee, sellerCity: listing.city, buyerCity });
    } catch (error) {
        console.error('Error purchasing listing:', error);
        res.status(500).json({ message: 'Error purchasing listing', error: error.message });
    }
}; 