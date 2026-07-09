import React from "react";
import { Destination } from "../../types/travel";
import { MapPin, Package, PencilLine, Sparkles, Star, Trash2 } from "lucide-react";

interface DestinationCardProps {
  key?: React.Key;
  destination: Destination;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onTogglePopular: () => Promise<void>;
}

export default function DestinationCard({
  destination,
  onClick,
  onEdit,
  onDelete,
  onTogglePopular,
}: DestinationCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Hover description overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
          <p className="text-xs text-white/90 leading-relaxed line-clamp-3">
            {destination.description}
          </p>
        </div>

        {/* Top badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          {destination.popular && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/95 text-amber-950 backdrop-blur-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Popular
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
            <Package className="w-2.5 h-2.5" />
            {destination.availablePackages ?? 0} pkg
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{destination.city}, {destination.country}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-800 leading-snug font-display line-clamp-2 group-hover:text-brand-600 transition-colors">
            {destination.name}
          </h4>
        </div>

        {/* Footer row: popular toggle + edit/delete */}
        <div
          className="pt-4 border-t border-slate-50 flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onTogglePopular}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
              destination.popular
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
          >
            <Star
              className={`w-3 h-3 ${destination.popular ? "fill-amber-400 text-amber-400" : ""}`}
            />
            {destination.popular ? "Popular" : "Mark popular"}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <PencilLine className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
