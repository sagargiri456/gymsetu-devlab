"use client";

// components/AccountSecurity.tsx
import React, { useState } from 'react';
import { changePassword } from '@/lib/auth';

const AccountSecurity = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return requirements;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    const requirements = validatePassword(formData.newPassword);
    if (!Object.values(requirements).every(Boolean)) {
      setMessage({ type: 'error', text: 'New password does not meet requirements' });
      return;
    }

    try {
      setLoading(true);
      
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const requirements = validatePassword(formData.newPassword);

  return (
    <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Account Security
      </h2>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-3 space-y-2">
              <div className="text-sm font-medium text-gray-800">
                Password Requirements:
              </div>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center ${requirements.length ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="material-icons text-base mr-1">
                    {requirements.length ? 'check_circle' : 'cancel'}
                  </span>
                  At least 8 characters
                </div>
                <div className={`flex items-center ${requirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="material-icons text-base mr-1">
                    {requirements.uppercase ? 'check_circle' : 'cancel'}
                  </span>
                  One uppercase letter
                </div>
                <div className={`flex items-center ${requirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="material-icons text-base mr-1">
                    {requirements.lowercase ? 'check_circle' : 'cancel'}
                  </span>
                  One lowercase letter
                </div>
                <div className={`flex items-center ${requirements.number ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="material-icons text-base mr-1">
                    {requirements.number ? 'check_circle' : 'cancel'}
                  </span>
                  One number
                </div>
                <div className={`flex items-center ${requirements.special ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="material-icons text-base mr-1">
                    {requirements.special ? 'check_circle' : 'cancel'}
                  </span>
                  One special character
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] focus:outline-none focus:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
          />
          {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-[#67d18a] text-white rounded-lg shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] disabled:opacity-50 transition-all"
        >
          {loading ? 'Updating Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default AccountSecurity;