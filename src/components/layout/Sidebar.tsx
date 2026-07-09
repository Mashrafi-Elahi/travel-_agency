import React from "react";
import { LayoutDashboard, Compass, MapPinned, Receipt, Users, ShieldAlert, Settings, HelpCircle, LogOut, MessageSquare, CreditCard } from "lucide-react";

export type SidebarTab = "overview" | "packages" | "destinations" | "bookings" | "customers" | "inquiries" | "payments" | "reviews";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    {
      id: "overview" as SidebarTab,
      label: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "packages" as SidebarTab,
      label: "Travel Packages",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: "destinations" as SidebarTab,
      label: "Destinations",
      icon: <MapPinned className="w-5 h-5" />,
    },
    {
      id: "bookings" as SidebarTab,
      label: "Bookings Manager",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      id: "inquiries" as SidebarTab,
      label: "Inquiry Management",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: "customers" as SidebarTab,
      label: "Customer Records",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "payments" as SidebarTab,
      label: "Payments & Revenue",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "reviews" as SidebarTab,
      label: "Reviews & Ratings",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-brand-500/20">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-white font-black text-sm tracking-wide font-display block uppercase">
            Travel Admin
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            Agency Control Room
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-3 block">
          Main Console
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/10"
                  : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}

        <div className="pt-6 border-t border-slate-800/50 mt-6 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-3 block">
            System
          </div>
          <button
            onClick={() => alert("Settings panel mock-up")}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Control Settings
          </button>
          <button
            onClick={() => alert("Documentation and support mock-up")}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            Support Help
          </button>
        </div>
      </nav>

      {/* Footer Profile Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white border border-slate-700">
            ME
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200 block truncate max-w-[110px]">
              Mashrafe Elahi
            </span>
            <span className="text-[10px] text-slate-500 block">Agent Admin</span>
          </div>
        </div>
        <button
          onClick={() => alert("Session logout mock-up")}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
