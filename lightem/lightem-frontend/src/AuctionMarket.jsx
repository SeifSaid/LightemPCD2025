import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';

const AuctionMarket = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('open');
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      buyer: "GreenGuru",
      energy: 61,
      elapsedTime: 35,
      completion: "98.45%",
      distance: "7 km (Ariana)",
      orders: "112 orders",
      bestBid: '100.99 wei',
      role: "buyer",
      status: "open",
    },
    {
      id: 2,
      buyer: "BioBeth",
      energy: 21,
      elapsedTime: 285,
      completion: "78.9%",
      distance: "12 km (Lac2)",
      orders: "41 orders",
      bestBid: '-',
      role: "buyer",
      status: "open",
    },
    {
      id: 3,
      buyer: "SunPower",
      energy: 45,
      elapsedTime: 120,
      completion: "85.2%",
      distance: "5 km (Marsa)",
      orders: "67 orders",
      bestBid: '99.50 wei',
      role: "buyer",
      status: "closed",
    },
    {
      id: 4,
      buyer: "EcoVolt",
      energy: 80,
      elapsedTime: 200,
      completion: "92.1%",
      distance: "9 km (Bardo)",
      orders: "88 orders",
      bestBid: '120.00 wei',
      role: "buyer",
      status: "closed",
    },
  ]);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions((prev) =>
        prev.map((a) => ({
          ...a,
          elapsedTime: a.status === 'open' ? a.elapsedTime + 1 : a.elapsedTime,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAuctions = auctions.filter(auction => auction.status === activeTab);

  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: theme.background,
      minHeight: '100vh',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      margin: 0,
      color: theme.text,
      fontFamily: "'Poppins', sans-serif",
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: '1rem',
      margin: '0.5rem 0 0 0',
    },
    startAuctionBtn: {
      backgroundColor: theme.accent,
      color: theme.text,
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    tabs: {
      display: 'flex',
      borderBottom: `1px solid ${theme.border}`,
      marginBottom: '1.5rem',
      gap: '1rem',
    },
    tabBtn: isActive => ({
      padding: '0.75rem 1.5rem',
      border: 'none',
      background: 'none',
      fontWeight: isActive ? '600' : '500',
      color: isActive ? theme.accent : theme.textSecondary,
      borderBottom: isActive ? `2px solid ${theme.accent}` : '2px solid transparent',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    }),
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
      fontWeight: '600',
      color: theme.textSecondary,
      padding: '1rem 0',
      borderBottom: `1px solid ${theme.border}`,
      fontSize: '0.95rem',
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${theme.border}`,
      fontSize: '0.95rem',
      background: theme.cardBackground,
      transition: 'background 0.2s',
    },
    tableRowHover: {
      background: '#fafafa',
    },
    bidBtn: {
      backgroundColor: theme.accent,
      color: theme.text,
      padding: '0.5rem 1.25rem',
      borderRadius: '0.4rem',
      border: 'none',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    bidBtnHover: {
      backgroundColor: '#e6b800',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: theme.textSecondary,
      fontSize: '0.95rem',
      textDecoration: 'none',
      marginBottom: '1rem',
      cursor: 'pointer',
      width: 'fit-content',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'inline-block',
    },
    statusOpen: {
      backgroundColor: '#dcfce7',
      color: '#059669',
    },
    statusClosed: {
      backgroundColor: theme.isDarkMode ? '#3a2323' : '#fee2e2',
      color: theme.isDarkMode ? '#fca5a5' : '#dc2626',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: theme.textSecondary,
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Auction Market</h1>
            <p style={styles.subtitle}>
              {activeTab === 'open' 
                ? 'Active auctions that you can participate in'
                : 'Recently closed auctions and their results'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/start-auction')} 
            style={styles.startAuctionBtn}
            onMouseEnter={e => e.target.style.backgroundColor = theme.accentHover}
            onMouseLeave={e => e.target.style.backgroundColor = theme.accent}
          >
            Start New Auction
          </button>
        </div>
        <div style={styles.tabs}>
          <button 
            style={styles.tabBtn(activeTab === 'open')} 
            onClick={() => setActiveTab('open')}
          >
            Open Auctions
          </button>
          <button 
            style={styles.tabBtn(activeTab === 'closed')} 
            onClick={() => setActiveTab('closed')}
          >
            Closed Auctions
          </button>
        </div>
        {filteredAuctions.length > 0 ? (
          <>
            <div style={styles.tableHeader}>
              <span>Buyer</span>
              <span>Energy amount</span>
              <span>Current best bid</span>
              <span>Time</span>
              <span>Action</span>
            </div>
            {filteredAuctions.map((auction) => (
              <div 
                key={auction.id} 
                style={styles.tableRow}
              >
                <div>
                  <div style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>
                    {auction.buyer}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: theme.textSecondary, lineHeight: '1.5' }}>
                    {auction.completion} &bull; {auction.distance}<br />
                    {auction.orders}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: theme.text }}>{auction.energy} kWh</div>
                <div style={{ fontWeight: '600', color: theme.text }}>{auction.bestBid}</div>
                <div>
                  {auction.status === 'open' ? (
                    <div style={{ fontFamily: "'Inter', monospace", fontWeight: '600', color: theme.text }}>
                      {formatTime(auction.elapsedTime)}
                    </div>
                  ) : (
                    <span style={{ ...styles.statusBadge, ...styles.statusClosed }}>
                      Closed
                    </span>
                  )}
                </div>
                <div>
                  {auction.status === 'open' ? (
                    <button 
                      style={{
                        ...styles.bidBtn,
                        backgroundColor: hoveredButtonId === auction.id ? '#e6b800' : '#facc15',
                        color: '#222',
                      }}
                      onMouseEnter={() => setHoveredButtonId(auction.id)}
                      onMouseLeave={() => setHoveredButtonId(null)}
                      onClick={() => navigate('/bid', { state: { auction } })}
                    >
                      Place Bid
                    </button>
                  ) : (
                    <button 
                      style={{ 
                        ...styles.bidBtn, 
                        backgroundColor: theme.isDarkMode ? '#444c56' : '#e5e7eb', 
                        color: theme.isDarkMode ? '#d1d5db' : '#666',
                      }}
                      onClick={() => navigate('/bid', { state: { auction, viewOnly: true } })}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={styles.emptyState}>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>
              No {activeTab} auctions found
            </h3>
            <p style={{ color: '#888' }}>
              {activeTab === 'open' 
                ? 'Check back later for new auctions or start your own'
                : 'No closed auctions to display'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionMarket;
