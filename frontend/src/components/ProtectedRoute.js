/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Uses shared AuthContext to prevent duplicate API calls.
 * Shows skeleton loading with animated background for smooth transitions.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from './AnimatedBackground';

/**
 * Dashboard skeleton loader shown during authentication
 * Provides visual continuity between login and dashboard
 */
function DashboardSkeleton({ showLoadingBar }) {
  return (
    <>
      <AnimatedBackground theme="dashboard" />
      <div className="dashboard-skeleton" style={{ position: 'relative', zIndex: 1 }}>
        <div className="skeleton-profile-card">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
        <div className="skeleton-stats">
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
        </div>
        {showLoadingBar && (
          <div className="loading-bar-overlay">
            <div className="loading-bar">
              <div className="loading-bar-fill"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, isAuthenticating } = useAuth();

  if (loading) {
    // Always show skeleton with background during loading
    // This prevents the white screen flash
    return <DashboardSkeleton showLoadingBar={isAuthenticating} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
