"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdEmojiEvents, MdStar, MdWorkspacePremium } from "react-icons/md";
import { getApiUrl } from "@/lib/api";

// Contest interface
interface Contest {
  id: number;
  name: string;
  description: string;
  banner_link: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  gym_id: number;
}

// Leaderboard entry interface
interface LeaderboardEntry {
  id: number;
  member_id: number;
  contest_id: number;
  contest_rank: number;
  participant_status: string;
  member_name: string;
  score: number;
}

const LeaderboardPage: React.FC = () => {
  const router = useRouter();
  const [contest, setContest] = useState<Contest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const apiUrl = getApiUrl("api/contest/get_leaderboard");
        console.log("Fetching leaderboard from:", apiUrl);
        console.log("Authorization token:", token ? "Present" : "Missing");
        
        if (!token) {
          console.error("No access token found. Please login again.");
          setLoading(false);
          return;
        }
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.contest && data.leaderboard) {
            setContest(data.contest);
            setLeaderboard(data.leaderboard);
          } else {
            console.log("No leaderboard data found in response");
            setLeaderboard([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch leaderboard:", response.status, response.statusText);
          console.error("Error response:", errorText);
          
          // Check if it's an auth error
          if (response.status === 401) {
            try {
              const parsed = JSON.parse(errorText);
              if (parsed?.msg?.toLowerCase().includes("subject must be a string") || parsed?.msg || parsed?.message) {
                localStorage.removeItem("access_token");
                router.push("/login");
                return;
              }
            } catch (_) {}
            localStorage.removeItem("access_token");
            router.push("/login");
            return;
          }
          
          // If it's a 404 error, no contests/participants exist
          if (response.status === 404) {
            console.log("No contests or leaderboard data available.");
            setLeaderboard([]);
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [router]);

  // Default prizes if contest data is not available
  const prizes = ["🏅 1st: ₹5000 + Free Gym Month", "🥈 2nd: ₹3000", "🥉 3rd: ₹1000"];
  const defaultBanner = "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1000&q=80";

  if (loading) {
    return (
      <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3] flex flex-col items-center justify-center">
        <div className="text-gray-500">Loading leaderboard...</div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3] flex flex-col items-center justify-center">
        <div className="text-gray-500">No contest found. Please create a contest first.</div>
      </div>
    );
  }

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3] flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      {/* Contest Header */}
      <div className="w-full max-w-5xl bg-gray-100 rounded-3xl p-6 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]">
        <Image
          src={contest.banner_link || defaultBanner}
          alt={contest.name}
          width={1000}
          height={224}
          className="w-full h-56 object-cover rounded-2xl mb-5"
        />
        <h1 className="text-3xl font-bold text-gray-700 mb-2 flex items-center gap-2">
          <MdEmojiEvents className="text-indigo-500" /> {contest.name}
        </h1>
        <p className="text-gray-600 mb-4">{contest.description}</p>
        <div className="flex flex-col md:flex-row gap-4 text-gray-700">
          {prizes.map((p, i) => (
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
      {leaderboard.length >= 3 && (
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
                {p.member_name.charAt(0)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{p.member_name}</h3>
            <p className="text-gray-500 text-sm">Score: {p.score}</p>
            <div className="mt-2 text-indigo-500 flex items-center gap-1">
              {index === 0 && <MdWorkspacePremium size={20} />}
              {index === 1 && <MdStar size={20} />}
              {index === 2 && <MdEmojiEvents size={20} />}
              <span className="font-medium">Rank #{p.contest_rank}</span>
            </div>
          </div>
          ))}
        </div>
      )}

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
            {leaderboard.length > 0 ? (
              leaderboard.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-6 font-medium text-gray-700">
                  #{p.contest_rank}
                </td>
                <td className="py-3 px-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shadow-inner overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-sm rounded-full">
                      {p.member_name.charAt(0)}
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">{p.member_name}</span>
                </td>
                <td className="py-3 px-6 text-gray-700">{p.score}</td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 px-6 text-center text-gray-500">
                  No participants yet. Be the first to join!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
