import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    login: (data) => api.post('/users/login', data),
    register: (data) => api.post('/users/register', data),
    getProfile: () => api.get('/users/profile'),
    getUserProfile: (address) => api.get(`/users/${address}`),
    getUserReputation: (address) => api.get(`/users/${address}/reputation`),
};

// Auction endpoints
export const auctions = {
    create: (data) => api.post('/auctions/create', data),
    placeBid: (auctionId, data) => api.post(`/auctions/${auctionId}/bid`, data),
    complete: (auctionId, data) => api.put(`/auctions/${auctionId}/complete`, data),
    getActive: () => api.get('/auctions/active'),
    getCompleted: () => api.get('/auctions/completed'),
    getById: (auctionId) => api.get(`/auctions/${auctionId}`),
    getUserAuctions: (address) => api.get(`/auctions/user/${address}`),
};

// Energy endpoints
export const energy = {
    mint: (data) => api.post('/energy/mint', data),
    transfer: (data) => api.post('/energy/transfer', data),
    getBatches: () => api.get('/energy/batches'),
    getPriceHistory: () => api.get('/energy/price-history')
};

// Listing endpoints
export const listings = {
    create: (data) => api.post('/listings/create', data),
    getActive: () => api.get('/listings/active'),
    purchase: (listingId, data) => api.post(`/listings/${listingId}/purchase`, data),
    getUserListings: (address) => api.get(`/listings/user/${address}`),
};

// Transaction endpoints
export const transactions = {
    getAll: () => api.get('/transactions'),
    getById: (hash) => api.get(`/transactions/${hash}`),
    getByUser: (address) => api.get(`/transactions/user/${address}`),
};

export const stats = {
    getUserStats: (address) => api.get(`/users/${address}/stats`), // if available
};

export default api; 