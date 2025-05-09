import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useWeb3 } from './context/Web3Context';
import { useTheme } from './context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from './context/AuthContext';
import { auctions, listings, stats, auth, transactions } from './services/api';
import { getCityName } from './utils/cityUtils';

const FALLBACK_USD = 2298.23;
const FALLBACK_TND = 6854.17;

const mockPriceHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    price: 2200 + Math.sin(i / 3) * 50 + Math.random() * 30
}));

const Dashboard = () => {
    const navigate = useNavigate();
    const { web3, account } = useWeb3();
    const { theme } = useTheme();
    const { user, loading, logout } = useAuth();
    const [userAuctions, setUserAuctions] = useState([]);
    const [userListings, setUserListings] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [userTransactions, setUserTransactions] = useState([]);
    const [balance, setBalance] = useState('0');
    const [priceHistory, setPriceHistory] = useState(mockPriceHistory);
    const [ethPrice, setEthPrice] = useState(FALLBACK_USD);
    const [ethPriceTND, setEthPriceTND] = useState(FALLBACK_TND);
    const [ethPriceLoading, setEthPriceLoading] = useState(true);
    const [completionRate, setCompletionRate] = useState('N/A');
    const [publicProfile, setPublicProfile] = useState(null);

    // Fetch ETH balance
    useEffect(() => {
        const fetchBalance = async () => {
            if (web3 && account) {
                try {
                    const bal = await web3.eth.getBalance(account);
                    const ethBalance = web3.utils.fromWei(bal, 'ether');
                    setBalance(parseFloat(ethBalance).toFixed(4));
                } catch {
                    setBalance('0');
                }
            } else {
                setBalance('0');
            }
        };
        fetchBalance();
    }, [web3, account]);

    // Fetch ETH price
    useEffect(() => {
        const getEthPrice = async () => {
            setEthPriceLoading(true);
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
                );
                const data = await response.json();
                if (data.ethereum && data.ethereum.usd) {
                    setEthPrice(data.ethereum.usd);
                    setEthPriceTND(data.ethereum.usd * (FALLBACK_TND / FALLBACK_USD));
                } else {
                    setEthPrice(FALLBACK_USD);
                    setEthPriceTND(FALLBACK_TND);
                }
            } catch {
                setEthPrice(FALLBACK_USD);
                setEthPriceTND(FALLBACK_TND);
            } finally {
                setEthPriceLoading(false);
            }
        };
        getEthPrice();
        const interval = setInterval(getEthPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fetch user data
    useEffect(() => {
        let cancelled = false;
        const fetchAllUserData = async () => {
            if (!account) return;
            try {
                if (user) {
                    const [auctionsRes, listingsRes, statsRes, txRes] = await Promise.all([
                        auctions.getUserAuctions(account),
                        listings.getUserListings(account),
                        stats.getUserStats(account).catch(() => null),
                        transactions.getByUser(account),
                    ]);
                    if (!cancelled) {
                        setUserAuctions(auctionsRes.data);
                        setUserListings(listingsRes.data);
                        setUserStats(statsRes ? statsRes.data : null);
                        setUserTransactions(txRes.data);
                        setCompletionRate(
                            statsRes && statsRes.data && statsRes.data.completionRate
                                ? `${statsRes.data.completionRate}%`
                                : 'N/A'
                        );
                    }
                } else {
                    const response = await auth.getUserProfile(account);
                    if (!cancelled) {
                        setPublicProfile(response.data);
                        setCompletionRate(
                            response.data.completionRate ? `${response.data.completionRate}%` : 'N/A'
                        );
                    }
                }
            } catch {
                // silently ignore errors
            }
        };
        fetchAllUserData();
        return () => {
            cancelled = true;
        };
    }, [account, user]);

    // Dynamic status badge styles for light/dark mode
    const getStatusStyle = (status) => {
        const dark = theme.isDarkMode;
        switch (status) {
            case 'Completed':
                return {
                    ...styles.statusBadge,
                    backgroundColor: dark ? '#064e3b' : '#dcfce7',
                    color: dark ? '#a7f3d0' : '#059669',
                };
            case 'Pending':
                return {
                    ...styles.statusBadge,
                    backgroundColor: dark ? '#78350f' : '#fef3c7',
                    color: dark ? '#fde68a' : '#d97706',
                };
            case 'Failed':
                return {
                    ...styles.statusBadge,
                    backgroundColor: dark ? '#7f1d1d' : '#fee2e2',
                    color: dark ? '#fecaca' : '#dc2626',
                };
            default:
                return styles.statusBadge;
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: theme.background,
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
        },
        content: {
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '1.2rem',
        },
        infoRow: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.2rem',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
        },
        card: {
            background: theme.cardBackground,
            border: theme.cardBorder,
            borderRadius: '10px',
            padding: '1rem 1.2rem',
            minWidth: '220px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            fontSize: '0.98rem',
        },
        statValue: {
            color: theme.text,
            fontWeight: 700,
            fontSize: '1.08rem',
            marginBottom: '0.2rem',
        },
        statLabel: {
            color: theme.textSecondary,
            fontSize: '0.92rem',
            fontWeight: 500,
        },
        sectionTitle: {
            fontSize: '1.15rem',
            fontWeight: 700,
            color: theme.text,
            marginBottom: '0.5rem',
        },
        small: {
            fontSize: '0.95rem',
            color: theme.text,
        },
        graphCard: {
            background: theme.cardBackground,
            border: theme.cardBorder,
            borderRadius: '10px',
            padding: '1rem 1.2rem',
            marginBottom: '1.2rem',
        },
        infoText: {
            color: theme.textSecondary,
            fontSize: '1rem',
            marginBottom: '1.2rem',
            textAlign: 'center',
        },
        statusBadge: {
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
        },
    };

    // Determine user info
    const infoUser = user || publicProfile;
    const city = infoUser ? getCityName(infoUser.latitude, infoUser.longitude) || infoUser.city : '';

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.infoText}>
                    Welcome to your Light'em dashboard. Here you can monitor your wallet, energy trading stats, and the latest ETH price. All data updates live.
                    <br />
                    <span style={{ color: theme.accent, fontWeight: 600 }}>Tip:</span> Check your completion rate to see how reliable your trading activity is!
                </div>

                {/* Info Row */}
                <div style={styles.infoRow}>
                    {/* Wallet */}
                    <div style={styles.card}>
                        <div style={styles.statLabel}>Wallet</div>
                        <div style={styles.statValue}>
                            {account
                                ? `${account.slice(0, 8)}...${account.slice(-6)}`
                                : 'Not Connected'}
                        </div>
                        <div style={styles.statLabel}>ETH Balance</div>
                        <div style={styles.statValue}>{balance} ETH</div>
                    </div>

                    {/* User Info */}
                    <div style={styles.card}>
                        <div style={styles.statLabel}>{user ? 'Profile' : 'Public Profile'}</div>
                        {infoUser ? (
                            <>
                                <div style={styles.statValue}>
                                    <b>Name:</b> {infoUser.name}
                                </div>
                                <div style={styles.small}>
                                    <b>City:</b> {city}
                                </div>
                                <div style={styles.small}>
                                    <b>Status:</b> {infoUser.isProducer ? 'Producer' : 'Consumer'}
                                </div>
                                <div style={styles.small}>
                                    <b>Completion Rate:</b> {completionRate}
                                </div>
                            </>
                        ) : (
                            <div style={styles.statLabel}>No profile found.</div>
                        )}
                    </div>

                    {/* ETH Price */}
                    <div style={styles.card}>
                        <div style={styles.statLabel}>ETH Price (USD / TND)</div>
                        <div style={styles.statValue}>
                            {ethPriceLoading
                                ? 'Loading...'
                                : `$${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ` +
                                  `${ethPriceTND.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`}
                        </div>
                    </div>
                </div>

                {/* Price History Graph */}
                <div style={styles.graphCard}>
                    <div style={styles.sectionTitle}>ETH Price History (Last 24h)</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={priceHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid
                                stroke={theme.isDarkMode ? '#333' : '#eee'}
                                strokeDasharray="3 3"
                            />
                            <XAxis dataKey="hour" stroke={theme.textSecondary} fontSize={12} />
                            <YAxis stroke={theme.textSecondary} fontSize={12} domain={["auto", "auto"]} />
                            <Tooltip
                                contentStyle={{ background: theme.cardBackground, border: theme.cardBorder, color: theme.text }}
                                labelStyle={{ color: theme.text }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke={theme.accent}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={styles.card}>
                        <div style={styles.statValue}>{userAuctions.length}</div>
                        <div style={styles.statLabel}>Active Auctions</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.statValue}>{userListings.length}</div>
                        <div style={styles.statLabel}>Active Listings</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.statValue}>{completionRate}</div>
                        <div style={styles.statLabel}>Completion Rate</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.statValue}>{userStats?.energyTraded ?? '-'}</div>
                        <div style={styles.statLabel}>Energy Traded (kWh)</div>
                    </div>
                </div>

                {/* Transactions */}
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ color: theme.text, fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                        Transaction History
                    </h2>
                    {userTransactions.length === 0 ? (
                        <div style={{ color: theme.textSecondary }}>No transactions found.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: theme.cardBackground, borderRadius: 8 }}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Amount</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Counterparty</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userTransactions.map((tx) => (
                                    <tr key={tx.transactionHash}>
                                        <td style={styles.td}>{tx.type}</td>
                                        <td style={styles.td}>{tx.amount}</td>
                                        <td style={styles.td}>{tx.price} wei</td>
                                        <td style={styles.td}>
                                            {account?.toLowerCase() === tx.from.toLowerCase() ? tx.to : tx.from}
                                        </td>
                                        <td style={getStatusStyle(tx.status)}>{tx.status}</td>
                                        <td style={styles.td}>{new Date(tx.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
