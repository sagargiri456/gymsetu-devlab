// Authentication utility functions

/**
 * Check if user has a valid token stored
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * Get the stored access token
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

/**
 * Remove token and logout
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
};

/**
 * Verify token with backend
 * Returns true if token exists and appears valid (validates format and expiration if possible)
 * The actual validation happens on backend API calls which will return 401 if token is invalid
 */
export const verifyToken = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  const token = getToken();
  if (!token) return false;

  // Basic JWT format check (should have 3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    logout();
    return false;
  }

  // Try to decode JWT payload to check expiration (optional, non-critical)
  try {
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    
    // If token has expiration and it's expired, invalidate it
    if (exp && Date.now() >= exp * 1000) {
      logout();
      return false;
    }
  } catch {
    // If we can't decode, assume token might still be valid
    // The backend will reject it if it's actually invalid
  }

  // Token exists and appears valid
  // Actual validation will happen when API calls are made
  return true;
};

