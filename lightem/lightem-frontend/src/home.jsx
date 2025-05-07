import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isBtnHovered, setIsBtnHovered] = React.useState(false);

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: theme.background,
      textAlign: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative',
    },
    heroSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    heroContent: {
      maxWidth: "800px",
      marginBottom: "2rem",
    },
    heroTitle: {
      fontSize: "2.5rem",
      fontWeight: "800",
      fontFamily: "'Poppins', sans-serif",
      color: theme.text,
      marginBottom: '1rem',
      letterSpacing: '-1px',
    },
    highlight: {
      color: theme.accent,
    },
    motto: {
      fontSize: '1rem',
      color: theme.accent,
      fontWeight: '600',
      marginBottom: '1rem',
      fontFamily: "'Poppins', sans-serif",
    },
    heroSubtitle: {
      fontSize: "1rem",
      color: theme.textSecondary,
      marginBottom: '2rem',
      fontWeight: '500',
      lineHeight: 1.5,
    },
    ctaButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: theme.accent,
      color: theme.text,
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    secondaryButton: {
      backgroundColor: theme.background,
      color: theme.text,
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: `2px solid ${theme.accent}`,
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem',
      width: '100%',
      maxWidth: '1000px',
    },
    feature: {
      background: theme.cardBackground,
      border: theme.cardBorder,
      borderRadius: '12px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'transform 0.2s',
    },
    featureIcon: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
    },
    featureTitle: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: theme.text,
      marginBottom: '0.5rem',
    },
    featureDesc: {
      fontSize: '0.95rem',
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 1.5,
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to Lightem</h1>
          <p style={styles.heroSubtitle}>Your decentralized energy marketplace</p>
          <div style={styles.ctaButtons}>
            <button 
              onClick={() => navigate('/auction-market')} 
              style={{
                ...styles.primaryButton,
                backgroundColor: isBtnHovered ? theme.accentHover : theme.accent,
              }}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
            >
              Get Started
            </button>
          </div>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <h2 style={styles.featureTitle}>Decentralized Energy Trading</h2>
            <p style={styles.featureDesc}>
              Trade energy directly with other users on our blockchain-based platform.
              No intermediaries, just peer-to-peer transactions.
            </p>
          </div>
          <div style={styles.feature}>
            <h2 style={styles.featureTitle}>Real-time Auctions</h2>
            <p style={styles.featureDesc}>
              Participate in live energy auctions to get the best prices.
              Place bids and win energy at competitive rates.
            </p>
          </div>
          <div style={styles.feature}>
            <h2 style={styles.featureTitle}>Fixed Price Listings</h2>
            <p style={styles.featureDesc}>
              Browse and purchase energy at fixed prices.
              Simple, transparent, and efficient energy trading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
