// components/member/dashboard/QuickActions.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface QuickAction {
  icon: string;
  label: string;
  href: string;
  color: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    { icon: 'fitness_center', label: 'Start Workout', href: '/member/workout-plan', color: 'blue' },
    { icon: 'restaurant', label: 'Log Meal', href: '/member/diet-plan', color: 'green' },
    { icon: 'person', label: 'Contact Trainer', href: '/member/my-trainer', color: 'purple' },
    { icon: 'emoji_events', label: 'Join Contest', href: '/member/contests', color: 'yellow' },
    { icon: 'trending_up', label: 'View Progress', href: '/member/progress', color: 'indigo' },
    { icon: 'schedule', label: 'Book Session', href: '/member/my-trainer', color: 'pink' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/50'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${getColorClasses(action.color)}`}
          >
            <span className="material-icons text-2xl mb-2">{action.icon}</span>
            <span className="text-sm font-medium text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

