// app/member/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    workoutReminders: true,
    contestUpdates: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    // Handle password change logic
    console.log('Changing password...');
    alert('Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/members/login');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted. Please contact support for further assistance.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 mt-4 lg:mt-6">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Settings
        </h4>
        <p className="text-gray-600 opacity-70 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Settings */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
        <div className="p-0 mb-4">
          <h6 className="text-lg font-bold text-gray-800">Account Settings</h6>
          <p className="text-sm text-gray-600 opacity-70">Manage your account</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-300">
            <div>
              <div className="font-medium text-gray-800">Change Password</div>
              <div className="text-sm text-gray-600 opacity-70">
                Update your password to keep your account secure
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg transition-all"
            >
              Change Password
            </button>
          </div>

          {showPasswordForm && (
            <div className="p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700 rounded-lg transition-all"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-4 border-b border-gray-300">
            <div>
              <div className="font-medium text-gray-800">Logout</div>
              <div className="text-sm text-gray-600 opacity-70">
                Sign out of your account
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium text-red-700">Delete Account</div>
              <div className="text-sm text-gray-600 opacity-70">
                Permanently delete your account and all data
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-red-700 rounded-lg transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
        <div className="p-0 mb-4">
          <h6 className="text-lg font-bold text-gray-800">Appearance</h6>
          <p className="text-sm text-gray-600 opacity-70">Customize your appearance</p>
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <div className="font-medium text-gray-800">Dark Mode</div>
            <div className="text-sm text-gray-600 opacity-70">
              Toggle dark mode theme
            </div>
          </div>
          <button
            onClick={handleToggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] ${
              darkMode ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-[2px_2px_4px_#cbced1] ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
        <div className="p-0 mb-4">
          <h6 className="text-lg font-bold text-gray-800">Notifications</h6>
          <p className="text-sm text-gray-600 opacity-70">Manage your notification preferences</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-300">
            <div>
              <div className="font-medium text-gray-800">Email Notifications</div>
              <div className="text-sm text-gray-600 opacity-70">
                Receive notifications via email
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] ${
                notifications.email ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-[2px_2px_4px_#cbced1] ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-300">
            <div>
              <div className="font-medium text-gray-800">Push Notifications</div>
              <div className="text-sm text-gray-600 opacity-70">
                Receive push notifications
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('push')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] ${
                notifications.push ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-[2px_2px_4px_#cbced1] ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-300">
            <div>
              <div className="font-medium text-gray-800">Workout Reminders</div>
              <div className="text-sm text-gray-600 opacity-70">
                Get reminded about upcoming workouts
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('workoutReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] ${
                notifications.workoutReminders ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-[2px_2px_4px_#cbced1] ${
                  notifications.workoutReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-800">Contest Updates</div>
              <div className="text-sm text-gray-600 opacity-70">
                Get notified about contest updates
              </div>
            </div>
            <button
              onClick={() => handleNotificationChange('contestUpdates')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] ${
                notifications.contestUpdates ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-[2px_2px_4px_#cbced1] ${
                  notifications.contestUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
        <div className="p-0 mb-4">
          <h6 className="text-lg font-bold text-gray-800">Privacy</h6>
          <p className="text-sm text-gray-600 opacity-70">Manage your privacy settings</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-300">
            <div>
              <div className="font-medium text-gray-800">Profile Visibility</div>
              <div className="text-sm text-gray-600 opacity-70">
                Control who can see your profile
              </div>
            </div>
            <select className="px-4 py-2 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none">
              <option>Public</option>
              <option>Members Only</option>
              <option>Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-gray-800">Progress Sharing</div>
              <div className="text-sm text-gray-600 opacity-70">
                Allow others to see your progress
              </div>
            </div>
            <select className="px-4 py-2 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none">
              <option>Everyone</option>
              <option>Trainers Only</option>
              <option>Private</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

