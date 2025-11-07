"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UnifiedSidebar from "@/components/shared/UnifiedSidebar";
import UnifiedTopbar from "@/components/shared/UnifiedTopbar";
import { ownerMenuItems } from "@/config/menuConfig";
import { isAuthenticated, verifyToken, logout, isMember } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if token exists
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      // Verify token is still valid
      const isValid = await verifyToken();
      if (!isValid) {
        logout();
        router.push("/login");
        return;
      }

      // If user is a member, redirect to member dashboard
      if (isMember()) {
        router.push("/member");
        return;
      }

      // Auth is valid, show dashboard
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar 
        menuItems={ownerMenuItems}
        userRole="owner"
        basePath="/dashboard"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <UnifiedTopbar 
          userRole="owner"
          profilePath="/dashboard/settings"
          settingsPath="/dashboard/settings"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}