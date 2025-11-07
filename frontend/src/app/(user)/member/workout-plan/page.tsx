// app/member/workout-plan/page.tsx
'use client';

import React, { useState } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise } from '@/types/member';

const WorkoutPlanPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Mock workout data
  const workoutPlan: WorkoutPlan = {
    name: 'Strength & Conditioning',
    duration: '8 weeks',
    progress: 60,
    daysPerWeek: 5,
    weeklySchedule: [
      { day: 1, name: 'Chest & Triceps', completed: true },
      { day: 2, name: 'Back & Biceps', completed: true },
      { day: 3, name: 'Legs & Shoulders', completed: false },
      { day: 4, name: 'Cardio & Core', completed: false },
      { day: 5, name: 'Full Body', completed: false },
      { day: 6, name: 'Rest', completed: false },
      { day: 7, name: 'Rest', completed: false }
    ],
    exercises: {
      1: [
        { name: 'Bench Press', sets: '4', reps: '8-10', weight: '80kg', rest: '90s', personalBest: '85kg' },
        { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12', weight: '25kg', rest: '60s', personalBest: '28kg' },
        { name: 'Tricep Pushdown', sets: '3', reps: '12-15', weight: '30kg', rest: '45s', personalBest: '35kg' }
      ],
      2: [
        { name: 'Deadlifts', sets: '4', reps: '6-8', weight: '120kg', rest: '120s', personalBest: '130kg' },
        { name: 'Pull-ups', sets: '3', reps: '8-10', weight: 'Bodyweight', rest: '90s', personalBest: '12 reps' }
      ]
    }
  };

  const currentExercises = workoutPlan.exercises[selectedDay] || [];

  return (
    <div className="space-y-6">
      {/* Workout Plan Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {workoutPlan.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {workoutPlan.duration} • {workoutPlan.daysPerWeek} days/week
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${workoutPlan.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {workoutPlan.progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Schedule
            </h2>
            <div className="space-y-2">
              {workoutPlan.weeklySchedule.map((day: WorkoutDay) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDay === day.day
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${
                    day.completed ? 'border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{day.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Day {day.day}
                      </div>
                    </div>
                    {day.completed && (
                      <span className="material-icons text-green-500 text-sm">
                        check_circle
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exercise Details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {workoutPlan.weeklySchedule.find((d: WorkoutDay) => d.day === selectedDay)?.name || 'Select a Day'}
            </h2>

            {currentExercises.length > 0 ? (
              <div className="space-y-4">
                {currentExercises.map((exercise: Exercise, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {exercise.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm">
                          Log Performance
                        </button>
                        <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-sm">
                          Mark Complete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Sets × Reps</span>
                        <div className="font-medium">{exercise.sets} × {exercise.reps}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Weight</span>
                        <div className="font-medium">{exercise.weight}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Rest</span>
                        <div className="font-medium">{exercise.rest}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Personal Best</span>
                        <div className="font-medium text-green-600 dark:text-green-400">
                          {exercise.personalBest}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <span className="material-icons text-4xl mb-2">fitness_center</span>
                <p>Rest day or no exercises scheduled</p>
              </div>
            )}
          </div>

          {/* Workout History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Workouts
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium">Chest & Triceps</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date().toLocaleDateString()} • 45 minutes
                    </div>
                  </div>
                  <span className="material-icons text-green-500">check_circle</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanPage;