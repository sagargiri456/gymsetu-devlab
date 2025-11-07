// app/member/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Member } from '@/types/member';
import { fetchMemberProfile, updateMemberProfile } from '@/lib/memberApi';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    gender: '',
    height: 0,
    weight: 0,
    fitnessGoals: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMemberProfile();
        
        // Transform API response to match our types
        if (data.member) {
          setMemberData(data.member);
          setFormData({
            name: data.member.name || '',
            email: data.member.email || '',
            phone: data.member.phone || '',
            address: data.member.address || '',
            city: data.member.city || '',
            state: data.member.state || '',
            zipCode: data.member.zipCode || '',
            dateOfBirth: data.member.dateOfBirth || '',
            gender: data.member.gender || '',
            height: data.member.stats?.height || 0,
            weight: data.member.stats?.weight || 0,
            fitnessGoals: data.member.fitnessGoals || ''
          });
        } else if (data) {
          // If API returns data directly
          setMemberData(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            height: data.height || data.stats?.height || 0,
            weight: data.weight || data.stats?.weight || 0,
            fitnessGoals: data.fitnessGoals || ''
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateMemberProfile(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
      
      // Reload profile to get updated data
      const data = await fetchMemberProfile();
      if (data.member) {
        setMemberData(data.member);
      } else if (data) {
        setMemberData(data);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const bmi = formData.height > 0 ? formData.weight / ((formData.height / 100) ** 2) : 0;
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !memberData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  // Update memberData with current formData for display
  const displayMemberData: Member = {
    ...memberData,
    name: formData.name,
    email: formData.email,
    stats: {
      ...memberData.stats,
      weight: formData.weight,
      height: formData.height,
      bmi: bmi
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 mt-4 lg:mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
              My Profile
            </h4>
            <p className="text-gray-600 opacity-70 mt-2">
              Manage your personal information and profile settings
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg transition-all"
            >
              <span className="material-icons text-sm mr-2 align-middle">edit</span>
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700 rounded-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo & Basic Info */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] flex items-center justify-center text-blue-700 text-4xl font-bold mx-auto mb-4">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </div>
              {isEditing && (
                <button className="text-blue-700 hover:underline text-sm mb-4">
                  Change Photo
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                {displayMemberData.name}
              </h2>
              <p className="text-gray-600 opacity-70 mt-1">
                {displayMemberData.email}
              </p>
            </div>

            {/* Physical Stats */}
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <div className="text-sm text-gray-600 opacity-70 mb-1">BMI</div>
                <div className="text-2xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                  {bmi.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 opacity-70 mt-1">
                  {bmiCategory}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                  <div className="text-sm text-gray-600 opacity-70 mb-1">Height</div>
                  <div className="text-xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                    {formData.height} cm
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                  <div className="text-sm text-gray-600 opacity-70 mb-1">Weight</div>
                  <div className="text-xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                    {formData.weight} kg
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Personal Information</h6>
              <p className="text-sm text-gray-600 opacity-70">Your personal details</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Address Information</h6>
              <p className="text-sm text-gray-600 opacity-70">Your address details</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
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
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
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
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Fitness Goals</h6>
              <p className="text-sm text-gray-600 opacity-70">Your fitness objectives</p>
            </div>
            <textarea
              name="fitnessGoals"
              value={formData.fitnessGoals}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Subscription Information */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Subscription Information</h6>
              <p className="text-sm text-gray-600 opacity-70">Your subscription details</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <div className="text-sm text-gray-600 opacity-70 mb-1">Plan</div>
                <div className="font-medium text-gray-800">
                  {displayMemberData.subscription.plan}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <div className="text-sm text-gray-600 opacity-70 mb-1">Status</div>
                <div className="font-medium text-green-700">
                  {displayMemberData.subscription.status}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <div className="text-sm text-gray-600 opacity-70 mb-1">Start Date</div>
                <div className="font-medium text-gray-800">
                  {new Date(displayMemberData.subscription.startDate).toLocaleDateString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <div className="text-sm text-gray-600 opacity-70 mb-1">Days Remaining</div>
                <div className="font-medium text-gray-800">
                  {displayMemberData.subscription.daysRemaining} days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

