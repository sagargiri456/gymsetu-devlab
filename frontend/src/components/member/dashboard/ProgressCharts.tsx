// components/member/dashboard/ProgressCharts.tsx
'use client';

import React from 'react';

const ProgressCharts: React.FC = () => {
  // Mock progress data
  const weeklyProgress = [
    { day: 'Mon', value: 80 },
    { day: 'Tue', value: 100 },
    { day: 'Wed', value: 60 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 100 },
    { day: 'Sat', value: 70 },
    { day: 'Sun', value: 0 }
  ];

  const maxValue = Math.max(...weeklyProgress.map(p => p.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Weekly Progress
      </h2>
      <div className="space-y-4">
        {/* Bar Chart */}
        <div className="flex items-end justify-between space-x-2 h-40">
          {weeklyProgress.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative h-full flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    item.value === 100
                      ? 'bg-green-500'
                      : item.value >= 70
                      ? 'bg-blue-500'
                      : item.value > 0
                      ? 'bg-yellow-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {item.day}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {weeklyProgress.filter(p => p.value === 100).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Perfect Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(weeklyProgress.reduce((sum, p) => sum + p.value, 0) / weeklyProgress.length)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg. Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {weeklyProgress.filter(p => p.value > 0).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Active Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;

