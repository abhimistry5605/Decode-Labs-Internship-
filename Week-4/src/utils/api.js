import axios from 'axios';

// Create Axios client pointing to our Node/Express REST API on port 5000
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach authorization Bearer token (user email)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('techforge_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
