import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useWeb3 } from './context/Web3Context';
import { useTheme } from './context/ThemeContext';
import { useToast } from '@chakra-ui/react';
import { auth } from './services/api';
import { useAuth } from './context/AuthContext';

const cityOptions = [
  { name: 'Akouda', latitude: 35.8714, longitude: 10.5697 },
  { name: 'Aïne Draham', latitude: 36.7833, longitude: 8.7000 },
  { name: 'Ariana', latitude: 36.8625, longitude: 10.1956 },
  { name: 'Ar Rudayyif', latitude: 34.3833, longitude: 8.1500 },
  { name: 'Béja', latitude: 36.7333, longitude: 9.1833 },
  { name: 'Ben Arous', latitude: 36.7472, longitude: 10.3333 },
  { name: 'Ben Gardane', latitude: 33.1389, longitude: 11.2167 },
  { name: 'Beni Khiar', latitude: 36.4667, longitude: 10.7833 },
  { name: 'Bir Ali Ben Khalifa', latitude: 34.7339, longitude: 10.1000 },
  { name: 'Bizerte', latitude: 37.2778, longitude: 9.8639 },
  { name: 'Bou Salem', latitude: 36.6167, longitude: 8.9667 },
  { name: 'Dahmani', latitude: 35.9500, longitude: 8.8333 },
  { name: 'Dar Chabanne', latitude: 36.4700, longitude: 10.7500 },
  { name: 'Djemmal', latitude: 35.6400, longitude: 10.7600 },
  { name: 'Douz', latitude: 33.4500, longitude: 9.0167 },
  { name: 'El Alia', latitude: 37.1667, longitude: 10.0333 },
  { name: 'El Hamma', latitude: 33.8864, longitude: 9.7951 },
  { name: 'El Jem', latitude: 35.2967, longitude: 10.7128 },
  { name: 'El Kef', latitude: 36.1822, longitude: 8.7147 },
  { name: 'El Ksar', latitude: 34.3900, longitude: 8.8000 },
  { name: 'Ez Zahra', latitude: 36.7439, longitude: 10.3083 },
  { name: 'Fouchana', latitude: 36.7000, longitude: 10.1667 },
  { name: 'Gabès', latitude: 33.8833, longitude: 10.1167 },
  { name: 'Gafsa', latitude: 34.4225, longitude: 8.7842 },
  { name: 'Ghardimaou', latitude: 36.4500, longitude: 8.4333 },
  { name: 'Hammam Sousse', latitude: 35.8589, longitude: 10.5939 },
  { name: 'Hammam-Lif', latitude: 36.7333, longitude: 10.3333 },
  { name: 'Hammamet', latitude: 36.4000, longitude: 10.6167 },
  { name: 'Houmt Souk', latitude: 33.8667, longitude: 10.8500 },
  { name: 'Jedeïda', latitude: 36.8333, longitude: 9.9167 },
  { name: 'Jendouba', latitude: 36.5000, longitude: 8.7833 },
  { name: 'Kairouan', latitude: 35.6772, longitude: 10.1008 },
  { name: 'Kalaa Srira', latitude: 35.8236, longitude: 10.5583 },
  { name: 'Kasserine', latitude: 35.1667, longitude: 8.8333 },
  { name: 'Kebili', latitude: 33.7050, longitude: 8.9650 },
  { name: 'Kélibia', latitude: 36.8500, longitude: 11.1000 },
  { name: 'Kelaa Kebira', latitude: 35.8667, longitude: 10.5333 },
  { name: 'Korba', latitude: 36.5667, longitude: 10.8667 },
  { name: 'Ksar Hellal', latitude: 35.6429, longitude: 10.8911 },
  { name: 'La Goulette', latitude: 36.8181, longitude: 10.3050 },
  { name: 'La Marsa', latitude: 36.8764, longitude: 10.3253 },
  { name: 'Le Bardo', latitude: 36.8092, longitude: 10.1406 },
  { name: 'Le Kram', latitude: 36.8333, longitude: 10.3167 },
  { name: 'Mahdia', latitude: 35.5000, longitude: 11.0667 },
  { name: 'Manouba', latitude: 36.8078, longitude: 10.1011 },
  { name: 'Mateur', latitude: 37.0400, longitude: 9.6650 },
  { name: 'Medenine', latitude: 33.3547, longitude: 10.5053 },
  { name: 'Métouia', latitude: 33.9667, longitude: 10.0000 },
  { name: 'Metlaoui', latitude: 34.3333, longitude: 8.4000 },
  { name: 'Menzel Bourguiba', latitude: 37.1500, longitude: 9.7833 },
  { name: 'Menzel Temime', latitude: 36.7833, longitude: 10.9833 },
  { name: 'Midoun', latitude: 33.8000, longitude: 11.0000 },
  { name: 'Monastir', latitude: 35.7694, longitude: 10.8194 },
  { name: 'Moknine', latitude: 35.6333, longitude: 10.9000 },
  { name: 'Msaken', latitude: 35.7333, longitude: 10.5833 },
  { name: 'Nabeul', latitude: 36.4542, longitude: 10.7347 },
  { name: 'Oued Lill', latitude: 36.8333, longitude: 10.0500 },
  { name: 'Radès', latitude: 36.7667, longitude: 10.2833 },
  { name: 'Rass el Djebel', latitude: 37.2150, longitude: 10.1200 },
  { name: 'Rhennouch', latitude: 33.9300, longitude: 10.0700 },
  { name: 'Sakiet ed Daier', latitude: 34.8000, longitude: 10.7800 },
  { name: 'Sakiet ez Zit', latitude: 34.8000, longitude: 10.7700 },
  { name: 'Sbiba', latitude: 35.5467, longitude: 9.0736 },
  { name: 'Sejenane', latitude: 37.0564, longitude: 9.2383 },
  { name: 'Sfax', latitude: 34.7400, longitude: 10.7600 },
  { name: 'Siliana', latitude: 36.0819, longitude: 9.3747 },
  { name: 'Skhira', latitude: 34.3006, longitude: 10.0708 },
  { name: 'Soliman', latitude: 36.7000, longitude: 10.4833 },
  { name: 'Sousse', latitude: 35.8333, longitude: 10.6333 },
  { name: 'Sukrah', latitude: 36.8833, longitude: 10.2500 },
  { name: 'Tabarka', latitude: 36.9544, longitude: 8.7581 },
  { name: 'Tataouine', latitude: 32.9306, longitude: 10.4500 },
  { name: 'Tebourba', latitude: 36.8333, longitude: 9.8333 },
  { name: 'Teboulba', latitude: 35.6700, longitude: 10.9000 },
  { name: 'Tozeur', latitude: 33.9167, longitude: 8.1333 },
  { name: 'Tunis', latitude: 36.8064, longitude: 10.1817 },
  { name: 'Zaghouan', latitude: 36.4000, longitude: 10.1500 },
  { name: 'Zarzis', latitude: 33.5000, longitude: 11.1167 },
  { name: 'Other', latitude: '', longitude: '' },
];


const styles = theme => ({
  container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: theme.background || '#fff',
    minHeight: '100vh',
  },
  content: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: 0,
    color: theme.text || '#222',
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: theme.textSecondary || '#666',
    fontSize: '1rem',
    margin: '0.5rem 0 0 0',
  },
  form: {
    background: theme.cardBackground || '#fff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: theme.text || '#222',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.95rem',
    border: `1px solid ${theme.border || '#e5e7eb'}`,
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: theme.inputBackground || '#fff',
    color: theme.text || '#222',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.95rem',
    border: `1px solid ${theme.border || '#e5e7eb'}`,
    borderRadius: '0.5rem',
    outline: 'none',
    background: theme.inputBackground || '#fff',
    color: theme.text || '#222',
    marginBottom: '0.5rem',
  },
  radioGroup: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '0.5rem',
  },
  radioLabel: {
    fontSize: '0.95rem',
    color: theme.text || '#222',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  button: {
    width: '100%',
    backgroundColor: theme.accent || '#facc15',
    color: theme.text || '#222',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonHover: {
    backgroundColor: theme.accentHover || '#e6b800',
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontSize: '0.95rem',
    color: theme.textSecondary || '#666',
  },
  link: {
    color: theme.accent || '#facc15',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  },
});

const SignUp = () => {
  const navigate = useNavigate();
  const { account, setAccount } = useWeb3();
  const { theme } = useTheme();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    latitude: '',
    longitude: '',
    isProducer: false,
  });
  const [loading, setLoading] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { user, loading: userLoading, register } = useAuth();

  const s = styles(theme);

  // Only connect wallet on button click, always force MetaMask popup
  const handleConnectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (err) {
      toast({
        title: 'Wallet Connection Failed',
        description: err.message || 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCityChange = (e) => {
    const city = cityOptions.find(c => c.name === e.target.value);
    setFormData(prev => ({
      ...prev,
      city: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      isProducer: e.target.value === 'producer'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = {};
    if (!account) newErrors.account = 'Please connect your wallet.';
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.latitude || !formData.longitude) newErrors.city = 'Please select a valid city.';
    if (formData.isProducer === null) newErrors.isProducer = 'Please select a role.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const response = await register({
        address: account,
        name: formData.name,
        latitude: formData.latitude,
        longitude: formData.longitude,
        isProducer: formData.isProducer,
      });
      // Wait for user context to finish loading
      const waitForUser = async () => {
        let tries = 0;
        while (!user && tries < 20) {
          await new Promise(res => setTimeout(res, 100));
          tries++;
        }
      };
      await waitForUser();
      if (user) {
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        navigate('/dashboard');
      } else {
        setApiError('Failed to load user profile after registration. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message && err.response.data.message.toLowerCase().includes('already')) {
        setApiError('This address is already registered. Please log in or use a different wallet.');
      } else {
        setApiError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = account && formData.name && formData.city && formData.latitude && formData.longitude && (formData.isProducer === true || formData.isProducer === false);

  return (
    <div style={s.container}>
      <Navbar hideAccountInfo />
      <div style={s.content}>
        <div style={s.header}>
          <h1 style={s.title}>Create Account</h1>
          <p style={s.subtitle}>Join our energy trading platform</p>
        </div>
        <form style={s.form} onSubmit={handleSubmit}>
          <div style={s.formGroup}>
            <label style={s.label}>Wallet Address</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={account || ''}
                disabled
                style={{ ...s.input, background: '#f3f4f6', color: '#888' }}
              />
              {!account && (
                <button
                  type="button"
                  style={{ ...s.button, width: 'auto', padding: '0.5rem 1rem', marginTop: 0 }}
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </button>
              )}
            </div>
            {errors.account && <div style={s.errorMessage}>{errors.account}</div>}
          </div>
          <div style={s.formGroup}>
            <label style={s.label} htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={s.input}
            />
            {errors.name && <div style={s.errorMessage}>{errors.name}</div>}
          </div>
          <div style={s.formGroup}>
            <label style={s.label} htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              style={s.select}
            >
              <option value="">Select a city</option>
              {cityOptions.map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
            {errors.city && <div style={s.errorMessage}>{errors.city}</div>}
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Role</label>
            <div style={s.radioGroup}>
              <label style={s.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="producer"
                  checked={formData.isProducer === true}
                  onChange={handleRoleChange}
                />
                Producer
              </label>
              <label style={s.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="consumer"
                  checked={formData.isProducer === false}
                  onChange={handleRoleChange}
                />
                Consumer
              </label>
            </div>
            {errors.isProducer && <div style={s.errorMessage}>{errors.isProducer}</div>}
          </div>
          {apiError && <div style={{ color: '#dc2626', fontSize: '0.95rem', marginBottom: '1rem', textAlign: 'center' }}>{apiError}</div>}
          {userLoading && <div style={{ color: theme.textSecondary, textAlign: 'center', margin: '1rem' }}>Loading user...</div>}
          <button
            type="submit"
            style={{ ...s.button, ...(buttonHover ? s.buttonHover : {}) }}
            onMouseOver={() => setButtonHover(true)}
            onMouseOut={() => setButtonHover(false)}
            disabled={loading || !isFormValid}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div style={s.loginLink}>
          Already have an account?{' '}
          <span
            style={s.link}
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
