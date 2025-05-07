import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useWeb3 } from './context/Web3Context';
import { useTheme } from './context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const { web3, account } = useWeb3();
    const { theme } = useTheme();
    const [balance, setBalance] = useState('0');
    const [energyBalance, setEnergyBalance] = useState('0');
    const [transactions, setTransactions] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [ethPrice, setEthPrice] = useState(0);
    const [ethPriceChange, setEthPriceChange] = useState(0);

    const styles = {
        container: {
            minHeight: '100vh',
            background: theme.background,
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
        },
        content: {
            maxWidth: '1200px',
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
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem',
        },
        statCard: {
            background: theme.cardBackground,
            border: theme.cardBorder,
            borderRadius: '12px',
            padding: '1.5rem',
        },
        statLabel: {
            color: theme.textSecondary,
            fontSize: '0.95rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
        },
        statValue: {
            color: theme.text,
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
        },
        statChange: {
            fontSize: '0.95rem',
            fontWeight: '500',
        },
        statChangePositive: {
            color: '#059669',
        },
        statChangeNegative: {
            color: '#dc2626',
        },
        dashboardGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem',
        },
        card: {
            background: theme.cardBackground,
            border: theme.cardBorder,
            borderRadius: '12px',
            padding: '1.5rem',
        },
        cardTitle: {
            fontSize: '0.95rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '1rem',
        },
        transactionTable: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        transactionHeader: {
            textAlign: 'left',
            padding: '0.75rem',
            borderBottom: `1px solid ${theme.border}`,
            color: theme.textSecondary,
            fontSize: '0.95rem',
            fontWeight: '500',
        },
        transactionRow: {
            borderBottom: `1px solid ${theme.border}`,
        },
        transactionCell: {
            padding: '0.75rem',
            color: theme.textSecondary,
            fontSize: '0.95rem',
        },
        statusBadge: {
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
        },
        statusCompleted: {
            backgroundColor: '#dcfce7',
            color: '#059669',
        },
        statusPending: {
            backgroundColor: '#fef3c7',
            color: '#d97706',
        },
        statusFailed: {
            backgroundColor: '#fee2e2',
            color: '#dc2626',
        },
        actionBtn: {
            backgroundColor: theme.accent,
            color: theme.text,
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%',
            marginBottom: '0.75rem',
        },
    };

    const getEthPriceInUSD = async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
            const data = await response.json();
            setEthPrice(data.ethereum.usd);
            setEthPriceChange(data.ethereum.usd_24h_change);
        } catch (error) {
            console.error('Error fetching ETH price:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (web3 && account) {
                // Fetch ETH balance
                const balance = await web3.eth.getBalance(account);
                const ethBalance = web3.utils.fromWei(balance, 'ether');
                setBalance(parseFloat(ethBalance).toFixed(4));

                // Fetch energy token balance (mock for now)
                setEnergyBalance('150.5');

                // Fetch recent transactions (mock for now)
                setTransactions([
                    { id: 1, type: 'Purchase', amount: '25 kWh', price: '0.05 ETH', status: 'Completed', date: '2024-03-15 14:30' },
                    { id: 2, type: 'Sale', amount: '15 kWh', price: '0.03 ETH', status: 'Completed', date: '2024-03-14 09:15' },
                    { id: 3, type: 'Auction Bid', amount: '50 kWh', price: '0.08 ETH', status: 'Pending', date: '2024-03-13 16:45' },
                ]);

                // Fetch price data (mock for now)
                setPriceData([
                    { time: '09:00', price: 102 },
                    { time: '10:00', price: 104 },
                    { time: '11:00', price: 101 },
                    { time: '12:00', price: 107 },
                    { time: '13:00', price: 110 },
                    { time: '14:00', price: 108 },
                    { time: '15:00', price: 112 },
                    { time: '16:00', price: 109 },
                ]);
            }
        };

        fetchData();
        getEthPriceInUSD();
        const interval = setInterval(() => {
            fetchData();
            getEthPriceInUSD();
        }, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [web3, account]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return { ...styles.statusBadge, ...styles.statusCompleted };
            case 'Pending':
                return { ...styles.statusBadge, ...styles.statusPending };
            case 'Failed':
                return { ...styles.statusBadge, ...styles.statusFailed };
            default:
                return styles.statusBadge;
        }
    };

    return (
        <div style={{
            ...styles.container,
            minHeight: '100vh',
            minWidth: '100vw',
            width: '100vw',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
        }}>
            <Navbar />
            <div style={styles.content}>
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        background: theme.cardBackground,
                        border: theme.cardBorder,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        minWidth: '260px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}>
                        <div style={{ color: theme.textSecondary, fontSize: '0.95rem', fontWeight: 500 }}>Wallet</div>
                        <div style={{ color: theme.text, fontWeight: 700, fontSize: '1.1rem', wordBreak: 'break-all' }}>{account ? `${account.slice(0, 8)}...${account.slice(-6)}` : 'Not Connected'}</div>
                        <div style={{ color: theme.textSecondary, fontSize: '0.95rem', fontWeight: 500 }}>ETH Balance</div>
                        <div style={{ color: theme.text, fontWeight: 700, fontSize: '1.1rem' }}>{balance} ETH</div>
                    </div>
                    <div style={{
                        background: theme.cardBackground,
                        border: theme.cardBorder,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        minWidth: '260px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}>
                        <div style={{ color: theme.textSecondary, fontSize: '0.95rem', fontWeight: 500 }}>ETH Price (USD)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: theme.text, fontWeight: 700, fontSize: '1.1rem' }}>${ethPrice}</span>
                            {ethPriceChange !== 0 && (
                                <span style={{
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    color: ethPriceChange > 0 ? '#059669' : '#dc2626',
                                }}>
                                    {ethPriceChange > 0 ? '+' : ''}{ethPriceChange.toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div style={{
                        background: theme.cardBackground,
                        border: theme.cardBorder,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        minWidth: '260px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}>
                        <div style={{ color: theme.textSecondary, fontSize: '0.95rem', fontWeight: 500 }}>Energy Token Balance</div>
                        <div style={{ color: theme.text, fontWeight: 700, fontSize: '1.1rem' }}>{energyBalance} kWh</div>
                    </div>
                </div>

                <div style={{
                    background: theme.cardBackground,
                    border: theme.cardBorder,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                }}>
                    <div style={{ color: theme.text, fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>ETH Price Chart (Mock Data)</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke={theme.isDarkMode ? '#333' : '#eee'} strokeDasharray="3 3" />
                            <XAxis dataKey="time" stroke={theme.textSecondary} fontSize={12} />
                            <YAxis stroke={theme.textSecondary} fontSize={12} domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ background: theme.cardBackground, border: theme.cardBorder, color: theme.text }} labelStyle={{ color: theme.text }} />
                            <Line type="monotone" dataKey="price" stroke={theme.accent} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div style={styles.header}>
                    <h1 style={styles.title}>Dashboard</h1>
                    <p style={styles.subtitle}>Monitor your energy trading activity</p>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>12</div>
                        <div style={styles.statLabel}>Active Auctions</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>45</div>
                        <div style={styles.statLabel}>Total Orders</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>89%</div>
                        <div style={styles.statLabel}>Completion Rate</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>1,234</div>
                        <div style={styles.statLabel}>Energy Traded (kWh)</div>
                    </div>
                </div>

                <div style={styles.dashboardGrid}>
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Recent Activity</h2>
                        <table style={styles.transactionTable}>
                            <thead>
                                <tr>
                                    <th style={styles.transactionHeader}>Type</th>
                                    <th style={styles.transactionHeader}>Amount</th>
                                    <th style={styles.transactionHeader}>Status</th>
                                    <th style={styles.transactionHeader}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={styles.transactionRow}>
                                    <td style={styles.transactionCell}>Purchase</td>
                                    <td style={styles.transactionCell}>25 kWh</td>
                                    <td style={styles.transactionCell}>
                                        <span style={{...styles.statusBadge, ...styles.statusCompleted}}>
                                            Completed
                                        </span>
                                    </td>
                                    <td style={styles.transactionCell}>2024-03-15</td>
                                </tr>
                                <tr style={styles.transactionRow}>
                                    <td style={styles.transactionCell}>Sale</td>
                                    <td style={styles.transactionCell}>15 kWh</td>
                                    <td style={styles.transactionCell}>
                                        <span style={{...styles.statusBadge, ...styles.statusPending}}>
                                            Pending
                                        </span>
                                    </td>
                                    <td style={styles.transactionCell}>2024-03-14</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Active Listings</h2>
                        <table style={styles.transactionTable}>
                            <thead>
                                <tr>
                                    <th style={styles.transactionHeader}>Type</th>
                                    <th style={styles.transactionHeader}>Amount</th>
                                    <th style={styles.transactionHeader}>Price</th>
                                    <th style={styles.transactionHeader}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={styles.transactionRow}>
                                    <td style={styles.transactionCell}>Auction</td>
                                    <td style={styles.transactionCell}>50 kWh</td>
                                    <td style={styles.transactionCell}>0.08 ETH</td>
                                    <td style={styles.transactionCell}>
                                        <span style={{...styles.statusBadge, ...styles.statusPending}}>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                                <tr style={styles.transactionRow}>
                                    <td style={styles.transactionCell}>Fixed</td>
                                    <td style={styles.transactionCell}>25 kWh</td>
                                    <td style={styles.transactionCell}>0.05 ETH</td>
                                    <td style={styles.transactionCell}>
                                        <span style={{...styles.statusBadge, ...styles.statusCompleted}}>
                                            Listed
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 