import axios from 'axios';

// 🛑 FIX: Use the Vercel variable OR fall back to '/api' for local development.
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: BASE_URL, 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // This header is correct based on your auth middleware
        config.headers['x-auth-token'] = token; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;