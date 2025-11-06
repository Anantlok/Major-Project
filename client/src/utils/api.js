import axios from 'axios';const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
const api = axios.create({
  baseURL: BASE_URL, 
});api.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
  if (token) {
    // Note: If your backend expects 'Authorization: Bearer <token>', 
    // you might need to change 'x-auth-token' here.
    config.headers['x-auth-token'] = token; 
  }
return config;
}, (error) => {
return Promise.reject(error);});
export default api;