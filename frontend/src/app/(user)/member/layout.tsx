// app/member/layout.tsx
'use client';

import React from 'react';
import UnifiedSidebar from '@/components/shared/UnifiedSidebar';
import UnifiedTopbar from '@/components/shared/UnifiedTopbar';
import { memberMenuItems } from '@/config/menuConfig';

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar 
        menuItems={memberMenuItems}
        userRole="member"
        basePath="/member"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <UnifiedTopbar 
          userRole="member"
          profilePath="/member/profile"
          settingsPath="/member/settings"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}