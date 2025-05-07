import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWeb3 } from './context/Web3Context';
import { useTheme } from './context/ThemeContext';
import logoImg from './assets/Lightem_Logo.png';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Auction Market', path: '/auction-market' },
  { label: 'Fixed Market', path: '/fixed-market' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { account, isConnected, web3, disconnectWallet } = useWeb3();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const [balance, setBalance] = useState('0');
    const [showDropdown, setShowDropdown] = useState(false);

    const styles = {
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: theme.background,
            borderBottom: `1px solid ${theme.border}`,
        },
        logo: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: theme.text,
            textDecoration: 'none',
            fontFamily: "'Poppins', sans-serif",
        },
        navLinks: {
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
        },
        navLink: isActive => ({
            color: isActive ? theme.accent : theme.textSecondary,
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: isActive ? '700' : '500',
            background: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            transition: 'none',
            cursor: 'pointer',
            position: 'relative',
            borderBottom: 'none',
        }),
        connectButton: {
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
        themeToggle: {
            background: 'none',
            border: 'none',
            color: theme.textSecondary,
            cursor: 'pointer',
            padding: '0.5rem',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
        },
        walletInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: theme.cardBackground,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            marginLeft: '2rem',
            border: theme.cardBorder,
        },
        walletAddress: {
            fontSize: '0.9rem',
            color: theme.text,
            fontWeight: '500',
        },
        balance: {
            fontSize: '0.9rem',
            color: '#059669',
            fontWeight: '600',
        },
        logoutButton: {
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s',
        },
        logoutButtonHover: {
            backgroundColor: '#dc2626',
        },
        dropdown: {
            position: 'relative',
            display: 'inline-block',
        },
        dropdownContent: {
            display: 'none',
            position: 'absolute',
            right: 0,
            backgroundColor: theme.cardBackground,
            minWidth: '200px',
            boxShadow: theme.isDarkMode ? '0 2px 8px rgba(0,0,0,0.7)' : '0 2px 5px rgba(0,0,0,0.2)',
            borderRadius: '8px',
            padding: '0.5rem',
            zIndex: 1,
            border: theme.cardBorder,
        },
        dropdownContentShow: {
            display: 'block',
        },
        dropdownItem: {
            padding: '0.5rem 1rem',
            display: 'block',
            color: theme.text,
            textDecoration: 'none',
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderRadius: '4px',
            background: 'none',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
        },
    };

    React.useEffect(() => {
        const getBalance = async () => {
            if (web3 && account) {
                const balance = await web3.eth.getBalance(account);
                const ethBalance = web3.utils.fromWei(balance, 'ether');
                setBalance(parseFloat(ethBalance).toFixed(4));
            }
        };
        getBalance();
    }, [web3, account]);

    const handleLogout = () => {
        disconnectWallet();
        navigate('/');
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={{...styles.logo, display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none'}}>
                <img src={logoImg} alt="Light'em Logo" style={{ height: '2.2rem', width: '2.2rem', objectFit: 'contain', verticalAlign: 'middle' }} />
                <span style={{ color: '#facc15', fontWeight: 900, fontFamily: "'Poppins', sans-serif", fontSize: '1.7rem', letterSpacing: '-1px' }}>
                  Light'em
                </span>
            </Link>
            <div style={styles.navLinks}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={styles.navLink(isActive)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <button 
                    onClick={toggleTheme} 
                    style={styles.themeToggle}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                {!isConnected ? (
                    <button
                        onClick={() => navigate('/login')}
                        style={styles.connectButton}
                        onMouseOver={e => e.target.style.backgroundColor = theme.accentHover}
                        onMouseOut={e => e.target.style.backgroundColor = theme.accent}
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <div style={styles.walletInfo}>
                        <div>
                            <div style={styles.walletAddress}>{formatAddress(account)}</div>
                            <div style={styles.balance}>{balance} ETH</div>
                        </div>
                        <div style={styles.dropdown}>
                            <button
                                style={styles.logoutButton}
                                onMouseOver={e => e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor}
                                onMouseOut={e => e.target.style.backgroundColor = styles.logoutButton.backgroundColor}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                Account
                            </button>
                            <div style={{
                                ...styles.dropdownContent,
                                ...(showDropdown ? styles.dropdownContentShow : {})
                            }}>
                                <Link to="/dashboard" style={styles.dropdownItem}>Dashboard</Link>
                                <Link to="/list-energy" style={styles.dropdownItem}>List Energy</Link>
                                <Link to="/buy-energy" style={styles.dropdownItem}>Buy Energy</Link>
                                <div
                                    style={styles.dropdownItem}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 