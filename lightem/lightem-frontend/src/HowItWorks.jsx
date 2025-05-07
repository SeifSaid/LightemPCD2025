import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';

const HowItWorks = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

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
        button: {
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
        steps: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginTop: '2rem',
        },
        step: {
            background: theme.cardBackground,
            border: theme.cardBorder,
            borderRadius: '12px',
            padding: '2rem',
        },
        stepNumber: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: theme.accent,
            marginBottom: '1rem',
        },
        stepTitle: {
            fontSize: '0.95rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '0.75rem',
        },
        stepText: {
            color: theme.textSecondary,
            fontSize: '0.95rem',
            lineHeight: '1.5',
        },
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>How It Works</h1>
                        <p style={styles.subtitle}>Learn how to trade energy on our platform</p>
                    </div>
                    <button 
                        onClick={() => navigate('/auction-market')} 
                        style={styles.button}
                        onMouseOver={e => e.target.style.backgroundColor = theme.accentHover}
                        onMouseOut={e => e.target.style.backgroundColor = theme.accent}
                    >
                        Start Trading
                    </button>
                </div>

                <div style={styles.steps}>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>01</div>
                        <h2 style={styles.stepTitle}>Connect Your Wallet</h2>
                        <p style={styles.stepText}>
                            Connect your Web3 wallet to access the platform.
                            We support MetaMask and other popular wallets.
                        </p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>02</div>
                        <h2 style={styles.stepTitle}>Choose Your Market</h2>
                        <p style={styles.stepText}>
                            Browse the auction market for competitive prices
                            or the fixed market for immediate purchases.
                        </p>
                    </div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>03</div>
                        <h2 style={styles.stepTitle}>Trade Energy</h2>
                        <p style={styles.stepText}>
                            Place bids in auctions or buy directly at fixed prices.
                            Complete transactions securely on the blockchain.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks; 