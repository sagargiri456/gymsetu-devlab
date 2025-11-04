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
  MdCardMembership,
} from "react-icons/md";
import Modal from "../../components/Modal";
import { getApiUrl } from "@/lib/api";


// --- SubscriptionPlan Interface based on backend model ---
interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  gym_id: number;
  created_at: string;
}

// Sample data will be replaced by API fetch

const SubscriptionPlansPage: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plansList, setPlansList] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    gym_id: 1,
  });

  const headers = [
    "Plan Name",
    "Description",
    "Duration",
    "Price",
    "Gym ID",
  ];

  // Fetch subscription plans data from backend
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await fetch(getApiUrl("api/subscription_plans/get_subscription_plans"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.subscription_plans) {
            setPlansList(data.subscription_plans);
          } else {
            console.log("No subscription plans data found in response");
            setPlansList([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch subscription plans:", response.status, response.statusText);
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
            setPlansList([]);
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gym_id' || name === 'duration' || name === 'price' ? parseInt(value) || (name === 'gym_id' ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: SubscriptionPlan = {
      id: Math.max(...plansList.map(p => p.id)) + 1,
      name: formData.name,
      description: formData.description,
      duration: parseInt(formData.duration),
      price: parseInt(formData.price),
      gym_id: formData.gym_id,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(getApiUrl("api/subscription_plans/add_subscription_plan"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          name: newPlan.name,
          description: newPlan.description,
          duration: newPlan.duration,
          price: newPlan.price,
          gym_id: newPlan.gym_id,
        }),
      });
      
        if (response.ok) {
          const data = await response.json();
          console.log("Add subscription plan response:", data);
          if (data.success && data.subscription_plan) {
            // Use the subscription plan data returned from backend
            setPlansList(prev => [...prev, data.subscription_plan]);
          } else {
            // Fallback to using the newPlan we created
            setPlansList(prev => [...prev, newPlan]);
          }
          setFormData({
            name: "",
            description: "",
            duration: "",
            price: "",
            gym_id: 1,
          });
          setIsModalOpen(false);
          alert("Subscription plan added successfully!");
        } else {
          const errorData = await response.json();
          console.error("Failed to add subscription plan:", response.status, response.statusText);
          console.error("Error response:", errorData);
          alert(`Failed to add subscription plan: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    }
  };

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 sm:p-8 lg:p-12 min-h-screen bg-[#ecf0f3]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 mt-4 lg:mt-6 gap-6 px-2">
        <h4 className="text-2xl lg:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Subscription Plans
        </h4>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 min-w-[140px] shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} className="mr-2" />
          New Plan
        </button>
      </div>

      {/* Card */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 lg:p-6 gap-4">
          <div className="relative flex items-center w-full lg:w-72 rounded-full px-4 py-2 bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <MdSearch size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search plans..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          <button className="p-3 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all text-gray-600 w-full lg:w-auto">
            <MdFilterList size={22} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading subscription plans...</div>
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
                {plansList.map((plan) => (
                <tr
                  key={plan.id}
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
                      <MdCardMembership
                        size={22}
                        className="text-gray-600"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{plan.name}</td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs">
                    <div className="truncate" title={plan.description}>
                      {plan.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{plan.duration} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">₹{plan.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{plan.gym_id}</td>
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

      {/* Add Subscription Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Subscription Plan"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
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
              Add Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionPlansPage;
