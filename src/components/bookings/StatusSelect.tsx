import React from "react";
import { BookingStatus } from "../../types/travel";

interface StatusSelectProps {
  status: BookingStatus;
  onChange: (status: BookingStatus) => void;
  disabled?: boolean;
}

export default function StatusSelect({ status, onChange, disabled = false }: StatusSelectProps) {
  const options: BookingStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];

  return (
    <div className="relative inline-block text-left">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as BookingStatus)}
        disabled={disabled}
        className="w-full text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg py-1.5 pl-2.5 pr-8 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "1.25rem 1.25rem",
          backgroundRepeat: "no-repeat",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
