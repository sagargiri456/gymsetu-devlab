// components/member/dashboard/ProgressCharts.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { fetchWeeklyProgress } from '@/lib/memberApi';

interface WeeklyProgressItem {
  day: string;
  value: number;
}

const ProgressCharts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressItem[]>([]);

  useEffect(() => {
    const loadWeeklyProgress = async () => {
      try {
        setLoading(true);
        const data = await fetchWeeklyProgress();
        
        // Transform API response to match our types
        if (data.weeklyProgress) {
          setWeeklyProgress(data.weeklyProgress);
        } else if (data.progress) {
          setWeeklyProgress(data.progress);
        } else if (Array.isArray(data)) {
          setWeeklyProgress(data);
        } else {
          // Fallback to default data if API fails
          setWeeklyProgress([
            { day: 'Mon', value: 0 },
            { day: 'Tue', value: 0 },
            { day: 'Wed', value: 0 },
            { day: 'Thu', value: 0 },
            { day: 'Fri', value: 0 },
            { day: 'Sat', value: 0 },
            { day: 'Sun', value: 0 }
          ]);
        }
      } catch (err) {
        console.error('Error loading weekly progress:', err);
        // Fallback to default data if API fails
        setWeeklyProgress([
          { day: 'Mon', value: 0 },
          { day: 'Tue', value: 0 },
          { day: 'Wed', value: 0 },
          { day: 'Thu', value: 0 },
          { day: 'Fri', value: 0 },
          { day: 'Sat', value: 0 },
          { day: 'Sun', value: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadWeeklyProgress();
  }, []);

  const maxValue = weeklyProgress.length > 0 ? Math.max(...weeklyProgress.map(p => p.value)) : 100;

  return (
    <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
      <div className="p-0 mb-4">
        <h6 className="text-lg font-bold text-gray-800">Weekly Progress</h6>
        <p className="text-sm text-gray-600 opacity-70">Workout completion rate</p>
      </div>
      <div className="mt-4 p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
        <div className="space-y-4">
          {/* Bar Chart */}
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-600 opacity-70">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm">Loading progress...</p>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between space-x-2 h-40">
              {weeklyProgress.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-[#ecf0f3] rounded-t-lg relative h-full flex items-end" style={{boxShadow: 'inset 2px 2px 4px #cbced1, inset -2px -2px 4px #ffffff'}}>
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      item.value === 100
                        ? 'bg-green-500'
                        : item.value >= 70
                        ? 'bg-blue-500'
                        : item.value > 0
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 opacity-70 mt-2">
                  {item.day}
                </div>
              </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                {weeklyProgress.filter(p => p.value === 100).length}
              </div>
              <div className="text-xs text-gray-600 opacity-70">Perfect Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                {Math.round(weeklyProgress.reduce((sum, p) => sum + p.value, 0) / weeklyProgress.length)}%
              </div>
              <div className="text-xs text-gray-600 opacity-70">Avg. Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                {weeklyProgress.filter(p => p.value > 0).length}
              </div>
              <div className="text-xs text-gray-600 opacity-70">Active Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;

