// components/member/dashboard/StatsCards.tsx
import React from 'react';
import { 
  MdCalendarToday, 
  MdEventAvailable, 
  MdFitnessCenter, 
  MdEmojiEvents 
} from 'react-icons/md';
import { IconType } from 'react-icons';
import { DashboardStats } from '@/types/member';

interface StatsCardsProps {
  data: DashboardStats;
}

interface CardData {
  title: string;
  value: string | number;
  icon: IconType;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  description: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const cards: CardData[] = [
    {
      title: 'Active Days',
      value: data.activeDays,
      icon: MdCalendarToday,
      color: 'blue',
      description: 'Days since joining'
    },
    {
      title: 'Days Remaining',
      value: data.daysRemaining,
      icon: MdEventAvailable,
      color: 'green',
      description: 'Subscription expiry'
    },
    {
      title: 'Workouts This Week',
      value: `${data.workoutsThisWeek.completed}/${data.workoutsThisWeek.total}`,
      icon: MdFitnessCenter,
      color: 'purple',
      description: 'Completed workouts'
    },
    {
      title: 'Contests Joined',
      value: data.contestsJoined,
      icon: MdEmojiEvents,
      color: 'yellow',
      description: 'Active contests'
    }
  ];

  const iconBgColors = {
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    purple: 'bg-purple-200',
    yellow: 'bg-yellow-200'
  };

  const iconTextColors = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    purple: 'text-purple-800',
    yellow: 'text-yellow-800'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, index) => (
        <div key={index} className="p-8 text-center rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:scale-[1.01] flex flex-col items-center">
          {/* Icon Circle (Inner pressed circle) */}
          <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#ecf0f3] p-1.5"
               style={{boxShadow: 'inset 4px 4px 8px #cbced1, inset -4px -4px 8px #ffffff'}}>
            <div className={`w-full h-full flex items-center justify-center rounded-full ${iconBgColors[card.color]} ${iconTextColors[card.color]}`}>
              <card.icon className="text-2xl" />
            </div>
          </div>
          
          {/* Value */}
          <h3 className="text-4xl font-extrabold text-gray-800 mb-1 drop-shadow-[1px_1px_0px_#fff]">
            {card.value}
          </h3>
          
          {/* Title */}
          <h6 className="text-sm font-semibold text-gray-600 opacity-80 mb-1">
            {card.title}
          </h6>
          
          {/* Description */}
          <p className="text-xs text-gray-600 opacity-60">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

