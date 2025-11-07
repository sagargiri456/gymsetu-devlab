// app/trainer/members/page.tsx
'use client';

import React, { useState } from 'react';
import { MdSearch, MdPerson, MdEmail, MdPhone, MdFitnessCenter, MdTrendingUp } from 'react-icons/md';

export default function MyMembers() {
  const [searchQuery, setSearchQuery] = useState('');

  // Hardcoded members data
  const members = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 234-567-8900',
      joinDate: '2024-01-15',
      status: 'Active',
      workoutsCompleted: 45,
      progress: 85,
      nextSession: '2024-11-08 10:00 AM',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1 234-567-8901',
      joinDate: '2024-01-20',
      status: 'Active',
      workoutsCompleted: 32,
      progress: 72,
      nextSession: '2024-11-08 11:30 AM',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '+1 234-567-8902',
      joinDate: '2024-02-01',
      status: 'Active',
      workoutsCompleted: 28,
      progress: 65,
      nextSession: '2024-11-08 2:00 PM',
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana@example.com',
      phone: '+1 234-567-8903',
      joinDate: '2024-02-10',
      status: 'Active',
      workoutsCompleted: 20,
      progress: 58,
      nextSession: '2024-11-08 4:00 PM',
    },
    {
      id: 5,
      name: 'Eve Wilson',
      email: 'eve@example.com',
      phone: '+1 234-567-8904',
      joinDate: '2024-02-15',
      status: 'Active',
      workoutsCompleted: 15,
      progress: 45,
      nextSession: '2024-11-09 9:00 AM',
    },
  ];

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Members</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage and track your assigned members</p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none hover:shadow-[12px_12px_24px_#cbced1,-12px_-12px_24px_#ffffff] transition-shadow"
          >
            {/* Member Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0">
                  <MdPerson className="text-white text-lg sm:text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">{member.name}</h3>
                  <span className="px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold inline-block mt-1">
                    {member.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Member Details */}
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdEmail className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdPhone className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{member.phone}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Joined: {new Date(member.joinDate).toLocaleDateString()}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-[#ecf0f3] rounded-xl p-2 sm:p-3 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <MdFitnessCenter className="text-blue-600 text-xs sm:text-sm flex-shrink-0" />
                  <span className="text-xs text-gray-600">Workouts</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-gray-800">{member.workoutsCompleted}</p>
              </div>
              <div className="bg-[#ecf0f3] rounded-xl p-2 sm:p-3 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <MdTrendingUp className="text-green-600 text-xs sm:text-sm flex-shrink-0" />
                  <span className="text-xs text-gray-600">Progress</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-gray-800">{member.progress}%</p>
              </div>
            </div>

            {/* Next Session */}
            <div className="bg-blue-50 rounded-xl p-2 sm:p-3 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none mb-3 sm:mb-4">
              <p className="text-xs text-gray-600 mb-1">Next Session</p>
              <p className="text-xs sm:text-sm font-semibold text-blue-700 break-words">{member.nextSession}</p>
            </div>

            {/* Actions */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
              <button className="flex-1 bg-[#ecf0f3] rounded-xl px-3 sm:px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-gray-800 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow">
                View Profile
              </button>
              <button className="flex-1 bg-[#ecf0f3] rounded-xl px-3 sm:px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-blue-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow">
                Progress
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none text-center">
          <p className="text-sm sm:text-base text-gray-600">No members found matching your search.</p>
        </div>
      )}
    </div>
  );
}

