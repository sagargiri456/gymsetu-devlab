"use client";

// SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  MdPerson, 
  MdLock, 
  MdPalette, 
  MdSecurity 
} from 'react-icons/md';
import { IconType } from 'react-icons';
import { 
  ProfileInformation, 
  AccountSecurity, 
  PreferencesAppearance, 
  DataPrivacy 
} from '../../components';
import { fetchGymProfile, GymProfile } from '@/lib/auth';

interface Section {
  id: string;
  name: string;
  icon: IconType;
}

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [gymData, setGymData] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadGymProfile();
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const loadGymProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await fetchGymProfile();
      if (profile) {
        setGymData(profile);
      } else {
        setError('Failed to load gym profile. Please check if the backend server is running and try again.');
      }
    } catch (error) {
      // Error is already logged in fetchGymProfile, just display it to the user
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to load gym profile. Please check if the backend server is running.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', enabled.toString());
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const sections: Section[] = [
    { id: 'profile', name: 'Profile Information', icon: MdPerson },
    { id: 'security', name: 'Account Security', icon: MdLock },
    { id: 'preferences', name: 'Preferences & Appearance', icon: MdPalette },
    { id: 'privacy', name: 'Data & Privacy', icon: MdSecurity }
  ];

  if (loading) {
    return (
      <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 min-h-screen bg-[#ecf0f3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#67d18a] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-4 sm:p-6 lg:p-10 min-h-screen bg-[#ecf0f3]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 mt-4 lg:mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage your gym profile and account preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-[#ecf0f3] rounded-2xl shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] p-4 sm:p-6">
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-[#ecf0f3] text-[#67d18a] font-semibold shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]'
                          : 'text-gray-600 font-medium shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] hover:text-[#67d18a]'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <div className="w-7 h-7 flex items-center justify-center mr-3 rounded-full bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
                        <Icon size={18} className={isActive ? 'text-[#67d18a]' : 'text-gray-600'} />
                      </div>
                      <span className="text-sm sm:text-base capitalize">{section.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#ecf0f3] rounded-2xl shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
              {activeSection === 'profile' && (
                <>
                  {error ? (
                    <div className="p-6">
                      <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                        {error}
                      </div>
                      <button
                        onClick={loadGymProfile}
                        className="px-4 py-2 bg-[#67d18a] text-white rounded-lg shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  ) : gymData ? (
                    <ProfileInformation gymData={gymData} onUpdate={loadGymProfile} />
                  ) : (
                    <div className="p-6">
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#67d18a] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading profile information...</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {activeSection === 'security' && <AccountSecurity />}
              {activeSection === 'preferences' && (
                <PreferencesAppearance 
                  darkMode={darkMode}
                  onDarkModeToggle={handleDarkModeToggle}
                />
              )}
              {activeSection === 'privacy' && (
                <>
                  {error ? (
                    <div className="p-6">
                      <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                        {error}
                      </div>
                      <button
                        onClick={loadGymProfile}
                        className="px-4 py-2 bg-[#67d18a] text-white rounded-lg shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  ) : gymData ? (
                    <DataPrivacy gymData={gymData} />
                  ) : (
                    <div className="p-6">
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#67d18a] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading privacy information...</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;