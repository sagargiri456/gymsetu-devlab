"use client";

// components/ProfileInformation.tsx
import React, { useState, useEffect } from 'react';
import { GymProfile, updateGymProfile } from '@/lib/auth';

interface ProfileInformationProps {
  gymData: GymProfile;
  onUpdate: () => void | Promise<void>;
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ gymData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: gymData.name,
    phone: gymData.phone,
    address: gymData.address,
    city: gymData.city,
    state: gymData.state,
    zip: gymData.zip,
    logo_link: gymData.logo_link || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      name: gymData.name,
      phone: gymData.phone,
      address: gymData.address,
      city: gymData.city,
      state: gymData.state,
      zip: gymData.zip,
      logo_link: gymData.logo_link || '',
    });
  }, [gymData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    // Convert to base64 data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, logo_link: base64String }));
      setMessage({ type: 'success', text: 'Logo selected. Click "Save Changes" to update.' });
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Failed to read image file' });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const result = await updateGymProfile(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setIsEditing(false);
        await onUpdate();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: gymData.name,
      phone: gymData.phone,
      address: gymData.address,
      city: gymData.city,
      state: gymData.state,
      zip: gymData.zip,
      logo_link: gymData.logo_link || '',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Profile Information
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#67d18a] text-white rounded-lg shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Gym Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 disabled:bg-[#ecf0f3] disabled:text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={gymData.email}
            disabled
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 disabled:bg-[#ecf0f3] disabled:text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 disabled:bg-[#ecf0f3] disabled:text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 disabled:bg-[#ecf0f3] disabled:text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 disabled:bg-[#ecf0f3] disabled:text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 disabled:bg-[#ecf0f3] disabled:text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Account Created
          </label>
          <input
            type="text"
            value={gymData.created_at ? new Date(gymData.created_at).toLocaleDateString() : 'N/A'}
            disabled
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Role
          </label>
          <input
            type="text"
            value={gymData.role}
            disabled
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-600 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Gym Logo
        </label>
        <div className="flex items-center gap-4">
          {(formData.logo_link || gymData.logo_link) ? (
            <img 
              src={formData.logo_link || gymData.logo_link || ''} 
              alt="Gym Logo" 
              className="w-16 h-16 rounded-lg object-cover shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff]"
              onError={(e) => {
                // If image fails to load, show placeholder
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.logo-placeholder')) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'logo-placeholder w-16 h-16 bg-[#ecf0f3] rounded-lg flex items-center justify-center shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]';
                  placeholder.innerHTML = '<span class="text-gray-600 text-2xl">🏋️</span>';
                  parent.insertBefore(placeholder, e.currentTarget);
                }
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-[#ecf0f3] rounded-lg flex items-center justify-center shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
              <span className="text-gray-600 text-2xl">🏋️</span>
            </div>
          )}
          {isEditing && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={handleLogoChange}
                type="button"
                className="px-4 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
              >
                Change Logo
              </button>
            </>
          )}
        </div>
        {isEditing && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Or enter logo URL
            </label>
            <input
              type="url"
              name="logo_link"
              value={formData.logo_link}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInformation;