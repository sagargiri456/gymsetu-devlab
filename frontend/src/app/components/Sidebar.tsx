'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MdDashboard,
  MdPeople,
  MdOutlineSportsGymnastics,
  MdProductionQuantityLimits,
  MdSportsKabaddi,
  MdLeaderboard,
  MdSettings,
  MdHelpOutline,
  MdClose,
} from 'react-icons/md';
import { IconType } from 'react-icons';

interface NavItem {
  title: string;
  path: string;
  icon: IconType;
  isActive: boolean;
}

const navConfig: NavItem[] = [
  { title: 'dashboard', path: '/dashboard/', icon: MdDashboard, isActive: false },
  { title: 'members', path: '/dashboard/members', icon: MdPeople, isActive: true },
  { title: 'trainers', path: '/dashboard/trainers', icon: MdOutlineSportsGymnastics, isActive: false },
  { title: 'subscriptions', path: '/dashboard/subscriptions', icon: MdProductionQuantityLimits, isActive: false },
  { title: 'contest', path: '/dashboard/contest', icon: MdSportsKabaddi, isActive: false },
  { title: 'leaderboard', path: '/dashboard/leaderboard', icon: MdLeaderboard, isActive: false },
  { title: 'settings', path: '/dashboard/settings', icon: MdSettings, isActive: false },
  { title: 'help', path: '/dashboard/help', icon: MdHelpOutline, isActive: false },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const logoSrc = '/images/logo.svg';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 flex flex-col h-screen w-64 bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none overflow-hidden transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Mobile Close Button */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
          >
            <MdClose size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Logo Section */}
        <div className="flex items-center justify-center p-6 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image src={logoSrc} alt="GymSetu Logo" width={48} height={48} className="w-12 h-12 rounded-full shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff]" />
            <span className="font-bold text-gray-700 text-lg tracking-wide">GymSetu</span>
          </Link>
        </div>

      {/* User Info Card */}
      <div className="mx-5 my-6 p-4 rounded-2xl bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] flex items-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] text-green-600">
          <MdPeople size={24} />
        </div>
        <div className="ml-4">
          <h6 className="font-semibold text-gray-800 text-sm">admin</h6>
          <p className="text-xs text-gray-500">admin@gmail.com</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow pt-10 overflow-y-auto px-4">
        <ul className="list-none space-y-2">
          {navConfig.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            const baseClasses =
              'flex items-center p-3 rounded-xl transition-all duration-200';
            const activeClasses =
              'text-green-600 font-semibold shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]';
            const inactiveClasses =
              'text-gray-600 font-medium shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] hover:text-green-600';

            return (
              <li key={item.title}>
                <a
                  href={item.path}
                  className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
                >
                  <div className="w-7 h-7 flex items-center justify-center mr-4 rounded-full bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
                    <Icon size={18} />
                  </div>
                  <span className="capitalize text-sm">{item.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom filler or extra button */}
      <div className="flex-shrink-0 p-6">
        <button className="w-full py-3 rounded-xl text-gray-700 font-semibold text-sm bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all duration-200">
          Logout
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
