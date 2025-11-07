// app/trainer/schedule/page.tsx
'use client';

import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSchedule, MdPerson, MdEvent } from 'react-icons/md';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Hardcoded schedule data
  const [sessions, setSessions] = useState([
    {
      id: 1,
      memberName: 'Alice Johnson',
      date: '2024-11-08',
      time: '10:00 AM',
      duration: '60 min',
      type: 'Personal Training',
      status: 'Scheduled',
    },
    {
      id: 2,
      memberName: 'Bob Smith',
      date: '2024-11-08',
      time: '11:30 AM',
      duration: '45 min',
      type: 'Strength Training',
      status: 'Scheduled',
    },
    {
      id: 3,
      memberName: 'Charlie Brown',
      date: '2024-11-08',
      time: '2:00 PM',
      duration: '60 min',
      type: 'Cardio Session',
      status: 'Scheduled',
    },
    {
      id: 4,
      memberName: 'Diana Prince',
      date: '2024-11-08',
      time: '4:00 PM',
      duration: '90 min',
      type: 'Personal Training',
      status: 'Scheduled',
    },
    {
      id: 5,
      memberName: 'Eve Wilson',
      date: '2024-11-09',
      time: '9:00 AM',
      duration: '60 min',
      type: 'Strength Training',
      status: 'Scheduled',
    },
  ]);

  const filteredSessions = sessions.filter((session) => session.date === selectedDate);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this session?')) {
      setSessions(sessions.filter((session) => session.id !== id));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Schedule</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your training sessions</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#ecf0f3] rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 font-semibold flex items-center gap-2 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <MdAdd className="text-lg sm:text-xl" />
            <span className="hidden sm:inline">Add Session</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <MdSchedule className="text-gray-600 text-lg sm:text-xl flex-shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-sm sm:text-base text-gray-800 focus:outline-none"
            />
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} scheduled
          </span>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Add New Session</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newSession = {
                id: sessions.length + 1,
                memberName: formData.get('memberName') as string,
                date: formData.get('date') as string,
                time: formData.get('time') as string,
                duration: formData.get('duration') as string,
                type: formData.get('type') as string,
                status: 'Scheduled',
              };
              setSessions([...sessions, newSession]);
              setShowCreateForm(false);
              e.currentTarget.reset();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Member Name</label>
                <input
                  type="text"
                  name="memberName"
                  required
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="Member name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Session Type</label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
                >
                  <option value="Personal Training">Personal Training</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Cardio Session">Cardio Session</option>
                  <option value="Group Class">Group Class</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  required
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                <select
                  name="duration"
                  required
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
                >
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="60 min">60 min</option>
                  <option value="90 min">90 min</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#ecf0f3] rounded-xl px-6 py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 font-semibold transition-all"
              >
                Add Session
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-[#ecf0f3] rounded-xl px-6 py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-700 font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none hover:shadow-[12px_12px_24px_#cbced1,-12px_-12px_24px_#ffffff] transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0">
                    <MdSchedule className="text-white text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MdPerson className="text-gray-400 flex-shrink-0" />
                      <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">{session.memberName}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MdEvent className="text-gray-400 flex-shrink-0" />
                        <span>{session.time}</span>
                      </div>
                      <span>{session.duration}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {session.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                  <button className="px-3 sm:px-4 py-2 bg-[#ecf0f3] rounded-xl shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-blue-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow">
                    <MdEdit className="text-sm sm:text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="px-3 sm:px-4 py-2 bg-[#ecf0f3] rounded-xl shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-red-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow"
                  >
                    <MdDelete className="text-sm sm:text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-8 sm:p-12 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none text-center">
            <MdSchedule className="text-gray-400 text-4xl sm:text-5xl mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600">No sessions scheduled for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
}

