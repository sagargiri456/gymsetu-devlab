// app/trainer/workout-plans/page.tsx
'use client';

import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdFitnessCenter, MdPeople, MdCalendarToday } from 'react-icons/md';

export default function WorkoutPlans() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Hardcoded workout plans
  const [workoutPlans, setWorkoutPlans] = useState([
    {
      id: 1,
      name: 'Beginner Strength Program',
      duration: '12 weeks',
      daysPerWeek: 3,
      assignedMembers: 8,
      createdAt: '2024-01-15',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Advanced Cardio Blast',
      duration: '8 weeks',
      daysPerWeek: 5,
      assignedMembers: 5,
      createdAt: '2024-02-01',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Weight Loss Program',
      duration: '16 weeks',
      daysPerWeek: 4,
      assignedMembers: 12,
      createdAt: '2024-01-20',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Muscle Building Plan',
      duration: '10 weeks',
      daysPerWeek: 4,
      assignedMembers: 6,
      createdAt: '2024-02-10',
      status: 'Active',
    },
  ]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this workout plan?')) {
      setWorkoutPlans(workoutPlans.filter((plan) => plan.id !== id));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Workout Plans</h1>
            <p className="text-sm sm:text-base text-gray-600">Create and manage workout plans for your members</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#ecf0f3] rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 font-semibold flex items-center gap-2 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <MdAdd className="text-lg sm:text-xl" />
            <span className="hidden sm:inline">Create New Plan</span>
            <span className="sm:hidden">New Plan</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Create New Workout Plan</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newPlan = {
                id: workoutPlans.length + 1,
                name: formData.get('name') as string,
                duration: formData.get('duration') as string,
                daysPerWeek: parseInt(formData.get('daysPerWeek') as string),
                assignedMembers: 0,
                createdAt: new Date().toISOString().split('T')[0],
                status: 'Active',
              };
              setWorkoutPlans([...workoutPlans, newPlan]);
              setShowCreateForm(false);
              e.currentTarget.reset();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 placeholder-gray-400 focus:outline-none"
                placeholder="e.g., Beginner Strength Program"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  required
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="e.g., 12 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Days Per Week</label>
                <input
                  type="number"
                  name="daysPerWeek"
                  required
                  min="1"
                  max="7"
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="3"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#ecf0f3] rounded-xl px-6 py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 font-semibold transition-all"
              >
                Create Plan
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

      {/* Workout Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {workoutPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none hover:shadow-[12px_12px_24px_#cbced1,-12px_-12px_24px_#ffffff] transition-shadow"
          >
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0">
                  <MdFitnessCenter className="text-white text-lg sm:text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">{plan.name}</h3>
                  <span className="px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold inline-block mt-1">
                    {plan.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdCalendarToday className="text-gray-400 flex-shrink-0" />
                <span className="truncate">Duration: {plan.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdFitnessCenter className="text-gray-400 flex-shrink-0" />
                <span>{plan.daysPerWeek} days per week</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MdPeople className="text-gray-400 flex-shrink-0" />
                <span>{plan.assignedMembers} members assigned</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Created: {new Date(plan.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
              <button className="flex-1 bg-[#ecf0f3] rounded-xl px-3 sm:px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-blue-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow flex items-center justify-center gap-1 sm:gap-2">
                <MdEdit className="text-sm sm:text-base" />
                <span>Edit</span>
              </button>
              <button className="flex-1 bg-[#ecf0f3] rounded-xl px-3 sm:px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-gray-800 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow flex items-center justify-center gap-1 sm:gap-2">
                <MdPeople className="text-sm sm:text-base" />
                <span>Assign</span>
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
                className="px-3 sm:px-4 py-2 bg-[#ecf0f3] rounded-xl shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-xs sm:text-sm font-semibold text-red-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow flex items-center justify-center"
              >
                <MdDelete className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

