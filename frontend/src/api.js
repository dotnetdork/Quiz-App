/**
 * API Configuration
 * 
 * Contains the base URL for API calls.
 * When served from the same server as the backend, use empty string (same origin).
 * For development with separate servers, set REACT_APP_API_URL=http://localhost:8000
 * 
 * Performance optimizations:
 * - Simple request caching for GET requests
 * - Configurable cache TTL per endpoint
 */

// Backend API URL - defaults to same origin (empty string) for production
// When frontend is served by the backend, API calls go to the same server
export const API_URL = process.env.REACT_APP_API_URL || '';

// Simple in-memory cache for GET requests
const apiCache = new Map();

// Cache TTL in milliseconds (5 minutes default, longer for static data)
const CACHE_TTL = {
  '/api/quiz/questions': 5 * 60 * 1000,  // Quiz list: 5 minutes
  '/api/quiz/quiz/': 10 * 60 * 1000,      // Individual quiz: 10 minutes
  '/api/leaderboard/': 30 * 1000,         // Leaderboard: 30 seconds (changes frequently)
  '/api/ai/credits': 5 * 1000,            // AI credit balance: 5 seconds (changes after every AI call)
  '/api/courses/': 60 * 1000,             // Quest lists/detail/progress: 1 minute
  default: 60 * 1000                       // Default: 1 minute
};

/**
 * Get cache TTL for an endpoint
 */
function getCacheTTL(endpoint) {
  for (const [pattern, ttl] of Object.entries(CACHE_TTL)) {
    if (pattern === 'default') continue;
    if (endpoint.startsWith(pattern)) return ttl;
  }
  return CACHE_TTL.default;
}

/**
 * Clear all API cache (useful after mutations)
 */
export function clearApiCache() {
  apiCache.clear();
}

/**
 * Clear cache for a specific endpoint pattern
 */
export function clearCacheFor(pattern) {
  for (const key of apiCache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
}

/**
 * Helper function to make API calls
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/api/quiz/questions')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The response data
 */
export async function apiCall(endpoint, options = {}) {
  const method = options.method || 'GET';
  const cacheKey = endpoint;
  
  // Check cache for GET requests
  if (method === 'GET') {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < getCacheTTL(endpoint)) {
      return cached.data;
    }
  }
  
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
    // Most endpoints use a plain string `detail` (FastAPI's default), but
    // the AI course extension's endpoints raise HTTPException with an
    // object detail (e.g. {"error": "credits_exhausted", "message": "..."}
    // -- see backend/ai_routes.py) so a specific error code can be told
    // apart from a human-readable message. `new Error(data.detail)` on an
    // object would stringify to "[object Object]", so prefer `.message`
    // when detail is an object, and still surface `.detail` on the thrown
    // Error so callers can branch on `.detail.error` (e.g. show a
    // dedicated "out of credits" UI instead of a generic error banner).
    let message = 'API request failed';
    if (typeof data.detail === 'string') {
      message = data.detail;
    } else if (data.detail && typeof data.detail === 'object') {
      message = data.detail.message || data.detail.error || message;
    }
    const error = new Error(message);
    error.status = response.status;
    error.detail = data.detail;
    throw error;
  }

  // Cache successful GET responses
  if (method === 'GET') {
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  // Clear relevant caches after mutations
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    // Clear leaderboard cache after quiz submission
    if (endpoint.includes('/submit')) {
      clearCacheFor('/api/leaderboard');
    }
    // AI credit-spending calls change the remaining balance -- clear the
    // cached balance so CreditMeter reflects the new spend on next read
    // instead of a stale number.
    if (endpoint.includes('/api/ai/tutor-chat') || endpoint.includes('/api/ai/grade-response')) {
      clearCacheFor('/api/ai/credits');
    }
    // Completing a quest changes course progress (xp/streak/completed list).
    if (endpoint.includes('/complete')) {
      clearCacheFor('/progress');
    }
  }

  return data;
}
