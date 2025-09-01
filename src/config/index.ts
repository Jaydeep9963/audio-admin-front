// src/config/index.js
const config = {
  // API Configuration - NO hardcoded URLs
  API_BASE_URL: process.env.REACT_APP_BACKEND_API_URL || (() => {
    throw new Error('REACT_APP_BACKEND_API_URL is required but not set');
  })(),
  
  // You can add other configuration values here
  APP_NAME: process.env.REACT_APP_NAME || 'Audio Player',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Environment check
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Optional: Add validation
if (!config.API_BASE_URL) {
  console.warn('⚠️ API_BASE_URL is not configured properly');
}

// Log configuration in development
if (config.isDevelopment) {
  console.log('🔧 App Configuration:', {
    API_BASE_URL: config.API_BASE_URL,
    Environment: process.env.NODE_ENV,
  });
}

export default config;

// Named exports for convenience
export const { 
  API_BASE_URL, 
  APP_NAME, 
  APP_VERSION,
  isDevelopment,
  isProduction 
} = config;