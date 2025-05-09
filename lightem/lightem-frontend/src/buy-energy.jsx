import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';
import { useWeb3 } from './context/Web3Context';
import { listings } from './services/api';

const BuyEnergy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { account } = useWeb3();
    const listing = location.state?.listing;
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isBtnHovered, setIsBtnHovered] = useState(false);
    const [distanceFee, setDistanceFee] = useState(listing.distanceFee || 0);
    const [sellerCity, setSellerCity] = useState(listing.sellerCity || '');
    const [buyerCity, setBuyerCity] = useState('');

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
        successMessage: {
            color: '#059669',
            fontSize: '0.95rem',
            marginTop: '0.5rem',
            fontWeight: 600,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (Number(amount) > listing.remainingAmount) {
            setError('Amount exceeds available energy');
            return;
        }
        if (!account) {
            setError('Please connect your wallet');
            return;
        }
        setLoading(true);
        try {
            const res = await listings.purchase(listing._id, {
                buyer: account,
                finalPrice: Number(listing.basePrice) * Number(amount),
                purchaseAmount: Number(amount),
            });
            setSuccess('Purchase successful!');
            setDistanceFee(res.data.distanceFee || 0);
            setSellerCity(res.data.sellerCity || '');
            setBuyerCity(res.data.buyerCity || '');
            setTimeout(() => navigate('/fixed-market'), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete purchase.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate cost breakdown
    const baseCost = Number(listing.basePrice) * Number(amount || 0);
    const platformFee = Math.round(baseCost * 0.01 * 10000) / 10000; // 1% fee, rounded

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Buy Energy</h1>
                    <p style={styles.subtitle}>Purchase energy from {listing.producerName || listing.producer || listing.seller?.slice(0, 8) + '...' || 'Unknown'}</p>
                </div>
                <div style={styles.listingCard}>
                    <div style={styles.detail}><span style={styles.detailLabel}>Producer:</span> {listing.producerName || listing.producer || listing.seller?.slice(0, 8) + '...' || 'Unknown'}</div>
                    <div style={styles.detail}><span style={styles.detailLabel}>Available:</span> {listing.remainingAmount} kWh</div>
                    <div style={styles.detail}><span style={styles.detailLabel}>Price:</span> {listing.basePrice} wei</div>
                    <div style={styles.detail}><span style={styles.detailLabel}>Location:</span> {listing.city || '--'}</div>
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
                    {/* Cost breakdown */}
                    {amount && Number(amount) > 0 && !isNaN(amount) && (
                      <div style={{ margin: '1rem 0', background: theme.isDarkMode ? '#23272f' : '#f3f4f6', borderRadius: 8, padding: '1rem' }}>
                        <div style={{ color: theme.text, fontWeight: 500 }}>Cost Breakdown:</div>
                        <div style={{ color: theme.textSecondary, fontSize: '0.98em', marginTop: 4 }}>
                          Base: <b>{listing.basePrice} wei</b> × <b>{amount}</b> = <b>{baseCost} wei</b><br />
                          Platform Fee (1%): <b>{platformFee} wei</b><br />
                          Distance Fee: <b>{distanceFee} wei</b><br />
                          <span style={{ color: '#059669', fontWeight: 600 }}>Total: {baseCost + platformFee + distanceFee} wei</span>
                        </div>
                        {(sellerCity || buyerCity) && (
                          <div style={{ color: theme.textSecondary, fontSize: '0.95em', marginTop: 6 }}>
                            <b>Seller City:</b> {sellerCity || '--'}<br />
                            <b>Your City:</b> {buyerCity || '--'}
                          </div>
                        )}
                      </div>
                    )}
                    {error && <div style={styles.errorMessage}>{error}</div>}
                    {success && <div style={styles.successMessage}>{success}</div>}
                    <button
                        type="submit"
                        style={styles.submitButton}
                        onMouseEnter={() => setIsBtnHovered(true)}
                        onMouseLeave={() => setIsBtnHovered(false)}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Buy Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuyEnergy; 