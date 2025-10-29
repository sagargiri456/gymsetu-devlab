'use client';
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  MdMenu,
  MdSearch,
  MdOutlineNotifications,
} from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import Image from "next/image";

// Styled Components for Dark Mode Toggle
const StyledWrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    --hue: 220deg;
    --width: 4rem;
    --accent-hue: 22deg;
    --duration: 0.6s;
    --easing: cubic-bezier(1, 0, 1, 1);
  }

  .togglesw {
    display: none;
  }

  .switch {
    --shadow-offset: calc(var(--width) / 20);
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: var(--width);
    height: calc(var(--width) / 2.5);
    border-radius: var(--width);
    box-shadow: inset 10px 10px 10px hsl(var(--hue) 20% 80%),
      inset -10px -10px 10px hsl(var(--hue) 20% 93%);
  }

  .indicator {
    content: '';
    position: absolute;
    width: 40%;
    height: 60%;
    transition: all var(--duration) var(--easing);
    box-shadow: inset 0 0 2px hsl(var(--hue) 20% 15% / 60%),
      inset 0 0 3px 2px hsl(var(--hue) 20% 15% / 60%),
      inset 0 0 5px 2px hsl(var(--hue) 20% 45% / 60%);
  }

  .indicator.left {
    --hue: var(--accent-hue);
    overflow: hidden;
    left: 10%;
    border-radius: 100px 0 0 100px;
    background: linear-gradient(180deg, hsl(calc(var(--accent-hue) + 20deg) 95% 80%) 10%, hsl(calc(var(--accent-hue) + 20deg) 100% 60%) 30%, hsl(var(--accent-hue) 90% 50%) 60%, hsl(var(--accent-hue) 90% 60%) 75%, hsl(var(--accent-hue) 90% 50%));
  }

  .indicator.left::after {
    content: '';
    position: absolute;
    opacity: 0.6;
    width: 100%;
    height: 100%;
  }

  .indicator.right {
    right: 10%;
    border-radius: 0 100px 100px 0;
    background-image: linear-gradient(180deg, hsl(var(--hue) 20% 95%), hsl(var(--hue) 20% 65%) 60%, hsl(var(--hue) 20% 70%) 70%, hsl(var(--hue) 20% 65%));
  }

  .button {
    position: absolute;
    z-index: 1;
    width: 55%;
    height: 80%;
    left: 5%;
    border-radius: 100px;
    background-image: linear-gradient(160deg, hsl(var(--hue) 20% 95%) 40%, hsl(var(--hue) 20% 65%) 70%);
    transition: all var(--duration) var(--easing);
    box-shadow: 2px 2px 3px hsl(var(--hue) 18% 50% / 80%),
      2px 2px 6px hsl(var(--hue) 18% 50% / 40%),
      10px 20px 10px hsl(var(--hue) 18% 50% / 40%),
      20px 30px 30px hsl(var(--hue) 18% 50% / 60%);
  }

  .button::before, 
  .button::after {
    content: '';
    position: absolute;
    top: 10%;
    width: 41%;
    height: 80%;
    border-radius: 100%;
  }

  .button::before {
    left: 5%;
    box-shadow: inset 1px 1px 2px hsl(var(--hue) 20% 85%);
    background-image: linear-gradient(-50deg, hsl(var(--hue) 20% 95%) 20%, hsl(var(--hue) 20% 85%) 80%);
  }

  .button::after {
    right: 5%;
    box-shadow: inset 1px 1px 3px hsl(var(--hue) 20% 70%);
    background-image: linear-gradient(-50deg, hsl(var(--hue) 20% 95%) 20%, hsl(var(--hue) 20% 75%) 80%);
  }

  .togglesw:checked ~ .button {
    left: 40%;
  }

  .togglesw:not(:checked) ~ .indicator.left,
  .togglesw:checked ~ .indicator.right {
    box-shadow: inset 0 0 5px hsl(var(--hue) 20% 15% / 100%),
      inset 20px 20px 10px hsl(var(--hue) 20% 15% / 100%),
      inset 20px 20px 15px hsl(var(--hue) 20% 45% / 100%);
  }
`;

// Dark Mode Toggle Component
const DarkModeToggle: React.FC = () => {
  // Initialize from localStorage, default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      // Check if dark class is already on document (for initial page load)
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Initialize dark mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      const shouldBeDark = saved === 'true' || document.documentElement.classList.contains('dark');
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    }
  }, []);

  const toggleDarkMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    console.log('Dark mode toggle clicked:', checked);
    setIsDarkMode(checked);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', checked.toString());
    }
    
    // Toggle dark class on document element
    if (checked) {
      document.documentElement.classList.add('dark');
      console.log('Dark mode enabled');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Dark mode disabled');
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <label className="switch">
          <input 
            className="togglesw" 
            type="checkbox" 
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <div className="indicator left" />
          <div className="indicator right" />
          <div className="button" />
        </label>
      </div>
    </StyledWrapper>
  );
};

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const notificationCount = 13;
  const adminName = "admin";
  const profileImageSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QTwvdGV4dD4KPC9zdmc+";

  return (
    <header className="fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-256px)] transition-all duration-300 ease-in-out">
      <div className="flex items-center min-h-16 px-4 md:px-6 lg:min-h-24 lg:px-10 bg-[#ecf0f3] shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] rounded-bl-2xl">
        {/* Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-gray-700 p-3 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all"
        >
          <MdMenu size={22} />
        </button>

        {/* Search Bar */}
        <div className="relative flex items-center w-60 md:w-80 ml-4 px-3 py-2 rounded-full bg-[#ecf0f3] shadow-[inset_5px_5px_10px_#cbced1,inset_-5px_-5px_10px_#ffffff] transition-all duration-200">
          <MdSearch size={20} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search user..."
            className="w-full text-sm text-gray-700 bg-transparent border-none focus:outline-none placeholder-gray-500"
          />
        </div>

        <div className="flex-grow"></div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Dark Mode Toggle */}
          <div className="w-16 h-8">
            <DarkModeToggle />
          </div>

          {/* Language */}
          <button className="text-gray-700 p-3 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all">
            <FaGlobe size={18} />
          </button>

          {/* Notifications */}
          <button className="relative text-gray-700 p-3 rounded-full bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all">
            <MdOutlineNotifications size={22} />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {notificationCount}
            </span>
          </button>

          {/* Profile Avatar */}
          <button className="p-[3px] rounded-full w-10 h-10 bg-[#ecf0f3] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff] transition-all overflow-hidden">
            <Image
              src={profileImageSrc}
              alt={adminName}
              width={40}
              height={40}
              className="object-cover w-full h-full rounded-full"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
