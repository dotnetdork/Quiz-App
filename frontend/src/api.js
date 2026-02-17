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
    throw new Error(data.detail || 'API request failed');
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
  }
  
  return data;
}
