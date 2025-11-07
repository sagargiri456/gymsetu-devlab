// app/member/progress/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ProgressEntry } from '@/types/member';
import { fetchProgressData, logProgress } from '@/lib/memberApi';

const ProgressPage: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bodyFat' | 'muscleMass'>('weight');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newProgress, setNewProgress] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: ''
  });

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProgressData();
        
        // Transform API response to match our types
        if (data.progress) {
          setProgressData(data.progress);
        } else if (data.entries) {
          setProgressData(data.entries);
        } else if (Array.isArray(data)) {
          setProgressData(data);
        }
      } catch (err) {
        console.error('Error loading progress data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load progress data');
        setProgressData([]);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  const handleLogProgress = async () => {
    try {
      await logProgress({
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(newProgress.weight),
        bodyFat: newProgress.bodyFat ? parseFloat(newProgress.bodyFat) : undefined,
        muscleMass: newProgress.muscleMass ? parseFloat(newProgress.muscleMass) : undefined
      });
      
      // Reload progress data
      const data = await fetchProgressData();
      if (data.progress) {
        setProgressData(data.progress);
      } else if (data.entries) {
        setProgressData(data.entries);
      } else if (Array.isArray(data)) {
        setProgressData(data);
      }
      
      setShowLogForm(false);
      setNewProgress({ weight: '', bodyFat: '', muscleMass: '' });
      alert('Progress logged successfully!');
    } catch (err) {
      console.error('Error logging progress:', err);
      alert('Failed to log progress. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error && progressData.length === 0) {
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

  const currentWeight = progressData.length > 0 ? (progressData[progressData.length - 1]?.weight || 0) : 0;
  const startingWeight = progressData.length > 0 ? (progressData[0]?.weight || 0) : 0;
  const weightChange = currentWeight - startingWeight;
  const weightChangePercent = startingWeight > 0 ? ((weightChange / startingWeight) * 100).toFixed(1) : '0';

  const maxValue = progressData.length > 0 ? Math.max(...progressData.map(d => 
    selectedMetric === 'weight' ? d.weight :
    selectedMetric === 'bodyFat' ? (d.bodyFat || 0) :
    (d.muscleMass || 0)
  )) : 100;
  const minValue = progressData.length > 0 ? Math.min(...progressData.map(d =>
    selectedMetric === 'weight' ? d.weight :
    selectedMetric === 'bodyFat' ? (d.bodyFat || 0) :
    (d.muscleMass || 0)
  )) : 0;

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
      <div className="mb-8 mt-4 lg:mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
              My Progress
            </h4>
            <p className="text-gray-600 opacity-70 mt-2">
              Track your fitness journey and achievements
            </p>
          </div>
          <button 
            onClick={() => setShowLogForm(!showLogForm)}
            className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700 rounded-lg transition-all"
          >
            <span className="material-icons text-sm mr-2 align-middle">add</span>
            Log Progress
          </button>
        </div>
      </div>

      {/* Log Progress Form */}
      {showLogForm && (
        <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
          <div className="p-0 mb-4">
            <h6 className="text-lg font-bold text-gray-800">Log New Progress</h6>
            <p className="text-sm text-gray-600 opacity-70">Record your fitness metrics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={newProgress.weight}
                onChange={(e) => setNewProgress({ ...newProgress, weight: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none"
                placeholder="Enter weight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Body Fat (%)</label>
              <input
                type="number"
                value={newProgress.bodyFat}
                onChange={(e) => setNewProgress({ ...newProgress, bodyFat: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none"
                placeholder="Enter body fat %"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Muscle Mass (kg)</label>
              <input
                type="number"
                value={newProgress.muscleMass}
                onChange={(e) => setNewProgress({ ...newProgress, muscleMass: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none"
                placeholder="Enter muscle mass"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => {
                setShowLogForm(false);
                setNewProgress({ weight: '', bodyFat: '', muscleMass: '' });
              }}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleLogProgress}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700 rounded-lg transition-all"
            >
              Save Progress
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-8 text-center rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:scale-[1.01]">
          <div className="text-sm text-gray-600 opacity-70 mb-1">Current Weight</div>
          <div className="text-4xl font-extrabold text-gray-800 mb-1 drop-shadow-[1px_1px_0px_#fff]">
            {currentWeight} kg
          </div>
          <div className={`text-sm mt-1 ${weightChange < 0 ? 'text-green-700' : 'text-gray-600 opacity-70'}`}>
            {weightChange < 0 ? '↓' : '↑'} {Math.abs(weightChange)} kg ({Math.abs(parseFloat(weightChangePercent))}%)
          </div>
        </div>
        <div className="p-8 text-center rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:scale-[1.01]">
          <div className="text-sm text-gray-600 opacity-70 mb-1">Body Fat</div>
          <div className="text-4xl font-extrabold text-gray-800 mb-1 drop-shadow-[1px_1px_0px_#fff]">
            {progressData[progressData.length - 1]?.bodyFat || 0}%
          </div>
          <div className="text-sm text-gray-600 opacity-70 mt-1">
            Target: 15%
          </div>
        </div>
        <div className="p-8 text-center rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:scale-[1.01]">
          <div className="text-sm text-gray-600 opacity-70 mb-1">Muscle Mass</div>
          <div className="text-4xl font-extrabold text-gray-800 mb-1 drop-shadow-[1px_1px_0px_#fff]">
            {progressData[progressData.length - 1]?.muscleMass || 0} kg
          </div>
          <div className="text-sm text-green-700 mt-1">
            ↑ +2.5 kg
          </div>
        </div>
        <div className="p-8 text-center rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:scale-[1.01]">
          <div className="text-sm text-gray-600 opacity-70 mb-1">Days Tracked</div>
          <div className="text-4xl font-extrabold text-gray-800 mb-1 drop-shadow-[1px_1px_0px_#fff]">
            {progressData.length}
          </div>
          <div className="text-sm text-gray-600 opacity-70 mt-1">
            Last: {new Date(progressData[progressData.length - 1]?.date || '').toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="p-0">
            <h6 className="text-lg font-bold text-gray-800">Progress Chart</h6>
            <p className="text-sm text-gray-600 opacity-70">Track your metrics over time</p>
          </div>
          <div className="flex space-x-2">
            {(['weight', 'bodyFat', 'muscleMass'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === metric
                    ? 'bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700'
                    : 'bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800'
                }`}
              >
                {metric === 'weight' ? 'Weight' : metric === 'bodyFat' ? 'Body Fat' : 'Muscle Mass'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="mt-4 p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
          {progressData.length > 0 ? (
            <div className="h-64 flex items-end justify-between space-x-2">
              {progressData.map((entry, index) => {
              const value = getMetricValue(entry);
              const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-[#ecf0f3] rounded-t-lg relative h-full flex items-end" style={{boxShadow: 'inset 2px 2px 4px #cbced1, inset -2px -2px 4px #ffffff'}}>
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all"
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 opacity-70 mt-2 text-center">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs font-medium text-gray-800 mt-1">
                    {value.toFixed(1)}
                  </div>
                </div>
              );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-600 opacity-70">
              <p>No progress data available</p>
            </div>
          )}
          <div className="text-center text-sm text-gray-600 opacity-70 mt-4">
            {getMetricLabel()}
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
        <div className="p-0 mb-4">
          <h6 className="text-lg font-bold text-gray-800">Recent Progress Logs</h6>
          <p className="text-sm text-gray-600 opacity-70">Your progress history</p>
        </div>
        <div className="space-y-3">
          {progressData.slice().reverse().map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]"
            >
              <div>
                <div className="font-medium text-gray-800">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-sm text-gray-600 opacity-70 mt-1">
                  Weight: {entry.weight}kg • Body Fat: {entry.bodyFat}% • Muscle Mass: {entry.muscleMass}kg
                </div>
              </div>
              <button className="text-blue-700 hover:underline text-sm">
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

