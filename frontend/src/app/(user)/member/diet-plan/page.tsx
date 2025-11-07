// app/member/diet-plan/page.tsx
'use client';

import React from 'react';
import { DietPlan, Meal } from '@/types/member';

const DietPlanPage: React.FC = () => {

  // Mock diet plan data
  const dietPlan: DietPlan = {
    name: 'Balanced Nutrition Plan',
    duration: '12 weeks',
    calories: 2200,
    protein: 165,
    carbs: 275,
    fats: 73,
    meals: [
      {
        id: '1',
        name: 'Breakfast',
        time: '08:00 AM',
        calories: 550,
        protein: 35,
        carbs: 65,
        fats: 18,
        foods: ['Oatmeal with berries', 'Greek yogurt', 'Almonds'],
        completed: true
      },
      {
        id: '2',
        name: 'Mid-Morning Snack',
        time: '11:00 AM',
        calories: 200,
        protein: 15,
        carbs: 25,
        fats: 8,
        foods: ['Apple', 'Peanut butter'],
        completed: false
      },
      {
        id: '3',
        name: 'Lunch',
        time: '01:00 PM',
        calories: 650,
        protein: 50,
        carbs: 75,
        fats: 22,
        foods: ['Grilled chicken breast', 'Brown rice', 'Steamed vegetables', 'Salad'],
        completed: false
      },
      {
        id: '4',
        name: 'Afternoon Snack',
        time: '04:00 PM',
        calories: 250,
        protein: 20,
        carbs: 30,
        fats: 10,
        foods: ['Protein shake', 'Banana'],
        completed: false
      },
      {
        id: '5',
        name: 'Dinner',
        time: '07:00 PM',
        calories: 550,
        protein: 45,
        carbs: 80,
        fats: 15,
        foods: ['Salmon fillet', 'Sweet potato', 'Broccoli', 'Quinoa'],
        completed: false
      }
    ]
  };

  const totalCompleted = dietPlan.meals.filter(m => m.completed).length;
  const progress = (totalCompleted / dietPlan.meals.length) * 100;

  return (
    <div className="space-y-6">
      {/* Diet Plan Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {dietPlan.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {dietPlan.duration} • {dietPlan.calories} calories/day
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s Progress</div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Daily Macros */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Daily Macros
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Calories</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dietPlan.calories} kcal
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Protein</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dietPlan.protein}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Carbs</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dietPlan.carbs}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fats</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dietPlan.fats}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Today&apos;s Meals
            </h2>
            <div className="space-y-4">
              {dietPlan.meals.map((meal: Meal) => (
                <div
                  key={meal.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    meal.completed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
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
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {meal.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {meal.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div className="text-gray-600 dark:text-gray-400">
                          {meal.calories} kcal
                        </div>
                        <div className="text-gray-500 dark:text-gray-500 text-xs">
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          meal.completed
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
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
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Food Items:</div>
                    <div className="flex flex-wrap gap-2">
                      {meal.foods.map((food, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
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

