/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { apiCall } from '../api';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await apiCall('/auth/me');
        setIsAuthenticated(true);
      } catch (error) {
        // Log error in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Authentication check failed:', error.message);
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  if (loading) {
    // Check if we're coming from OAuth flow to show consistent loading bar
    const isAuthenticating = sessionStorage.getItem('isAuthenticating') === 'true';
    
    if (isAuthenticating) {
      // Show loading bar during authentication check
      return (
        <div className="loading-bar-container" style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '400px',
          maxWidth: '80%'
        }}>
          <div className="loading-bar">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
