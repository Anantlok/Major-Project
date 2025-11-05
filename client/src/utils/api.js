import axios from 'axios';

// Create a pre-configured instance of axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Our backend's base URL
});

/* This "interceptor" runs before every request.
  It checks if a token exists in localStorage, 
  and if it does, it adds it to the request headers.
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;