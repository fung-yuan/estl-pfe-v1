import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:8080/api'; // Ensure this matches your backend

// Create a dedicated Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken'); 
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = token;
    }
    
    // Ensure Content-Type is set for PUT and POST requests
    if (config.method === 'put' || config.method === 'post') {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (Example: Handle 401 Unauthorized globally)
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Unauthorized - Token might be invalid or expired
      console.error('Axios Interceptor: Unauthorized request (401). Clearing token.');
      localStorage.removeItem('authToken');
      // Optionally redirect to login page or trigger logout in context
      // This requires more complex setup to access context/navigation outside components
      // For now, just log and clear token.
      window.location.href = '/login'; // Simple redirect
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
