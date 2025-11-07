// app/member/layout.tsx
'use client';

import React from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#ecf0f3]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 mt-16 lg:mt-24">
          {children}
        </main>
      </div>
    </div>
  );
}