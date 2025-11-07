// app/member/workout-plan/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise } from '@/types/member';
import { fetchWorkoutPlan, markExerciseComplete } from '@/lib/memberApi';

const WorkoutPlanPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    const loadWorkoutPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWorkoutPlan();
        
        // Transform API response to match our types
        if (data.workoutPlan) {
          setWorkoutPlan(data.workoutPlan);
        } else if (data) {
          setWorkoutPlan(data);
        }
      } catch (err) {
        console.error('Error loading workout plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workout plan');
        
        // Fallback to default data if API fails
        setWorkoutPlan({
          name: 'No Workout Plan',
          duration: 'N/A',
          progress: 0,
          daysPerWeek: 0,
          weeklySchedule: [],
          exercises: {}
        });
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutPlan();
  }, []);

  const handleMarkComplete = async (exerciseId: string) => {
    try {
      await markExerciseComplete(exerciseId, selectedDay);
      // Reload workout plan to get updated data
      const data = await fetchWorkoutPlan();
      if (data.workoutPlan) {
        setWorkoutPlan(data.workoutPlan);
      } else if (data) {
        setWorkoutPlan(data);
      }
    } catch (err) {
      console.error('Error marking exercise complete:', err);
      alert('Failed to mark exercise as complete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workout plan...</p>
        </div>
      </div>
    );
  }

  if (error && !workoutPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No workout plan available</p>
      </div>
    );
  }

  const currentExercises = workoutPlan.exercises[selectedDay] || [];

  return (
    <div className="space-y-6">
      {/* Workout Plan Header */}
      <div className="mb-8 mt-4 lg:mt-6">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          {workoutPlan.name}
        </h4>
        <p className="text-gray-600 opacity-70 mt-2">
          {workoutPlan.duration} • {workoutPlan.daysPerWeek} days/week
        </p>
        <div className="flex items-center space-x-4 mt-4">
          <div className="text-sm text-gray-600 opacity-70">Progress</div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-[#ecf0f3] rounded-full h-3" style={{boxShadow: 'inset 3px 3px 6px #cbced1, inset -3px -3px 6px #ffffff'}}>
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${workoutPlan.progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {workoutPlan.progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Weekly Schedule</h6>
              <p className="text-sm text-gray-600 opacity-70">Select a day to view exercises</p>
            </div>
            <div className="space-y-2">
              {workoutPlan.weeklySchedule.map((day: WorkoutDay) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedDay === day.day
                      ? 'bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-blue-700'
                      : 'bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{day.name}</div>
                      <div className="text-sm text-gray-600 opacity-70">
                        Day {day.day}
                      </div>
                    </div>
                    {day.completed && (
                      <span className="material-icons text-green-700 text-sm">
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
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">
                {workoutPlan.weeklySchedule.find((d: WorkoutDay) => d.day === selectedDay)?.name || 'Select a Day'}
              </h6>
              <p className="text-sm text-gray-600 opacity-70">Exercise details and instructions</p>
            </div>

            {currentExercises.length > 0 ? (
              <div className="space-y-4">
                {currentExercises.map((exercise: Exercise, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">
                        {exercise.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg text-sm transition-all">
                          Log Performance
                        </button>
                        <button 
                          onClick={() => handleMarkComplete(exercise.name)}
                          className="px-3 py-1 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700 rounded-lg text-sm transition-all"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 opacity-70">Sets × Reps</span>
                        <div className="font-medium text-gray-800">{exercise.sets} × {exercise.reps}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 opacity-70">Weight</span>
                        <div className="font-medium text-gray-800">{exercise.weight}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 opacity-70">Rest</span>
                        <div className="font-medium text-gray-800">{exercise.rest}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 opacity-70">Personal Best</span>
                        <div className="font-medium text-green-700">
                          {exercise.personalBest}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 opacity-70">
                <span className="material-icons text-4xl mb-2">fitness_center</span>
                <p>Rest day or no exercises scheduled</p>
              </div>
            )}
          </div>

          {/* Workout History */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6 mt-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Recent Workouts</h6>
              <p className="text-sm text-gray-600 opacity-70">Your workout history</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                  <div>
                    <div className="font-medium text-gray-800">Chest & Triceps</div>
                    <div className="text-sm text-gray-600 opacity-70">
                      {new Date().toLocaleDateString()} • 45 minutes
                    </div>
                  </div>
                  <span className="material-icons text-green-700">check_circle</span>
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