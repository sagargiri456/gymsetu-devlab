"use client";
import React from "react";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdMoreVert,
  MdPeople,
} from "react-icons/md";

// Utility function for date formatting
const formatDate = (date: Date): string => {
  // Use 'short' month for brevity in the table
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// --- Neomorphic Status Badge ---
const StatusBadge: React.FC<{ status: 'active' | string }> = ({ status }) => {
  const isActive = status === "active";
  const statusDisplay = isActive ? "Active" : "Expired";
  
  // Neumorphic inset shadow for a "pressed" look
  const baseShadow =
    "shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase ${
        isActive
          ? "text-green-700"
          : "text-red-700"
      } bg-[#ecf0f3] ${baseShadow}`}
    >
      {statusDisplay}
    </span>
  );
};

// --- Data Structure and Sample Data based on Models ---
interface SubscriptionData {
  id: number;
  member_name: string;
  member_email: string;
  subscription_plan: string;
  subscription_status: 'active' | 'expired';
  start_date: Date;
  end_date: Date;
}

const subscriptions: SubscriptionData[] = [
  {
    id: 101,
    member_name: "Alex Johnson",
    member_email: "alex.j@mail.com",
    subscription_plan: "Annual Platinum (365 days)",
    subscription_status: "active",
    start_date: new Date('2025-10-01'),
    end_date: new Date('2026-10-01'),
  },
  {
    id: 102,
    member_name: "Maria Gomez",
    member_email: "maria.g@mail.com",
    subscription_plan: "Monthly Pass (30 days)",
    subscription_status: "active",
    start_date: new Date('2025-09-15'),
    end_date: new Date('2025-10-15'),
  },
  {
    id: 103,
    member_name: "Samir Khan",
    member_email: "samir.k@mail.com",
    subscription_plan: "Quarterly Flex (90 days)",
    subscription_status: "expired",
    start_date: new Date('2024-05-20'),
    end_date: new Date('2024-08-20'),
  },
  {
    id: 104,
    member_name: "Emily Wang",
    member_email: "emily.w@mail.com",
    subscription_plan: "Monthly Pass (30 days)",
    subscription_status: "active",
    start_date: new Date('2025-09-10'),
    end_date: new Date('2025-10-10'),
  },
  {
    id: 105,
    member_name: "Chris Lee",
    member_email: "chris.l@mail.com",
    subscription_plan: "Weekly Trial (7 days)",
    subscription_status: "expired",
    start_date: new Date('2025-07-01'),
    end_date: new Date('2025-07-08'),
  },
];

const SubscriptionsPage: React.FC = () => {
  const tableHeaders = [
    "ID",
    "Member Name",
    "Email",
    "Plan",
    "Start Date",
    "End Date",
    "Status",
  ];

  const totalRecords = subscriptions.length;
  const rowsPerPage = 5;
  const currentPage = 1; // For pagination display only
  const startRange = (currentPage - 1) * rowsPerPage + 1;
  const endRange = Math.min(currentPage * rowsPerPage, totalRecords);

  return (
    <div className="ml-0 lg:ml-64 pt-16 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3]">
      
      {/* Header and Add Button */}
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Subscriptions
        </h4>

        {/* New Subscription Button - Neumorphic Button Style */}
        <a
          href="#"
          className="inline-flex items-center justify-center px-5 py-2.5 font-semibold text-sm rounded-full text-white bg-[rgb(0,171,85)] shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] hover:bg-[rgb(0,150,70)] transition-all duration-200"
        >
          <MdAdd size={20} className="mr-2 -ml-1" />
          New Subscription
        </a>
      </div>

      {/* Table Card - Neumorphic Card Style */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
        
        {/* Search + Filter Bar */}
        <div className="flex items-center justify-between p-6">
          {/* Search Box - Neumorphic Inset Style */}
          <div className="relative flex items-center w-72 rounded-full px-4 py-2 bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <MdSearch size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Filter Button - Neumorphic Icon Button Style */}
          <button className="p-3 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all text-gray-600">
            <MdFilterList size={22} />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="text-gray-700 uppercase bg-[#ecf0f3] border-b border-gray-300">
              <tr>
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 accent-green-600"
                  />
                </th>
                {tableHeaders.map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left font-semibold tracking-wide"
                  >
                    {h}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-gray-200 hover:bg-[#d8d8d8] transition-all"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{sub.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
                        <MdPeople size={18} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-800">{sub.member_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">{sub.member_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{sub.subscription_plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(sub.start_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatDate(sub.end_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={sub.subscription_status} />
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button className="p-2 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all">
                      <MdMoreVert size={18} className="text-gray-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end p-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 mr-6">Rows per page: {rowsPerPage}</p>
          <p className="text-sm text-gray-600 mr-8">{startRange}–{endRange} of {totalRecords}</p>
          <div className="flex space-x-2">
            {/* Previous Page Button - Neumorphic Icon Button Style */}
            <button
              disabled={startRange === 1}
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-700 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] disabled:text-gray-400 disabled:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdKeyboardArrowLeft size={20} />
            </button>
            {/* Next Page Button - Neumorphic Icon Button Style */}
            <button
              disabled={endRange === totalRecords}
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-700 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] disabled:text-gray-400 disabled:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;