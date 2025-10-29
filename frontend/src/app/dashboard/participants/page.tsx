"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdMoreVert,
  MdPerson,
} from "react-icons/md";
import Modal from "../../components/Modal";
import { getApiUrl } from "@/lib/api";

// --- Participant Interface based on backend model ---
interface Participant {
  id: number;
  member_id: number;
  contest_id: number;
  contest_rank: number;
  created_at: string;
  updated_at: string;
  gym_id: number;
  participant_status: string;
  // Additional fields for display
  member_name?: string;
  contest_title?: string;
}

// --- Status Badge Component ---
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'participating':
        return "text-green-700";
      case 'inactive':
      case 'disqualified':
        return "text-red-700";
      case 'pending':
        return "text-yellow-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)} bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]`}
    >
      {status}
    </span>
  );
};

// Sample data will be replaced by API fetch

// --- Sample Members and Contests for dropdowns ---
const members = [
  { id: 1, name: "Mark Johnson" },
  { id: 2, name: "Sarah Wilson" },
  { id: 3, name: "Mike Chen" },
  { id: 4, name: "Emma Davis" },
  { id: 5, name: "David Brown" },
  { id: 6, name: "Lisa Anderson" },
  { id: 7, name: "Tom Wilson" },
];

const contests = [
  { id: 1, title: "Summer Strength Challenge" },
  { id: 2, title: "Cardio Marathon Week" },
  { id: 3, title: "Flexibility Challenge" },
];

const ParticipantsPage: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participantsList, setParticipantsList] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    member_id: "",
    contest_id: "",
    contest_rank: "",
    gym_id: 1,
    participant_status: "Active",
  });

  const headers = [
    "Member",
    "Contest",
    "Rank",
    "Status",
    "Gym ID",
    "Created",
    "Updated",
  ];

  // Fetch participants data from backend
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(getApiUrl("api/participants/get_participants"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.participants) {
            setParticipantsList(data.participants);
          } else {
            console.log("No participants data found in response");
            setParticipantsList([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch participants:", response.status, response.statusText);
          console.error("Error response:", errorText);
          
          // Check if it's an auth error
          if (response.status === 401) {
            try {
              const parsed = JSON.parse(errorText);
              if (parsed?.msg?.toLowerCase().includes("subject must be a string") || parsed?.msg) {
                localStorage.removeItem("access_token");
                router.push("/login");
                return;
              }
            } catch (_) {}
            localStorage.removeItem("access_token");
            router.push("/login");
            return;
          }
          
          // If it's a 400 or 404 error, the API might not exist yet
          if (response.status === 400 || response.status === 404) {
            console.log("API endpoint might not exist yet. Using empty array as fallback.");
            setParticipantsList([]);
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gym_id' || name === 'member_id' || name === 'contest_id' || name === 'contest_rank' 
        ? parseInt(value) || (name === 'gym_id' ? 1 : 0) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newParticipant: Participant = {
      id: participantsList.length + 1,
      member_id: parseInt(formData.member_id),
      contest_id: parseInt(formData.contest_id),
      contest_rank: parseInt(formData.contest_rank),
      gym_id: formData.gym_id,
      participant_status: formData.participant_status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_name: members.find(m => m.id === parseInt(formData.member_id))?.name || "",
      contest_title: contests.find(c => c.id === parseInt(formData.contest_id))?.title || "",
    };

    try {
      const response = await fetch(getApiUrl("api/participants/add_participant"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          member_id: newParticipant.member_id,
          contest_id: newParticipant.contest_id,
          contest_rank: newParticipant.contest_rank,
          gym_id: newParticipant.gym_id,
          participant_status: newParticipant.participant_status,
        }),
      });
      
        if (response.ok) {
          const data = await response.json();
          console.log("Add participant response:", data);
          if (data.success && data.participant) {
            // Use the participant data returned from backend
            setParticipantsList(prev => [...prev, data.participant]);
          } else {
            // Fallback to using the newParticipant we created
            setParticipantsList(prev => [...prev, newParticipant]);
          }
          setFormData({
            member_id: "",
            contest_id: "",
            contest_rank: "",
            gym_id: 1,
            participant_status: "Active",
          });
          setIsModalOpen(false);
          alert("Participant added successfully!");
        } else {
          const errorData = await response.json();
          console.error("Failed to add participant:", response.status, response.statusText);
          console.error("Error response:", errorData);
          alert(`Failed to add participant: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 sm:p-8 lg:p-12 min-h-screen bg-[#ecf0f3]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 gap-6 px-2">
        <h4 className="text-2xl lg:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Participants
        </h4>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 min-w-[160px] shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} className="mr-2" />
          Add Participant
        </button>
      </div>

      {/* Card */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-6 lg:p-8 gap-6">
          <div className="relative flex items-center w-full lg:w-80 rounded-full px-5 py-3 bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <MdSearch size={20} className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search participant..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          <button className="p-4 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all text-gray-600 w-full lg:w-auto">
            <MdFilterList size={22} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading participants...</div>
            </div>
          ) : (
            <table className="min-w-full text-sm text-gray-700">
              <thead className="text-gray-700 uppercase bg-[#ecf0f3] border-b border-gray-300">
                <tr>
                  <th className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                  </th>
                  <th></th>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left font-semibold tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {participantsList.map((participant) => (
                <tr
                  key={participant.id}
                  className="border-b border-gray-200 hover:bg-[#d8d8d8] transition-all"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ecf0f3] shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]">
                      <MdPerson
                        size={22}
                        className="text-gray-600"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{participant.member_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{participant.contest_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">#{participant.contest_rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={participant.participant_status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{participant.gym_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(participant.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(participant.updated_at)}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button className="p-2 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all">
                      <MdMoreVert size={18} className="text-gray-700" />
                    </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end p-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 mr-6">Rows per page: 5</p>
          <p className="text-sm text-gray-600 mr-8">1–5 of 5</p>
          <div className="flex space-x-2">
            <button
              disabled
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-700 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] disabled:text-gray-400 disabled:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdKeyboardArrowLeft size={20} />
            </button>
            <button
              disabled
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-700 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] disabled:text-gray-400 disabled:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Participant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Participant"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member
              </label>
              <select
                name="member_id"
                value={formData.member_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest
              </label>
              <select
                name="contest_id"
                value={formData.contest_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Contest</option>
                {contests.map((contest) => (
                  <option key={contest.id} value={contest.id}>
                    {contest.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Rank
              </label>
              <input
                type="number"
                name="contest_rank"
                value={formData.contest_rank}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="participant_status"
                value={formData.participant_status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Disqualified">Disqualified</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gym ID
            </label>
            <input
              type="number"
              name="gym_id"
              value={formData.gym_id}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Participant
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ParticipantsPage;

