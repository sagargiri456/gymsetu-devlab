// components/member/dashboard/StatsCards.tsx
import React from 'react';
import { DashboardStats } from '@/types/member';

interface StatsCardsProps {
  data: DashboardStats;
}

interface CardData {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  description: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const cards: CardData[] = [
    {
      title: 'Active Days',
      value: data.activeDays,
      icon: 'calendar_today',
      color: 'blue',
      description: 'Days since joining'
    },
    {
      title: 'Days Remaining',
      value: data.daysRemaining,
      icon: 'event_available',
      color: 'green',
      description: 'Subscription expiry'
    },
    {
      title: 'Workouts This Week',
      value: `${data.workoutsThisWeek.completed}/${data.workoutsThisWeek.total}`,
      icon: 'fitness_center',
      color: 'purple',
      description: 'Completed workouts'
    },
    {
      title: 'Contests Joined',
      value: data.contestsJoined,
      icon: 'emoji_events',
      color: 'yellow',
      description: 'Active contests'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {card.description}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[card.color]} bg-opacity-10`}>
              <span className={`material-icons text-${card.color}-500`}>
                {card.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

