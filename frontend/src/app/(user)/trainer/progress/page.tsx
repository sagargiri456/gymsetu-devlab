// app/trainer/progress/page.tsx
'use client';

import React, { useState } from 'react';
import { MdTrendingUp, MdPerson, MdFitnessCenter, MdBarChart } from 'react-icons/md';

export default function ProgressTracking() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Hardcoded members and their progress
  const members = [
    {
      id: 1,
      name: 'Alice Johnson',
      progress: [
        { date: '2024-10-01', weight: 75, bodyFat: 20, muscleMass: 60 },
        { date: '2024-10-15', weight: 74, bodyFat: 19, muscleMass: 61 },
        { date: '2024-11-01', weight: 73, bodyFat: 18, muscleMass: 62 },
        { date: '2024-11-08', weight: 72, bodyFat: 17, muscleMass: 63 },
      ],
      workoutsCompleted: 45,
      progressPercentage: 85,
    },
    {
      id: 2,
      name: 'Bob Smith',
      progress: [
        { date: '2024-10-01', weight: 80, bodyFat: 22, muscleMass: 62 },
        { date: '2024-10-15', weight: 79, bodyFat: 21, muscleMass: 63 },
        { date: '2024-11-01', weight: 78, bodyFat: 20, muscleMass: 64 },
        { date: '2024-11-08', weight: 77, bodyFat: 19, muscleMass: 65 },
      ],
      workoutsCompleted: 32,
      progressPercentage: 72,
    },
    {
      id: 3,
      name: 'Charlie Brown',
      progress: [
        { date: '2024-10-01', weight: 70, bodyFat: 18, muscleMass: 58 },
        { date: '2024-10-15', weight: 71, bodyFat: 17, muscleMass: 59 },
        { date: '2024-11-01', weight: 72, bodyFat: 16, muscleMass: 60 },
        { date: '2024-11-08', weight: 73, bodyFat: 15, muscleMass: 61 },
      ],
      workoutsCompleted: 28,
      progressPercentage: 65,
    },
  ];

  const selectedMemberData = selectedMember
    ? members.find((m) => m.id === parseInt(selectedMember))
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Progress Tracking</h1>
        <p className="text-sm sm:text-base text-gray-600">Monitor and analyze member progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Members List */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Members</h2>
            <div className="space-y-2 sm:space-y-3">
              {members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member.id.toString())}
                  className={`w-full text-left bg-[#ecf0f3] rounded-xl p-3 sm:p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none transition-all ${
                    selectedMember === member.id.toString()
                      ? 'shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff]'
                      : 'hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0">
                        <MdPerson className="text-white text-xs sm:text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-gray-800 truncate">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.workoutsCompleted} workouts</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-green-600">{member.progressPercentage}%</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Details */}
        <div className="lg:col-span-2">
          {selectedMemberData ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Member Stats */}
              <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{selectedMemberData.name}&apos;s Progress</h2>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-[#ecf0f3] rounded-xl p-2 sm:p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-center">
                    <MdFitnessCenter className="text-blue-600 text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Workouts</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800">{selectedMemberData.workoutsCompleted}</p>
                  </div>
                  <div className="bg-[#ecf0f3] rounded-xl p-2 sm:p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-center">
                    <MdTrendingUp className="text-green-600 text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Progress</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800">{selectedMemberData.progressPercentage}%</p>
                  </div>
                  <div className="bg-[#ecf0f3] rounded-xl p-2 sm:p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-center">
                    <MdBarChart className="text-purple-600 text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Records</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800">{selectedMemberData.progress.length}</p>
                  </div>
                </div>
              </div>

              {/* Progress History */}
              <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Progress History</h3>
                <div className="space-y-2 sm:space-y-3">
                  {selectedMemberData.progress.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-[#ecf0f3] rounded-xl p-3 sm:p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none"
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Weight (kg)</p>
                          <p className="text-sm font-bold text-gray-800">{entry.weight}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Body Fat (%)</p>
                          <p className="text-sm font-bold text-gray-800">{entry.bodyFat}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Muscle Mass (kg)</p>
                          <p className="text-sm font-bold text-gray-800">{entry.muscleMass}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none text-center">
              <MdPerson className="text-gray-400 text-4xl sm:text-5xl mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-600">Select a member to view their progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

