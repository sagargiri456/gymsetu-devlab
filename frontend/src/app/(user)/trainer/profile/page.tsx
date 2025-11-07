// app/trainer/profile/page.tsx
'use client';

import React, { useState } from 'react';
import { MdEdit, MdPerson, MdEmail, MdPhone, MdFitnessCenter, MdSchool } from 'react-icons/md';

export default function TrainerProfile() {
  const [isEditing, setIsEditing] = useState(false);

  // Hardcoded trainer data
  const [trainerData, setTrainerData] = useState({
    name: 'John Trainer',
    email: 'trainer@example.com',
    phone: '+1 234-567-8900',
    specialization: 'Strength Training',
    experience: 5,
    bio: 'Certified personal trainer with 5 years of experience in strength training and bodybuilding.',
    certifications: ['NASM Certified Personal Trainer', 'CPR/AED Certified'],
    photo: '',
  });

  const [formData, setFormData] = useState(trainerData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setTrainerData(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(trainerData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your trainer profile information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#ecf0f3] rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 font-semibold flex items-center gap-2 transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <MdEdit className="text-sm sm:text-base" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none bg-[#ecf0f3] rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 font-semibold transition-all text-sm sm:text-base"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 sm:flex-none bg-[#ecf0f3] rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-700 font-semibold transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] flex-shrink-0">
            <MdPerson className="text-white text-4xl sm:text-5xl" />
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 break-words">
              {isEditing ? formData.name : trainerData.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 break-words">
              {isEditing ? formData.specialization : trainerData.specialization} •{' '}
              {isEditing ? formData.experience : trainerData.experience} years experience
            </p>
            {isEditing && (
              <button className="text-blue-600 font-semibold text-xs sm:text-sm hover:underline">
                Change Photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MdPerson className="inline mr-2" />
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800">
                {trainerData.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MdEmail className="inline mr-2" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800">
                {trainerData.email}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MdPhone className="inline mr-2" />
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800">
                {trainerData.phone}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MdFitnessCenter className="inline mr-2" />
              Specialization
            </label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800">
                {trainerData.specialization}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MdSchool className="inline mr-2" />
              Experience (years)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
              />
            ) : (
              <p className="px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800">
                {trainerData.experience} years
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Bio</h2>
        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none resize-none"
          />
        ) : (
          <p className="px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800">
            {trainerData.bio}
          </p>
        )}
      </div>

      {/* Certifications */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Certifications</h2>
        <div className="space-y-2">
          {trainerData.certifications.map((cert, index) => (
            <div
              key={index}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-sm sm:text-base text-gray-800"
            >
              {cert}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

