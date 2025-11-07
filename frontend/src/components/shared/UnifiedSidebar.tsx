// components/shared/UnifiedSidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutUser, getCurrentUser, UserData, fetchGymProfile, GymProfile } from '@/lib/auth';

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

interface UnifiedSidebarProps {
  menuItems: MenuItem[];
  userRole?: 'member' | 'owner' | 'trainer';
  basePath?: string;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({ 
  menuItems, 
  userRole = 'member',
  basePath = '/member'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [gymProfile, setGymProfile] = useState<GymProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const loadUserData = async () => {
      const user = await getCurrentUser();
      setUserData(user);
      
      // Fetch gym profile for owners
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

  const isActive = (path: string) => {
    const normalizedPathname = pathname?.replace(/\/$/, '') || '';
    const normalizedPath = path.replace(/\/$/, '');
    
    if (normalizedPath === basePath) {
      return normalizedPathname === basePath || normalizedPathname === `${basePath}/`;
    }
    
    return normalizedPathname.startsWith(normalizedPath);
  };

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

  const getUserDisplayName = () => {
    if (userRole === 'owner') {
      return gymProfile?.name || userData?.name || 'Admin';
    }
    return userData?.name || 'User';
  };

  const getUserDisplayEmail = () => {
    if (userRole === 'owner') {
      return gymProfile?.email || userData?.email || 'admin@example.com';
    }
    return userData?.email || 'user@example.com';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col h-screen ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <span className="material-icons text-green-600 text-2xl mr-2">fitness_center</span>
              <span className="text-xl font-bold text-gray-800 dark:text-white">GymSetu</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="material-icons text-gray-600 dark:text-gray-300">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {userRole === 'owner' && gymProfile?.logo_link ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gymProfile.logo_link}
                alt={getUserDisplayName()}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getUserInitials()
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {getUserDisplayName()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {getUserDisplayEmail()}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 capitalize">
                {userRole}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="material-icons mr-3">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Help & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 space-y-2">
        <button className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <span className="material-icons mr-3">help_outline</span>
          {!isCollapsed && <span>Help</span>}
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <span className="material-icons mr-3">logout</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default UnifiedSidebar;

