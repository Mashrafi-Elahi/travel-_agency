import React from "react";
import { BookingStatus } from "../../types/travel";

interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Pending: {
      bg: "bg-amber-50 text-amber-700 border-amber-200/60",
      dot: "bg-amber-500",
    },
    Confirmed: {
      bg: "bg-sky-50 text-sky-700 border-sky-200/60",
      dot: "bg-sky-500",
    },
    Cancelled: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/60",
      dot: "bg-rose-500",
    },
    Completed: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      dot: "bg-emerald-500",
    },
  };

  const current = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} shadow-2xs`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}
