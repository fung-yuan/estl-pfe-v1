import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error); // Log the entire error object
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error Data:', error.response.data);
            console.error('API Error Status:', error.response.status);
            console.error('API Error Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Error Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Error Message:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;