// app/trainer/help/page.tsx
'use client';

import React, { useState } from 'react';
import { MdHelpOutline, MdExpandMore, MdExpandLess, MdEmail, MdPhone } from 'react-icons/md';

export default function TrainerHelp() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I create a workout plan for my members?',
      answer: 'Go to the Workout Plans page and click "Create New Plan". Fill in the plan details including name, duration, and days per week. Once created, you can assign it to members from the plan details page.',
    },
    {
      question: 'How can I track member progress?',
      answer: 'Visit the Progress Tracking page to view detailed progress data for all your assigned members. You can see their weight, body fat, muscle mass, and workout completion statistics.',
    },
    {
      question: 'How do I schedule a training session?',
      answer: 'Go to the Schedule page and click "Add Session". Select the member, date, time, duration, and session type. The session will appear in your schedule and the member will be notified.',
    },
    {
      question: 'Can I create custom diet plans?',
      answer: 'Yes! Go to the Diet Plans page and click "Create New Plan". Specify the calories, protein, carbs, and fats for the plan. You can then assign it to members who need nutritional guidance.',
    },
    {
      question: 'How do I view all my assigned members?',
      answer: 'Visit the My Members page to see a complete list of all members assigned to you. You can search by name or email, and view their progress, upcoming sessions, and contact information.',
    },
    {
      question: 'What should I do if a member cancels a session?',
      answer: 'Go to the Schedule page, find the session, and click the delete button. You can then reschedule if needed. The member will be notified of the cancellation.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <MdHelpOutline className="text-blue-600 text-2xl sm:text-3xl flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Help & Support</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Find answers to common questions and get support</p>
      </div>

      {/* Contact Support */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Contact Support</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#ecf0f3] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none">
            <div className="flex items-center gap-3 mb-2">
              <MdEmail className="text-blue-600 text-xl" />
              <h3 className="font-semibold text-gray-800">Email Support</h3>
            </div>
            <p className="text-sm text-gray-600">support@gymsetu.com</p>
            <p className="text-xs text-gray-500 mt-1">We typically respond within 24 hours</p>
          </div>
          <div className="bg-[#ecf0f3] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none">
            <div className="flex items-center gap-3 mb-2">
              <MdPhone className="text-blue-600 text-xl" />
              <h3 className="font-semibold text-gray-800">Phone Support</h3>
            </div>
            <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
            <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9 AM - 6 PM EST</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#ecf0f3] rounded-xl shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#ecf0f3] transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                {openFaq === index ? (
                  <MdExpandLess className="text-gray-600 text-xl flex-shrink-0" />
                ) : (
                  <MdExpandMore className="text-gray-600 text-xl flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm border-t border-gray-300 border-opacity-30 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-[#ecf0f3] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <a
            href="/trainer/workout-plans"
            className="bg-[#ecf0f3] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none hover:shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-shadow text-gray-800 font-semibold"
          >
            Create Workout Plans
          </a>
          <a
            href="/trainer/diet-plans"
            className="bg-[#ecf0f3] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none hover:shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-shadow text-gray-800 font-semibold"
          >
            Create Diet Plans
          </a>
          <a
            href="/trainer/schedule"
            className="bg-[#ecf0f3] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none hover:shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-shadow text-gray-800 font-semibold"
          >
            Manage Schedule
          </a>
          <a
            href="/trainer/progress"
            className="bg-[#ecf0f3] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] border-none hover:shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] transition-shadow text-gray-800 font-semibold"
          >
            Track Progress
          </a>
        </div>
      </div>
    </div>
  );
}

