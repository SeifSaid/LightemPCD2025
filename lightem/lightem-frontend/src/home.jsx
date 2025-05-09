import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';
import { FaLeaf, FaBolt, FaHandshake, FaGlobeEurope, FaSolarPanel } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isBtnHovered, setIsBtnHovered] = React.useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: theme.background,
      textAlign: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    heroSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3rem 2rem',
      margin: '0 auto',
      maxWidth: '1200px',
      backgroundColor: theme.cardBackground,
      borderRadius: '0 0 32px 32px',
      boxShadow: theme.isDarkMode
        ? '0 2px 16px rgba(0,0,0,0.25)'
        : '0 2px 16px rgba(0,0,0,0.1)',
      border: `1px solid ${theme.border}`,
      transition: 'background-color 0.3s, box-shadow 0.3s',
    },
    heroIcon: {
      fontSize: '4rem',
      color: theme.accent,
      marginBottom: '1rem',
      backgroundColor: theme.iconBackground,
      borderRadius: '50%',
      padding: '1rem',
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.05)',
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 800,
      color: theme.text,
      margin: '0.5rem 0',
      letterSpacing: '-1px',
      transition: 'color 0.3s',
    },
    highlight: {
      color: theme.accent,
    },
    motto: {
      fontSize: '1.2rem',
      color: theme.accent,
      fontWeight: 700,
      marginBottom: '1rem',
      fontFamily: "'Poppins', sans-serif",
    },
    heroSubtitle: {
      fontSize: '1.1rem',
      color: theme.textSecondary,
      marginBottom: '2rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    ctaButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
      marginBottom: '2rem',
    },
    primaryButton: {
      backgroundColor: isBtnHovered ? theme.accentHover : theme.accent,
      color: theme.buttonText,
      padding: '0.85rem 1.7rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 700,
      fontSize: '1.05rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    secondaryButton: {
      backgroundColor: theme.background,
      color: theme.text,
      padding: '0.85rem 1.7rem',
      borderRadius: '0.5rem',
      border: `2px solid ${theme.accent}`,
      fontWeight: 700,
      fontSize: '1.05rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      width: '100%',
      maxWidth: '1000px',
      margin: '2rem auto',
    },
    feature: {
      backgroundColor: theme.cardBackground,
      border: `1px solid ${theme.border}`,
      borderRadius: '16px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    featureIcon: {
      fontSize: '2.2rem',
      marginBottom: '1rem',
      color: theme.accent,
      backgroundColor: theme.iconBackground,
      borderRadius: '50%',
      padding: '0.7rem',
      boxShadow: theme.isDarkMode
        ? '0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.05)',
    },
    featureTitle: {
      fontSize: '1.1rem',
      fontWeight: 700,
      color: theme.text,
      marginBottom: '0.5rem',
    },
    featureDesc: {
      fontSize: '1rem',
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 1.6,
    },
    whySection: {
      margin: '4rem auto',
      maxWidth: '900px',
      backgroundColor: theme.cardBackground,
      borderRadius: '16px',
      padding: '2rem',
      border: `1px solid ${theme.border}`,
      transition: 'background-color 0.3s',
    },
    whyTitle: {
      fontSize: '1.5rem',
      fontWeight: 800,
      color: theme.accent,
      marginBottom: '1rem',
    },
    whyDesc: {
      fontSize: '1rem',
      color: theme.textSecondary,
      lineHeight: 1.7,
    },
    divider: {
      width: '100%',
      height: '1px',
      backgroundColor: theme.border,
      margin: '2rem 0',
    },
    footer: {
      padding: '1.5rem 0',
      backgroundColor: theme.background,
      color: theme.textSecondary,
      fontSize: '1rem',
      textAlign: 'center',
      borderTop: `1px solid ${theme.border}`,
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <section style={styles.heroSection}>
        <div style={styles.heroIcon}><FaLeaf /></div>
        <div style={styles.motto}>Empowering a Greener Tomorrow</div>
        <h1 style={styles.heroTitle}>
          Welcome to <span style={styles.highlight}>Lightem</span>
        </h1>
        <p style={styles.heroSubtitle}>
          The decentralized, peer-to-peer energy marketplace for a sustainable future.<br />
          Buy, sell, and trade renewable energy directly with your community.
        </p>
        <div style={styles.ctaButtons}>
          <button
            onClick={() => navigate('/auction-market')}
            style={styles.primaryButton}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/how-it-works')}
            style={styles.secondaryButton}
          >
            How It Works
          </button>
        </div>
      </section>

      <div style={styles.features}>
        {[
          { icon: <FaBolt />, title: 'Decentralized Energy Trading', desc: 'Trade energy directly with others with no intermediaries.' },
          { icon: <FaHandshake />, title: 'Real-time Auctions', desc: 'Participate in live auctions and secure the best rates.' },
          { icon: <FaSolarPanel />, title: 'Fixed Price Listings', desc: 'Browse and purchase energy at transparent, fixed prices.' },
        ].map((f, i) => (
          <div key={i} style={styles.feature} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h2 style={styles.featureTitle}>{f.title}</h2>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      <section style={styles.whySection}>
        <h2 style={styles.whyTitle}><FaGlobeEurope style={{ verticalAlign: 'middle', marginRight: 6 }} />Why Green Energy?</h2>
        <p style={styles.whyDesc}>
          <strong>Green energy</strong> is clean, renewable, and essential for a sustainable future. By trading on Lightem, you support local producers, reduce carbon emissions, and build a resilient, eco-friendly grid.
        </p>
        <p style={styles.whyDesc}>
          <strong>Our mission:</strong> Empower communities to take control of their energy, promote renewables, and make green power accessible to all.
        </p>
      </section>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Lightem &mdash; Powering a Greener Tomorrow
      </footer>
    </div>
  );
};

export default Home;
