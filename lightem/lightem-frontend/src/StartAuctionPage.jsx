import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from './context/ThemeContext';

const StartAuctionPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        energyAmount: '',
        startingPrice: '',
        duration: '30',
    });
    const [errors, setErrors] = useState({});
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
        select: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            fontSize: '1rem',
            color: theme.text,
            background: theme.cardBackground,
            cursor: 'pointer',
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
        infoText: {
            color: theme.textSecondary,
            fontSize: '0.875rem',
            marginTop: '0.5rem',
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.energyAmount || formData.energyAmount <= 0) {
            newErrors.energyAmount = 'Please enter a valid energy amount';
        }
        if (!formData.startingPrice || formData.startingPrice <= 0) {
            newErrors.startingPrice = 'Please enter a valid starting price';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // TODO: Implement auction creation logic
            console.log('Creating auction:', formData);
            navigate('/auction-market');
        }
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Start New Auction</h1>
                    <p style={styles.subtitle}>Create a new energy auction for producers to bid on</p>
                </div>

                <div style={styles.formCard}>
                    <form onSubmit={handleSubmit}>
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
                            <label style={styles.label}>Starting Price (wei)</label>
                            <input
                                type="number"
                                name="startingPrice"
                                value={formData.startingPrice}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Enter starting price in wei"
                                required
                            />
                            {errors.startingPrice && (
                                <div style={styles.errorMessage}>{errors.startingPrice}</div>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Auction Duration (minutes)</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                style={styles.select}
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                            </select>
                            <div style={styles.infoText}>
                                The auction will automatically close after the selected duration
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={styles.submitButton}
                            onMouseEnter={() => setIsBtnHovered(true)}
                            onMouseLeave={() => setIsBtnHovered(false)}
                        >
                            Start Auction
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StartAuctionPage; 