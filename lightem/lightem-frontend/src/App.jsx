import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { ThemeProvider } from './context/ThemeContext';
import Home from './home.jsx';
import HowItWorks from './HowItWorks.jsx';
import AuctionMarket from './AuctionMarket.jsx';
import FixedMarket from './FixedMarket.jsx';
import Dashboard from './dashboard.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';
import OrderEnergy from './OrderEnergy.jsx';
import ListEnergy from './list-energy.jsx';
import BuyEnergy from './buy-energy.jsx';
import BidPage from './BidPage.jsx';
import StartAuctionPage from './StartAuctionPage.jsx';
import { AuthProvider } from './context/AuthContext';
import { AuctionProvider } from './context/AuctionContext';

function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <AuctionProvider>
          <ThemeProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/auction-market" element={<AuctionMarket />} />
                <Route path="/fixed-market" element={<FixedMarket />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/order-energy" element={<OrderEnergy />} />
                <Route path="/list-energy" element={<ListEnergy />} />
                <Route path="/buy-energy" element={<BuyEnergy />} />
                <Route path="/bid/:auctionId" element={<BidPage />} />
                <Route path="/start-auction" element={<StartAuctionPage />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </AuctionProvider>
      </AuthProvider>
    </Web3Provider>
  );
}

export default App;
