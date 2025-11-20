"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdAddCircleOutline } from "react-icons/md";
import Modal from "../../components/Modal";
import { getApiUrl } from "@/lib/api";
import { getToken, isMember } from "@/lib/auth";

// Sample gyms removed - using API data instead

// Sample data will be replaced by API fetch

interface Contest {
  id: number;
  name: string;
  description: string;
  banner_link: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  gym_id: number;
  // Additional fields for display
  gym_name?: string;
}

interface ContestCardProps {
  contest: Contest;
  isRegistered?: boolean;
  onParticipate?: (contestId: number) => void;
  isParticipating?: boolean;
}

const ContestCard = ({ contest, isRegistered = false, onParticipate, isParticipating = false }: ContestCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleParticipate = () => {
    if (onParticipate) {
      onParticipate(contest.id);
    }
  };

  return (
    <div className="bg-gray-100 rounded-3xl p-4 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300">
      <Image
        src={contest.banner_link}
        alt={contest.name}
        width={400}
        height={160}
        className="w-full h-40 object-cover rounded-2xl mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-700">{contest.name}</h3>
      <p className="text-gray-500 text-sm mt-1">{contest.description}</p>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Start:</span> {formatDate(contest.start_date)}
        </p>
        <p className="text-xs text-gray-600">
          <span className="font-medium">End:</span> {formatDate(contest.end_date)}
        </p>
        <p className="text-xs text-gray-600">
          <span className="font-medium">Gym:</span> {contest.gym_name}
        </p>
      </div>
      {onParticipate && (
        <div className="mt-4">
          {isRegistered ? (
            <button
              disabled
              className="w-full px-4 py-2 rounded-xl bg-green-500 text-white font-medium shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] cursor-not-allowed opacity-75"
            >
              Registered ✓
            </button>
          ) : (
            <button
              onClick={handleParticipate}
              disabled={isParticipating}
              className="w-full px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#4b4bff,inset_-3px_-3px_6px_#6b6bff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParticipating ? 'Participating...' : 'Participate'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ContestsPage: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"ongoing" | "upcoming">("ongoing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contests, setContests] = useState<{ongoing: Contest[], upcoming: Contest[]}>({ongoing: [], upcoming: []});
  const [loading, setLoading] = useState(true);
  const [registeredContests, setRegisteredContests] = useState<Set<number>>(new Set());
  const [participatingContestId, setParticipatingContestId] = useState<number | null>(null);
  const [isMemberUser, setIsMemberUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner_link: "",
    start_date: "",
    end_date: "",
    type: "ongoing" as "ongoing" | "upcoming",
  });

  // Check if user is a member
  useEffect(() => {
    setIsMemberUser(isMember());
  }, []);

  // Fetch registration status for all contests (if member)
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!isMemberUser) return;
      
      const token = getToken();
      if (!token) return;
      
      const allContests = [...contests.ongoing, ...contests.upcoming];
      const registered = new Set<number>();
      
      // Check registration status for each contest
      for (const contest of allContests) {
        try {
          const response = await fetch(
            getApiUrl(`api/participants/check_registration?contest_id=${contest.id}`),
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.is_registered) {
              registered.add(contest.id);
            }
          }
        } catch (error) {
          console.error(`Failed to check registration for contest ${contest.id}:`, error);
        }
      }
      
      setRegisteredContests(registered);
    };

    if (contests.ongoing.length > 0 || contests.upcoming.length > 0) {
      fetchRegistrationStatus();
    }
  }, [contests, isMemberUser]);

  // Fetch contests data from backend
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const apiUrl = getApiUrl("api/contest/get_all_contests");
        console.log("Fetching contests from:", apiUrl);
        console.log("Authorization token:", token ? "Present" : "Missing");
        
        if (!token) {
          console.error("No access token found. Please login again.");
          setContests({ ongoing: [], upcoming: [] });
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
          if (data.success && data.contests) {
            // Separate contests into ongoing and upcoming based on dates
            const now = new Date();
            const ongoing: Contest[] = [];
            const upcoming: Contest[] = [];
            
            data.contests.forEach((contest: Contest) => {
              const startDate = new Date(contest.start_date);
              const endDate = new Date(contest.end_date);
              
              if (startDate <= now && endDate >= now) {
                ongoing.push(contest);
              } else if (startDate > now) {
                upcoming.push(contest);
              }
            });
            
            setContests({ ongoing, upcoming });
          } else {
            console.log("No contests data found in response");
            setContests({ ongoing: [], upcoming: [] });
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch contests:", response.status, response.statusText);
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
            } catch {
              // Ignore parsing errors
            }
            localStorage.removeItem("access_token");
            router.push("/login");
            return;
          }
          
          // If it's a 400 or 404 error, the API might not exist yet
          if (response.status === 400 || response.status === 404) {
            console.log("API endpoint might not exist yet. Using empty arrays as fallback.");
            setContests({ ongoing: [], upcoming: [] });
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipate = async (contestId: number) => {
    if (!isMemberUser) {
      alert("Only members can participate in contests.");
      return;
    }

    try {
      setParticipatingContestId(contestId);
      const token = getToken();
      
      if (!token) {
        alert("Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(getApiUrl("api/participants/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ contest_id: contestId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Mark contest as registered
          setRegisteredContests(prev => new Set([...prev, contestId]));
          alert("Successfully registered for contest! You will now appear on the leaderboard.");
        } else {
          alert(data.message || "Failed to register for contest");
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to register" }));
        alert(errorData.message || "Failed to register for contest");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    } finally {
      setParticipatingContestId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(getApiUrl("api/contest/add_contest"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          banner_link: formData.banner_link || null,
          start_date: new Date(formData.start_date).toISOString(),
          end_date: new Date(formData.end_date).toISOString(),
        }),
      });
      
        if (response.ok) {
          const data = await response.json();
          console.log("Add contest response:", data);
          
          // Reload contests from backend to get the updated list
          const token = localStorage.getItem("access_token");
          const refreshResponse = await fetch(getApiUrl("api/contest/get_all_contests"), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.contests) {
              // Separate contests into ongoing and upcoming based on dates
              const now = new Date();
              const ongoing: Contest[] = [];
              const upcoming: Contest[] = [];
              
              refreshData.contests.forEach((contest: Contest) => {
                const startDate = new Date(contest.start_date);
                const endDate = new Date(contest.end_date);
                
                if (startDate <= now && endDate >= now) {
                  ongoing.push(contest);
                } else if (startDate > now) {
                  upcoming.push(contest);
                }
              });
              
              setContests({ ongoing, upcoming });
            }
          }
          
          setFormData({
            name: "",
            description: "",
            banner_link: "",
            start_date: "",
            end_date: "",
            type: "ongoing",
          });
          setIsModalOpen(false);
          alert("Contest added successfully!");
        } else {
          let errorMessage = "Failed to add contest";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.msg || errorMessage;
          } catch {
            errorMessage = response.statusText || errorMessage;
          }
          console.error("Failed to add contest:", response.status, response.statusText);
          alert(`Failed to add contest: ${errorMessage}`);
        }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    }
  };

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 sm:p-8 lg:p-12 min-h-screen bg-[#ecf0f3] flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-between items-center mb-8 lg:mb-12 mt-4 lg:mt-6 gap-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-700 tracking-tight">
          Contests
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-white bg-indigo-500 hover:bg-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 w-full lg:w-auto min-w-[180px]"
        >
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
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="text-gray-500">Loading contests...</div>
          </div>
        ) : contests[tab].length > 0 ? (
          contests[tab].map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              isRegistered={registeredContests.has(contest.id)}
              onParticipate={isMemberUser ? handleParticipate : undefined}
              isParticipating={participatingContestId === contest.id}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="text-gray-500">No {tab} contests found.</div>
          </div>
        )}
      </div>

      {/* Add Contest Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Contest"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contest Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image URL (optional)
            </label>
            <input
              type="url"
              name="banner_link"
              value={formData.banner_link}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contest Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="ongoing">Ongoing Contest</option>
              <option value="upcoming">Upcoming Contest</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Contest
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContestsPage;
