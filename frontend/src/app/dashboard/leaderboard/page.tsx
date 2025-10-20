"use client";
import React from "react";
import Image from "next/image";
import { MdEmojiEvents, MdStar, MdWorkspacePremium } from "react-icons/md";

const contest = {
  title: "Summer Strength Challenge",
  banner:
    "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1000&q=80",
  description: "Push your limits and showcase your strength!",
  prizes: ["🏅 1st: ₹5000 + Free Gym Month", "🥈 2nd: ₹3000", "🥉 3rd: ₹1000"],
};

const leaderboard = [
  { id: 1, name: "Rohan Sharma", score: 980, rank: 1 },
  { id: 2, name: "Amit Patel", score: 950, rank: 2 },
  { id: 3, name: "Sanya Mehta", score: 930, rank: 3 },
  { id: 4, name: "Neha Singh", score: 890, rank: 4 },
  { id: 5, name: "Arjun Verma", score: 865, rank: 5 },
  { id: 6, name: "Tanya Kapoor", score: 840, rank: 6 },
];

const LeaderboardPage: React.FC = () => {
  return (
    <div className="ml-0 lg:ml-64 pt-16 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3] flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      {/* Contest Header */}
      <div className="w-full max-w-5xl bg-gray-100 rounded-3xl p-6 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]">
        <Image
          src={contest.banner}
          alt={contest.title}
          width={1000}
          height={224}
          className="w-full h-56 object-cover rounded-2xl mb-5"
        />
        <h1 className="text-3xl font-bold text-gray-700 mb-2 flex items-center gap-2">
          <MdEmojiEvents className="text-indigo-500" /> {contest.title}
        </h1>
        <p className="text-gray-600 mb-4">{contest.description}</p>
        <div className="flex flex-col md:flex-row gap-4 text-gray-700">
          {contest.prizes.map((p, i) => (
            <div
              key={i}
              className="flex-1 text-center p-3 rounded-2xl bg-gray-100 shadow-[3px_3px_8px_#d1d9e6,-3px_-3px_8px_#ffffff]"
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-3 gap-6">
        {leaderboard.slice(0, 3).map((p, index) => (
          <div
            key={p.id}
            className={`flex flex-col items-center justify-center rounded-3xl p-6 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] ${
              index === 0
                ? "scale-110 bg-indigo-50"
                : "bg-gray-100 hover:scale-105"
            } transition-all duration-300`}
          >
            <div className="w-20 h-20 rounded-full bg-gray-200 shadow-inner flex items-center justify-center mb-3 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-2xl rounded-full">
                {p.name.charAt(0)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{p.name}</h3>
            <p className="text-gray-500 text-sm">Score: {p.score}</p>
            <div className="mt-2 text-indigo-500 flex items-center gap-1">
              {index === 0 && <MdWorkspacePremium size={20} />}
              {index === 1 && <MdStar size={20} />}
              {index === 2 && <MdEmojiEvents size={20} />}
              <span className="font-medium">Rank #{p.rank}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="w-full max-w-5xl mt-12 bg-gray-100 rounded-3xl shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 bg-gray-50">
              <th className="py-4 px-6 font-semibold">Rank</th>
              <th className="py-4 px-6 font-semibold">Participant</th>
              <th className="py-4 px-6 font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6 font-medium text-gray-700">
                  #{p.rank}
                </td>
                <td className="py-3 px-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shadow-inner overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-sm rounded-full">
                      {p.name.charAt(0)}
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">{p.name}</span>
                </td>
                <td className="py-3 px-6 text-gray-700">{p.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
