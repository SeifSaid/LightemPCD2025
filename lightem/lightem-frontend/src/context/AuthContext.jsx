import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import { useWeb3 } from './Web3Context';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { account } = useWeb3();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!account) {
            setUser(null);
            setLoading(false);
            return;
        }
        if (token) {
            // Optionally decode JWT to check address, or just try to load user
            loadUser();
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [account]);

    const loadUser = async () => {
        try {
            let response;
            try {
                response = await auth.getProfile();
            } catch (e) {
                if (account) {
                    response = await auth.getUserProfile(account);
                } else {
                    throw e;
                }
            }
            if (response.data.address && response.data.address.toLowerCase() !== account.toLowerCase()) {
                // JWT is for a different address, clear session
                localStorage.removeItem('token');
                setUser(null);
                return;
            }
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {
        const response = await auth.login(data);
        localStorage.setItem('token', response.data.token);
        await loadUser();
        return response.data;
    };

    const register = async (data) => {
        const response = await auth.register(data);
        localStorage.setItem('token', response.data.token);
        await loadUser();
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 