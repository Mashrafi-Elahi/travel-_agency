import React from "react";
import { Customer } from "../../types/travel";
import { Users, DollarSign, CalendarCheck, TrendingUp } from "lucide-react";

interface CustomerStatsProps {
  customers: Customer[];
}

export default function CustomerStats({ customers }: CustomerStatsProps) {
  const totalCustomers = customers.length;
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalBookings = customers.reduce((sum, c) => sum + c.totalBookings, 0);
  const activeCount = customers.filter((c) => c.status === "Active").length;
  const suspendedCount = customers.filter((c) => c.status === "Suspended").length;
  const bannedCount = customers.filter((c) => c.status === "Banned").length;

  const stats = [
    {
      label: "Total Customers",
      value: totalCustomers.toString(),
      icon: <Users className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50/55 border border-blue-100/40",
      bgGlow: "bg-blue-500/5",
      hoverClasses: "hover:border-blue-350 hover:shadow-[0_0_22px_rgba(59,130,246,0.15)]",
      stagger: "stagger-1",
      sub: (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-[9px] font-bold text-emerald-600/80 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
            {activeCount} Active
          </span>
          {suspendedCount > 0 && (
            <span className="text-[9px] font-bold text-amber-600/80 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-md">
              {suspendedCount} Suspended
            </span>
          )}
          {bannedCount > 0 && (
            <span className="text-[9px] font-bold text-rose-600/80 bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded-md">
              {bannedCount} Banned
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Lifetime Revenue",
      value: `$${totalSpent.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5 text-indigo-600" />,
      iconBg: "bg-indigo-50/50 border border-indigo-100/50",
      bgGlow: "bg-indigo-500/5",
      hoverClasses: "hover:border-indigo-350 hover:shadow-[0_0_22px_rgba(99,102,241,0.15)]",
      stagger: "stagger-2",
      sub: null,
    },
    {
      label: "Total Bookings",
      value: totalBookings.toString(),
      icon: <CalendarCheck className="w-5 h-5 text-violet-600" />,
      iconBg: "bg-violet-50/50 border border-violet-100/50",
      bgGlow: "bg-violet-500/5",
      hoverClasses: "hover:border-violet-350 hover:shadow-[0_0_22px_rgba(139,92,246,0.15)]",
      stagger: "stagger-3",
      sub: null,
    },
    {
      label: "Avg. Spend",
      value: `$${totalCustomers > 0 ? Math.round(totalSpent / totalCustomers).toLocaleString() : 0}`,
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
      iconBg: "bg-teal-50/50 border border-teal-100/50",
      bgGlow: "bg-teal-500/5",
      hoverClasses: "hover:border-teal-350 hover:shadow-[0_0_22px_rgba(20,184,166,0.15)]",
      stagger: "stagger-4",
      sub: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`animate-fade-in-up ${stat.stagger} relative overflow-hidden bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] ${stat.hoverClasses} hover:bg-white/85 hover:-translate-y-0.5 transition-all duration-300 group cursor-default`}
        >
          <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full ${stat.bgGlow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {stat.label}
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-2 font-display leading-none tracking-tight">
                {stat.value}
              </h3>
              {stat.sub}
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg} shrink-0 group-hover:scale-105 transition-transform duration-300`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
