// Authentication utility functions
import { getApiUrl, API_BASE_URL } from './api';

// User data interface
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Cookie utility functions
 */
const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name: string): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Store user data in cookies
 */
export const setUserData = (userData: UserData): void => {
  if (typeof window === 'undefined') return;
  setCookie('user_data', JSON.stringify(userData), 30);
};

/**
 * Get user data from cookies
 */
export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  const userDataStr = getCookie('user_data');
  if (!userDataStr) return null;
  try {
    return JSON.parse(userDataStr) as UserData;
  } catch {
    return null;
  }
};

/**
 * Clear user data from cookies
 */
export const clearUserData = (): void => {
  if (typeof window === 'undefined') return;
  deleteCookie('user_data');
};

// Dashboard statistics interface
export interface DashboardStats {
  monthly_members: number;
  total_trainers: number;
  unpaid_memberships: number;
  total_income: number;
  total_income_display: string;
  cached_at?: number; // Timestamp when cached
}

/**
 * Store dashboard stats in cookies
 */
export const setDashboardStats = (stats: DashboardStats): void => {
  if (typeof window === 'undefined') return;
  const statsWithTimestamp = {
    ...stats,
    cached_at: Date.now(),
  };
  setCookie('dashboard_stats', JSON.stringify(statsWithTimestamp), 1); // Cache for 1 day
};

/**
 * Get dashboard stats from cookies
 */
export const getDashboardStats = (): DashboardStats | null => {
  if (typeof window === 'undefined') return null;
  const statsStr = getCookie('dashboard_stats');
  if (!statsStr) return null;
  try {
    const stats = JSON.parse(statsStr) as DashboardStats & { cached_at: number };
    // Check if cache is still valid (1 hour = 3600000 ms)
    const cacheAge = Date.now() - (stats.cached_at || 0);
    const cacheExpiry = 60 * 60 * 1000; // 1 hour
    if (cacheAge > cacheExpiry) {
      // Cache expired, remove it
      clearDashboardStats();
      return null;
    }
    return stats;
  } catch {
    return null;
  }
};

/**
 * Clear dashboard stats from cookies
 */
export const clearDashboardStats = (): void => {
  if (typeof window === 'undefined') return;
  deleteCookie('dashboard_stats');
};

/**
 * Fetch dashboard stats from backend API
 * @returns Promise that resolves with stats or null
 */
export const fetchDashboardStats = async (): Promise<DashboardStats | null> => {
  if (typeof window === 'undefined') return null;
  
  const token = getToken();
  if (!token) return null;
  
  try {
    const response = await fetch(getApiUrl('api/auth/dashboard_stats'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.stats) {
        setDashboardStats(data.stats);
        return data.stats;
      }
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
  
  return null;
};

/**
 * Get dashboard stats (from cache or fetch from API)
 * @returns Promise that resolves with stats or null
 */
export const getDashboardStatsData = async (): Promise<DashboardStats | null> => {
  // First try to get from cache
  const cachedStats = getDashboardStats();
  if (cachedStats) return cachedStats;
  
  // If not in cache, fetch from API
  return await fetchDashboardStats();
};

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
 * Remove token and logout (sync version - clears local storage only)
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
};

/**
 * Fetch current user from backend API
 * @returns Promise that resolves with user data or null
 */
export const fetchCurrentUser = async (): Promise<UserData | null> => {
  if (typeof window === 'undefined') return null;
  
  const token = getToken();
  if (!token) return null;
  
  try {
    const response = await fetch(getApiUrl('api/auth/me'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        setUserData(data.user);
        return data.user;
      }
    }
  } catch (error) {
    console.error('Failed to fetch current user:', error);
  }
  
  return null;
};

/**
 * Get current user data (from cookies or fetch from API)
 * @returns Promise that resolves with user data or null
 */
export const getCurrentUser = async (): Promise<UserData | null> => {
  // First try to get from cookies
  const cachedUser = getUserData();
  if (cachedUser) return cachedUser;
  
  // If not in cookies, fetch from API
  return await fetchCurrentUser();
};

/**
 * Check if the current user is a member (by checking token format)
 * @returns boolean indicating if user is a member
 */
export const isMember = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = getToken();
  if (!token) return false;
  
  try {
    // Decode JWT token (basic decode without verification)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const identity = payload.sub || payload.identity;
    
    // Check if identity starts with "member:"
    return typeof identity === 'string' && identity.startsWith('member:');
  } catch {
    return false;
  }
};

/**
 * Check if the current user is a trainer (by checking token format or role)
 * @returns boolean indicating if user is a trainer
 */
export const isTrainer = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // First check userData role
  const userData = getUserData();
  if (userData && userData.role === 'trainer') return true;
  
  // Then check token format
  const token = getToken();
  if (!token) return false;
  
  try {
    // Decode JWT token (basic decode without verification)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const identity = payload.sub || payload.identity;
    
    // Check if identity starts with "trainer:"
    return typeof identity === 'string' && identity.startsWith('trainer:');
  } catch {
    return false;
  }
};

/**
 * Logout user by calling backend API and clearing local storage
 * @returns Promise that resolves when logout is complete
 */
export const logoutUser = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  const token = getToken();
  
  // Call backend logout API if token exists
  if (token) {
    try {
      await fetch(getApiUrl('api/auth/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      // Even if API call fails, we still want to clear local storage
      console.error('Logout API call failed:', error);
    }
  }
  
  // Always clear local storage and cookies regardless of API call result
  logout();
  clearUserData();
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

/**
 * Gym Profile interface matching backend schema
 */
export interface GymProfile {
  id: number;
  name: string;
  address: string;
  logo_link: string | null;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  role: string;
  created_at: string | null;
}

/**
 * Fetch gym profile from backend API using JWT token
 */
export const fetchGymProfile = async (): Promise<GymProfile | null> => {
  if (typeof window === 'undefined') return null;
  
  const token = getToken();
  if (!token) {
    console.error('No token available');
    return null;
  }
  
  try {
    // First get current user to get ID and email
    const user = await getCurrentUser();
    if (!user) {
      console.error('User not found');
      return null;
    }
    
    // Try to get gym profile by ID first (more efficient)
    if (user.id) {
      const urlById = getApiUrl(`api/auth/get_gym_by_id?id=${user.id}`);
      console.log('Fetching gym profile by ID from:', urlById);
      
      try {
        const responseById = await fetch(urlById, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (responseById.ok) {
          const data = await responseById.json();
          console.log('Gym profile response by ID:', data);
          
          if (data.gym) {
            return data.gym as GymProfile;
          }
        }
      } catch (idError) {
        // If it's a network error, don't try email fallback - same issue will occur
        if (idError instanceof TypeError && idError.message === 'Failed to fetch') {
          // Create a more helpful error message instead of just logging
          const networkError = new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend server is running on port 5000.`);
          throw networkError;
        }
        // For other errors (not network), try email fallback
        console.log('Failed to fetch by ID, trying by email:', idError);
      }
    }
    
    // Fallback: try by email if ID method fails
    if (user.email) {
      const urlByEmail = getApiUrl(`api/auth/get_gym_profile?email=${encodeURIComponent(user.email)}`);
      console.log('Fetching gym profile by email from:', urlByEmail);
      
      try {
        const response = await fetch(urlByEmail, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          console.error('Failed to fetch gym profile:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          return null;
        }
        
        const data = await response.json();
        console.log('Gym profile response by email:', data);
        
        if (data.gym) {
          return data.gym as GymProfile;
        } else {
          console.error('No gym data in response:', data);
          return null;
        }
      } catch (fetchError) {
        // This is a network error (like server not running)
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          console.error('Network error: Cannot connect to backend server');
          console.error('Backend URL:', API_BASE_URL);
          console.error('Possible causes:');
          console.error('1. Backend server is not running');
          console.error('2. Backend server is running on a different port');
          console.error('3. CORS configuration issue');
          // Re-throw with a more helpful message
          throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend server is running.`);
        }
        // Re-throw other errors
        throw fetchError;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch gym profile:', error);
    
    // If error is already an Error with a message, re-throw it
    if (error instanceof Error) {
      // Check if it's already our formatted error message
      if (error.message.includes('Cannot connect to backend server')) {
        throw error;
      }
      // If it's a network error, wrap it with a better message
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend server is running on port 5000.`;
        console.error('Network error:', errorMessage);
        throw new Error(errorMessage);
      }
      throw error;
    }
    
    // Handle other error types
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend server is running on port 5000.`;
      console.error('Network error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Re-throw the error so the caller can handle it
    throw new Error(`Failed to fetch gym profile: ${String(error)}`);
  }
};

/**
 * Update gym profile
 */
export const updateGymProfile = async (profileData: {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  logo_link?: string;
}): Promise<{ success: boolean; message: string }> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Not available on server' };
  }
  
  const token = getToken();
  if (!token) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    // Get current user to get email
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'User email not found' };
    }
    
    const response = await fetch(getApiUrl('api/auth/update_gym_profile'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user.email,
        ...profileData,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, message: data.message || 'Profile updated successfully' };
    } else {
      return { success: false, message: data.message || 'Failed to update profile' };
    }
  } catch (error) {
    console.error('Failed to update gym profile:', error);
    return { success: false, message: 'Failed to update profile' };
  }
};

/**
 * Delete gym profile
 */
export const deleteGymProfile = async (): Promise<{ success: boolean; message: string }> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Not available on server' };
  }
  
  const token = getToken();
  if (!token) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    // Get current user to get email
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'User email not found' };
    }
    
    const response = await fetch(getApiUrl('api/auth/delete_gym_profile'), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user.email,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Logout user after successful deletion
      await logoutUser();
      return { success: true, message: data.message || 'Profile deleted successfully' };
    } else {
      return { success: false, message: data.message || 'Failed to delete profile' };
    }
  } catch (error) {
    console.error('Failed to delete gym profile:', error);
    return { success: false, message: 'Failed to delete profile' };
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Not available on server' };
  }
  
  const token = getToken();
  if (!token) {
    return { success: false, message: 'Not authenticated' };
  }
  
  try {
    // Get current user to get email
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'User email not found' };
    }
    
    const response = await fetch(getApiUrl('api/auth/change_password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user.email,
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, message: data.message || 'Password changed successfully' };
    } else {
      return { success: false, message: data.message || 'Failed to change password' };
    }
  } catch (error) {
    console.error('Failed to change password:', error);
    return { success: false, message: 'Failed to change password' };
  }
};

