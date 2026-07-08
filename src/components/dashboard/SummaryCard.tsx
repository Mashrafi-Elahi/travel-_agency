import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function SummaryCard({
  title,
  value,
  icon,
  iconBgColor = "bg-brand-50",
  iconTextColor = "text-brand-600",
  description,
  trend,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2 font-display leading-tight tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-slate-50 ${iconBgColor} ${iconTextColor} shrink-0`}>
          {icon}
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {trend && (
            <span
              className={`font-semibold px-1.5 py-0.5 rounded-sm ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {trend.value}
            </span>
          )}
          {description && <span className="text-slate-400 font-medium">{description}</span>}
        </div>
      )}
    </div>
  );
}
