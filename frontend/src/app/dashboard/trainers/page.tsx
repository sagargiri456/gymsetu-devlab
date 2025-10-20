"use client";
import React from "react";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdMoreVert,
  MdOutlineSportsGymnastics,
} from "react-icons/md";

// --- Neomorphic Status Badge ---
const StatusBadge: React.FC<{ status: "Active" | "Inactive" }> = ({ status }) => {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        isActive ? "text-green-700" : "text-red-700"
      } bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]`}
    >
      {status}
    </span>
  );
};

// --- Sample Trainers Data ---
interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  certificationId: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  status: "Active" | "Inactive";
}

const trainers: Trainer[] = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Johnson",
    certificationId: "CERT-789",
    specialization: "Weightlifting",
    phoneNumber: "+1 555-123-4567",
    email: "alex.j@gym.com",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Gomez",
    certificationId: "CERT-002",
    specialization: "Yoga & Pilates",
    phoneNumber: "+44 20-7123-4567",
    email: "maria.g@gym.com",
    status: "Active",
  },
  {
    id: 3,
    firstName: "Samir",
    lastName: "Khan",
    certificationId: "CERT-999",
    specialization: "Cardio",
    phoneNumber: "+91 98765-43210",
    email: "samir.k@gym.com",
    status: "Inactive",
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Wang",
    certificationId: "CERT-101",
    specialization: "CrossFit",
    phoneNumber: "+1 555-987-6543",
    email: "emily.w@gym.com",
    status: "Active",
  },
  {
    id: 5,
    firstName: "Chris",
    lastName: "Lee",
    certificationId: "CERT-555",
    specialization: "Boxing",
    phoneNumber: "+61 412-345-678",
    email: "chris.l@gym.com",
    status: "Active",
  },
];

const TrainersPage: React.FC = () => {
  const headers = [
    "First Name",
    "Last Name",
    "Cert. ID",
    "Specialization",
    "Phone Number",
    "Email",
    "Status",
  ];

  return (
    <div className="ml-0 lg:ml-64 pt-16 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Trainers
        </h4>

        <a
          href="#"
          className="inline-flex items-center justify-center px-5 py-2.5 font-semibold text-sm rounded-full text-white bg-[rgb(0,171,85)] shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] hover:bg-[rgb(0,150,70)] transition-all duration-200"
        >
          <MdAdd size={20} className="mr-2 -ml-1" />
          New Trainer
        </a>
      </div>

      {/* Card */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
        {/* Search and Filter */}
        <div className="flex items-center justify-between p-6">
          <div className="relative flex items-center w-72 rounded-full px-4 py-2 bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <MdSearch size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search trainer..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          <button className="p-3 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all text-gray-600">
            <MdFilterList size={22} />
          </button>
        </div>

        {/* Table */}
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
                <th></th>
                {headers.map((h) => (
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
              {trainers.map((trainer) => (
                <tr
                  key={trainer.id}
                  className="border-b border-gray-200 hover:bg-[#d8d8d8] transition-all"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ecf0f3] shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]">
                      <MdOutlineSportsGymnastics
                        size={22}
                        className="text-gray-600"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{trainer.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trainer.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trainer.certificationId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trainer.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trainer.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trainer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={trainer.status} />
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
          <p className="text-sm text-gray-600 mr-6">Rows per page: 5</p>
          <p className="text-sm text-gray-600 mr-8">1–5 of 5</p>
          <div className="flex space-x-2">
            <button
              disabled
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-700 shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] disabled:text-gray-400 disabled:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdKeyboardArrowLeft size={20} />
            </button>
            <button
              disabled
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

export default TrainersPage;
