'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
  MdFitnessCenter,
  MdRestaurant,
  MdTrendingUp,
  MdAccountCircle,
} from 'react-icons/md';
import { IconType } from 'react-icons';
import { logoutUser, getCurrentUser, UserData, fetchGymProfile, GymProfile, isMember } from '@/lib/auth';
import { fetchMemberProfile } from '@/lib/memberApi';

interface NavItem {
  title: string;
  path: string;
  icon: IconType;
}

// Owner/Gym navigation items
const ownerNavConfig: NavItem[] = [
  { title: 'dashboard', path: '/dashboard', icon: MdDashboard },
  { title: 'members', path: '/dashboard/members', icon: MdPeople },
  { title: 'trainers', path: '/dashboard/trainers', icon: MdOutlineSportsGymnastics },
  { title: 'subscriptions', path: '/dashboard/subscriptions', icon: MdProductionQuantityLimits },
  { title: 'contest', path: '/dashboard/contest', icon: MdSportsKabaddi },
  { title: 'leaderboard', path: '/dashboard/leaderboard', icon: MdLeaderboard },
  { title: 'settings', path: '/dashboard/settings', icon: MdSettings },
  { title: 'help', path: '/dashboard/help', icon: MdHelpOutline },
];

// Member navigation items
const memberNavConfig: NavItem[] = [
  { title: 'dashboard', path: '/member', icon: MdDashboard },
  { title: 'workout plan', path: '/member/workout-plan', icon: MdFitnessCenter },
  { title: 'diet plan', path: '/member/diet-plan', icon: MdRestaurant },
  { title: 'my trainer', path: '/member/my-trainer', icon: MdOutlineSportsGymnastics },
  { title: 'contests', path: '/member/contests', icon: MdSportsKabaddi },
  { title: 'my progress', path: '/member/progress', icon: MdTrendingUp },
  { title: 'my profile', path: '/member/profile', icon: MdAccountCircle },
  { title: 'settings', path: '/member/settings', icon: MdSettings },
  { title: 'help', path: '/member/help', icon: MdHelpOutline },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const logoSrc = '/images/logo.svg';
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [gymProfile, setGymProfile] = React.useState<GymProfile | null>(null);
  const [isMemberUser, setIsMemberUser] = React.useState(false);
  const [memberProfilePhoto, setMemberProfilePhoto] = React.useState<string | null>(null);

  // Get user data and gym profile on mount
  React.useEffect(() => {
    const loadUserData = async () => {
      const user = await getCurrentUser();
      setUserData(user);
      
      // Check if user is a member
      const memberCheck = isMember();
      setIsMemberUser(memberCheck);
      
      if (memberCheck) {
        // Fetch member profile to get profile photo
        try {
          const memberProfile = await fetchMemberProfile();
          if (memberProfile.member) {
            setMemberProfilePhoto(memberProfile.member.profilePhoto || memberProfile.member.dp_link || null);
          } else if (memberProfile.profilePhoto || memberProfile.dp_link) {
            setMemberProfilePhoto(memberProfile.profilePhoto || memberProfile.dp_link || null);
          }
        } catch (error) {
          console.error('Failed to load member profile:', error);
        }
      } else {
        // Fetch gym profile to get logo (only for owners)
        try {
          const profile = await fetchGymProfile();
          if (profile) {
            setGymProfile(profile);
          }
        } catch (error) {
          console.error('Failed to load gym profile:', error);
        }
      }
    };
    loadUserData();
  }, []);

  // Get navigation config based on user type
  const navConfig = isMemberUser ? memberNavConfig : ownerNavConfig;

  const handleLogout = async () => {
    await logoutUser();
    if (isMemberUser) {
      router.push('/members/login');
    } else {
      router.push('/login');
    }
  };

  // Check if a nav item is active based on current pathname
  const isActive = (path: string) => {
    // Normalize paths: remove trailing slashes and handle exact matches
    const normalizedPathname = pathname?.replace(/\/$/, '') || '';
    const normalizedPath = path.replace(/\/$/, '');
    
    // For dashboard routes, check if it's exactly the path (with or without trailing slash)
    if (normalizedPath === '/dashboard' || normalizedPath === '/member') {
      return normalizedPathname === normalizedPath || normalizedPathname === `${normalizedPath}/`;
    }
    
    // For other paths, check if pathname starts with the path
    return normalizedPathname.startsWith(normalizedPath);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {onClose !== undefined && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 flex flex-col h-screen w-64 bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-none overflow-hidden ${
        onClose !== undefined ? 'transform transition-transform duration-300 ease-in-out' : ''
      } ${
        onClose !== undefined ? (isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0') : 'translate-x-0'
      }`}>
        {/* Mobile Close Button */}
        {onClose !== undefined && (
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <MdClose size={20} className="text-gray-700" />
            </button>
          </div>
        )}

        {/* Logo Section */}
        <div className="flex items-center justify-center p-6 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image src={logoSrc} alt="GymSetu Logo" width={48} height={48} className="w-12 h-12 rounded-full shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff]" />
            <span className="font-bold text-gray-700 text-lg tracking-wide">GymSetu</span>
          </Link>
        </div>

      {/* User Info Card */}
      <div className="mx-5 my-6 p-4 rounded-2xl bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] flex items-center">
        {isMemberUser ? (
          // Member view - show member profile photo or default
          <>
            {memberProfilePhoto ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] overflow-hidden">
                <img
                  src={memberProfilePhoto}
                  alt={userData?.name || 'Member'}
                  className="w-12 h-12 object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-icon')) {
                      const icon = document.createElement('div');
                      icon.className = 'fallback-icon w-12 h-12 flex items-center justify-center rounded-full bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] text-green-600';
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                      parent.appendChild(icon);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] text-green-600">
                <MdAccountCircle size={24} />
              </div>
            )}
            <div className="ml-4">
              <h6 className="font-semibold text-gray-800 text-sm">{userData?.name || 'Member'}</h6>
              <p className="text-xs text-gray-500">{userData?.email || 'member@example.com'}</p>
            </div>
          </>
        ) : (
          // Owner view - show gym logo
          <>
            {gymProfile?.logo_link ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] overflow-hidden">
                <img
                  src={gymProfile.logo_link}
                  alt={gymProfile.name || 'Gym Logo'}
                  className="w-12 h-12 object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-icon')) {
                      const icon = document.createElement('div');
                      icon.className = 'fallback-icon w-12 h-12 flex items-center justify-center rounded-full bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] text-green-600';
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';
                      parent.appendChild(icon);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#ecf0f3] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff] text-green-600">
                <MdPeople size={24} />
              </div>
            )}
            <div className="ml-4">
              <h6 className="font-semibold text-gray-800 text-sm">{gymProfile?.name || userData?.name || 'Admin'}</h6>
              <p className="text-xs text-gray-500">{gymProfile?.email || userData?.email || 'admin@gmail.com'}</p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-grow pt-10 overflow-y-auto px-4">
        <ul className="list-none space-y-2">
          {navConfig.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            const baseClasses =
              'flex items-center p-3 rounded-xl transition-all duration-200';
            const activeClasses =
              'text-[#67d18a] font-semibold shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff]';
            const inactiveClasses =
              'text-gray-600 font-medium shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] hover:text-[#67d18a]';

            return (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
                  onClick={() => onClose && onClose()}
                >
                  <div className="w-7 h-7 flex items-center justify-center mr-4 rounded-full bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
                    <Icon size={18} />
                  </div>
                  <span className="capitalize text-sm">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom filler or extra button */}
      <div className="flex-shrink-0 p-6">
        <button 
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-gray-700 font-semibold text-sm bg-[#ecf0f3] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all duration-200"
        >
          Logout
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
