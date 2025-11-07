// app/member/contests/page.tsx
'use client';

import React, { useState } from 'react';
import { Contest } from '@/types/member';

const ContestsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'joined'>('all');

  // Mock contests data
  const contests: Contest[] = [
    {
      id: '1',
      name: '30-Day Transformation Challenge',
      description: 'Complete 30 days of consistent workouts and nutrition tracking. Winners will be selected based on commitment and results.',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      status: 'ongoing',
      participants: 45,
      prize: '$500 + Free 3-month membership',
      joined: true,
      myRank: 12,
      myScore: 850
    },
    {
      id: '2',
      name: 'New Year Fitness Challenge',
      description: 'Start the new year strong! Join our January fitness challenge and compete for amazing prizes.',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      status: 'upcoming',
      participants: 28,
      prize: '$1000 + Premium membership',
      joined: false
    },
    {
      id: '3',
      name: 'Strength Competition',
      description: 'Test your strength! Compete in bench press, squat, and deadlift competitions.',
      startDate: '2024-11-15',
      endDate: '2024-12-15',
      status: 'completed',
      participants: 60,
      prize: 'Trophy + $300',
      joined: true,
      myRank: 5,
      myScore: 1200
    }
  ];

  const filteredContests = contests.filter(contest => {
    if (filter === 'all') return true;
    if (filter === 'joined') return contest.joined;
    return contest.status === filter;
  });

  const handleJoinContest = () => {
    alert('Successfully joined the contest!');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'Upcoming' },
      ongoing: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Ongoing' },
      completed: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', label: 'Completed' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contests & Challenges
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Join competitions and compete with other members
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex space-x-2">
          {(['all', 'upcoming', 'ongoing', 'joined'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contests List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredContests.map((contest: Contest) => (
          <div
            key={contest.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {contest.name}
                  </h2>
                  {getStatusBadge(contest.status)}
                  {contest.joined && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      Joined
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {contest.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Start Date</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(contest.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">End Date</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(contest.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Participants</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {contest.participants}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Prize</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {contest.prize}
                    </div>
                  </div>
                </div>
                {contest.joined && contest.myRank && (
                  <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Your Rank</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        #{contest.myRank}
                      </div>
                    </div>
                    {contest.myScore && (
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Your Score</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {contest.myScore}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="ml-6">
                {!contest.joined && contest.status !== 'completed' && (
                  <button
                    onClick={handleJoinContest}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Join Contest
                  </button>
                )}
                {contest.joined && contest.status === 'ongoing' && (
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContests.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <span className="material-icons text-6xl text-gray-400 mb-4">emoji_events</span>
          <p className="text-gray-500 dark:text-gray-400">No contests found</p>
        </div>
      )}
    </div>
  );
};

export default ContestsPage;

