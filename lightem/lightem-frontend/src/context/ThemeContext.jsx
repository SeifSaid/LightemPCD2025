import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    background: '#fff',
    text: '#222',
    textSecondary: '#666',
    border: '#e5e7eb',
    accent: '#facc15',
    accentHover: '#e6b800',
    cardBackground: '#fff',
    cardBorder: '1px solid #e5e7eb',
  },
  dark: {
    background: '#1a1a1a',
    text: '#fff',
    textSecondary: '#a3a3a3',
    border: '#333',
    accent: '#facc15',
    accentHover: '#e6b800',
    cardBackground: '#262626',
    cardBorder: '1px solid #333',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const theme = isDarkMode ? themes.dark : themes.light;

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 