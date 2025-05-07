# Lightem Project Architecture Documentation

## Project Overview
Lightem is a P2P Ethereum-based energy trading platform that enables users to trade energy tokens through auctions and fixed-price listings. The project consists of three main components:
1. Smart Contracts (Solidity)
2. Frontend (React)
3. Backend (Node.js/Express)

## Current Development Status

### 1. Smart Contracts (Completed)
- **EnergyToken.sol**: ERC20 token for energy trading
  - Manages energy token minting and transfers
  - Tracks energy batches with location data
  - Maintains price history
- **UserRegistry.sol**: User management system
  - Handles user registration
  - Stores user location and reputation
  - Manages user roles (producer/consumer)
- **ReverseAuctionMarket.sol**: Reverse auction system
  - Enables consumers to create energy requests
  - Allows producers to bid on requests
  - Handles auction completion and token transfers
- **FixedPriceMarket.sol**: Fixed-price trading system
  - Enables producers to list energy at fixed prices
  - Allows consumers to purchase listed energy
  - Manages direct energy token transfers

### 2. Frontend (In Progress)
- React application with Vite
- Project structure:
  - src/
    - components/
    - pages/
    - services/
    - utils/
- Dependencies:
  - React 18.2.0
  - Web3.js for blockchain interaction
  - Chakra UI for styling
  - React Router for navigation
- Status:
  - ⏳ Basic project setup complete
  - ⏳ Component implementation in progress
  - ⏳ Blockchain integration pending

### 3. Backend (In Progress)
- Node.js/Express application
- Project structure:
  - config/
  - controllers/
  - middleware/
  - models/
  - routes/
  - services/
- Status:
  - ⏳ Basic server setup complete
  - ⏳ Database models created
  - ⏳ API routes implementation in progress
  - ⏳ Blockchain integration pending

## Next Steps (Updated)
1. Set up local development environment:
   - Install and configure Ganache
   - Deploy smart contracts to local network
   - Set up MongoDB database
2. Complete backend implementation:
   - Implement remaining controllers
   - Set up Web3 event listeners
   - Add authentication middleware
3. Complete frontend implementation:
   - Implement wallet connection
   - Create trading interfaces
   - Add real-time updates
4. Integration and testing:
   - Connect frontend with backend
   - Test complete trading flow
   - Record demonstration video

## Development Environment
- Node.js
- MongoDB
- Ganache (Local Ethereum network)
- Truffle (Smart contract development)
- Web3.js
- Express.js
- React

## API Endpoints (To Be Implemented)
1. User Management
   - POST /api/users/register
   - GET /api/users/:address
   - PUT /api/users/:address

2. Energy Management
   - POST /api/energy/mint
   - GET /api/energy/batches
   - GET /api/energy/price-history

3. Auction Management
   - POST /api/auctions/create
   - POST /api/auctions/:id/bid
   - GET /api/auctions/active
   - PUT /api/auctions/:id/complete

4. Listing Management
   - POST /api/listings/create
   - GET /api/listings/active
   - POST /api/listings/:id/purchase

5. Transaction Management
   - GET /api/transactions
   - GET /api/transactions/:hash

## Security Considerations
1. Web3 wallet authentication
2. Input validation
3. Rate limiting
4. Error handling
5. Transaction verification
6. Data encryption

## Future Enhancements
1. Real-time price updates
2. Advanced search and filtering
3. User reputation system
4. Energy consumption analytics
5. Mobile application
6. Integration with other energy networks

---
*This document will be updated as development progresses.* 