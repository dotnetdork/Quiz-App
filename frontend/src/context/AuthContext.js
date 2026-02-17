/**
 * Authentication Context
 * 
 * Provides centralized authentication state management to prevent
 * duplicate API calls and enable smoother page transitions.
 * Also prefetches dashboard data during authentication to reduce loading time.
 */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiCall } from '../api';

const AuthContext = createContext(null);

// Cache for prefetched data
let prefetchedData = null;
let prefetchPromise = null;

/**
 * Prefetch dashboard data while auth is being checked
 * This runs in parallel with auth check to minimize total loading time
 */
function prefetchDashboardData(username) {
  if (prefetchPromise) return prefetchPromise;
  
  prefetchPromise = Promise.all([
    apiCall(`/api/leaderboard/user/${username}`).catch(() => ({ scores: [] })),
    apiCall('/api/quiz/questions').catch(() => ({ quizzes: [] })),
    apiCall('/api/leaderboard/').catch(() => ({ leaderboard: [] }))
  ]).then(([scoreData, quizData, leaderData]) => {
    prefetchedData = {
      scores: scoreData.scores || [],
      quizzes: quizData.quizzes || [],
      leaderboard: leaderData.leaderboard || [],
      timestamp: Date.now()
    };
    return prefetchedData;
  });
  
  return prefetchPromise;
}

/**
 * Get prefetched data if available and fresh (within 30 seconds)
 */
export function getPrefetchedData() {
  if (prefetchedData && Date.now() - prefetchedData.timestamp < 30000) {
    const data = prefetchedData;
    // Clear after consumption to allow fresh fetch on next load
    prefetchedData = null;
    prefetchPromise = null;
    return data;
  }
  return null;
}

/**
 * Clear prefetch cache (e.g., on logout)
 */
export function clearPrefetchCache() {
  prefetchedData = null;
  prefetchPromise = null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(
    sessionStorage.getItem('isAuthenticating') === 'true'
  );

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const userData = await apiCall('/auth/me');
        
        if (!mounted) return;
        
        setUser(userData);
        
        // Start prefetching dashboard data immediately after auth succeeds
        // This runs in parallel while React updates state
        if (userData?.username) {
          prefetchDashboardData(userData.username);
        }
      } catch (error) {
        if (!mounted) return;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Authentication check failed:', error.message);
        }
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Clear isAuthenticating flag once loading is complete
  useEffect(() => {
    if (!loading && isAuthenticating) {
      // Small delay to allow for smooth transition
      const timer = setTimeout(() => {
        sessionStorage.removeItem('isAuthenticating');
        setIsAuthenticating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticating]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    isAuthenticating
  }), [user, loading, isAuthenticating]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
