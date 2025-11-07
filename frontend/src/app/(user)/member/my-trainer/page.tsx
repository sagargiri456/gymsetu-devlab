// app/member/my-trainer/page.tsx
'use client';

import React, { useState } from 'react';
import { Trainer } from '@/types/member';

const MyTrainerPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);

  // Mock trainer data
  const trainer: Trainer = {
    id: '1',
    name: 'Michael Johnson',
    email: 'michael.johnson@gymsetu.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Strength Training & Bodybuilding',
    experience: 8,
    photo: undefined,
    bio: 'Certified personal trainer with 8 years of experience in strength training and bodybuilding. Specialized in helping athletes and fitness enthusiasts achieve their goals through customized workout plans and nutrition guidance.',
    nextSession: '2024-12-15 at 10:00 AM'
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic
      console.log('Sending message:', message);
      setMessage('');
      setShowMessageForm(false);
      alert('Message sent successfully!');
    }
  };

  const handleRequestSession = () => {
    alert('Session request submitted! Your trainer will contact you soon.');
  };

  return (
    <div className="space-y-6">
      {/* Trainer Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {trainer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {trainer.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {trainer.specialization}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons text-sm align-middle mr-1">star</span>
                  {trainer.experience} years experience
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <span className="material-icons text-sm mr-2 align-middle">message</span>
              Send Message
            </button>
            <button
              onClick={handleRequestSession}
              className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <span className="material-icons text-sm mr-2 align-middle">event</span>
              Request Session
            </button>
          </div>
        </div>
      </div>

      {/* Message Form */}
      {showMessageForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Send Message to {trainer.name}
          </h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => {
                setShowMessageForm(false);
                setMessage('');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About Your Trainer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {trainer.bio}
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-400">email</span>
                <a href={`mailto:${trainer.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {trainer.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-400">phone</span>
                <a href={`tel:${trainer.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Next Session
              </h2>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="material-icons text-blue-600 dark:text-blue-400">event</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {trainer.nextSession}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Training Session
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                onClick={handleRequestSession}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600 dark:text-gray-400">event</span>
                  <span className="text-gray-700 dark:text-gray-300">Request New Session</span>
                </div>
              </button>
              <button
                onClick={() => setShowMessageForm(!showMessageForm)}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600 dark:text-gray-400">message</span>
                  <span className="text-gray-700 dark:text-gray-300">Send Message</span>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600 dark:text-gray-400">history</span>
                  <span className="text-gray-700 dark:text-gray-300">View Session History</span>
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

