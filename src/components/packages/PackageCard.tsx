import React from "react";
import { TravelPackage } from "../../types/travel";
import { PencilLine, Star, MapPin, Tag, Clock, Trash2 } from "lucide-react";

interface PackageCardProps {
  pkg: TravelPackage;
  key?: React.Key;
  onEdit: (pkg: TravelPackage) => void;
  onDelete: (pkg: TravelPackage) => void;
}

export default function PackageCard({ pkg, onEdit, onDelete }: PackageCardProps) {
  // Determine status styles
  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    Inactive: "bg-rose-50 text-rose-700 border-rose-200/50",
    Draft: "bg-amber-50 text-amber-700 border-amber-200/50",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group h-full">
      {/* Package Image & Status Tag */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-xs ${statusStyles[pkg.status]}`}>
            {pkg.status}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" />
            {pkg.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/95 px-2 py-0.5 rounded-md text-xs font-bold text-slate-800 shadow-sm backdrop-blur-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {pkg.rating.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{pkg.destination}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-800 leading-snug font-display line-clamp-2 group-hover:text-brand-600 transition-colors">
            {pkg.title}
          </h4>
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {pkg.description}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {pkg.duration}
            </span>
            <span className="font-semibold text-slate-400 uppercase tracking-wider">Package Price</span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <span className="text-base font-extrabold text-slate-950">
              ${pkg.price.toLocaleString()}<span className="text-[10px] font-normal text-slate-400">/person</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(pkg)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <PencilLine className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(pkg)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
