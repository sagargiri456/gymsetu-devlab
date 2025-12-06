'use client';
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import {
  MdMenu,
  MdSearch,
  MdOutlineNotifications,
  MdLogout,
  MdAccountCircle,
} from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import Image from "next/image";
import { logoutUser, getCurrentUser, UserData, fetchGymProfile, GymProfile, isMember, isTrainer } from "@/lib/auth";
import { fetchMemberProfile } from "@/lib/memberApi";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, Notification, subscribePushNotifications } from "@/lib/notificationApi";
import { registerServiceWorker, subscribeToPushNotifications, requestNotificationPermission } from "@/lib/pushNotifications";
import MemberModal from "@/app/dashboard/members/MemberModal";
import { getApiUrl } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  dp_link?: string | null;
  state: string;
  zip: string;
  created_at: string;
  expiration_date?: string | null;
}

// Styled Components for Dark Mode Toggle
const StyledWrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    --hue: 220deg;
    --width: 4rem;
    --accent-hue: 22deg;
    --duration: 0.6s;
    --easing: cubic-bezier(1, 0, 1, 1);
  }

  .togglesw {
    display: none;
  }

  .switch {
    --shadow-offset: calc(var(--width) / 20);
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: var(--width);
    height: calc(var(--width) / 2.5);
    border-radius: var(--width);
    box-shadow: inset 10px 10px 10px hsl(var(--hue) 20% 80%),
      inset -10px -10px 10px hsl(var(--hue) 20% 93%);
  }

  .indicator {
    content: '';
    position: absolute;
    width: 40%;
    height: 60%;
    transition: all var(--duration) var(--easing);
    box-shadow: inset 0 0 2px hsl(var(--hue) 20% 15% / 60%),
      inset 0 0 3px 2px hsl(var(--hue) 20% 15% / 60%),
      inset 0 0 5px 2px hsl(var(--hue) 20% 45% / 60%);
  }

  .indicator.left {
    --hue: var(--accent-hue);
    overflow: hidden;
    left: 10%;
    border-radius: 100px 0 0 100px;
    background: linear-gradient(180deg, hsl(calc(var(--accent-hue) + 20deg) 95% 80%) 10%, hsl(calc(var(--accent-hue) + 20deg) 100% 60%) 30%, hsl(var(--accent-hue) 90% 50%) 60%, hsl(var(--accent-hue) 90% 60%) 75%, hsl(var(--accent-hue) 90% 50%));
  }

  .indicator.left::after {
    content: '';
    position: absolute;
    opacity: 0.6;
    width: 100%;
    height: 100%;
  }

  .indicator.right {
    right: 10%;
    border-radius: 0 100px 100px 0;
    background-image: linear-gradient(180deg, hsl(var(--hue) 20% 95%), hsl(var(--hue) 20% 65%) 60%, hsl(var(--hue) 20% 70%) 70%, hsl(var(--hue) 20% 65%));
  }

  .button {
    position: absolute;
    z-index: 1;
    width: 55%;
    height: 80%;
    left: 5%;
    border-radius: 100px;
    background-image: linear-gradient(160deg, hsl(var(--hue) 20% 95%) 40%, hsl(var(--hue) 20% 65%) 70%);
    transition: all var(--duration) var(--easing);
    box-shadow: 2px 2px 3px hsl(var(--hue) 18% 50% / 80%),
      2px 2px 6px hsl(var(--hue) 18% 50% / 40%),
      10px 20px 10px hsl(var(--hue) 18% 50% / 40%),
      20px 30px 30px hsl(var(--hue) 18% 50% / 60%);
  }

  .button::before, 
  .button::after {
    content: '';
    position: absolute;
    top: 10%;
    width: 41%;
    height: 80%;
    border-radius: 100%;
  }

  .button::before {
    left: 5%;
    box-shadow: inset 1px 1px 2px hsl(var(--hue) 20% 85%);
    background-image: linear-gradient(-50deg, hsl(var(--hue) 20% 95%) 20%, hsl(var(--hue) 20% 85%) 80%);
  }

  .button::after {
    right: 5%;
    box-shadow: inset 1px 1px 3px hsl(var(--hue) 20% 70%);
    background-image: linear-gradient(-50deg, hsl(var(--hue) 20% 95%) 20%, hsl(var(--hue) 20% 75%) 80%);
  }

  .togglesw:checked ~ .button {
    left: 40%;
  }

  .togglesw:not(:checked) ~ .indicator.left,
  .togglesw:checked ~ .indicator.right {
    box-shadow: inset 0 0 5px hsl(var(--hue) 20% 15% / 100%),
      inset 20px 20px 10px hsl(var(--hue) 20% 15% / 100%),
      inset 20px 20px 15px hsl(var(--hue) 20% 45% / 100%);
  }
`;

// Dark Mode Toggle Component
const DarkModeToggle: React.FC = () => {
  // Initialize from localStorage, default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      // Check if dark class is already on document (for initial page load)
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Initialize dark mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      const shouldBeDark = saved === 'true' || document.documentElement.classList.contains('dark');
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    }
  }, []);

  const toggleDarkMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    console.log('Dark mode toggle clicked:', checked);
    setIsDarkMode(checked);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', checked.toString());
    }
    
    // Toggle dark class on document element
    if (checked) {
      document.documentElement.classList.add('dark');
      console.log('Dark mode enabled');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Dark mode disabled');
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <label className="switch">
          <input 
            className="togglesw" 
            type="checkbox" 
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <div className="indicator left" />
          <div className="indicator right" />
          <div className="button" />
        </label>
      </div>
    </StyledWrapper>
  );
};

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [gymProfile, setGymProfile] = useState<GymProfile | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMemberUser, setIsMemberUser] = useState(false);
  const [isTrainerUser, setIsTrainerUser] = useState(false);
  const [memberProfilePhoto, setMemberProfilePhoto] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get user data and gym profile on mount
  useEffect(() => {
    const loadUserData = async () => {
      const user = await getCurrentUser();
      setUserData(user);
      
      // Check if user is a member or trainer
      const memberCheck = isMember();
      const trainerCheck = isTrainer();
      setIsMemberUser(memberCheck);
      setIsTrainerUser(trainerCheck);
      
      if (memberCheck) {
        // Fetch member profile to get profile photo
        try {
          const memberProfile = await fetchMemberProfile();
          if (memberProfile.member) {
            setMemberProfilePhoto(memberProfile.member.profilePhoto || memberProfile.member.dp_link || null);
          } else if (memberProfile.profilePhoto || memberProfile.dp_link) {
            setMemberProfilePhoto(memberProfile.profilePhoto || memberProfile.dp_link || null);
          }
        } catch (error) {
          console.error('Failed to load member profile:', error);
        }
      } else if (!trainerCheck) {
        // Fetch gym profile to get logo (only for owners)
        try {
          const profile = await fetchGymProfile();
          if (profile) {
            setGymProfile(profile);
          }
        } catch (error) {
          console.error('Failed to load gym profile:', error);
        }
      }
    };
    loadUserData();
  }, []);

  // Load notifications and initialize push notifications (only for admin users)
  useEffect(() => {
    if (isMemberUser || isTrainerUser) {
      return; // Don't load notifications for members or trainers
    }

    const loadNotifications = async () => {
      try {
        const [notificationsData, unreadCount] = await Promise.all([
          getNotifications(10, false),
          getUnreadCount(),
        ]);
        setNotifications(notificationsData.notifications || []);
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        // Don't set error state - just log it and continue
        // This prevents the app from breaking if notifications API is unavailable
        setNotifications([]);
        setNotificationCount(0);
      }
    };

    const setupPushNotifications = async () => {
      try {
        // Check if notifications are supported
        if (typeof window === 'undefined' || !('Notification' in window)) {
          console.warn('Notifications are not supported in this browser');
          return;
        }

        // Initialize push notifications (will request permission if needed)
        const registration = await registerServiceWorker();
        if (registration) {
          // Check if already subscribed
          const existingSubscription = await registration.pushManager.getSubscription();
          if (!existingSubscription) {
            // Request permission and subscribe using the safe function
            const permission = await requestNotificationPermission();
            if (permission === 'granted') {
              const subscription = await subscribeToPushNotifications(registration);
              if (subscription) {
                // Send subscription to backend
                await subscribePushNotifications(subscription);
              }
            }
          } else {
            // Already subscribed, just send to backend to ensure it's registered
            await subscribePushNotifications(existingSubscription);
          }
        }
      } catch (error) {
        console.error('Failed to setup push notifications:', error);
        // Don't block the app if push notifications fail
      }
    };

    loadNotifications();
    setupPushNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, [isMemberUser, isTrainerUser]);

  // Generate profile image from user's first letter (fallback)
  const getProfileImageSrc = (name: string): string => {
    const firstLetter = name.charAt(0).toUpperCase();
    const svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="#4F46E5"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${firstLetter}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const userName = isMemberUser 
    ? (userData?.name || "Member") 
    : isTrainerUser 
    ? (userData?.name || "Trainer")
    : (gymProfile?.name || userData?.name || "Admin");
  const userEmail = isMemberUser 
    ? (userData?.email || "member@example.com") 
    : isTrainerUser
    ? (userData?.email || "trainer@example.com")
    : (gymProfile?.email || userData?.email || "admin@gmail.com");
  // Use gym logo if available (for owners), otherwise use default avatar
  const profileImageSrc = isMemberUser 
    ? (userData ? getProfileImageSrc(userData.name) : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TTwvdGV4dD4KPC9zdmc+")
    : (gymProfile?.logo_link || (userData ? getProfileImageSrc(userData.name) : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QTwvdGV4dD4KPC9zdmc+"));

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };

    if (profileDropdownOpen || notificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, notificationDropdownOpen]);

  const handleLogout = async () => {
    await logoutUser();
    if (isMemberUser) {
      router.push('/members/login');
    } else if (isTrainerUser) {
      router.push('/trainers/login');
    } else {
      router.push('/login');
    }
  };

  const handleNotificationIconClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

    // If it's a subscription_expired notification and has member_id, fetch member details
    if (notification.type === 'subscription_expired' && notification.member_id) {
      try {
        const token = getToken();
        if (!token) {
          console.error('Not authenticated');
          return;
        }

        const response = await fetch(
          `${getApiUrl('api/members/get_member_by_id')}?member_id=${notification.member_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.member) {
            setSelectedMember(data.member);
            setMemberModalOpen(true);
            setNotificationDropdownOpen(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch member details:', error);
      }
    }
  };

  const handleLanguageClick = () => {
    // Placeholder for language selection functionality
    console.log('Language clicked');
    // TODO: Implement language selection dropdown
  };

  return (
    <header className={`fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out ${
      onMenuClick ? 'w-full lg:w-[calc(100%-256px)]' : 'w-full lg:w-[calc(100%-256px)]'
    }`}>
      <div className="flex items-center min-h-16 px-4 md:px-6 lg:min-h-24 lg:px-10 bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] rounded-bl-2xl">
        {/* Menu Button */}
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-gray-700 p-3 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
          >
            <MdMenu size={22} />
          </button>
        )}

        {/* Search Bar */}
        <div className={`relative flex items-center w-60 md:w-80 px-3 py-2 rounded-full bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all duration-200 ${
          onMenuClick ? 'ml-4' : ''
        }`}>
          <MdSearch size={20} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder={isMemberUser ? "Search..." : isTrainerUser ? "Search members..." : "Search user..."}
            className="w-full text-sm text-gray-700 bg-transparent border-none focus:outline-none placeholder-gray-500"
          />
        </div>

        <div className="flex-grow"></div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Dark Mode Toggle */}
          <div className="w-16 h-8">
            <DarkModeToggle />
          </div>

          {/* Language */}
          <button 
            onClick={handleLanguageClick}
            className="text-gray-700 p-3 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            title="Change Language"
          >
            <FaGlobe size={18} />
          </button>

          {/* Notifications - Only show for admin users */}
          {!isMemberUser && !isTrainerUser && (
            <div className="relative" ref={notificationDropdownRef}>
              <button 
                onClick={handleNotificationIconClick}
                className="relative text-gray-700 p-3 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
                title="Notifications"
              >
                <MdOutlineNotifications size={22} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[18px]">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none overflow-hidden z-50 max-h-[500px] flex flex-col">
                  <div className="p-4 border-b border-gray-300 border-opacity-30 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                    {notificationCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto max-h-[400px]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <MdOutlineNotifications size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-300 border-opacity-30 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.is_read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            )}
                            {/* Member Display Picture */}
                            {notification.type === 'subscription_expired' && notification.member_dp_link && (
                              <div className="flex-shrink-0">
                                <img
                                  src={notification.member_dp_link}
                                  alt={notification.member_name || 'Member'}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            {notification.type === 'subscription_expired' && !notification.member_dp_link && (
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ecf0f3] flex items-center justify-center">
                                <MdAccountCircle size={24} className="text-gray-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </p>
                              {notification.type === 'subscription_expired' && notification.member_name && (
                                <div className="mt-1 space-y-0.5">
                                  <p className="text-sm font-medium text-gray-800">
                                    {notification.member_name}
                                  </p>
                                  {notification.member_phone && (
                                    <p className="text-xs text-gray-600">
                                      {notification.member_phone}
                                    </p>
                                  )}
                                </div>
                              )}
                              <p className="text-sm text-gray-700 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatNotificationTime(notification.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 border-t border-gray-300 border-opacity-30">
                      <button
                        onClick={() => router.push('/dashboard/members')}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                      >
                        View All Members
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Avatar with Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="p-[3px] rounded-full w-10 h-10 bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all overflow-hidden"
              title="Profile Menu"
            >
              {isMemberUser && memberProfilePhoto ? (
                <img
                  src={memberProfilePhoto}
                  alt={userName}
                  className="object-cover w-full h-full rounded-full"
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    e.currentTarget.src = userData ? getProfileImageSrc(userData.name) : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TTwvdGV4dD4KPC9zdmc+";
                  }}
                />
              ) : !isMemberUser && gymProfile?.logo_link ? (
                <img
                  src={gymProfile.logo_link}
                  alt={userName}
                  className="object-cover w-full h-full rounded-full"
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    e.currentTarget.src = userData ? getProfileImageSrc(userData.name) : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QTwvdGV4dD4KPC9zdmc+";
                  }}
                />
              ) : (
                <Image
                  src={profileImageSrc}
                  alt={userName}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full rounded-full"
                />
              )}
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none overflow-hidden z-50">
                <div className="p-3 border-b border-gray-300 border-opacity-30">
                  <div className="flex items-center space-x-3">
                    {isMemberUser && memberProfilePhoto ? (
                      <img
                        src={memberProfilePhoto}
                        alt={userName}
                        className="w-8 h-8 object-cover rounded-full"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.currentTarget.src = userData ? getProfileImageSrc(userData.name) : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TTwvdGV4dD4KPC9zdmc+";
                        }}
                      />
                    ) : !isMemberUser && gymProfile?.logo_link ? (
                      <img
                        src={gymProfile.logo_link}
                        alt={userName}
                        className="w-8 h-8 object-cover rounded-full"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.currentTarget.src = userData ? getProfileImageSrc(userData.name) : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QTwvdGV4dD4KPC9zdmc+";
                        }}
                      />
                    ) : (
                      <Image
                        src={profileImageSrc}
                        alt={userName}
                        width={32}
                        height={32}
                        className="object-cover rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-600">{userEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      router.push(isMemberUser ? '/member/profile' : isTrainerUser ? '/trainer/profile' : '/dashboard/settings');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#ecf0f3] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
                  >
                    <MdAccountCircle size={20} />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-[#ecf0f3] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all mt-1"
                  >
                    <MdLogout size={20} />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      {memberModalOpen && selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => {
            setMemberModalOpen(false);
            setSelectedMember(null);
          }}
        />
      )}
    </header>
  );
};

export default Topbar;
