"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdAdd, MdCameraAlt, MdPhotoLibrary } from "react-icons/md";
import MemberCard from "./MemberCard";
import MemberModal from "./MemberModal";
import Modal from "../../components/Modal";
import { getApiUrl } from "@/lib/api";

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  dp_link?: string | null;
  state: string;
  zip: string;
  created_at: string; // ISO date string from backend
  expiration_date?: string | null; // ISO date string from backend
}

type FilterType = "All" | "Active" | "Expired";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("All");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [dpLink, setDpLink] = useState("");
  const [memberPhoto, setMemberPhoto] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    expiration_date: "",
    gym_id: 1,
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login");
          return;
        }
        console.log("Token found");

        const apiUrl = getApiUrl("/api/members/get_members");
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.members) {
            setMembers(data.members);
          } else if (Array.isArray(data)) {
            // Fallback: if the API returns an array directly
            setMembers(data);
          } else {
            console.log("No members data found in response");
            setMembers([]);
          }
        } else if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        } else {
          // If it's a 400 or 404 error, the API might not exist yet
          if (response.status === 400 || response.status === 404) {
            console.log("API endpoint might not exist yet. Using empty array as fallback.");
            setMembers([]);
          } else {
            const errorText = await response.text();
            console.error("Failed to fetch members:", response.status, response.statusText);
            console.error("Error response:", errorText);
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [router]);

  // Helper function to get member status (matching MemberCard logic)
  const getMemberStatus = (member: Member): "Active" | "Expired" => {
    // Use expiration_date if available, otherwise fallback to created_at + 30 days
    if (member.expiration_date) {
      const expiration = new Date(member.expiration_date);
      const now = new Date();
      return now <= expiration ? "Active" : "Expired";
    }
    // Fallback: calculate from created_at + 30 days
    const created = new Date(member.created_at);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30 ? "Active" : "Expired";
  };

  // Filter members based on selected filter
  const filteredMembers = members.filter((member) => {
    if (filter === "All") return true;
    const status = getMemberStatus(member);
    return status === filter;
  });

  const handleEditDp = (member: Member) => {
    setEditingMember(member);
    setDpLink(member.dp_link || "");
  };

  const handleUpdateDpLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      const token = localStorage.getItem("access_token");
      console.log(token);
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(getApiUrl(`api/members/update_member`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          member_id: editingMember.id,
          dp_link: dpLink,
        }),
      });

      if (response.ok) {
        // Update the member in the members array
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? { ...m, dp_link: dpLink } : m))
        );
        setEditingMember(null);
        setDpLink("");
        alert("Profile picture updated successfully!");
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile picture:", response.status, response.statusText);
        console.error("Error response:", errorData);
        alert(`Failed to update profile picture: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to server. Please check your connection and try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gym_id" ? parseInt(value) : value,
    }));
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB - Cloudinary can handle larger)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Store the file directly (no need to convert to base64)
    setPhotoFile(file);
    
    // Create preview URL for display
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setMemberPhoto(previewUrl);
    };
    reader.onerror = () => {
      alert('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setMemberPhoto("");
    setPhotoFile(null);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("zip", formData.zip);
      if (formData.expiration_date) {
        formDataToSend.append("expiration_date", formData.expiration_date);
      }
      formDataToSend.append("gym_id", formData.gym_id.toString());
      
      // Add photo file if available
      if (photoFile) {
        formDataToSend.append("photo", photoFile);
      }

      const response = await fetch(getApiUrl("api/members/add_member"), {
        method: "POST",
        headers: {
          // Don't set Content-Type header - browser will set it with boundary for FormData
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Add member response:", data);
        if (data.success && data.member) {
          // Use the member data returned from backend
          setMembers((prev) => [...prev, data.member]);
        }
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          expiration_date: "",
          gym_id: 1,
        });
        setMemberPhoto("");
        setPhotoFile(null);
        if (cameraInputRef.current) {
          cameraInputRef.current.value = '';
        }
        if (galleryInputRef.current) {
          galleryInputRef.current.value = '';
        }
        setIsAddModalOpen(false);
        alert("Member added successfully!");
        // Refresh the members list
        const refreshResponse = await fetch(getApiUrl("api/members/get_members"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.members) {
            setMembers(refreshData.members);
          } else if (Array.isArray(refreshData)) {
            setMembers(refreshData);
          }
        } else if (refreshResponse.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
        }
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
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

  if (loading) {
    return (
      <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 flex items-center justify-center min-h-screen bg-[#ecf0f3] text-gray-500">
        Loading members...
      </div>
    );
  }

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-6 sm:p-8 lg:p-12 min-h-screen bg-[#ecf0f3]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 mt-4 lg:mt-6 gap-6 px-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">Members</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sm rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-200 min-w-[160px] shadow-lg hover:shadow-xl"
        >
          <MdAdd size={20} className="mr-2" />
          Add Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-8 px-2">
        <button
          onClick={() => setFilter("All")}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            filter === "All"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Active")}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            filter === "Active"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("Expired")}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            filter === "Expired"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
          }`}
        >
          Expired
        </button>
      </div>

      {!Array.isArray(members) || members.length === 0 ? (
        <p className="text-gray-500">No members found.</p>
      ) : filteredMembers.length === 0 ? (
        <p className="text-gray-500">No {filter.toLowerCase()} members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => setSelectedMember(member)}
              onEditDp={handleEditDp}
            />
          ))}
        </div>
      )}

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Edit DP Link Modal */}
      <Modal
        isOpen={editingMember !== null}
        onClose={() => {
          setEditingMember(null);
          setDpLink("");
        }}
        title="Edit Profile Picture"
      >
        <form onSubmit={handleUpdateDpLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={dpLink}
              onChange={(e) => setDpLink(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter the URL of the profile picture
            </p>
          </div>

          {dpLink && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dpLink}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setEditingMember(null);
                setDpLink("");
              }}
              className="px-6 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Member"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Photo (Optional)
            </label>
            <div className="flex flex-col items-center space-y-4">
              {memberPhoto ? (
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-lg">
                    <img
                      src={memberPhoto}
                      alt="Member preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-dashed border-gray-400">
                  <MdCameraAlt className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MdCameraAlt className="w-5 h-5 mr-2" />
                  Take Photo
                </button>
                <button
                  type="button"
                  onClick={handleGalleryClick}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MdPhotoLibrary className="w-5 h-5 mr-2" />
                  Choose from Gallery
                </button>
              </div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 text-center">
                Click to take a photo with camera or choose from gallery
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                ZIP
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <input
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              onClick={(e) => {
                // Ensure the calendar opens on click
                (e.target as HTMLInputElement).showPicker?.();
              }}
            />
            <p className="mt-2 text-xs text-gray-500">
              Select the membership expiration date
            </p>
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
              onClick={() => {
                setIsAddModalOpen(false);
                setMemberPhoto("");
                setPhotoFile(null);
                if (cameraInputRef.current) {
                  cameraInputRef.current.value = '';
                }
                if (galleryInputRef.current) {
                  galleryInputRef.current.value = '';
                }
              }}
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
}
