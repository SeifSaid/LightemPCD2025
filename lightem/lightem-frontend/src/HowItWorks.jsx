import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';
import { FaLeaf, FaPlug, FaBolt, FaHandshake, FaSolarPanel, FaGlobeEurope } from 'react-icons/fa';

const HowItWorks = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isBtnHovered, setIsBtnHovered] = React.useState(false);

  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s, color 0.3s',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    banner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: '16px',
      padding: '1.5rem 2rem',
      marginBottom: '2rem',
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.1)',
      border: `1px solid ${theme.border}`,
      transition: 'background-color 0.3s, box-shadow 0.3s',
    },
    bannerIcon: {
      fontSize: '2.5rem',
      color: theme.accent,
      marginRight: '1rem',
      backgroundColor: theme.iconBackground,
      borderRadius: '50%',
      padding: '0.7rem',
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.05)',
    },
    bannerText: {
      fontSize: '1.25rem',
      color: theme.accent,
      fontWeight: 700,
      fontFamily: "'Poppins', sans-serif",
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    titleGroup: {
      flex: '1 1 auto',
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
    button: {
      backgroundColor: isBtnHovered ? theme.accentHover : theme.accent,
      color: theme.buttonText,
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    steps: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
    },
    step: {
      backgroundColor: theme.cardBackground,
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    stepIcon: {
      fontSize: '2.2rem',
      color: theme.accent,
      marginBottom: '1rem',
      backgroundColor: theme.iconBackground,
      borderRadius: '50%',
      padding: '0.7rem',
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.05)',
    },
    stepNumber: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: theme.accent,
      marginBottom: '0.75rem',
    },
    stepTitle: {
      fontSize: '1.1rem',
      fontWeight: 700,
      color: theme.text,
      marginBottom: '0.5rem',
    },
    stepText: {
      color: theme.textSecondary,
      fontSize: '1rem',
      lineHeight: 1.6,
      textAlign: 'center',
    },
    whySection: {
      margin: '4rem auto',
      maxWidth: '900px',
      backgroundColor: theme.cardBackground,
      borderRadius: '16px',
      padding: '2rem',
      border: `1px solid ${theme.border}`,
      transition: 'background-color 0.3s, box-shadow 0.3s',
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.1)',
    },
    whyTitle: {
      fontSize: '1.5rem',
      fontWeight: 800,
      color: theme.accent,
      marginBottom: '1rem',
      fontFamily: "'Poppins', sans-serif",
      display: 'flex',
      alignItems: 'center',
    },
    whyDesc: {
      fontSize: '1rem',
      color: theme.textSecondary,
      lineHeight: 1.7,
    },
    getStarted: {
      margin: '3rem auto',
      maxWidth: '700px',
      backgroundColor: theme.cardBackground,
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'center',
      border: `1px solid ${theme.border}`,
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.1)',
    },
    getStartedTitle: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: theme.accent,
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    getStartedDesc: {
      fontSize: '1rem',
      color: theme.textSecondary,
      marginBottom: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.content}>
        <div style={styles.banner}>
          <FaLeaf style={styles.bannerIcon} />
          <span style={styles.bannerText}>Green, Decentralized, Empowering</span>
        </div>

        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>How It Works</h1>
            <p style={styles.subtitle}>Learn how to trade energy on our platform</p>
          </div>
          <button
            onClick={() => navigate('/auction-market')}
            style={styles.button}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            Start Trading
          </button>
        </div>

        <div style={styles.steps}>
          {[
            { icon: <FaPlug />, number: '01', title: 'Connect Your Wallet', desc: 'Connect your Web3 wallet to access the platform. We support MetaMask and other popular wallets.' },
            { icon: <FaBolt />, number: '02', title: 'Choose Your Market', desc: 'Browse the auction market for competitive prices or the fixed market for immediate purchases.' },
            { icon: <FaHandshake />, number: '03', title: 'Trade Energy', desc: 'Place bids in auctions or buy directly at fixed prices. Complete transactions securely on the blockchain.' },
          ].map((step, idx) => (
            <div
              key={idx}
              style={styles.step}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={styles.stepIcon}>{step.icon}</div>
              <div style={styles.stepNumber}>{step.number}</div>
              <h2 style={styles.stepTitle}>{step.title}</h2>
              <p style={styles.stepText}>{step.desc}</p>
            </div>
          ))}
        </div>

        <section style={styles.whySection}>
          <h2 style={styles.whyTitle}><FaGlobeEurope style={{ marginRight: 8 }} />Why Lightem?</h2>
          <p style={styles.whyDesc}>
            <strong>Lightem</strong> is more than a marketplace—it’s a movement for a cleaner, greener future. We empower communities to trade renewable energy, reduce carbon emissions, and support local producers.
          </p>
          <p style={styles.whyDesc}>
            <strong>Why choose us?</strong><br />
            • <strong>Eco-friendly:</strong> All trades support green energy.<br />
            • <strong>Decentralized:</strong> No middlemen, just peer-to-peer.<br />
            • <strong>Transparent:</strong> Every transaction is on the blockchain.<br />
            • <strong>Community-driven:</strong> You control your energy.
          </p>
        </section>

        <div style={styles.getStarted}>
          <div style={styles.getStartedTitle}><FaSolarPanel style={{ marginRight: 8 }} />Ready to Get Started?</div>
          <div style={styles.getStartedDesc}>
            Join Lightem today and help build a sustainable energy future.
            <button
              onClick={() => navigate('/signup')}
              style={{ ...styles.button, marginTop: '1rem' }}
            >
              Create Your Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
