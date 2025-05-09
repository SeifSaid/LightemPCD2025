import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';
import { useWeb3 } from './context/Web3Context';
import { listings } from './services/api';

const CreateListing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { account, isConnected } = useWeb3();
  const [formData, setFormData] = useState({ energyAmount: '', price: '' });
  const [errors, setErrors] = useState({});
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

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
    formCard: {
      background: theme.cardBackground,
      border: theme.cardBorder,
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    formGroup: {
      marginBottom: '1.25rem',
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
    disabledInput: {
      background: '#f3f4f6',
      color: '#888',
      cursor: 'not-allowed',
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isConnected || !account) newErrors.account = 'Please connect your wallet.';
    if (!formData.energyAmount || formData.energyAmount <= 0) newErrors.energyAmount = 'Please enter a valid energy amount';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Please enter a valid price';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess('');
    if (validateForm()) {
      setLoading(true);
      try {
        await listings.create({
          seller: account,
          amount: Number(formData.energyAmount),
          basePrice: Number(formData.price),
        });
        setApiSuccess('Listing created successfully!');
        setTimeout(() => navigate('/fixed-market'), 1000);
      } catch (err) {
        setApiError(err.response?.data?.message || 'Failed to create listing.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Listing</h1>
          <p style={styles.subtitle}>List your energy for sale at a fixed price</p>
        </div>
        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Wallet Address</label>
              <input
                type="text"
                value={account || ''}
                disabled
                style={{ ...styles.input, ...styles.disabledInput }}
                placeholder="Connect your wallet"
              />
              {errors.account && <div style={styles.errorMessage}>{errors.account}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Energy Amount (kWh)</label>
              <input
                type="number"
                name="energyAmount"
                value={formData.energyAmount}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter amount of energy to sell"
                required
              />
              {errors.energyAmount && (
                <div style={styles.errorMessage}>{errors.energyAmount}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (wei)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter price per kWh in wei"
                required
              />
              {errors.price && (
                <div style={styles.errorMessage}>{errors.price}</div>
              )}
            </div>
            <button
              type="submit"
              style={styles.submitButton}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            {apiError && <div style={styles.errorMessage}>{apiError}</div>}
            {apiSuccess && <div style={styles.successMessage}>{apiSuccess}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
