// app/member/progress/page.tsx
'use client';

import React, { useState } from 'react';
import { ProgressEntry } from '@/types/member';

const ProgressPage: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bodyFat' | 'muscleMass'>('weight');

  // Mock progress data
  const progressData: ProgressEntry[] = [
    { date: '2024-11-01', weight: 80, bodyFat: 18, muscleMass: 65 },
    { date: '2024-11-08', weight: 79.5, bodyFat: 17.5, muscleMass: 65.5 },
    { date: '2024-11-15', weight: 79, bodyFat: 17, muscleMass: 66 },
    { date: '2024-11-22', weight: 78.5, bodyFat: 16.5, muscleMass: 66.5 },
    { date: '2024-11-29', weight: 78, bodyFat: 16, muscleMass: 67 },
    { date: '2024-12-06', weight: 77.5, bodyFat: 15.5, muscleMass: 67.5 }
  ];

  const currentWeight = progressData[progressData.length - 1]?.weight || 0;
  const startingWeight = progressData[0]?.weight || 0;
  const weightChange = currentWeight - startingWeight;
  const weightChangePercent = ((weightChange / startingWeight) * 100).toFixed(1);

  const maxValue = Math.max(...progressData.map(d => 
    selectedMetric === 'weight' ? d.weight :
    selectedMetric === 'bodyFat' ? (d.bodyFat || 0) :
    (d.muscleMass || 0)
  ));
  const minValue = Math.min(...progressData.map(d =>
    selectedMetric === 'weight' ? d.weight :
    selectedMetric === 'bodyFat' ? (d.bodyFat || 0) :
    (d.muscleMass || 0)
  ));

  const getMetricValue = (entry: ProgressEntry) => {
    if (selectedMetric === 'weight') return entry.weight;
    if (selectedMetric === 'bodyFat') return entry.bodyFat || 0;
    return entry.muscleMass || 0;
  };

  const getMetricLabel = () => {
    if (selectedMetric === 'weight') return 'Weight (kg)';
    if (selectedMetric === 'bodyFat') return 'Body Fat (%)';
    return 'Muscle Mass (kg)';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Progress
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your fitness journey and achievements
            </p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <span className="material-icons text-sm mr-2 align-middle">add</span>
            Log Progress
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Weight</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentWeight} kg
          </div>
          <div className={`text-sm mt-1 ${weightChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
            {weightChange < 0 ? '↓' : '↑'} {Math.abs(weightChange)} kg ({Math.abs(parseFloat(weightChangePercent))}%)
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Body Fat</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {progressData[progressData.length - 1]?.bodyFat || 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Target: 15%
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Muscle Mass</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {progressData[progressData.length - 1]?.muscleMass || 0} kg
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mt-1">
            ↑ +2.5 kg
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Days Tracked</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {progressData.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Last: {new Date(progressData[progressData.length - 1]?.date || '').toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Progress Chart
          </h2>
          <div className="flex space-x-2">
            {(['weight', 'bodyFat', 'muscleMass'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {metric === 'weight' ? 'Weight' : metric === 'bodyFat' ? 'Body Fat' : 'Muscle Mass'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {progressData.map((entry, index) => {
            const value = getMetricValue(entry);
            const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative h-full flex items-end">
                  <div
                    className="w-full bg-green-500 rounded-t-lg transition-all"
                    style={{ height: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs font-medium text-gray-900 dark:text-white mt-1">
                  {value.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          {getMetricLabel()}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Progress Logs
        </h2>
        <div className="space-y-3">
          {progressData.slice().reverse().map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Weight: {entry.weight}kg • Body Fat: {entry.bodyFat}% • Muscle Mass: {entry.muscleMass}kg
                </div>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;

