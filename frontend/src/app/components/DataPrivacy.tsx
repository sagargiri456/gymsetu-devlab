"use client";

// components/DataPrivacy.tsx
import React, { useState } from 'react';
import { GymProfile, deleteGymProfile } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface DataPrivacyProps {
  gymData: GymProfile;
}

const DataPrivacy = ({ gymData }: DataPrivacyProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const result = await deleteGymProfile();
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Redirect to login page after deletion
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ type: 'error', text: 'Failed to delete account' });
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Data & Privacy
      </h2>

      <div className="space-y-6">
        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Account Information */}
        <div className="bg-[#ecf0f3] rounded-lg p-6 shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
          <h3 className="font-medium text-gray-800 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Gym ID
              </label>
              <p className="mt-1 text-sm text-gray-800">
                {gymData.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-800">
                {gymData.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Account Created
              </label>
              <p className="mt-1 text-sm text-gray-800">
                {gymData.created_at ? new Date(gymData.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <p className="mt-1 text-sm text-gray-800">
                {gymData.role}
              </p>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="bg-[#ecf0f3] rounded-lg p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-2 border-red-300">
          <h3 className="font-medium text-red-700 mb-2">
            Delete Account
          </h3>
          <p className="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. This action is permanent 
            and all your data will be erased.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-red-700">
                Are you absolutely sure? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-[#ecf0f3] text-gray-800 shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] disabled:opacity-50 transition-all"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;