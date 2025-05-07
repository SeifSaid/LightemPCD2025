import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';

const BidPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const { auction, viewOnly } = location.state || {};
    const [bidAmount, setBidAmount] = useState('');
    const [isBtnHovered, setIsBtnHovered] = useState(false);

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            background: theme.background,
            minHeight: '100vh',
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
        auctionCard: {
            background: theme.cardBackground,
            border: theme.cardBorder,
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
        },
        auctionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
        },
        auctionInfo: {
            flex: 1,
        },
        auctionTitle: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '0.5rem',
        },
        auctionDetails: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
        },
        detailItem: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
        },
        detailLabel: {
            fontSize: '0.875rem',
            color: theme.textSecondary,
        },
        detailValue: {
            fontSize: '1.125rem',
            fontWeight: '600',
            color: theme.text,
        },
        bidSection: {
            background: theme.cardBackground,
            borderRadius: '8px',
            padding: '1.5rem',
            marginTop: '2rem',
        },
        bidTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
        },
        bidForm: {
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
        },
        inputGroup: {
            flex: 1,
            minWidth: '0',
        },
        label: {
            display: 'block',
            fontSize: '1rem',
            color: theme.textSecondary,
            marginBottom: '0.5rem',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontWeight: 500,
        },
        input: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            fontSize: '1.1rem',
            color: theme.text,
            background: theme.cardBackground,
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontWeight: 500,
            boxSizing: 'border-box',
        },
        submitButton: {
            flexShrink: 0,
            minWidth: '140px',
            backgroundColor: isBtnHovered ? theme.accentHover : theme.accent,
            color: theme.text,
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '700',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
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
        bidHistory: {
            marginTop: '2rem',
        },
        bidHistoryTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
        },
        bidHistoryTable: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        bidHistoryHeader: {
            textAlign: 'left',
            padding: '0.75rem',
            borderBottom: `1px solid ${theme.border}`,
            color: theme.textSecondary,
            fontSize: '0.875rem',
            fontWeight: '500',
        },
        bidHistoryRow: {
            borderBottom: `1px solid ${theme.border}`,
        },
        bidHistoryCell: {
            padding: '0.75rem',
            fontSize: '0.95rem',
            color: theme.text,
        },
        winnerBadge: {
            backgroundColor: '#dcfce7',
            color: '#059669',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: '500',
        },
        errorMessage: {
            color: '#dc2626',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement bid submission logic
        console.log('Submitting bid:', bidAmount);
    };

    if (!auction) {
        return (
            <div style={styles.container}>
                <Navbar />
                <div style={styles.content}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Auction Not Found</h1>
                        <p style={styles.subtitle}>The auction you are trying to view does not exist.</p>
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
                    <h1 style={styles.title}>{auction.buyer}'s Energy Auction</h1>
                    <span style={{ ...styles.statusBadge, ...(auction.status === 'open' ? styles.statusOpen : styles.statusClosed) }}>
                        {auction.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                </div>
                <div style={styles.auctionCard}>
                    <div style={styles.auctionDetails}>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Energy Amount</span>
                            <span style={styles.detailValue}>{auction.energy} kWh</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Current Best Bid</span>
                            <span style={styles.detailValue}>{auction.bestBid}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Completion Rate</span>
                            <span style={styles.detailValue}>{auction.completion}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Orders</span>
                            <span style={styles.detailValue}>{auction.orders}</span>
                        </div>
                    </div>

                    {auction.status === 'open' && !viewOnly && (
                        <div style={styles.bidSection}>
                            <h2 style={styles.bidTitle}>Place Your Bid</h2>
                            <form style={styles.bidForm} onSubmit={handleSubmit}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Bid Amount (wei)</label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        placeholder="Enter your bid amount"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={styles.submitButton}
                                    onMouseEnter={() => setIsBtnHovered(true)}
                                    onMouseLeave={() => setIsBtnHovered(false)}
                                >
                                    Place Bid
                                </button>
                            </form>
                        </div>
                    )}

                    {auction.status === 'closed' && (
                        <div style={styles.bidHistory}>
                            <h2 style={styles.bidHistoryTitle}>Auction Results</h2>
                            <table style={styles.bidHistoryTable}>
                                <thead>
                                    <tr>
                                        <th style={styles.bidHistoryHeader}>Bidder</th>
                                        <th style={styles.bidHistoryHeader}>Amount</th>
                                        <th style={styles.bidHistoryHeader}>Time</th>
                                        <th style={styles.bidHistoryHeader}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={styles.bidHistoryRow}>
                                        <td style={styles.bidHistoryCell}>0x1234...5678</td>
                                        <td style={styles.bidHistoryCell}>120.00 wei</td>
                                        <td style={styles.bidHistoryCell}>2024-03-15 14:30:00</td>
                                        <td style={styles.bidHistoryCell}>
                                            <span style={styles.winnerBadge}>Winner</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BidPage; 