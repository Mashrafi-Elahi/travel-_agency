import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading dashboard data..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
      <p className="text-slate-500 font-medium text-sm">{message}</p>
    </div>
  );
}
