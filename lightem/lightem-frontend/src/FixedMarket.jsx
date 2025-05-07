import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';

const FixedMarket = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [listings] = useState([
    {
      id: 1,
      producer: "GreenGuru",
      energy: 61,
      price: "100.99 wei",
      distance: "7 km (Ariana)",
      orders: "112 orders",
      completion: "98.45%",
    },
    {
      id: 2,
      producer: "BioBeth",
      energy: 21,
      price: "95.50 wei",
      distance: "12 km (Lac2)",
      orders: "41 orders",
      completion: "78.9%",
    },
    {
      id: 3,
      producer: "SunPower",
      energy: 45,
      price: "99.50 wei",
      distance: "5 km (Marsa)",
      orders: "67 orders",
      completion: "85.2%",
    },
    {
      id: 4,
      producer: "EcoVolt",
      energy: 80,
      price: "120.00 wei",
      distance: "9 km (Bardo)",
      orders: "88 orders",
      completion: "92.1%",
    },
  ]);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

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
    createListingBtn: {
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
    buyBtn: {
      backgroundColor: hoveredButtonId ? theme.accentHover : theme.accent,
      color: theme.text,
      padding: '0.5rem 1.25rem',
      borderRadius: '0.4rem',
      border: 'none',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
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
            <h1 style={styles.title}>Fixed Market</h1>
            <p style={styles.subtitle}>Browse and purchase energy at fixed prices</p>
          </div>
          <button 
            onClick={() => navigate('/list-energy')} 
            style={styles.createListingBtn}
          >
            Create Listing
          </button>
        </div>

        {listings.length > 0 ? (
          <>
            <div style={styles.tableHeader}>
              <span>Producer</span>
              <span>Energy amount</span>
              <span>Price</span>
              <span>Location</span>
              <span>Action</span>
            </div>
            {listings.map((listing) => (
              <div 
                key={listing.id} 
                style={styles.tableRow}
              >
                <div>
                  <div style={{ fontWeight: '600', color: theme.text, fontSize: '0.95rem' }}>
                    {listing.producer}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: theme.textSecondary, lineHeight: '1.5' }}>
                    {listing.completion} &bull; {listing.orders}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: theme.text }}>{listing.energy} kWh</div>
                <div style={{ fontWeight: '600', color: theme.text }}>{listing.price}</div>
                <div style={{ color: theme.textSecondary }}>{listing.distance}</div>
                <div>
                  <button 
                    style={{
                      ...styles.buyBtn,
                      backgroundColor: hoveredButtonId === listing.id ? theme.accentHover : theme.accent,
                      color: theme.text,
                    }}
                    onMouseEnter={() => setHoveredButtonId(listing.id)}
                    onMouseLeave={() => setHoveredButtonId(null)}
                    onClick={() => navigate('/buy-energy', { state: { listing } })}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={styles.emptyState}>
            <h3 style={{ color: theme.textSecondary, marginBottom: '1rem' }}>
              No listings available
            </h3>
            <p style={{ color: theme.textSecondary }}>
              Check back later for new listings or create your own
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedMarket; 