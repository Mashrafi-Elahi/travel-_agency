import React from "react";
import { Customer, CustomerStatus } from "../../types/travel";
import { Mail, Phone, ChevronRight, Inbox, ShieldCheck, ShieldAlert, ShieldBan } from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  onViewProfile: (customer: Customer) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const avatarColors = [
  "from-slate-400 to-slate-500",
  "from-indigo-400 to-indigo-500",
  "from-teal-400 to-teal-500",
  "from-violet-400 to-violet-500",
  "from-sky-400 to-sky-500",
  "from-emerald-400 to-emerald-500",
];

const customerStatusConfig: Record<CustomerStatus, { label: string; bg: string; dot: string; icon: React.ReactNode }> = {
  Active: {
    label: "Active",
    bg: "bg-emerald-500/5 text-emerald-600/90 border-emerald-500/10",
    dot: "bg-emerald-400",
    icon: <ShieldCheck className="w-3 h-3" />,
  },
  Suspended: {
    label: "Suspended",
    bg: "bg-amber-500/5 text-amber-600/90 border-amber-500/10",
    dot: "bg-amber-400",
    icon: <ShieldAlert className="w-3 h-3" />,
  },
  Banned: {
    label: "Banned",
    bg: "bg-rose-500/5 text-rose-600/90 border-rose-500/10",
    dot: "bg-rose-400",
    icon: <ShieldBan className="w-3 h-3" />,
  },
};

const tagColors: Record<string, string> = {
  VIP: "bg-violet-500/5 text-violet-600 border-violet-500/10",
  Frequent: "bg-blue-500/5 text-blue-600 border-blue-500/10",
  New: "bg-emerald-500/5 text-emerald-600 border-emerald-500/10",
  "At-Risk": "bg-rose-500/5 text-rose-600 border-rose-500/10",
  Corporate: "bg-slate-500/5 text-slate-600 border-slate-500/10",
};

export default function CustomerTable({
  customers,
  onViewProfile,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
}: CustomerTableProps) {
  const sortedCustomers = [...customers].sort((a, b) => {
    switch (sortBy) {
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "spent-desc": return b.totalSpent - a.totalSpent;
      case "spent-asc": return a.totalSpent - b.totalSpent;
      case "bookings-desc": return b.totalBookings - a.totalBookings;
      case "recent": return new Date(b.lastBookingDate === "-" ? 0 : b.lastBookingDate).getTime() - new Date(a.lastBookingDate === "-" ? 0 : a.lastBookingDate).getTime();
      default: return 0;
    }
  });

  if (sortedCustomers.length === 0) {
    return (
      <div className="animate-fade-in-up text-center py-20 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-50/50 flex items-center justify-center mx-auto mb-3 border border-slate-100/50">
          <Inbox className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-slate-600 text-sm font-semibold">No customers found</p>
      </div>
    );
  }

  const selectClasses = "text-[11px] font-semibold bg-white/80 backdrop-blur-xs text-slate-600 border border-slate-200/60 hover:border-slate-300 rounded-lg py-1.5 pl-2.5 pr-7 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500/50 transition-all cursor-pointer appearance-none";
  const selectBg = {
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 0.35rem center",
    backgroundSize: "1rem 1rem",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="animate-fade-in-up bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
      {/* Table header */}
      <div className="px-6 py-4 border-b border-slate-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-display">Customer Directory</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Click any row to manage profile insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className={selectClasses} style={selectBg}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Banned">Banned</option>
          </select>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={selectClasses} style={selectBg}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="spent-desc">Top Spenders</option>
            <option value="bookings-desc">Most Bookings</option>
          </select>
          <span className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-slate-800/90 text-white shadow-2xs shrink-0 font-mono">
            {sortedCustomers.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/40 text-slate-400 font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100/60">
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3 text-center">Bookings</th>
              <th className="px-6 py-3">Total Spent</th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {sortedCustomers.map((customer, index) => {
              const colorClass = avatarColors[index % avatarColors.length];
              const statusCfg = customerStatusConfig[customer.status];
              const isBannedOrSuspended = customer.status !== "Active";

              return (
                <tr
                  key={customer.id}
                  onClick={() => onViewProfile(customer)}
                  className={`transition-all duration-200 cursor-pointer group ${
                    isBannedOrSuspended ? "opacity-60 hover:opacity-100" : ""
                  } hover:bg-slate-50/40`}
                >
                  {/* Name */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform duration-200 ${
                            isBannedOrSuspended ? "grayscale opacity-80" : ""
                          }`}
                        >
                          {customer.avatar}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${statusCfg.dot}`} />
                      </div>
                      <div className="min-w-0">
                        <span className={`font-semibold block text-xs truncate transition-colors ${
                          isBannedOrSuspended ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800 group-hover:text-brand-600"
                        }`}>
                          {customer.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{customer.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold border ${statusCfg.bg}`}>
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-3.5">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="truncate max-w-[150px]">{customer.email}</span>
                      </span>
                    </div>
                  </td>

                  {/* Bookings */}
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100/50 text-xs font-bold text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      {customer.totalBookings}
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-bold text-slate-800">
                      ${customer.totalSpent.toLocaleString()}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="px-6 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.length > 0 ? (
                        customer.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${tagColors[tag] || "bg-slate-50 text-slate-500 border-slate-200"}`}
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </div>
                  </td>

                  {/* Arrow */}
                  <td className="px-6 py-3.5 text-right">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all inline-block" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
