import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';

const BuyEnergy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const listing = location.state?.listing;
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isBtnHovered, setIsBtnHovered] = useState(false);

    const styles = {
        container: {
            minHeight: '100vh',
            background: theme.background,
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
        },
        content: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
        },
        header: {
            marginBottom: '2rem',
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '800',
            color: theme.text,
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '0.5rem',
        },
        subtitle: {
            color: theme.textSecondary,
            fontSize: '1rem',
            margin: '0.5rem 0 0 0',
        },
        listingCard: {
            background: theme.cardBackground,
            border: theme.cardBorder,
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
        },
        label: {
            display: 'block',
            fontSize: '0.95rem',
            color: theme.textSecondary,
            marginBottom: '0.5rem',
            fontWeight: '500',
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            fontSize: '1rem',
            color: theme.text,
            background: theme.cardBackground,
            transition: 'border-color 0.2s',
            marginBottom: '1rem',
        },
        submitButton: {
            backgroundColor: isBtnHovered ? theme.accentHover : theme.accent,
            color: theme.text,
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
            marginTop: '1rem',
        },
        errorMessage: {
            color: '#dc2626',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
        },
        info: {
            color: theme.textSecondary,
            fontSize: '0.95rem',
            marginBottom: '1rem',
        },
        detail: {
            fontWeight: '600',
            color: theme.text,
            fontSize: '1.1rem',
            marginBottom: '0.5rem',
        },
        detailLabel: {
            color: theme.textSecondary,
            fontSize: '0.95rem',
            marginRight: '0.5rem',
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (Number(amount) > listing.energy) {
            setError('Amount exceeds available energy');
            return;
        }
        // TODO: Implement buy logic
        navigate('/fixed-market');
    };

    if (!listing) {
        return (
            <div style={styles.container}>
                <Navbar />
                <div style={styles.content}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Listing Not Found</h1>
                        <p style={styles.subtitle}>The listing you are trying to buy does not exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Buy Energy</h1>
                    <p style={styles.subtitle}>Purchase energy from {listing.producer}</p>
                </div>
                <div style={styles.listingCard}>
                    <div style={styles.detail}><span style={styles.detailLabel}>Producer:</span> {listing.producer}</div>
                    <div style={styles.detail}><span style={styles.detailLabel}>Available:</span> {listing.energy} kWh</div>
                    <div style={styles.detail}><span style={styles.detailLabel}>Price:</span> {listing.price}</div>
                    <div style={styles.detail}><span style={styles.detailLabel}>Location:</span> {listing.distance}</div>
                    <div style={styles.detail}><span style={styles.detailLabel}>Completion:</span> {listing.completion}</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Amount to Buy (kWh)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={styles.input}
                        placeholder="Enter amount to buy"
                        required
                    />
                    {error && <div style={styles.errorMessage}>{error}</div>}
                    <button
                        type="submit"
                        style={styles.submitButton}
                        onMouseEnter={() => setIsBtnHovered(true)}
                        onMouseLeave={() => setIsBtnHovered(false)}
                    >
                        Buy Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuyEnergy; 