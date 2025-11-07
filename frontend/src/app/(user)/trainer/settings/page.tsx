// app/trainer/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';
import { MdNotifications, MdLock, MdDelete } from 'react-icons/md';

export default function TrainerSettings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sessionReminders: true,
    memberUpdates: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
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
    alert('Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/trainers/login');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted. Please contact support for further assistance.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Account Settings */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <MdLock className="text-gray-600 text-lg sm:text-xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Account Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-300 border-opacity-30">
            <div>
              <div className="font-semibold text-gray-800">Change Password</div>
              <div className="text-sm text-gray-600">Update your password to keep your account secure</div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-[#ecf0f3] rounded-xl px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-sm font-semibold text-blue-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow"
            >
              Change
            </button>
          </div>

          {showPasswordForm && (
            <div className="bg-[#ecf0f3] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none text-gray-800 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 bg-[#ecf0f3] rounded-xl px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-sm font-semibold text-blue-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow"
                >
                  Save Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 bg-[#ecf0f3] rounded-xl px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-sm font-semibold text-gray-700 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <MdNotifications className="text-gray-600 text-lg sm:text-xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Notifications</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-3 border-b border-gray-300 border-opacity-30"
            >
              <div>
                <div className="font-semibold text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-sm text-gray-600">
                  {key === 'email' && 'Receive email notifications'}
                  {key === 'push' && 'Receive push notifications'}
                  {key === 'sessionReminders' && 'Get reminders for upcoming sessions'}
                  {key === 'memberUpdates' && 'Get updates about member progress'}
                </div>
              </div>
              <button
                onClick={() => handleNotificationChange(key)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-300'
                } relative`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <MdDelete className="text-red-600 text-lg sm:text-xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-red-600">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-300 border-opacity-30">
            <div>
              <div className="font-semibold text-gray-800">Logout</div>
              <div className="text-sm text-gray-600">Sign out of your account</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#ecf0f3] rounded-xl px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-sm font-semibold text-gray-800 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow"
            >
              Logout
            </button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-semibold text-red-600">Delete Account</div>
              <div className="text-sm text-gray-600">Permanently delete your account and all data</div>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="bg-[#ecf0f3] rounded-xl px-4 py-2 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] border-none text-sm font-semibold text-red-600 hover:shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff] transition-shadow"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

