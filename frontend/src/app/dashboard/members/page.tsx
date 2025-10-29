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


// --- Member Interface based on backend model ---
interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  dp_link: string;
  state: string;
  zip: string;
  created_at: string;
  gym_id: number;
}

// Sample data will be replaced by API fetch

const MembersPage: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    dp_link: "",
    state: "",
    zip: "",
    gym_id: 1,
  });

  const tableHeaders = [
    "Name",
    "Email",
    "Phone",
    "Address",
    "City",
    "State",
    "Zip",
  ];

  // Fetch members data from backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const apiUrl = getApiUrl("api/members/get_members");
        console.log("Fetching members from:", apiUrl);
        console.log("Authorization token:", token ? "Present" : "Missing");
        
        if (!token) {
          console.error("No access token found. Please login again.");
          setMembersList([]);
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
        console.log("Response headers:", response.headers);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Response data:", data);
          if (data.success && data.members) {
            setMembersList(data.members);
          } else {
            console.log("No members data found in response");
            setMembersList([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch members:", response.status, response.statusText);
          console.error("Error response:", errorText);
          
          // Check if it's an auth error
          if (response.status === 401) {
            console.log("Authentication failed. Token may be invalid or expired.");
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
            setMembersList([]);
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gym_id' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      id: membersList.length + 1,
      ...formData,
      created_at: new Date().toISOString(),
    };
    
    try {
      console.log(localStorage.getItem("access_token"));
      const response = await fetch(getApiUrl("api/members/add_member"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(newMember),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Add member response:", data);
        if (data.success && data.member) {
          // Use the member data returned from backend
          setMembersList(prev => [...prev, data.member]);
        } else {
          // Fallback to using the newMember we created
          setMembersList(prev => [...prev, newMember]);
        }
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          dp_link: "",
          state: "",
          zip: "",
          gym_id: 1,
        });
        setIsModalOpen(false);
        alert("Member added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add member:", response.status, response.statusText);
        console.error("Error response:", errorData);
        alert(`Failed to add member: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    }
  };

  return (
    <div 
      className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 sm:p-8 lg:p-12 min-h-screen bg-[#ecf0f3]"
      style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: '#ecf0f3'
      }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 gap-6 px-2">
        <h4 className="text-2xl lg:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Members
        </h4>

        {/* New Member Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 min-w-[160px] shadow-lg hover:shadow-xl"
          style={{
            display: 'inline-flex',
            visibility: 'visible',
            opacity: 1,
            zIndex: 10,
            position: 'relative'
          }}
        >
          <MdAdd size={20} className="mr-2" />
          New Member
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
        {/* Search + Filter */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-6 lg:p-8 gap-6">
          {/* Search Box */}
          <div className="relative flex items-center w-full lg:w-80 rounded-full px-5 py-3 bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <MdSearch size={20} className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search member..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Filter */}
          <button className="p-4 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all text-gray-600 w-full lg:w-auto">
            <MdFilterList size={22} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading members...</div>
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
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left font-semibold tracking-wide"
                    >
                      {header}
                    </th>
                  ))}
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {membersList.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-200 hover:bg-[#d8d8d8] transition-all"
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                  </td>

                  {/* Avatar */}
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ecf0f3] shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]">
                      <MdPerson size={22} className="text-gray-600" />
                    </div>
                  </td>
                  {/* Data */}
                  <td className="px-6 py-4">{member.name}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">{member.phone}</td>
                  <td className="px-6 py-4">{member.address}</td>
                  <td className="px-6 py-4">{member.city}</td>
                  <td className="px-6 py-4">{member.state}</td>
                  <td className="px-6 py-4">{member.zip}</td>
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
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
        <div className="flex items-center justify-end p-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 mr-8">Rows per page: 5</p>
          <p className="text-sm text-gray-600 mr-10">1–3 of 3</p>
          <div className="flex space-x-3">
            <button
              disabled
              className="p-3 rounded-full bg-[#ecf0f3] text-gray-400 shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
            >
              <MdKeyboardArrowLeft size={20} />
            </button>
            <button
              disabled
              className="p-3 rounded-full bg-[#ecf0f3] text-gray-400 shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Member"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
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
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL
            </label>
            <input
              type="url"
              name="dp_link"
              value={formData.dp_link}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/profile.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
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
              Add Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembersPage;
