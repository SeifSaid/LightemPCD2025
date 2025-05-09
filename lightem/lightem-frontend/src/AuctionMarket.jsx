import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { useAuctions } from './context/AuctionContext';
import { useToast } from '@chakra-ui/react';
import { useWeb3 } from './context/Web3Context';

const AuctionMarket = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: userLoading } = useAuth();
  const { activeAuctions, completedAuctions, loading, error } = useAuctions();
  const [activeTab, setActiveTab] = useState('open');
  const [hoveredBidId, setHoveredBidId] = useState(null);
  const { account } = useWeb3();

  const isFullyConnected =
    account && user && user.address && user.address.toLowerCase() === account.toLowerCase();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleStartAuction = () => {
    if (userLoading) return;
    if (!isFullyConnected) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to create an auction',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    navigate('/start-auction');
  };

  const handlePlaceBid = id => {
    if (userLoading) return;
    if (!isFullyConnected) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to place a bid',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    navigate(`/bid/${id}`);
  };

  const formatTime = endTime => {
    const now = new Date();
    const diff = Math.floor((new Date(endTime) - now) / 1000);
    const mins = String(Math.floor(diff / 60)).padStart(2, '0');
    const secs = String(diff % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: '100vh',
      transition: 'background-color 0.3s, color 0.3s',
    },
    content: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    title: {
      fontSize: '2.5rem',
      fontWeight: 800,
      margin: 0,
      color: theme.text,
      fontFamily: "'Poppins', sans-serif",
    },
    subtitle: { color: theme.textSecondary, fontSize: '1rem', margin: '0.5rem 0 0' },
    startAuctionBtn: {
      backgroundColor: theme.accent,
      color: theme.buttonText,
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    tabs: { display: 'flex', borderBottom: `1px solid ${theme.border}`, marginBottom: '2rem', gap: '1rem' },
    tabBtn: active => ({
      padding: '0.75rem 1.5rem',
      background: 'none',
      border: 'none',
      fontWeight: active ? 600 : 500,
      color: active ? theme.accent : theme.textSecondary,
      borderBottom: active ? `2px solid ${theme.accent}` : '2px solid transparent',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
      fontWeight: 600,
      color: theme.textSecondary,
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${theme.border}`,
      fontSize: '0.95rem',
      backgroundColor: theme.cardBackground,
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${theme.border}`,
      fontSize: '0.95rem',
      backgroundColor: theme.cardBackground,
      transition: 'background-color 0.2s',
    },
    tableRowHover: { backgroundColor: theme.hoverBackground },
    bidBtn: {
      backgroundColor: theme.accent,
      color: theme.buttonText,
      padding: '0.5rem 1.25rem',
      borderRadius: '0.4rem',
      border: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: 500,
      display: 'inline-block',
    },
    statusOpen: {
      backgroundColor: theme.successBg,
      color: theme.successColor,
    },
    statusClosed: {
      backgroundColor: theme.errorBg || '#fee2e2',
      color: theme.errorColor || '#dc2626',
    },
    emptyState: { textAlign: 'center', padding: '3rem', color: theme.textSecondary },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.content}>
          <div style={{ color: theme.text }}>Loading auctions...</div>
        </div>
      </div>
    );
  }

  const auctions = activeTab === 'open' ? activeAuctions : completedAuctions;

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Auction Market</h1>
            <p style={styles.subtitle}>
              {activeTab === 'open'
                ? 'Participate now in live energy auctions!'
                : 'Explore results from completed auctions'}
            </p>
          </div>
          <button
            onClick={handleStartAuction}
            style={styles.startAuctionBtn}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.accent)}
            disabled={userLoading}
          >
            {userLoading ? 'Loading...' : 'Start New Auction'}
          </button>
        </div>

        <div style={styles.tabs}>
          {['open', 'closed'].map(tab => (
            <button
              key={tab}
              style={styles.tabBtn(activeTab === tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'open' ? 'Open Auctions' : 'Closed Auctions'}
            </button>
          ))}
        </div>

        {auctions.length > 0 ? (
          <>
            <div style={styles.tableHeader}>
              <span>Buyer</span>
              <span>Energy Amount</span>
              <span>Current Best Bid</span>
              <span>Time</span>
              <span>Action</span>
            </div>
            {auctions.map(a => (
              <div
                key={a._id}
                style={styles.tableRow}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.hoverBackground)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.cardBackground)}
              >
                <div>
                  <div style={{ fontWeight: 600, color: theme.text }}>{a.buyerName || a.buyer?.slice(0, 8) + '...'}</div>
                  <div style={{ fontSize: '0.875rem', color: theme.textSecondary }}>
                    {a.bids.length} bids • {a.amount} kWh
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: theme.text }}>{a.amount} kWh</div>
                <div style={{ fontWeight: 600, color: theme.text }}>
                  {a.bids.length ? `${Math.min(...a.bids.map(b => b.basePrice))} ETH` : 'No bids yet'}
                </div>
                <div>
                  {a.status === 'ACTIVE' ? (
                    <code style={{ fontFamily: 'monospace', color: theme.text }}>{formatTime(a.endTime)}</code>
                  ) : (
                    <span style={{ ...styles.statusBadge, ...styles.statusClosed }}>{a.status}</span>
                  )}
                </div>
                <div>
                  <button
                    style={{
                      ...styles.bidBtn,
                      backgroundColor:
                        a.status === 'ACTIVE'
                          ? hoveredBidId === a._id
                            ? theme.accentHover
                            : theme.accent
                          : theme.border,
                      color: a.status === 'ACTIVE' ? theme.buttonText : theme.textSecondary,
                    }}
                    onMouseEnter={() => setHoveredBidId(a._id)}
                    onMouseLeave={() => setHoveredBidId(null)}
                    onClick={() => handlePlaceBid(a._id)}
                    disabled={userLoading}
                  >
                    {a.status === 'ACTIVE' ? 'Place Bid' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={styles.emptyState}>
            <h3>No {activeTab === 'open' ? 'open' : 'closed'} auctions found</h3>
            <p>{activeTab === 'open' ? 'Be the first to start an auction!' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionMarket;
