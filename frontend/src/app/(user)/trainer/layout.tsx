// app/trainer/layout.tsx
'use client';

import React from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#ecf0f3]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-10 mt-14 sm:mt-16 md:mt-20 lg:mt-24">
          {children}
        </main>
      </div>
    </div>
  );
}

