import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';
import { useAuctions } from './context/AuctionContext';
import { useWeb3 } from './context/Web3Context';
import { useAuth } from './context/AuthContext';

const BidPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const { auction: auctionFromState, viewOnly } = location.state || {};
    const { auctionId } = useParams();
    const { getAuction, placeBid } = useAuctions();
    const { account } = useWeb3();
    const { user } = useAuth();
    const [bidAmount, setBidAmount] = useState('');
    const [isBtnHovered, setIsBtnHovered] = useState(false);
    const [auction, setAuction] = useState(auctionFromState || null);
    const [loading, setLoading] = useState(!auctionFromState);
    const [bidError, setBidError] = useState('');
    const [bidLoading, setBidLoading] = useState(false);

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

    useEffect(() => {
        if (!auctionFromState) {
            const fetchAuction = async () => {
                try {
                    const data = await getAuction(auctionId);
                    setAuction(data);
                } catch {
                    setAuction(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchAuction();
        } else {
            setLoading(false);
        }
    }, [auctionId, getAuction, auctionFromState]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBidError('');
        if (!account || !user) {
            setBidError('You must be logged in and connected to your wallet.');
            return;
        }
        if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
            setBidError('Please enter a valid bid amount.');
            return;
        }
        setBidLoading(true);
        try {
            await placeBid(auction._id, { basePrice: Number(bidAmount), bidder: account });
            // Refresh auction data
            const updatedAuction = await getAuction(auction._id);
            setAuction(updatedAuction);
            setBidAmount('');
        } catch (err) {
            setBidError('Failed to place bid. Please try again.');
        } finally {
            setBidLoading(false);
        }
    };

    // Helper to truncate Ethereum addresses
    function truncateAddress(address) {
        if (!address) return '';
        return address.slice(0, 6) + '...' + address.slice(-4);
    }

    if (loading) return <div>Loading...</div>;
    if (!auction) return <div>Auction Not Found</div>;

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        {auction.buyerName || (auction.buyer ? truncateAddress(auction.buyer) : 'Unknown')}'s Energy Auction
                    </h1>
                    <span style={{ ...styles.statusBadge, ...(auction.status === 'ACTIVE' ? styles.statusOpen : styles.statusClosed) }}>
                        {auction.status === 'ACTIVE' ? 'Open' : 'Closed'}
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

                    {auction.status === 'ACTIVE' && !viewOnly && (
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
                                        disabled={bidLoading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={styles.submitButton}
                                    onMouseEnter={() => setIsBtnHovered(true)}
                                    onMouseLeave={() => setIsBtnHovered(false)}
                                    disabled={bidLoading}
                                >
                                    {bidLoading ? 'Placing...' : 'Place Bid'}
                                </button>
                            </form>
                            {bidError && <div style={styles.errorMessage}>{bidError}</div>}
                        </div>
                    )}

                    {auction.status !== 'ACTIVE' && (
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
                                    {auction.bids && auction.bids.length > 0 ? auction.bids.map((bid, idx) => (
                                        <tr style={styles.bidHistoryRow} key={idx}>
                                            <td style={styles.bidHistoryCell}>{bid.bidderName || (bid.bidder ? truncateAddress(bid.bidder) : 'Unknown')}</td>
                                            <td style={styles.bidHistoryCell}>{bid.basePrice} wei</td>
                                            <td style={styles.bidHistoryCell}>{bid.timestamp ? new Date(bid.timestamp).toLocaleString() : ''}</td>
                                            <td style={styles.bidHistoryCell}>{auction.winner === bid.bidder ? <span style={styles.winnerBadge}>Winner</span> : ''}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" style={styles.bidHistoryCell}>No bids yet</td></tr>
                                    )}
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