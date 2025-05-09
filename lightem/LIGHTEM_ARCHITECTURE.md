# Lightem Project Architecture Documentation
# By :
# Seifeddine Said
# Mohamed Aziz Jridi
# Ines Talbi

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

### 2. Frontend (Integration Complete for Fixed Market)
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
  - ✅ Basic project setup complete
  - ✅ Wallet connection and authentication
  - ✅ Listing creation and purchase fully integrated with backend
  - ✅ Listings display seller city, available amount, and sold/finished status
  - ✅ Partial purchases update remaining amount and listing status in real time
  - ✅ Robust error handling and user feedback
  - ✅ Auction and other flows

### 3. Backend (Integration Complete for Fixed Market)
- Node.js/Express application
- Project structure:
  - config/
  - controllers/
  - middleware/
  - models/
  - routes/
  - services/
- Status:
  - ✅ Listing model includes seller, amount, remainingAmount, city, and status
  - ✅ Listing creation fetches seller city from User model
  - ✅ Purchase endpoint supports partial purchases and updates remainingAmount
  - ✅ Listings are marked as sold/finished when depleted
  - ✅ Listings API returns enriched data for frontend display
  - ✅ All endpoints tested and integrated with frontend
  - ✅ Auction/energy integration

## Integration Progress (as of 2025-05-09)
- **Fixed Market flow is fully integrated and robust:**
  - Users can create listings with their wallet address and city
  - Listings display all relevant info (city, available, price, status)
  - Partial purchases are supported; listings update in real time
  - Sold/finished listings are visually distinct and sorted last
  - All error and edge cases are handled
- **Next Steps:**
  - Complete auction and energy flows
  - Add advanced search/filtering and analytics
  - Continue improving UI/UX and real-time updates

## Development Environment Setup Guide
1. Smart Contract Development:
   - Install Truffle globally: `npm install -g truffle`
   - Install Ganache (GUI version recommended)
   - Configure truffle-config.js for local network

2. Backend Setup:
   - Install MongoDB and MongoDB Compass
   - Configure MongoDB connection in backend/config
   - Install dependencies: `cd lightem-backend && npm install`
   - Start server: `npm run dev`

3. Frontend Setup:
   - Install dependencies: `cd lightem-frontend && npm install`
   - Start development server: `npm run dev`

4. Testing Environment:
   - Configure Ganache network (localhost:7545)
   - Deploy contracts using Truffle
   - Test Web3 integration

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

## Backend Progress (as of 2025-05-09)

| Component         | Description                                 | Progress |
|-------------------|---------------------------------------------|----------|
| User API          | Register, login, update, get, on-chain sync | 100%     |
| Energy API        | Mint, transfer, get, on-chain sync, tx hash | 100%     |
| Auction API       | Create, bid, complete, on-chain sync        | 100%     |
| Listing API       | Create, get, purchase (DB + future on-chain)| 100%     |
| Transaction API   | Get, list, by user/hash, modularized        | 100%     |
| Blockchain Logic  | Fully modularized in services               | 100%     |
| Auth Middleware   | JWT, web3 signature                         | 100%     |
| Testing Scripts   | API and sync scripts                        | 100%     |


### Next Steps

1. **Medium Term (Next 2 Weeks)**
   - Add advanced features (search, filtering)
   - Implement real-time updates
   - Add analytics and reporting

2. **Long Term (Next Month)**
   - Scale infrastructure
   - Add mobile API support
   - Implement advanced security features

## API Documentation

### User Management
1. **Register User**
   - `POST /api/users/register`
   - Body: `{ address, name, latitude, longitude, isProducer }`
   - Creates user in both MongoDB and blockchain
   - Returns: User object with blockchain registration status

2. **Login User**
   - `POST /api/users/login`
   - Body: `{ address, signature }`
   - Verifies blockchain signature
   - Returns: JWT token and user data

### Energy Management
1. **Mint Energy**
   - `POST /api/energy/mint`
   - Body: `{ address, amount, price }`
   - Creates energy tokens on blockchain
   - Records batch in MongoDB
   - Returns: Transaction details and batch info

2. **Transfer Energy**
   - `POST /api/energy/transfer`
   - Body: `{ from, to, amount }`
   - Transfers tokens on blockchain
   - Records transaction in MongoDB
   - Returns: Transaction details

### Auction Management
1. **Create Auction**
   - `POST /api/auctions/create`
   - Body: `{ amount, maxBasePrice, duration, buyer }`
   - Creates auction on blockchain
   - Records in MongoDB
   - Returns: Auction details with blockchain ID

2. **Place Bid**
   - `POST /api/auctions/:auctionId/bid`
   - Body: `{ basePrice, bidder }`
   - Places bid on blockchain
   - Updates MongoDB auction
   - Returns: Updated auction with new bid

3. **Complete Auction**
   - `PUT /api/auctions/:auctionId/complete`
   - Body: `{ buyer }`
   - Completes auction on blockchain
   - Updates MongoDB status
   - Returns: Final auction state

### Listing Management
1. **Create Listing**
   - `POST /api/listings/create`
   - Body: `{ seller, amount, price }`
   - Creates listing in MongoDB
   - Returns: Listing details

2. **Purchase Listing**
   - `POST /api/listings/:id/purchase`
   - Body: `{ buyer }`
   - Executes purchase on blockchain
   - Updates listing status
   - Returns: Transaction details

## User Scenarios

### 1. Energy Producer Flow
1. **Registration**
   ```javascript
   // Frontend: Register as producer
   const response = await api.post('/users/register', {
     address: walletAddress,
     name: "Solar Farm A",
     latitude: 40.7128,
     longitude: -74.0060,
     isProducer: true
   });
   ```

2. **Mint Energy**
   ```javascript
   // Frontend: Mint new energy batch
   const response = await api.post('/energy/mint', {
     address: walletAddress,
     amount: 100,
     price: 50
   });
   ```

3. **Create Listing**
   ```javascript
   // Frontend: Create fixed price listing
   const response = await api.post('/listings/create', {
     seller: walletAddress,
     amount: 50,
     price: 45
   });
   ```

### 2. Energy Consumer Flow
1. **Registration**
   ```javascript
   // Frontend: Register as consumer
   const response = await api.post('/users/register', {
     address: walletAddress,
     name: "Home A",
     latitude: 40.7128,
     longitude: -74.0060,
     isProducer: false
   });
   ```

2. **Create Auction**
   ```javascript
   // Frontend: Create energy request
   const response = await api.post('/auctions/create', {
     amount: 20,
     maxBasePrice: 60,
     duration: 3600,
     buyer: walletAddress
   });
   ```

3. **Monitor Bids**
   ```javascript
   // Frontend: Poll for new bids
   const auction = await api.get(`/auctions/${auctionId}`);
   // Update UI with new bids
   ```

### 3. Trading Flow
1. **Fixed Price Purchase**
   ```javascript
   // Frontend: Buy from listing
   const response = await api.post(`/listings/${listingId}/purchase`, {
     buyer: walletAddress
   });
   ```

2. **Auction Participation**
   ```javascript
   // Frontend: Place bid
   const response = await api.post(`/auctions/${auctionId}/bid`, {
     basePrice: 55,
     bidder: walletAddress
   });
   ```

## Frontend Integration Guide

### 1. Project Structure
```
lightem-frontend/
├── src/
│   ├── services/
│   │   └── api.js           # API integration layer
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── AuctionContext.jsx # Auction state management
│   ├── components/          # Reusable UI components
│   └── pages/              # Page components
```

### 2. Integration Setup

1. **API Service Layer**
   - Located in `src/services/api.js`
   - Handles all backend communication
   - Includes error handling and auth token management
   - Organized by feature (auth, auctions, energy, etc.)

2. **Context Providers**
   - `AuthContext`: Manages user authentication state
   - `AuctionContext`: Manages auction state and operations
   - Wrap app in providers in `App.jsx`:
   ```jsx
   <AuthProvider>
     <AuctionProvider>
       <App />
     </AuctionProvider>
   </AuthProvider>
   ```

3. **Usage in Components**
   ```jsx
   import { useAuth } from '../context/AuthContext';
   import { useAuctions } from '../context/AuctionContext';
   import { auctions } from '../services/api';

   function AuctionComponent() {
     const { user } = useAuth();
     const { activeAuctions, placeBid } = useAuctions();

     const handleBid = async (auctionId, price) => {
       try {
         await placeBid(auctionId, { basePrice: price, bidder: user.address });
       } catch (error) {
         // Handle error
       }
     };
   }
   ```

### 3. Key Features

1. **Authentication**
   - JWT token management
   - Automatic token refresh
   - Protected routes
   - Web3 wallet integration

2. **Real-time Updates**
   - Automatic auction refresh every minute
   - WebSocket support for instant updates
   - Loading states and error handling

3. **Error Handling**
   - Global error interceptor
   - User-friendly error messages
   - Automatic logout on auth errors

4. **State Management**
   - Context-based state management
   - Optimistic updates
   - Loading and error states

### 4. Integration Notes

1. **Environment Setup**
   - Set `VITE_API_URL` in `.env` file
   - Configure CORS in backend
   - Enable WebSocket if using real-time features

2. **Security Considerations**
   - Store tokens in localStorage
   - Validate all user inputs
   - Handle Web3 wallet errors
   - Implement rate limiting

3. **Performance Optimization**
   - Implement request caching
   - Use pagination for large lists
   - Optimize re-renders with useMemo/useCallback

4. **Testing**
   - Unit tests for API services
   - Integration tests for contexts
   - E2E tests for critical flows

### 5. Common Issues and Solutions

1. **CORS Errors**
   - Ensure backend CORS configuration includes frontend URL
   - Check for proper headers in requests

2. **Authentication Issues**
   - Verify token storage and refresh logic
   - Check Web3 wallet connection
   - Validate signature verification

3. **Real-time Updates**
   - Implement fallback to polling
   - Handle connection errors
   - Manage WebSocket reconnection

4. **Blockchain Integration**
   - Handle transaction confirmations
   - Manage gas fees
   - Handle network changes

---
*This document reflects the current state of integration and will be updated as development progresses.* 
