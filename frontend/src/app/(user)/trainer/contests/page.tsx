// app/trainer/contests/page.tsx
'use client';

import React from 'react';
import { MdEmojiEvents, MdPeople, MdCalendarToday, MdTrendingUp } from 'react-icons/md';

export default function Contests() {
  // Hardcoded contests data
  const contests = [
    {
      id: 1,
      name: 'Weight Loss Challenge',
      description: 'Lose the most weight in 30 days',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      status: 'Ongoing',
      participants: 25,
      prize: '$500',
    },
    {
      id: 2,
      name: 'Muscle Gain Competition',
      description: 'Build the most muscle in 8 weeks',
      startDate: '2024-12-01',
      endDate: '2024-01-26',
      status: 'Upcoming',
      participants: 15,
      prize: '$750',
    },
    {
      id: 3,
      name: 'Fitness Transformation',
      description: 'Complete transformation challenge',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      status: 'Completed',
      participants: 30,
      prize: '$1000',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Contests</h1>
        <p className="text-sm sm:text-base text-gray-600">View and manage fitness contests</p>
      </div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none hover:shadow-[12px_12px_24px_#cbced1,-12px_-12px_24px_#ffffff] transition-shadow"
          >
            {/* Contest Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0">
                  <MdEmojiEvents className="text-white text-lg sm:text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">{contest.name}</h3>
                  <span
                    className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold inline-block mt-1 ${
                      contest.status === 'Ongoing'
                        ? 'bg-green-100 text-green-700'
                        : contest.status === 'Upcoming'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {contest.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Contest Details */}
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600">{contest.description}</p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdCalendarToday className="text-gray-400 flex-shrink-0" />
                <span className="break-words">
                  {new Date(contest.startDate).toLocaleDateString()} -{' '}
                  {new Date(contest.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdPeople className="text-gray-400 flex-shrink-0" />
                <span>{contest.participants} participants</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdTrendingUp className="text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-yellow-600">Prize: {contest.prize}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
              <button className="flex-1 bg-[#ecf0f3] rounded-xl px-3 sm:px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-blue-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow">
                View Details
              </button>
              <button className="flex-1 bg-[#ecf0f3] rounded-xl px-3 sm:px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-gray-800 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow">
                Leaderboard
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

