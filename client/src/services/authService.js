import axiosInstance from '@/lib/axiosInstance'; // Use the configured instance

// Function to create the Basic Auth header value
const createBasicAuthToken = (username, password) => {
  return 'Basic ' + btoa(username + ":" + password); // btoa encodes to Base64
}

const login = async (username, password) => {
  try {
    // Spring Security might intercept a GET request to a protected endpoint
    // when using Basic Auth, rather than requiring a specific POST to /login.
    // Let's try hitting a known protected endpoint like /students to trigger the auth.
    // If this doesn't work reliably, we might need a dedicated login endpoint in Spring.
    const response = await axiosInstance.get('/students', { // Or another protected endpoint
      headers: {
        'Authorization': createBasicAuthToken(username, password)
      }
    });

    // If the request succeeds (status 2xx), authentication was successful.
    // We don't necessarily get user data back from this specific call,
    // but we know the credentials are valid.
    console.log('AuthService: Basic Auth successful', response.status);
    // Return minimal user info or just confirmation
    return { username: username }; 

  } catch (error) {
    console.error('AuthService: Login failed', error.response || error.message);
    // If error.response exists, it's likely an HTTP error (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid username or password.');
    } else {
      // Network error or other issue
      throw new Error('Login failed. Please try again later.');
    }
  }
};

// Logout function (optional, might not be needed with Basic Auth unless clearing state)
const logout = () => {
  // With Basic Auth, the browser often caches credentials.
  // True logout often requires closing the browser or specific browser handling.
  // We mainly clear the client-side state.
  console.log('AuthService: Logout called (clearing client state)');
};


// Function to change password (to be implemented later)
const changePassword = async (currentPassword, newPassword) => {
    // TODO: Implement API call to backend endpoint for changing password
    // This will require sending the current Basic Auth token (or potentially a session token)
    // along with the current and new passwords in the request body.
    console.log("changePassword function not implemented yet.");
    throw new Error("Password change functionality not available.");
}

export const authService = {
  login,
  logout,
  changePassword,
  createBasicAuthToken // Expose this if needed elsewhere, e.g., for subsequent requests
};
