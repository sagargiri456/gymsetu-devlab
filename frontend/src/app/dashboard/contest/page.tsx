"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdAddCircleOutline } from "react-icons/md";

const contestsData = {
  ongoing: [
    {
      id: 1,
      title: "Summer Strength Challenge",
      banner: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=60",
      description: "Compete to lift your limits and earn rewards!",
    },
    {
      id: 2,
      title: "Cardio Marathon Week",
      banner: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=60",
      description: "Push your endurance and top the leaderboard.",
    },
  ],
  upcoming: [
    {
      id: 3,
      title: "Flexibility Challenge",
      banner: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=60",
      description: "Test your stretching power and balance.",
    },
  ],
};

interface Contest {
  id: number;
  title: string;
  banner: string;
  description: string;
}

const ContestCard = ({ contest }: { contest: Contest }) => (
  <div className="bg-gray-100 rounded-3xl p-4 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 cursor-pointer">
    <Image
      src={contest.banner}
      alt={contest.title}
      width={400}
      height={160}
      className="w-full h-40 object-cover rounded-2xl mb-3"
    />
    <h3 className="text-lg font-semibold text-gray-700">{contest.title}</h3>
    <p className="text-gray-500 text-sm mt-1">{contest.description}</p>
  </div>
);

const ContestsPage: React.FC = () => {
  const [tab, setTab] = useState<"ongoing" | "upcoming">("ongoing");

  return (
    <div className="ml-0 lg:ml-64 pt-16 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3] flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 tracking-tight">
          Contests
        </h1>
        <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-medium text-white bg-indigo-500 hover:bg-indigo-600 shadow-[5px_5px_15px_#c2cbe0,-5px_-5px_15px_#ffffff] transition-all duration-300 w-full sm:w-auto">
          <MdAddCircleOutline size={22} />
          Create Contest
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        {["ongoing", "upcoming"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as "ongoing" | "upcoming")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              tab === t
                ? "bg-indigo-500 text-white shadow-[inset_3px_3px_6px_#4b4bff,inset_-3px_-3px_6px_#6b6bff]"
                : "bg-gray-100 text-gray-600 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:text-indigo-500"
            }`}
          >
            {t === "ongoing" ? "Ongoing Contests" : "Upcoming Contests"}
          </button>
        ))}
      </div>

      {/* Contest Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl">
        {contestsData[tab].map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </div>
  );
};

export default ContestsPage;
