/**
 * Custom Hook for Authentication
 * 
 * Provides a reusable hook for checking user authentication status.
 * Reduces code duplication across components that need auth checks.
 */
import { useState, useEffect } from 'react';
import { apiCall } from '../api';

/**
 * Custom hook to check authentication status
 * @returns {Object} - { user, loading, error }
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await apiCall('/auth/me');
        setUser(userData);
      } catch (err) {
        // Log error in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Authentication check failed:', err.message);
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  return { user, loading, error };
}
