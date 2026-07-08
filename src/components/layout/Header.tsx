import React from "react";
import { Bell, Calendar, UserCheck } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  // Using the exact time context provided in the workspace metadata
  const formattedDate = new Date("2026-07-08T00:36:01-07:00").toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="h-16 px-6 lg:px-8 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-base lg:text-lg font-bold text-slate-900 font-display tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="hidden sm:block text-xs text-slate-400 mt-0.5 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Timestamp */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/40">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications mock button */}
        <button
          type="button"
          onClick={() => alert("Notification center: 4 unread alerts")}
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          <Bell className="w-5 h-5" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-4 border-l border-slate-100">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs border border-brand-200">
            ME
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              Mashrafe Elahi
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">
              mashrafeelahi8@gmail.com
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
