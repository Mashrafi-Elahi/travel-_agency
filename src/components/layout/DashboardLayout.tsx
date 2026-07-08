import React, { useState } from "react";
import Sidebar, { SidebarTab } from "./Sidebar";
import Header from "./Header";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  headerTitle: string;
  headerSubtitle?: string;
}

export default function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  headerTitle,
  headerSubtitle,
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleTabSelect = (tab: SidebarTab) => {
    onTabChange(tab);
    setMobileSidebarOpen(false); // Close sidebar drawer on selection
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/50 font-sans">
      {/* Desktop Sidebar (Always visible on lg screen) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar activeTab={activeTab} onTabChange={handleTabSelect} />
      </div>

      {/* Mobile Sidebar Slideover Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 h-full shadow-2xl z-10 animate-slide-in">
            {/* Close button inside sidebar */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <Sidebar activeTab={activeTab} onTabChange={handleTabSelect} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Custom Header Wrapper supporting mobile menu trigger */}
        <div className="flex items-center bg-white border-b border-slate-100">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-4 text-slate-500 hover:text-slate-800 focus:outline-hidden hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <Header title={headerTitle} subtitle={headerSubtitle} />
          </div>
        </div>

        {/* Core Screen Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
