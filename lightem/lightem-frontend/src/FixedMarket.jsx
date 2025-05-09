import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';
import { listings } from './services/api';

const FixedMarket = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeListings, setActiveListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await listings.getActive();
        setActiveListings(res.data);
      } catch {
        setError('Failed to load listings.');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
    const interval = setInterval(fetchListings, 60000);
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: '100vh',
      transition: 'background-color 0.3s, color 0.3s',
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
      fontWeight: 800,
      margin: 0,
      color: theme.text,
      fontFamily: "'Poppins', sans-serif",
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: '1rem',
      margin: '0.5rem 0 0',
    },
    createBtn: {
      backgroundColor: theme.accent,
      color: theme.buttonText,
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 1.2fr',
      fontWeight: 600,
      color: theme.textSecondary,
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: theme.cardBackground,
      fontSize: '0.95rem',
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 1.2fr',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: theme.cardBackground,
      transition: 'background-color 0.2s',
    },
    buyBtn: {
      backgroundColor: theme.accent,
      color: theme.buttonText,
      padding: '0.5rem 1.2rem',
      borderRadius: '0.4rem',
      border: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    statusText: {
      fontWeight: 600,
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: theme.textSecondary,
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.content}><div>Loading listings...</div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.content}><div>{error}</div></div>
      </div>
    );
  }

  const sorted = [...activeListings].sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') return -1;
    if (a.status !== 'Active' && b.status === 'Active') return 1;
    return 0;
  });

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Fixed Market</h1>
            <p style={styles.subtitle}>Real-time fixed-price energy listings</p>
          </div>
          <button
            onClick={() => navigate('/list-energy')}
            style={styles.createBtn}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.accent)}
          >
            Create Listing
          </button>
        </div>

        {sorted.length > 0 ? (
          <>
            <div style={styles.tableHeader}>
              <span>Producer</span>
              <span>Available</span>
              <span>Price</span>
              <span>Location</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {sorted.map(item => (
              <div
                key={item._id}
                style={styles.tableRow}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.hoverBackground)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.cardBackground)}
              >
                <div style={{ fontWeight: 600, color: theme.text }}>{item.producerName || item.producer || item.seller?.slice(0,8)}</div>
                <div style={{ color: theme.text }}>
                  {item.remainingAmount} kWh
                  {item.status !== 'Active' && item.originalAmount && (
                    <span style={{ color: theme.textSecondary, marginLeft: 8 }}>
                      (of {item.originalAmount} kWh)
                    </span>
                  )}
                </div>
                <div style={{ fontWeight: 600, color: theme.text }}>{item.basePrice} wei</div>
                <div style={{ color: theme.textSecondary }}>{item.location || '--'}</div>
                <div style={{ ...styles.statusText, color: item.status === 'Active' ? theme.successColor : item.status === 'Sold' ? theme.errorColor : theme.accent }}>
                  {item.status}
                </div>
                <div>
                  {item.status === 'Active' ? (
                    <button
                      style={{
                        ...styles.buyBtn,
                        backgroundColor: hoveredId === item._id ? theme.accentHover : theme.accent,
                        color: theme.buttonText,
                      }}
                      onMouseEnter={() => setHoveredId(item._id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => navigate('/buy-energy', { state: { listing: item } })}
                    >
                      Buy Now
                    </button>
                  ) : (
                    <span style={{ color: theme.textSecondary, fontWeight: 600 }}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={styles.emptyState}>
            <h3>No fixed listings available</h3>
            <p>Be the first to create a listing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedMarket;
