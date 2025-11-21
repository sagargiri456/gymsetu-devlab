// API Configuration
// This file centralizes API endpoint management

const getApiBaseUrl = (): string => {
  // If environment variable is set, use it (highest priority)
  // This is the recommended way for production deployments
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Check if we're on a production domain (not localhost or IP)
    const isProductionDomain = 
      hostname !== 'localhost' && 
      hostname !== '127.0.0.1' &&
      !hostname.match(/^\d+\.\d+\.\d+\.\d+$/); // Not an IP address
    
    if (isProductionDomain) {
      // For production domains, we need the API URL to be explicitly set
      // Log a warning if it's not set
      console.warn(
        `Production domain detected (${hostname}), but NEXT_PUBLIC_API_URL is not set. ` +
        `Please set NEXT_PUBLIC_API_URL environment variable to your backend API URL. ` +
        `Falling back to auto-detection (may not work if backend is on different domain).`
      );
      // Fallback: try to construct API URL (may not work if backend is on different domain)
      // For example, if frontend is on gymsetu.space, this would try gymsetu.space:5000
      // But backend is likely on Render, so this won't work
      return `${protocol}//${hostname}:5000`;
    } else {
      // For localhost or IP addresses, auto-detect backend URL
      // This allows the app to work with IP addresses (e.g., http://10.242.121.46:3000)
      return `${protocol}//${hostname}:5000`;
    }
  }
  
  // Server-side: use default localhost
  return 'http://127.0.0.1:5000';
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

