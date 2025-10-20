"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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