"use client";
import React from "react";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdMoreVert,
  MdPerson,
} from "react-icons/md";

// --- Status Badge (Neomorphic Flat Style) ---
const StatusBadge: React.FC<{ status: "Yes" | "No" }> = ({ status }) => {
  const isYes = status === "Yes";
  const baseShadow =
    "shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff]";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        isYes
          ? "text-green-700 bg-[#e0e0e0]"
          : "text-red-700 bg-[#e0e0e0]"
      } ${baseShadow}`}
    >
      {status}
    </span>
  );
};

// --- Fake Data ---
interface Member {
  id: number;
  firstName: string;
  lastName: string;
  cin: string;
  birthday: string;
  phoneNumber: string;
  gender: "male" | "female";
  status: "Yes" | "No";
}

const members: Member[] = [
  {
    id: 1,
    firstName: "Mark",
    lastName: "Mark",
    cin: "",
    birthday: "17 August 2000",
    phoneNumber: "+91 7894-561230",
    gender: "male",
    status: "Yes",
  },
  {
    id: 2,
    firstName: "Sharmake",
    lastName: "Hassan",
    cin: "0010",
    birthday: "20 September 2000",
    phoneNumber: "21275453316",
    gender: "male",
    status: "Yes",
  },
  {
    id: 3,
    firstName: "Satyajeet",
    lastName: "Jashav",
    cin: "dslnjflos",
    birthday: "10 September 2025",
    phoneNumber: "721584569",
    gender: "male",
    status: "Yes",
  },
];

const MembersPage: React.FC = () => {
  const tableHeaders = [
    "First Name",
    "Last Name",
    "CIN",
    "Birthday",
    "Phone Number",
    "Gender",
    "Status",
  ];

  return (
    <div className="ml-0 lg:ml-64 pt-16 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#ecf0f3]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10 gap-4">
        <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Members
        </h4>

        {/* New Member Button */}
        <a
          href="#"
          className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 font-semibold text-sm rounded-full text-white bg-[rgb(0,171,85)] shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] hover:bg-[rgb(0,150,70)] transition-all duration-200 w-full sm:w-auto"
        >
          <MdAdd size={20} className="mr-2 -ml-1" />
          New Member
        </a>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] overflow-hidden">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4">
          {/* Search Box */}
          <div className="relative flex items-center w-full sm:w-72 rounded-full px-4 py-2 bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]">
            <MdSearch size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search member..."
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Filter */}
          <button className="p-3 rounded-full bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all text-gray-600 w-full sm:w-auto">
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
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left font-semibold tracking-wide"
                  >
                    {header}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-200 hover:bg-[#d8d8d8] transition-all"
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                  </td>

                  {/* Avatar */}
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ecf0f3] shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]">
                      <MdPerson size={22} className="text-gray-600" />
                    </div>
                  </td>
                  {/* Data */}
                  <td className="px-6 py-4">{member.firstName}</td>
                  <td className="px-6 py-4">{member.lastName}</td>
                  <td className="px-6 py-4">{member.cin}</td>
                  <td className="px-6 py-4">{member.birthday}</td>
                  <td className="px-6 py-4">{member.phoneNumber}</td>
                  <td className="px-6 py-4 capitalize">{member.gender}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={member.status} />
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
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
          <p className="text-sm text-gray-600 mr-8">1–3 of 3</p>
          <div className="flex space-x-2">
            <button
              disabled
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-400 shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
            >
              <MdKeyboardArrowLeft size={20} />
            </button>
            <button
              disabled
              className="p-2 rounded-full bg-[#ecf0f3] text-gray-400 shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]"
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
