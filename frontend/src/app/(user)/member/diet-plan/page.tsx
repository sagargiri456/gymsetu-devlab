// app/member/diet-plan/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DietPlan, Meal } from '@/types/member';
import { fetchDietPlan, markMealComplete } from '@/lib/memberApi';

const DietPlanPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  useEffect(() => {
    const loadDietPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDietPlan();
        
        // Transform API response to match our types
        if (data.dietPlan) {
          setDietPlan(data.dietPlan);
        } else if (data) {
          setDietPlan(data);
        }
      } catch (err) {
        console.error('Error loading diet plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load diet plan');
        
        // Fallback to default data if API fails
        setDietPlan({
          name: 'No Diet Plan',
          duration: 'N/A',
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          meals: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDietPlan();
  }, []);

  const handleMarkMealComplete = async (mealId: string) => {
    try {
      await markMealComplete(mealId);
      // Reload diet plan to get updated data
      const data = await fetchDietPlan();
      if (data.dietPlan) {
        setDietPlan(data.dietPlan);
      } else if (data) {
        setDietPlan(data);
      }
    } catch (err) {
      console.error('Error marking meal complete:', err);
      alert('Failed to mark meal as complete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading diet plan...</p>
        </div>
      </div>
    );
  }

  if (error && !dietPlan) {
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

  if (!dietPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No diet plan available</p>
      </div>
    );
  }

  const totalCompleted = dietPlan.meals.filter(m => m.completed).length;
  const progress = dietPlan.meals.length > 0 ? (totalCompleted / dietPlan.meals.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Diet Plan Header */}
      <div className="mb-8 mt-4 lg:mt-6">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          {dietPlan.name}
        </h4>
        <p className="text-gray-600 opacity-70 mt-2">
          {dietPlan.duration} • {dietPlan.calories} calories/day
        </p>
        <div className="flex items-center space-x-4 mt-4">
          <div className="text-sm text-gray-600 opacity-70">Today&apos;s Progress</div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-[#ecf0f3] rounded-full h-3" style={{boxShadow: 'inset 3px 3px 6px #cbced1, inset -3px -3px 6px #ffffff'}}>
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Daily Macros */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Daily Macros</h6>
              <p className="text-sm text-gray-600 opacity-70">Nutrition breakdown</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 opacity-70">Calories</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dietPlan.calories} kcal
                  </span>
                </div>
                <div className="w-full bg-[#ecf0f3] rounded-full h-2" style={{boxShadow: 'inset 2px 2px 4px #cbced1, inset -2px -2px 4px #ffffff'}}>
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 opacity-70">Protein</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dietPlan.protein}g
                  </span>
                </div>
                <div className="w-full bg-[#ecf0f3] rounded-full h-2" style={{boxShadow: 'inset 2px 2px 4px #cbced1, inset -2px -2px 4px #ffffff'}}>
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 opacity-70">Carbs</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dietPlan.carbs}g
                  </span>
                </div>
                <div className="w-full bg-[#ecf0f3] rounded-full h-2" style={{boxShadow: 'inset 2px 2px 4px #cbced1, inset -2px -2px 4px #ffffff'}}>
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 opacity-70">Fats</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dietPlan.fats}g
                  </span>
                </div>
                <div className="w-full bg-[#ecf0f3] rounded-full h-2" style={{boxShadow: 'inset 2px 2px 4px #cbced1, inset -2px -2px 4px #ffffff'}}>
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Today&apos;s Meals</h6>
              <p className="text-sm text-gray-600 opacity-70">Your meal schedule</p>
            </div>
            <div className="space-y-4">
              {dietPlan.meals.map((meal: Meal) => (
                <div
                  key={meal.id}
                  className={`rounded-xl p-4 transition-all ${
                    meal.completed
                      ? 'bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-l-4 border-green-500'
                      : 'bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        meal.completed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        <span className="material-icons text-sm">restaurant</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {meal.name}
                        </h3>
                        <p className="text-sm text-gray-600 opacity-70">
                          {meal.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div className="text-gray-800">
                          {meal.calories} kcal
                        </div>
                        <div className="text-gray-600 opacity-70 text-xs">
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                        </div>
                      </div>
                      <button
                        onClick={() => !meal.completed && handleMarkMealComplete(meal.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          meal.completed
                            ? 'bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700'
                            : 'bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700'
                        }`}
                      >
                        {meal.completed ? (
                          <span className="material-icons text-sm">check_circle</span>
                        ) : (
                          'Mark Complete'
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 opacity-70 mb-2">Food Items:</div>
                    <div className="flex flex-wrap gap-2">
                      {meal.foods.map((food, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] rounded-full text-sm text-gray-800"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanPage;

