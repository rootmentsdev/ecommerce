/**
 * API Configuration
 * Centralized configuration for backend API URLs and settings
 */

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Check if we're on Vercel by looking at the URL
const isVercelDeployment = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || 
   window.location.hostname.includes('ecommerce-pi-six-17'));

// Backend API URLs
const API_URLS = {
  development: 'http://localhost:5000/api',
  production: 'https://ecommerce-q0bg.onrender.com/api', // Your actual production URL
  staging: 'https://ecommerce-q0bg.onrender.com/api' // Same as production for now
};

// Current environment API URL
const getCurrentApiUrl = () => {
  // ALWAYS use production URL if on Vercel
  if (isVercelDeployment) {
    console.log('🚀 Using PRODUCTION backend:', API_URLS.production);
    return API_URLS.production;
  }
  
  if (isDevelopment) {
    console.log('💻 Using DEVELOPMENT backend:', API_URLS.development);
    return API_URLS.development;
  } else if (isProduction) {
    console.log('🌐 Using PRODUCTION backend:', API_URLS.production);
    return API_URLS.production;
  } else {
    // Fallback to production for safety
    console.log('⚠️ Fallback to PRODUCTION backend:', API_URLS.production);
    return API_URLS.production;
  }
};

// API Configuration
const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: getCurrentApiUrl(),
  
  // Environment info
  ENVIRONMENT: isDevelopment ? 'development' : 'production',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      LOGOUT: '/auth/logout'
    },
    
    // Enquiries
    ENQUIRIES: {
      BASE: '/enquiries',
      CREATE: '/enquiries',
      GET_ALL: '/enquiries',
      GET_BY_ID: (id) => `/enquiries/${id}`,
      UPDATE: (id) => `/enquiries/${id}`,
      DELETE: (id) => `/enquiries/${id}`,
      STATS: '/enquiries/stats',
      ADMIN_DASHBOARD: '/enquiries/admin/dashboard',
      UPDATE_STATUS: (id) => `/enquiries/admin/${id}/status`
    },
    
    // Images
    IMAGES: {
      BASE: '/images',
      GET_ALL: '/images',
      GET_BY_ID: (id) => `/images/${id}`,
      CREATE: '/images',
      UPDATE: (id) => `/images/${id}`,
      DELETE: (id) => `/images/${id}`,
      TOGGLE_STATUS: (id) => `/images/${id}/toggle`,
      CATEGORIES: '/images/categories'
    },
    
    // Products (if you add product management later)
    PRODUCTS: {
      BASE: '/products',
      GET_ALL: '/products',
      GET_BY_ID: (id) => `/products/${id}`,
      CREATE: '/products',
      UPDATE: (id) => `/products/${id}`,
      DELETE: (id) => `/products/${id}`
    }
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper functions
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getAuthHeaders = (token) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`
  };
};

export const getAdminHeaders = (adminToken) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${adminToken}`
  };
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    environment: API_CONFIG.ENVIRONMENT,
    baseUrl: API_CONFIG.BASE_URL,
    isDevelopment,
    isProduction,
    isVercelDeployment,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
  };
};

// Log configuration on load for debugging
if (typeof window !== 'undefined') {
  console.log('📡 API Configuration Loaded:', getEnvironmentInfo());
}

// Export the main configuration
export default API_CONFIG;

// Export individual URL configurations for direct access
export { API_URLS, getCurrentApiUrl, isVercelDeployment };
