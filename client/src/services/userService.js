import axiosInstance from '@/lib/axiosInstance';

const API_URL = '/user'; // Removed '/api' prefix as axiosInstance likely includes it

/**
 * Fetches the details of the currently logged-in user.
 * @returns {Promise<object>} A promise that resolves to the user data (e.g., { username }).
 */
const getCurrentUser = async () => {
    try {
        console.log("userService: Fetching current user details...");
        const response = await axiosInstance.get(`${API_URL}/me`);
        console.log("userService: Current user details fetched successfully.", response.data); // Log response.data
        return response.data; // Return only the data part of the response
    } catch (error) {
        console.error('userService: Error fetching current user:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch user details');
    }
};

/**
 * Changes the password for the currently logged-in user.
 * @param {object} passwordData - Object containing { currentPassword, newPassword }.
 * @returns {Promise<object>} A promise that resolves to the success message from the backend.
 */
const changePassword = async (passwordData) => {
    try {
        console.log("userService: Attempting to change password...");
        // axiosInstance POST already returns response.data
        const response = await axiosInstance.post(`${API_URL}/change-password`, passwordData);
        console.log("userService: Password change response received.", response);
        return response; // Should be the success message string
    } catch (error) {
        console.error('userService: Error changing password:', error.response?.data || error.message);
        // Throw the specific error message from the backend if available
        throw error.response?.data || new Error('Password change failed');
    }
};

export const userService = {
    getCurrentUser,
    changePassword,
};
