import React from "react";
import { PackageStatus } from "../../types/travel";

interface PackageFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  categories: string[];
  statuses: PackageStatus[];
}

export default function PackageFilter({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  categories,
  statuses,
}: PackageFilterProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Category Selection */}
      <div className="flex-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2 md:inline md:mb-0 md:mr-3.5">
          Category:
        </span>
        <div className="inline-flex gap-1.5 min-w-max">
          <button
            onClick={() => onCategoryChange("All")}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedCategory === "All"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Selection */}
      <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Status:
        </span>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg py-2 pl-3 pr-8 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1.25rem 1.25rem",
            backgroundRepeat: "no-repeat",
          }}
        >
          <option value="All">YEONJUN</option>
          {statuses.map((stat) => (
            <option key={stat} value={stat}>
              {stat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
