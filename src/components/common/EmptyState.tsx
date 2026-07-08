import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No results found",
  description = "We couldn't find any items matching your current filters or search query.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
        <Inbox className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 font-display mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
