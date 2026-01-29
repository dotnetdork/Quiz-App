/**
 * API Configuration
 * 
 * Contains the base URL for API calls.
 * Change this based on your environment.
 */

// Backend API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Helper function to make API calls
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/api/quiz/questions')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The response data
 */
export async function apiCall(endpoint, options = {}) {
  // Set default options
  const defaultOptions = {
    credentials: 'include',  // Include cookies for auth
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
  
  // Parse JSON response
  const data = await response.json();
  
  // Check for errors
  if (!response.ok) {
    throw new Error(data.detail || 'API request failed');
  }
  
  return data;
}
