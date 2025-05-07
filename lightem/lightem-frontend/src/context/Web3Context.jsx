import React, { createContext, useState, useContext, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);
        setError(null);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        return accounts[0];
      } else {
        throw new Error('Please install MetaMask or use a Web3-enabled browser');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setIsConnected(false);
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch(err => {
          console.error('Error checking wallet connection:', err);
        });
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      web3,
      account,
      isConnected,
      error,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 