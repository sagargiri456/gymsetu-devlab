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
  MdPeople,
} from "react-icons/md";
import Modal from "../../components/Modal";
import { getApiUrl } from "@/lib/api";

// Utility function for date formatting
const formatDate = (dateString: string): string => {
  // Use 'short' month for brevity in the table
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// --- Neomorphic Status Badge ---
const StatusBadge: React.FC<{ status: 'active' | string }> = ({ status }) => {
  const isActive = status === "active";
  const statusDisplay = isActive ? "Active" : "Expired";
  
  // Neumorphic inset shadow for a "pressed" look
  const baseShadow =
    "shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase ${
        isActive
          ? "text-green-700"
          : "text-red-700"
      } bg-[#ecf0f3] ${baseShadow}`}
    >
      {statusDisplay}
    </span>
  );
};

// --- Subscription Interface based on backend model ---
interface SubscriptionData {
  id: number;
  member_id: number;
  gym_id: number;
  subscription_plan: string;
  subscription_status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  // Additional fields for display
  member_name?: string;
  gym_name?: string;
}

// Sample members and gyms for dropdowns
const members = [
  { id: 1, name: "Alex Johnson" },
  { id: 2, name: "Maria Gomez" },
  { id: 3, name: "Samir Khan" },
  { id: 4, name: "Emily Wang" },
  { id: 5, name: "Chris Lee" },
  { id: 6, name: "Lisa Anderson" },
  { id: 7, name: "Tom Wilson" },
];

const gyms = [
  { id: 1, name: "Main Gym" },
  { id: 2, name: "Branch Gym" },
  { id: 3, name: "Premium Gym" },
];

// Sample data will be replaced by API fetch

const SubscriptionsPage: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionsList, setSubscriptionsList] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    member_id: "",
    gym_id: "",
    subscription_plan: "",
    subscription_status: "active",
    start_date: "",
    end_date: "",
  });

  const tableHeaders = [
    "ID",
    "Member",
    "Gym",
    "Plan",
    "Start Date",
    "End Date",
    "Status",
  ];

  const totalRecords = subscriptionsList.length;
  const rowsPerPage = 5;
  const currentPage = 1; // For pagination display only
  const startRange = (currentPage - 1) * rowsPerPage + 1;
  const endRange = Math.min(currentPage * rowsPerPage, totalRecords);

  // Fetch subscriptions data from backend
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const apiUrl = getApiUrl("api/subscription/get_all_subscriptions");
        console.log("Fetching subscriptions from:", apiUrl);
        console.log("Authorization token:", token ? "Present" : "Missing");
        
        if (!token) {
          console.error("No access token found. Please login again.");
          setSubscriptionsList([]);
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
          if (data.success && data.subscriptions) {
            setSubscriptionsList(data.subscriptions);
          } else {
            console.log("No subscriptions data found in response");
            setSubscriptionsList([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch subscriptions:", response.status, response.statusText);
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
            console.log("API endpoint might not exist yet. Using empty array as fallback.");
            setSubscriptionsList([]);
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'member_id' || name === 'gym_id' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSubscription: SubscriptionData = {
      id: Math.max(...subscriptionsList.map(s => s.id)) + 1,
      member_id: parseInt(formData.member_id),
      gym_id: parseInt(formData.gym_id),
      subscription_plan: formData.subscription_plan,
      subscription_status: formData.subscription_status,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      created_at: new Date().toISOString(),
      member_name: members.find(m => m.id === parseInt(formData.member_id))?.name || "",
      gym_name: gyms.find(g => g.id === parseInt(formData.gym_id))?.name || "",
    };

    try {
      const response = await fetch(getApiUrl("api/subscriptions/add_subscription"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          member_id: newSubscription.member_id,
          gym_id: newSubscription.gym_id,
          subscription_plan: newSubscription.subscription_plan,
          subscription_status: newSubscription.subscription_status,
          start_date: newSubscription.start_date,
          end_date: newSubscription.end_date,
        }),
      });
      
        if (response.ok) {
          const data = await response.json();
          console.log("Add subscription response:", data);
          if (data.success && data.subscription) {
            // Use the subscription data returned from backend
            setSubscriptionsList(prev => [...prev, data.subscription]);
          } else {
            // Fallback to using the newSubscription we created
            setSubscriptionsList(prev => [...prev, newSubscription]);
          }
          setFormData({
            member_id: "",
            gym_id: "",
            subscription_plan: "",
            subscription_status: "active",
            start_date: "",
            end_date: "",
          });
          setIsModalOpen(false);
          alert("Subscription added successfully!");
        } else {
          const errorData = await response.json();
          console.error("Failed to add subscription:", response.status, response.statusText);
          console.error("Error response:", errorData);
          alert(`Failed to add subscription: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    }
  };

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 sm:p-8 lg:p-12 min-h-screen bg-[#ecf0f3]">
      
      {/* Header and Add Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 mt-4 lg:mt-6 gap-6 px-2">
        <h4 className="text-2xl lg:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Subscriptions
        </h4>

        {/* New Subscription Button - Neumorphic Button Style */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 min-w-[180px] shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} className="mr-2" />
          New Subscription
        </button>
      </div>

      {/* Table Card - Neumorphic Card Style */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
        
        {/* Search + Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 lg:p-6 gap-4">
          {/* Search Box - Neumorphic Inset Style */}
          <div className="relative flex items-center w-full lg:w-72 rounded-full px-4 py-2 bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <MdSearch size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Filter Button - Neumorphic Icon Button Style */}
          <button className="p-3 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all text-gray-600 w-full lg:w-auto">
            <MdFilterList size={22} />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading subscriptions...</div>
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
                  {tableHeaders.map((h) => (
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
                {subscriptionsList.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-gray-200 hover:bg-[#d8d8d8] transition-all"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{sub.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
                        <MdPeople size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{sub.member_name}</span>
                        <p className="text-xs text-gray-500">ID: {sub.member_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="font-medium text-gray-800">{sub.gym_name}</span>
                      <p className="text-xs text-gray-500">ID: {sub.gym_id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sub.subscription_plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(sub.start_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(sub.end_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={sub.subscription_status} />
                  </td>
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
          <p className="text-sm text-gray-600 mr-6">Rows per page: {rowsPerPage}</p>
          <p className="text-sm text-gray-600 mr-8">{startRange}–{endRange} of {totalRecords}</p>
          <div className="flex space-x-2">
            {/* Previous Page Button - Neumorphic Icon Button Style */}
            <button
              disabled={startRange === 1}
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-700 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] disabled:text-gray-400 disabled:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdKeyboardArrowLeft size={20} />
            </button>
            {/* Next Page Button - Neumorphic Icon Button Style */}
            <button
              disabled={endRange === totalRecords}
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-700 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] disabled:text-gray-400 disabled:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Subscription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Subscription"
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
                Gym
              </label>
              <select
                name="gym_id"
                value={formData.gym_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Gym</option>
                {gyms.map((gym) => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Plan
            </label>
            <input
              type="text"
              name="subscription_plan"
              value={formData.subscription_plan}
              onChange={handleInputChange}
              required
              placeholder="e.g., Monthly Pass (30 days)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="subscription_status"
              value={formData.subscription_status}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Subscription
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionsPage;