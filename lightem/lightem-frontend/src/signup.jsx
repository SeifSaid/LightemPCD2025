import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: '#fff',
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
    color: '#222',
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem',
    margin: '0.5rem 0 0 0',
  },
  form: {
    background: '#fff',
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
    color: '#222',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.95rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputFocus: {
    borderColor: '#facc15',
  },
  button: {
    width: '100%',
    backgroundColor: '#facc15',
    color: '#222',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonHover: {
    backgroundColor: '#e6b800',
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
    color: '#666',
  },
  link: {
    color: '#facc15',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length === 0) {
      // Handle successful signup
      navigate('/dashboard');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join our energy trading platform</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.username && <div style={styles.errorMessage}>{errors.username}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.email && <div style={styles.errorMessage}>{errors.email}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.password && <div style={styles.errorMessage}>{errors.password}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.confirmPassword && <div style={styles.errorMessage}>{errors.confirmPassword}</div>}
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={e => e.target.style.backgroundColor = '#e6b800'}
            onMouseOut={e => e.target.style.backgroundColor = '#facc15'}
          >
            Sign Up
          </button>
        </form>

        <div style={styles.loginLink}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
