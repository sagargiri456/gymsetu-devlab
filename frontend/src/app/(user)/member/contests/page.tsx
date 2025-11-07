// app/member/contests/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Contest } from '@/types/member';
import { fetchMemberContests } from '@/lib/memberApi';
import { getApiUrl } from '@/lib/api';

const ContestsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'joined'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    const loadContests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMemberContests();
        
        // Transform API response to match our types
        if (data.contests) {
          setContests(data.contests);
        } else if (Array.isArray(data)) {
          setContests(data);
        }
      } catch (err) {
        console.error('Error loading contests:', err);
        setError(err instanceof Error ? err.message : 'Failed to load contests');
        setContests([]);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  const filteredContests = contests.filter(contest => {
    if (filter === 'all') return true;
    if (filter === 'joined') return contest.joined;
    return contest.status === filter;
  });

  const handleJoinContest = async (contestId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login to join contests');
        return;
      }

      const response = await fetch(getApiUrl('api/participants/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contest_id: contestId }),
      });

      if (response.ok) {
        await response.json();
        alert('Successfully joined the contest!');
        // Reload contests to get updated data
        const contestsData = await fetchMemberContests();
        if (contestsData.contests) {
          setContests(contestsData.contests);
        } else if (Array.isArray(contestsData)) {
          setContests(contestsData);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.msg || 'Failed to join contest');
      }
    } catch (err) {
      console.error('Error joining contest:', err);
      alert('Failed to join contest. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contests...</p>
        </div>
      </div>
    );
  }

  if (error && contests.length === 0) {
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-200', text: 'text-blue-800', label: 'Upcoming' },
      ongoing: { bg: 'bg-green-200', text: 'text-green-800', label: 'Ongoing' },
      completed: { bg: 'bg-gray-200', text: 'text-gray-800', label: 'Completed' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff]`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 mt-4 lg:mt-6">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Contests & Challenges
        </h4>
        <p className="text-gray-600 opacity-70 mt-2">
          Join competitions and compete with other members
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-4">
        <div className="flex space-x-2">
          {(['all', 'upcoming', 'ongoing', 'joined'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterOption
                  ? 'bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700'
                  : 'bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800'
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
            className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                    {contest.name}
                  </h2>
                  {getStatusBadge(contest.status)}
                  {contest.joined && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800 shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff]">
                      Joined
                    </span>
                  )}
                </div>
                <p className="text-gray-600 opacity-80 mb-4">
                  {contest.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                    <div className="text-sm text-gray-600 opacity-70">Start Date</div>
                    <div className="font-medium text-gray-800">
                      {new Date(contest.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                    <div className="text-sm text-gray-600 opacity-70">End Date</div>
                    <div className="font-medium text-gray-800">
                      {new Date(contest.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                    <div className="text-sm text-gray-600 opacity-70">Participants</div>
                    <div className="font-medium text-gray-800">
                      {contest.participants}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                    <div className="text-sm text-gray-600 opacity-70">Prize</div>
                    <div className="font-medium text-gray-800">
                      {contest.prize}
                    </div>
                  </div>
                </div>
                {contest.joined && contest.myRank && (
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                    <div>
                      <div className="text-sm text-gray-600 opacity-70">Your Rank</div>
                      <div className="text-2xl font-bold text-green-700 drop-shadow-[1px_1px_0px_#fff]">
                        #{contest.myRank}
                      </div>
                    </div>
                    {contest.myScore && (
                      <div>
                        <div className="text-sm text-gray-600 opacity-70">Your Score</div>
                        <div className="text-2xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
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
                    onClick={() => handleJoinContest(contest.id)}
                    className="px-6 py-3 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700 rounded-lg transition-all font-medium"
                  >
                    Join Contest
                  </button>
                )}
                {contest.joined && contest.status === 'ongoing' && (
                  <button className="px-6 py-3 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg transition-all font-medium">
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContests.length === 0 && (
        <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-12 text-center">
          <span className="material-icons text-6xl text-gray-400 mb-4">emoji_events</span>
          <p className="text-gray-600 opacity-70">No contests found</p>
        </div>
      )}
    </div>
  );
};

export default ContestsPage;

