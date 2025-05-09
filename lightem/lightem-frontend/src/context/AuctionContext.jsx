import React, { createContext, useContext, useState, useEffect } from 'react';
import { auctions } from '../services/api';

const AuctionContext = createContext(null);

export const AuctionProvider = ({ children }) => {
    const [activeAuctions, setActiveAuctions] = useState([]);
    const [completedAuctions, setCompletedAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAuctions = async () => {
        try {
            setLoading(true);
            const [activeResponse, completedResponse] = await Promise.all([
                auctions.getActive(),
                auctions.getCompleted()
            ]);
            setActiveAuctions(activeResponse.data);
            setCompletedAuctions(completedResponse.data);
            setError(null);
        } catch (error) {
            console.error('Error loading auctions:', error);
            setError('Failed to load auctions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuctions();
        // Refresh auctions every minute
        const interval = setInterval(loadAuctions, 60000);
        return () => clearInterval(interval);
    }, []);

    const createAuction = async (data) => {
        try {
            const response = await auctions.create(data);
            await loadAuctions();
            return response.data;
        } catch (error) {
            console.error('Error creating auction:', error);
            throw error;
        }
    };

    const placeBid = async (auctionId, data) => {
        try {
            const response = await auctions.placeBid(auctionId, data);
            await loadAuctions();
            return response.data;
        } catch (error) {
            console.error('Error placing bid:', error);
            throw error;
        }
    };

    const completeAuction = async (auctionId, data) => {
        try {
            const response = await auctions.complete(auctionId, data);
            await loadAuctions();
            return response.data;
        } catch (error) {
            console.error('Error completing auction:', error);
            throw error;
        }
    };

    const getAuction = async (auctionId) => {
        try {
            const response = await auctions.getById(auctionId);
            return response.data;
        } catch (error) {
            console.error('Error getting auction:', error);
            throw error;
        }
    };

    return (
        <AuctionContext.Provider value={{
            activeAuctions,
            completedAuctions,
            loading,
            error,
            createAuction,
            placeBid,
            completeAuction,
            getAuction,
            refreshAuctions: loadAuctions
        }}>
            {children}
        </AuctionContext.Provider>
    );
};

export const useAuctions = () => {
    const context = useContext(AuctionContext);
    if (!context) {
        throw new Error('useAuctions must be used within an AuctionProvider');
    }
    return context;
}; 