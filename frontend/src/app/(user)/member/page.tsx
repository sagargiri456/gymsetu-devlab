// app/member/page.tsx
import React from 'react';
import StatsCards from '@/components/member/dashboard/StatsCards';
import TodaysSchedule from '@/components/member/dashboard/TodaysSchedule';
import ProgressCharts from '@/components/member/dashboard/ProgressCharts';
import QuickActions from '@/components/member/dashboard/QuickActions';
import { Member, DashboardStats } from '@/types/member';

// Mock data - replace with actual API calls
const memberData: Member = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  subscription: {
    status: 'Active',
    daysRemaining: 45,
    plan: 'Premium',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  stats: {
    weight: 75,
    height: 180,
    bmi: 23.1,
    joinDate: '2024-01-01'
  }
};

const statsData: DashboardStats = {
  activeDays: 120,
  daysRemaining: 45,
  workoutsThisWeek: { completed: 4, total: 5 },
  contestsJoined: 3
};

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {memberData.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here&apos;s your fitness overview for today
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {memberData.subscription.status} • {memberData.subscription.daysRemaining} days left
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {memberData.stats.weight}kg • {memberData.stats.height}cm • BMI: {memberData.stats.bmi}
            </p>
          </div>
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