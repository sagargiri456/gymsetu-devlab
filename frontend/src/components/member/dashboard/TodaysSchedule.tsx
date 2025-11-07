// components/member/dashboard/TodaysSchedule.tsx
'use client';

import React from 'react';
import { ScheduleItem } from '@/types/member';

const TodaysSchedule: React.FC = () => {
  // Mock schedule data
  const schedule: ScheduleItem[] = [
    { type: 'workout', title: 'Chest & Triceps', time: '09:00 AM', duration: '60 min', completed: false },
    { type: 'trainer', title: 'Session with John', time: '02:00 PM', duration: '30 min', completed: false },
    { type: 'diet', title: 'Diet Consultation', time: '04:00 PM', duration: '45 min', completed: false }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return 'fitness_center';
      case 'trainer': return 'person';
      case 'diet': return 'restaurant';
      default: return 'event';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workout': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'trainer': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'diet': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Today&apos;s Schedule
      </h2>
      <div className="space-y-3">
        {schedule.length > 0 ? (
          schedule.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                item.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                  <span className="material-icons text-sm">{getTypeIcon(item.type)}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.time} • {item.duration}
                  </div>
                </div>
              </div>
              {item.completed && (
                <span className="material-icons text-green-500 text-sm">
                  check_circle
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="material-icons text-4xl mb-2">event_busy</span>
            <p>No schedule for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysSchedule;

