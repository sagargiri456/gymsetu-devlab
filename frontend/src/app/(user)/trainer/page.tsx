// app/trainer/page.tsx
'use client';

import React from 'react';
import { HiOutlineHand } from 'react-icons/hi';
import { MdPeople, MdEventAvailable, MdFitnessCenter, MdSchedule } from 'react-icons/md';

export default function TrainerDashboard() {
  // Hardcoded trainer data
  const trainerData = {
    name: 'John Trainer',
    email: 'trainer@example.com',
    specialization: 'Strength Training',
    experience: 5,
    totalMembers: 25,
    activeSessions: 8,
    upcomingSessions: 12,
    completedWorkouts: 150,
  };

  const stats = [
    {
      title: 'Total Members',
      value: trainerData.totalMembers,
      icon: MdPeople,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Sessions',
      value: trainerData.activeSessions,
      icon: MdEventAvailable,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upcoming Sessions',
      value: trainerData.upcomingSessions,
      icon: MdSchedule,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completed Workouts',
      value: trainerData.completedWorkouts,
      icon: MdFitnessCenter,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const upcomingSessions = [
    { id: 1, memberName: 'Alice Johnson', time: '10:00 AM', type: 'Personal Training' },
    { id: 2, memberName: 'Bob Smith', time: '11:30 AM', type: 'Strength Training' },
    { id: 3, memberName: 'Charlie Brown', time: '2:00 PM', type: 'Cardio Session' },
    { id: 4, memberName: 'Diana Prince', time: '4:00 PM', type: 'Personal Training' },
  ];

  const recentMembers = [
    { id: 1, name: 'Alice Johnson', joinDate: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Bob Smith', joinDate: '2024-01-20', status: 'Active' },
    { id: 3, name: 'Charlie Brown', joinDate: '2024-02-01', status: 'Active' },
    { id: 4, name: 'Diana Prince', joinDate: '2024-02-10', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0">
            <HiOutlineHand className="text-2xl sm:text-3xl text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">
              Welcome back, {trainerData.name.split(' ')[0]}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
              {trainerData.specialization} • {trainerData.experience} years experience
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 truncate">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0 ml-2`}>
                <stat.icon className={`text-xl sm:text-2xl ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Upcoming Sessions</h2>
          <div className="space-y-2 sm:space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#ecf0f3] rounded-xl p-3 sm:p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">{session.memberName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{session.type}</p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-semibold text-sm sm:text-base text-blue-600">{session.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Members */}
        <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Recent Members</h2>
          <div className="space-y-2 sm:space-y-3">
            {recentMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#ecf0f3] rounded-xl p-3 sm:p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">{member.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex-shrink-0">
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

