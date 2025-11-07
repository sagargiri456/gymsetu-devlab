// app/member/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { HiOutlineHand } from 'react-icons/hi';
import StatsCards from '@/components/member/dashboard/StatsCards';
import TodaysSchedule from '@/components/member/dashboard/TodaysSchedule';
import ProgressCharts from '@/components/member/dashboard/ProgressCharts';
import QuickActions from '@/components/member/dashboard/QuickActions';
import { Member, DashboardStats } from '@/types/member';
import { fetchMemberDashboard } from '@/lib/memberApi';

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMemberDashboard();
        
        // Transform API response to match our types
        if (data.member) {
          setMemberData(data.member);
        }
        if (data.stats) {
          setStatsData(data.stats);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        
        // Fallback to default data if API fails
        setMemberData({
          id: '1',
          name: 'Member',
          email: 'member@example.com',
          subscription: {
            status: 'Active',
            daysRemaining: 0,
            plan: 'Basic',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
          },
          stats: {
            weight: 0,
            height: 0,
            bmi: 0,
            joinDate: new Date().toISOString().split('T')[0]
          }
        });
        setStatsData({
          activeDays: 0,
          daysRemaining: 0,
          workoutsThisWeek: { completed: 0, total: 0 },
          contestsJoined: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !memberData) {
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

  if (!memberData || !statsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8 mt-4 lg:mt-6">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff] flex items-center gap-2">
          Hi, Welcome back, {memberData.name}! <HiOutlineHand className="text-3xl text-blue-600" />
        </h4>
        <p className="text-gray-600 opacity-70 mt-2">
          Here&apos;s your fitness overview for today
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] text-green-700 text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {memberData.subscription.status} • {memberData.subscription.daysRemaining} days left
          </div>
          <p className="text-sm text-gray-600 opacity-70">
            {memberData.stats.weight}kg • {memberData.stats.height}cm • BMI: {memberData.stats.bmi.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards data={statsData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today&apos;s Schedule */}
        <TodaysSchedule />
        
        {/* Progress Charts */}
        <ProgressCharts />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}