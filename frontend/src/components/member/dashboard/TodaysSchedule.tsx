// components/member/dashboard/TodaysSchedule.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  MdFitnessCenter, 
  MdPerson, 
  MdRestaurant, 
  MdEvent, 
  MdCheckCircle, 
  MdEventBusy 
} from 'react-icons/md';
import { IconType } from 'react-icons';
import { ScheduleItem } from '@/types/member';
import { fetchTodaysSchedule } from '@/lib/memberApi';

const TodaysSchedule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        const data = await fetchTodaysSchedule();
        
        // Transform API response to match our types
        if (data.schedule) {
          setSchedule(data.schedule);
        } else if (Array.isArray(data)) {
          setSchedule(data);
        } else {
          setSchedule([]);
        }
      } catch (err) {
        console.error('Error loading schedule:', err);
        // Fallback to empty schedule if API fails
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const getTypeIcon = (type: string): IconType => {
    switch (type) {
      case 'workout': return MdFitnessCenter;
      case 'trainer': return MdPerson;
      case 'diet': return MdRestaurant;
      default: return MdEvent;
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
    <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
      <div className="p-0 mb-4">
        <h6 className="text-lg font-bold text-gray-800">Today&apos;s Schedule</h6>
        <p className="text-sm text-gray-600 opacity-70">Upcoming activities</p>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-600 opacity-70">
            <div className="w-8 h-8 border-2 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading schedule...</p>
          </div>
        ) : schedule.length > 0 ? (
          schedule.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                  {React.createElement(getTypeIcon(item.type), { className: 'text-sm' })}
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600 opacity-70">
                    {item.time} • {item.duration}
                  </div>
                </div>
              </div>
              {item.completed && (
                <MdCheckCircle className="text-green-700 text-sm" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 opacity-70">
            <MdEventBusy className="text-4xl mb-2 mx-auto" />
            <p>No schedule for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysSchedule;

