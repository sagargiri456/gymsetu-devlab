// components/member/dashboard/QuickActions.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MdFitnessCenter, 
  MdRestaurant, 
  MdPerson, 
  MdEmojiEvents, 
  MdTrendingUp, 
  MdSchedule 
} from 'react-icons/md';
import { IconType } from 'react-icons';

interface QuickAction {
  icon: IconType;
  label: string;
  href: string;
  color: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    { icon: MdFitnessCenter, label: 'Start Workout', href: '/member/workout-plan', color: 'blue' },
    { icon: MdRestaurant, label: 'Log Meal', href: '/member/diet-plan', color: 'green' },
    { icon: MdPerson, label: 'Contact Trainer', href: '/member/my-trainer', color: 'purple' },
    { icon: MdEmojiEvents, label: 'Join Contest', href: '/member/contests', color: 'yellow' },
    { icon: MdTrendingUp, label: 'View Progress', href: '/member/progress', color: 'indigo' },
    { icon: MdSchedule, label: 'Book Session', href: '/member/my-trainer', color: 'pink' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-200', text: 'text-blue-800' },
      green: { bg: 'bg-green-200', text: 'text-green-800' },
      purple: { bg: 'bg-purple-200', text: 'text-purple-800' },
      yellow: { bg: 'bg-yellow-200', text: 'text-yellow-800' },
      indigo: { bg: 'bg-indigo-200', text: 'text-indigo-800' },
      pink: { bg: 'bg-pink-200', text: 'text-pink-800' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
      <div className="p-0 mb-4">
        <h6 className="text-lg font-bold text-gray-800">Quick Actions</h6>
        <p className="text-sm text-gray-600 opacity-70">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => {
          const colors = getColorClasses(action.color);
          return (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
            >
              <div className={`w-12 h-12 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center mb-2`}>
                <action.icon className="text-xl" />
              </div>
              <span className="text-sm font-medium text-center text-gray-800">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;

