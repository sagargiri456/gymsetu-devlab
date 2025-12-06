import { getApiUrl } from './api';
import { getToken } from './auth';

export interface Notification {
  id: number;
  gym_id: number;
  member_id: number | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  member_name?: string | null;
  member_phone?: string | null;
  member_dp_link?: string | null;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  count: number;
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

// Get all notifications
export async function getNotifications(limit: number = 50, unreadOnly: boolean = false): Promise<NotificationResponse> {
  const token = getToken();
  if (!token) {
    // Return empty notifications if not authenticated instead of throwing
    console.warn('Not authenticated, returning empty notifications');
    return {
      success: false,
      notifications: [],
      count: 0,
    };
  }

  try {
    const apiUrl = `${getApiUrl('api/notifications')}?limit=${limit}&unread_only=${unreadOnly}`;
    console.log('Fetching notifications from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch notifications:', response.status, errorText);
      // Return empty notifications instead of throwing
      return {
        success: false,
        notifications: [],
        count: 0,
      };
    }

    return response.json();
  } catch (error) {
    // Handle network errors gracefully
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const apiUrl = getApiUrl('api/notifications');
      console.warn(
        `Network error: Could not connect to API at ${apiUrl}. ` +
        `Check if backend is running and CORS is configured. ` +
        `Returning empty notifications to prevent app breakage.`
      );
      // Return empty notifications instead of throwing
      return {
        success: false,
        notifications: [],
        count: 0,
      };
    }
    // For other errors, also return empty notifications
    console.error('Unexpected error fetching notifications:', error);
    return {
      success: false,
      notifications: [],
      count: 0,
    };
  }
}

// Get unread notification count
export async function getUnreadCount(): Promise<number> {
  const token = getToken();
  if (!token) {
    return 0;
  }

  try {
    const response = await fetch(getApiUrl('api/notifications/unread-count'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return 0;
    }

    const data: UnreadCountResponse = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

// Mark notification as read
export async function markAsRead(notificationId: number): Promise<boolean> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(
    getApiUrl(`api/notifications/${notificationId}/read`),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.ok;
}

// Mark all notifications as read
export async function markAllAsRead(): Promise<boolean> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(getApiUrl('api/notifications/mark-all-read'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.ok;
}

// Subscribe to push notifications
export async function subscribePushNotifications(subscription: PushSubscription): Promise<boolean> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    // Get keys from subscription
    const key = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');
    
    const response = await fetch(getApiUrl('api/notifications/subscribe'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(key),
          auth: arrayBufferToBase64(auth),
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

