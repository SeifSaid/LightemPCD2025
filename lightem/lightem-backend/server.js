const app = require('./app');
const { startAuctionExpirationCheck } = require('./services/auctionCompletionService');

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    // Start auction expiration check
    startAuctionExpirationCheck();
});
