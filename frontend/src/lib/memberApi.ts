// Member API utilities
// This file contains API functions for fetching member-related data

import { getApiUrl } from './api';
import { getToken } from './auth';

/**
 * Get authentication headers with token
 */
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Fetch member dashboard data
 */
export const fetchMemberDashboard = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_member_dashboard'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching member dashboard:', error);
    throw error;
  }
};

/**
 * Fetch member profile data
 */
export const fetchMemberProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_member_profile'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching member profile:', error);
    throw error;
  }
};

/**
 * Fetch member workout plan
 */
export const fetchWorkoutPlan = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_workout_plan'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workout plan: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    throw error;
  }
};

/**
 * Fetch member diet plan
 */
export const fetchDietPlan = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_diet_plan'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch diet plan: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    throw error;
  }
};

/**
 * Fetch member's assigned trainer
 */
export const fetchMyTrainer = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_my_trainer'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trainer data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trainer data:', error);
    throw error;
  }
};

/**
 * Fetch member progress data
 */
export const fetchProgressData = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_progress'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch progress data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
};

/**
 * Log new progress entry
 */
export const logProgress = async (progressData: {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/log_progress'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(progressData),
    });

    if (!response.ok) {
      throw new Error(`Failed to log progress: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging progress:', error);
    throw error;
  }
};

/**
 * Fetch member contests
 */
export const fetchMemberContests = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_contests'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contests: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
};

/**
 * Update member profile
 */
export interface UpdateMemberProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  fitnessGoals?: string;
}

export const updateMemberProfile = async (profileData: UpdateMemberProfileData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/update_profile'), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Mark workout exercise as complete
 */
export const markExerciseComplete = async (exerciseId: string, day: number) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/mark_exercise_complete'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ exerciseId, day }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark exercise complete: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking exercise complete:', error);
    throw error;
  }
};

/**
 * Mark meal as complete
 */
export const markMealComplete = async (mealId: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/mark_meal_complete'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mealId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark meal complete: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking meal complete:', error);
    throw error;
  }
};

/**
 * Send message to trainer
 */
export const sendMessageToTrainer = async (message: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/send_trainer_message'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Request training session
 */
export const requestTrainingSession = async (sessionData: {
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/request_session'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Failed to request session: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error requesting session:', error);
    throw error;
  }
};

/**
 * Fetch today's schedule
 */
export const fetchTodaysSchedule = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_todays_schedule'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch schedule: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

/**
 * Fetch weekly progress data
 */
export const fetchWeeklyProgress = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(getApiUrl('api/members/get_weekly_progress'), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch weekly progress: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    throw error;
  }
};

