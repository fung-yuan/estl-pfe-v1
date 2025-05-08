import axios from 'axios';

const API_BASE_URL = '/api/announcements'; // Adjust if your API is hosted elsewhere or proxy not set up
const EMAIL_API_BASE_URL = '/api/email-announcements'; // Base URL for email announcements

// Fetch active announcements for all users
export const getActiveAnnouncements = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/active`);
        return response.data;
    } catch (error) {
        console.error('Error fetching active announcements:', error);
        throw error;
    }
};

// Send email announcement with filtering options
export const sendEmailAnnouncement = async (emailAnnouncementData) => {
    try {
        const response = await axios.post(`${EMAIL_API_BASE_URL}/send`, emailAnnouncementData);
        return response.data;
    } catch (error) {
        console.error('Error sending email announcement:', error);
        throw error;
    }
};

// Fetch departments for email filtering
export const getDepartments = async () => {
    try {
        const response = await axios.get('/api/departments');
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

// Fetch semesters for email filtering
export const getSemesters = async () => {
    try {
        const response = await axios.get('/api/semesters');
        return response.data;
    } catch (error) {
        console.error('Error fetching semesters:', error);
        throw error;
    }
};
