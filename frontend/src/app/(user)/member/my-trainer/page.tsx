// app/member/my-trainer/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Trainer } from '@/types/member';
import { fetchMyTrainer, sendMessageToTrainer, requestTrainingSession } from '@/lib/memberApi';

const MyTrainerPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    const loadTrainer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMyTrainer();
        
        // Transform API response to match our types
        if (data.trainer) {
          setTrainer(data.trainer);
        } else if (data) {
          setTrainer(data);
        }
      } catch (err) {
        console.error('Error loading trainer data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trainer data');
        
        // Fallback to default data if API fails
        setTrainer({
          id: '1',
          name: 'No Trainer Assigned',
          email: '',
          phone: '',
          specialization: '',
          experience: 0,
          photo: undefined,
          bio: 'No trainer has been assigned to you yet.',
          nextSession: undefined
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrainer();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() && trainer) {
      try {
        await sendMessageToTrainer(message);
        setMessage('');
        setShowMessageForm(false);
        alert('Message sent successfully!');
      } catch (err) {
        console.error('Error sending message:', err);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  const handleRequestSession = async () => {
    try {
      await requestTrainingSession({
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: '10:00 AM',
        notes: 'Requesting a training session'
      });
      alert('Session request submitted! Your trainer will contact you soon.');
    } catch (err) {
      console.error('Error requesting session:', err);
      alert('Failed to submit session request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer information...</p>
        </div>
      </div>
    );
  }

  if (error && !trainer) {
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

  if (!trainer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No trainer assigned</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trainer Header */}
      <div className="mb-8 mt-4 lg:mt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] flex items-center justify-center text-blue-700 text-3xl font-bold">
              {trainer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
                {trainer.name}
              </h4>
              <p className="text-gray-600 opacity-70 mt-1">
                {trainer.specialization}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600 opacity-70">
                  <span className="material-icons text-sm align-middle mr-1">star</span>
                  {trainer.experience} years experience
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg transition-all"
            >
              <span className="material-icons text-sm mr-2 align-middle">message</span>
              Send Message
            </button>
            <button
              onClick={handleRequestSession}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-green-700 rounded-lg transition-all"
            >
              <span className="material-icons text-sm mr-2 align-middle">event</span>
              Request Session
            </button>
          </div>
        </div>
      </div>

      {/* Message Form */}
      {showMessageForm && (
        <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
          <div className="p-0 mb-4">
            <h6 className="text-lg font-bold text-gray-800">Send Message to {trainer.name}</h6>
            <p className="text-sm text-gray-600 opacity-70">Send a message to your trainer</p>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] text-gray-800 focus:outline-none"
            rows={4}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => {
                setShowMessageForm(false);
                setMessage('');
              }}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-gray-800 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] text-blue-700 rounded-lg transition-all"
            >
              Send Message
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trainer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">About Your Trainer</h6>
              <p className="text-sm text-gray-600 opacity-70">Trainer background and expertise</p>
            </div>
            <p className="text-gray-600 opacity-80 leading-relaxed">
              {trainer.bio}
            </p>
          </div>

          {/* Contact Information */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Contact Information</h6>
              <p className="text-sm text-gray-600 opacity-70">Get in touch with your trainer</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <span className="material-icons text-gray-600 opacity-70">email</span>
                <a href={`mailto:${trainer.email}`} className="text-blue-700 hover:underline">
                  {trainer.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <span className="material-icons text-gray-600 opacity-70">phone</span>
                <a href={`tel:${trainer.phone}`} className="text-blue-700 hover:underline">
                  {trainer.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions & Quick Actions */}
        <div className="space-y-6">
          {/* Next Session */}
          {trainer.nextSession && (
            <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
              <div className="p-0 mb-4">
                <h6 className="text-lg font-bold text-gray-800">Next Session</h6>
                <p className="text-sm text-gray-600 opacity-70">Upcoming training session</p>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <span className="material-icons text-blue-700">event</span>
                <div>
                  <div className="font-medium text-gray-800">
                    {trainer.nextSession}
                  </div>
                  <div className="text-sm text-gray-600 opacity-70">
                    Training Session
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden p-6">
            <div className="p-0 mb-4">
              <h6 className="text-lg font-bold text-gray-800">Quick Actions</h6>
              <p className="text-sm text-gray-600 opacity-70">Common actions</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleRequestSession}
                className="w-full text-left px-4 py-3 rounded-xl bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600 opacity-70">event</span>
                  <span className="text-gray-800">Request New Session</span>
                </div>
              </button>
              <button
                onClick={() => setShowMessageForm(!showMessageForm)}
                className="w-full text-left px-4 py-3 rounded-xl bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600 opacity-70">message</span>
                  <span className="text-gray-800">Send Message</span>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all">
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600 opacity-70">history</span>
                  <span className="text-gray-800">View Session History</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrainerPage;

