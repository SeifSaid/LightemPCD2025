import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useWeb3 } from './context/Web3Context';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { connectWallet, account, isConnected } = useWeb3();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!isConnected) {
        await connectWallet();
      }
      // Here you would typically make an API call to your backend
      // to verify the user and get their details
      console.log("Logged in with wallet:", account);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setError("");

    try {
      await connectWallet();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    body: {
      fontFamily: "'Inter', 'Poppins', Arial, sans-serif",
      backgroundColor: "#FAFAFA",
      display: "flex",
      flexDirection: 'column',
      alignItems: "center",
      minHeight: "100vh",
      margin: 0,
      position: "relative",
      paddingTop: "0",
    },
    loginBox: {
      background: "#fff",
      padding: "3.5rem 2.5rem 2.5rem 2.5rem",
      borderRadius: "16px",
      textAlign: "center",
      width: "100%",
      maxWidth: "400px",
      marginTop: '7vh',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    title: {
      fontSize: "2.2rem",
      color: "#222",
      fontWeight: 900,
      fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
      marginBottom: "0.5rem",
      letterSpacing: '-1px',
    },
    subtitle: {
      color: "#888",
      fontSize: "1.13rem",
      marginBottom: "2.2rem",
      fontWeight: 500,
    },
    inputField: {
      width: "100%",
      padding: "1rem 1.2rem",
      marginBottom: "1.1rem",
      border: "1.5px solid #e5e7eb",
      borderRadius: "8px",
      fontSize: "1.13rem",
      fontWeight: 600,
      outline: "none",
      background: '#fafafa',
      boxSizing: 'border-box',
      wordBreak: 'break-all',
    },
    forgotPassword: {
      color: "#facc15",
      textDecoration: "none",
      fontSize: "1.05rem",
      float: 'right',
      marginBottom: '1.2rem',
      fontWeight: 500,
    },
    loginButton: {
      backgroundColor: "#facc15",
      color: "#222",
      border: "none",
      padding: "1.1rem 0",
      width: "100%",
      borderRadius: "8px",
      fontWeight: "700",
      fontSize: "1.18rem",
      cursor: "pointer",
      marginTop: "0.7rem",
      transition: 'background 0.2s',
    },
    loginButtonHover: {
      backgroundColor: "#eab308",
    },
    signupText: {
      marginTop: "1.7rem",
      fontSize: "1.05rem",
      color: '#888',
    },
    signupLink: {
      color: "#facc15",
      textDecoration: "none",
      fontWeight: 700,
      marginLeft: '0.3rem',
    },
    errorMessage: {
      color: "#ef4444",
      fontSize: "0.9rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
    walletButton: {
      backgroundColor: "#3b82f6",
      color: "#fff",
      border: "none",
      padding: "1.1rem 0",
      width: "100%",
      borderRadius: "8px",
      fontWeight: "700",
      fontSize: "1.18rem",
      cursor: "pointer",
      marginBottom: "1rem",
      transition: 'background 0.2s',
    },
    walletButtonHover: {
      backgroundColor: "#2563eb",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "1.5rem 0",
      color: "#888",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#e5e7eb",
    },
    dividerText: {
      padding: "0 1rem",
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={styles.body}>
      <Navbar showAuthButtons={false} />
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Log In</h2>
        <div style={styles.subtitle}>Welcome back! Please sign in to your account.</div>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <button
          onClick={handleConnectWallet}
          style={styles.walletButton}
          onMouseOver={e => e.target.style.backgroundColor = styles.walletButtonHover.backgroundColor}
          onMouseOut={e => e.target.style.backgroundColor = styles.walletButton.backgroundColor}
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="E-mail or Wallet Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.inputField}
            required
          />
          <div>
            <a href="#" style={styles.forgotPassword}>Forgot Password?</a>
          </div>
          <button
            type="submit"
            style={styles.loginButton}
            onMouseOver={e => e.target.style.backgroundColor = styles.loginButtonHover.backgroundColor}
            onMouseOut={e => e.target.style.backgroundColor = styles.loginButton.backgroundColor}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div style={styles.signupText}>
          Don't have an account?
          <Link to="/signup" style={styles.signupLink}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
