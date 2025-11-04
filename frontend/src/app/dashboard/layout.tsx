"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { isAuthenticated, verifyToken, logout } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1">
        <Topbar onMenuClick={toggleSidebar} />
        {children}
      </div>
    </div>
  );
}