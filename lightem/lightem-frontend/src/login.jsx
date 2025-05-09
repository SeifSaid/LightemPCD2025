import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useWeb3 } from './context/Web3Context';
import Navbar from './Navbar';
import { useToast } from '@chakra-ui/react';

const styles = theme => ({
  container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: theme.background,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: theme.cardBackground,
    borderRadius: '16px',
    padding: '3rem 2rem',
    boxShadow: theme.isDarkMode
      ? '0 4px 12px rgba(0,0,0,0.5)'
      : '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    transition: 'transform 0.2s',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    margin: 0,
    color: theme.text,
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: theme.textSecondary,
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
  button: {
    width: '100%',
    background: theme.accent,
    color: theme.cardBackground,
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
  },
  buttonHover: {
    background: theme.accentHover,
    transform: 'scale(1.02)',
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  infoMessage: {
    color: theme.textSecondary,
    fontSize: '0.9rem',
    margin: '1rem 0',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  openMetaMaskBtn: {
    background: theme.cardBorder,
    color: theme.text,
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.2rem',
    fontWeight: 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
    margin: '0.5rem 0',
  },
  signupLink: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.9rem',
    color: theme.textSecondary,
  },
  link: {
    color: theme.accent,
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: '0.25rem',
  },
  address: {
    fontSize: '0.95rem',
    color: theme.textSecondary,
    marginTop: '1rem',
    wordBreak: 'break-all',
    textAlign: 'center',
  },
});

const openMetaMaskConnectedSites = () => {
  window.open(
    'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#settings/connectedSites',
    '_blank'
  );
};

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme } = useTheme();
  const { user, loading: userLoading, login } = useAuth();
  const { account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buttonHover, setButtonHover] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showSwitchMsg, setShowSwitchMsg] = useState(false);
  const [apiError, setApiError] = useState('');

  const s = styles(theme);

  useEffect(() => {
    if (account) setError('');
  }, [account]);

  const handleConnectWallet = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    setShowSwitchMsg(false);
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(accounts.length > 0);
        if (accounts.length === 1 && account && accounts[0].toLowerCase() === account.toLowerCase()) {
          setShowSwitchMsg(true);
        }
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (err) {
      setError(err.message.includes('already pending')
        ? 'A MetaMask request is already pending. Please complete it in your extension.'
        : err.message
      );
      toast({
        title: 'Connection Failed',
        description: err.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    setError('');
    setApiError('');
    try {
      if (!account) throw new Error('No wallet account detected.');
      const response = await login({ address: account });
      if (response.data.notRegistered) {
        setApiError('Address not registered. Please sign up first.');
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <Navbar />
      <div style={s.content}>
        <div style={s.card}>
          <header style={s.header}>
            <h1 style={s.title}>Log In</h1>
            <p style={s.subtitle}>Welcome back! Connect your wallet to continue.</p>
          </header>
          {error && <div style={s.errorMessage}>{error}</div>}
          {apiError && <div style={s.errorMessage}>{apiError}</div>}
          {!walletConnected ? (
            <>
              <button
                style={{ ...s.button, ...(buttonHover ? s.buttonHover : {}) }}
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
                onClick={handleConnectWallet}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
              {showSwitchMsg && (
                <div style={s.infoMessage}>
                  To switch accounts, disconnect this site in MetaMask and reconnect.
                </div>
              )}
              {showSwitchMsg && (
                <button style={s.openMetaMaskBtn} onClick={openMetaMaskConnectedSites}>
                  Manage Connected Sites
                </button>
              )}
            </>
          ) : (
            <>
              <div style={s.address}>Connected: {account}</div>
              <button
                style={{ ...s.button, ...(buttonHover ? s.buttonHover : {}) }}
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
                onClick={handleContinue}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Continue'}
              </button>
            </>
          )}
          <div style={s.signupLink}>
            Don't have an account?
            <span style={s.link} onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </div>
          {userLoading && <p style={{ color: theme.textSecondary, textAlign: 'center', marginTop: '1rem' }}>Loading user...</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
