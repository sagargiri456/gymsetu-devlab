// app/trainer/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import { isAuthenticated, verifyToken, logout, isTrainer } from '@/lib/auth';

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check for trainer token first
      const trainerToken = localStorage.getItem('trainer_access_token');
      if (trainerToken) {
        // Also set as access_token for compatibility
        localStorage.setItem('access_token', trainerToken);
      }

      // Check if token exists
      if (!isAuthenticated()) {
        router.push('/trainers/login');
        return;
      }

      // Verify token is still valid
      const isValid = await verifyToken();
      if (!isValid) {
        logout();
        localStorage.removeItem('trainer_access_token');
        router.push('/trainers/login');
        return;
      }

      // If user is not a trainer, redirect to appropriate login
      if (!isTrainer()) {
        // Check if it's a member
        const memberToken = localStorage.getItem('member_access_token');
        if (memberToken) {
          router.push('/member');
          return;
        }
        // Otherwise redirect to gym owner login
        router.push('/login');
        return;
      }

      // Auth is valid, show dashboard
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ecf0f3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#67d18a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#ecf0f3]">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Topbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-10 mt-14 sm:mt-16 md:mt-20 lg:mt-24">
          {children}
        </main>
      </div>
    </div>
  );
}

