// components/member/MemberSidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

interface MemberSidebarProps {
  currentPath: string;
}

const MemberSidebar: React.FC<MemberSidebarProps> = ({ currentPath }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { path: '/member', icon: 'dashboard', label: 'Dashboard' },
    { path: '/member/workout-plan', icon: 'fitness_center', label: 'Workout Plan' },
    { path: '/member/diet-plan', icon: 'restaurant', label: 'Diet Plan' },
    { path: '/member/my-trainer', icon: 'person', label: 'My Trainer' },
    { path: '/member/contests', icon: 'emoji_events', label: 'Contests' },
    { path: '/member/progress', icon: 'trending_up', label: 'My Progress' },
    { path: '/member/profile', icon: 'account_circle', label: 'My Profile' },
    { path: '/member/settings', icon: 'settings', label: 'Settings' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
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
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <button className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <span className="material-icons mr-3">help_outline</span>
          {!isCollapsed && <span>Help</span>}
        </button>
        <button className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <span className="material-icons mr-3">logout</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default MemberSidebar;

