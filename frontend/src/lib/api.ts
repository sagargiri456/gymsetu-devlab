// API Configuration
// This file centralizes API endpoint management

const getApiBaseUrl = (): string => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // In browser, use environment variable or fallback
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
  }
  // Server-side: use environment variable or fallback
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Ensure base URL doesn't end with slash to avoid double slashes
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  return `${baseUrl}/${cleanEndpoint}`;
};

