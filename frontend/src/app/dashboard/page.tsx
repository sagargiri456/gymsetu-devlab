"use client";
import React from 'react';
import { MdPeople, MdOutlineSportsGymnastics, MdOutlinePayment, MdMonetizationOn, MdArrowUpward } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

// --- Neumorphic Card Component ---
interface StatCardProps {
  title: string;
  value: string;
  Icon: React.ElementType;
  bgColorClass: string;
  iconColorClass: string;
}

const NeumorphicStatCard: React.FC<StatCardProps> = ({ title, value, Icon, bgColorClass, iconColorClass }) => {
  // Neumorphic shadow style
  const shadowStyle = 'shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff]';

  return (
    // Card Container (Outer convex shadow)
    <div className={`p-8 text-center rounded-3xl bg-[#ecf0f3] ${shadowStyle} transition-all duration-300 hover:scale-[1.01] flex flex-col items-center`}>
      
      {/* Icon Circle (Inner pressed circle) */}
      <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#ecf0f3] p-1.5"
           style={{boxShadow: 'inset 4px 4px 8px #cbced1, inset -4px -4px 8px #ffffff'}}>
        <div className={`w-full h-full flex items-center justify-center rounded-full ${bgColorClass} ${iconColorClass}`}>
            <Icon size={30} />
        </div>
      </div>
      
      {/* Value */}
      <h3 className="text-4xl font-extrabold text-gray-800 mb-1 drop-shadow-[1px_1px_0px_#fff]">
        {value}
      </h3>
      
      {/* Title */}
      <h6 className="text-sm font-semibold text-gray-600 opacity-80">
        {title}
      </h6>
    </div>
  );
};

// --- Neumorphic Chart Card Component ---
interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  spanClass?: string;
}

const NeumorphicChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, spanClass = 'col-span-full' }) => {
  const shadowStyle = 'shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff]';
  
  return (
    <div className={`rounded-3xl bg-[#ecf0f3] ${shadowStyle} overflow-hidden p-6 ${spanClass}`}>
      <div className="p-0">
        <h6 className="text-lg font-bold text-gray-800">{title}</h6>
        <p className="text-sm text-gray-600 opacity-70">{subtitle}</p>
      </div>
      <div className="mt-4 p-4 rounded-xl bg-[#ecf0f3] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
        {children}
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

const DashboardPage: React.FC = () => {
  // Data mimicking the summary cards from the HTML structure
  const stats = [
    {
      title: "Monthly Members",
      value: "450",
      Icon: MdPeople,
      bgColorClass: "bg-green-200",
      iconColorClass: "text-green-800",
    },
    {
      title: "Total Trainers",
      value: "15",
      Icon: MdOutlineSportsGymnastics,
      bgColorClass: "bg-blue-200",
      iconColorClass: "text-blue-800",
    },
    {
      title: "Unpaid Memberships",
      value: "8",
      Icon: MdOutlinePayment,
      bgColorClass: "bg-red-200",
      iconColorClass: "text-red-800",
    },
    {
      title: "Total Income (DHS)",
      value: "85K",
      Icon: MdMonetizationOn,
      bgColorClass: "bg-yellow-200",
      iconColorClass: "text-yellow-800",
    },
  ];

  return (
    // Main container with proper positioning for sidebar and topbar
    <div className="ml-0 lg:ml-64 pt-16 lg:pt-24 p-4 sm:p-6 lg:p-10 min-h-screen bg-[#ecf0f3]">
      
      {/* Welcome Header */}
      <div className="mb-8">
        <h4 className="text-3xl font-bold text-gray-800 drop-shadow-[1px_1px_0px_#fff]">
          Hi, Welcome back, Admin
        </h4>
      </div>

      {/* Grid for Stats Cards (4 columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <NeumorphicStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            Icon={stat.Icon}
            bgColorClass={stat.bgColorClass}
            iconColorClass={stat.iconColorClass}
          />
        ))}
      </div>

      {/* Grid for Charts and other Cards (Main content below stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Subscriptions Chart (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <NeumorphicChartCard 
            title="Monthly Subscriptions"
            subtitle="(+43%) than last year"
            spanClass="col-span-full"
          >
            {/* Placeholder for Bar Chart or Line Chart */}
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                            </div>
          </NeumorphicChartCard>
        </div>
        
        {/* Sport Types Pie Chart (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <NeumorphicChartCard 
            title="Sport Types"
            subtitle="by Income"
            spanClass="col-span-full"
          >
            {/* Placeholder for Pie Chart */}
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                            </div>
          </NeumorphicChartCard>
        </div>

        {/* Total Members by Sport (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <NeumorphicChartCard 
            title="Total Members"
            subtitle="by Sport"
            spanClass="col-span-full"
          >
            {/* Placeholder for Horizontal Bar Chart */}
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                            </div>
          </NeumorphicChartCard>
        </div>
        
        {/* Notifications & Events Column (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Notifications Card */}
            <NeumorphicChartCard 
                title="Notifications"
                subtitle="Recent activities"
            >
                {/* Placeholder for notifications list */}
                <ul className="space-y-3 text-sm text-left">
                    <li className="flex items-center text-gray-700">
                        <FaUserCircle className="mr-3 text-brand-green" size={18} /> New member signed up (John Doe).
                    </li>
                    <li className="flex items-center text-gray-700">
                        <MdOutlinePayment className="mr-3 text-blue-600" size={18} /> Maria&apos;s payment is due tomorrow.
                    </li>
                    <li className="flex items-center text-gray-700">
                        <MdArrowUpward className="mr-3 text-green-600" size={18} /> Income target reached 90%.
                    </li>
                </ul>
            </NeumorphicChartCard>

            {/* Today's Events Card */}
            <NeumorphicChartCard 
                title="Today's Events"
                subtitle="Upcoming schedule"
            >
                {/* Placeholder for events/timeline */}
                <ul className="space-y-3 text-sm text-left">
                    <li className="text-gray-700 border-l-4 border-yellow-500 pl-3">
                        <span className="font-semibold">6:00 PM</span> - Cardio Class (Studio A)
                    </li>
                    <li className="text-gray-700 border-l-4 border-purple-500 pl-3">
                        <span className="font-semibold">7:30 PM</span> - Trainer Meeting (Office)
                    </li>
                    <li className="text-gray-700 border-l-4 border-blue-500 pl-3">
                        <span className="font-semibold">9:00 PM</span> - Close Shift
                    </li>
                </ul>
            </NeumorphicChartCard>
        </div>
        
      </div>
    </div>
  );
};

export default DashboardPage;