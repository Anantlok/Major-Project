import axios from 'axios';

// Detect environment: use local proxy in dev, real backend in production
const api = axios.create({
  baseURL:
    import.meta.env.DEV
      ? '/api' // Local dev → vite.config proxy
      : import.meta.env.VITE_API_URL + '/api', // Production → your backend
  withCredentials: true, // optional if using cookies/sessions
});

// Add token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;