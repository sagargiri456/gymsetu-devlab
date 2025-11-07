// components/shared/UnifiedTopbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser, getCurrentUser, UserData, fetchGymProfile, GymProfile } from '@/lib/auth';

interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
}

interface UnifiedTopbarProps {
  userRole?: 'member' | 'owner' | 'trainer';
  profilePath?: string;
  settingsPath?: string;
}

const UnifiedTopbar: React.FC<UnifiedTopbarProps> = ({ 
  userRole = 'member',
  profilePath = '/member/profile',
  settingsPath = '/member/settings'
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [gymProfile, setGymProfile] = useState<GymProfile | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      const user = await getCurrentUser();
      setUserData(user);
      
      if (userRole === 'owner') {
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
  }, [userRole]);

  // Check dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      const isDark = saved === 'true' || document.documentElement.classList.contains('dark');
      setDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    await logoutUser();
    if (userRole === 'member') {
      router.push('/members/login');
    } else if (userRole === 'trainer') {
      router.push('/trainers/login');
    } else {
      router.push('/login');
    }
  };

  const notifications: Notification[] = [
    { id: 1, message: 'Your workout is scheduled in 1 hour', type: 'workout', read: false },
    { id: 2, message: 'New contest starting tomorrow', type: 'contest', read: false },
    { id: 3, message: 'Trainer sent you a message', type: 'trainer', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getUserDisplayName = () => {
    if (userRole === 'owner') {
      return gymProfile?.name || userData?.name || 'Admin';
    }
    return userData?.name || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProfileImage = () => {
    if (userRole === 'owner' && gymProfile?.logo_link) {
      return gymProfile.logo_link;
    }
    return null;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="material-icons">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
              >
                <span className="material-icons">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="material-icons text-blue-500 text-sm mt-1">
                            circle
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Just now
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2">
                    <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                  {getProfileImage() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getProfileImage() || ''}
                      alt={getUserDisplayName()}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {userRole}
                  </div>
                </div>
                <span className="material-icons text-gray-400 text-sm">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push(profilePath);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        router.push(settingsPath);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Settings
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedTopbar;

