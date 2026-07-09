import React, { useMemo, useState } from "react";
import { CheckCircle2, EyeOff, Filter, MessageSquare, Star } from "lucide-react";
import { Review, ReviewStatus } from "../../types/travel";

interface ReviewListProps {
  reviews: Review[];
  onStatusChange: (id: string, status: ReviewStatus) => void;
}

const statusStyles: Record<ReviewStatus, { bg: string; dot: string }> = {
  Approved: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    dot: "bg-emerald-500",
  },
  Hidden: {
    bg: "bg-rose-50 text-rose-700 border-rose-200/60",
    dot: "bg-rose-500",
  },
  Pending: {
    bg: "bg-amber-50 text-amber-700 border-amber-200/60",
    dot: "bg-amber-500",
  },
};

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const current = statusStyles[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} star rating`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${index < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewList({ reviews, onStatusChange }: ReviewListProps) {
  const [ratingFilter, setRatingFilter] = useState<number | "All">("All");

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (ratingFilter === "All") return reviews;
    return reviews.filter((review) => review.rating === ratingFilter);
  }, [reviews, ratingFilter]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Average Rating
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="text-2xl font-black text-slate-900 font-display leading-none">
                {averageRating.toFixed(1)}
              </h3>
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-xs font-medium text-slate-400">
                from {reviews.length} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === "All" ? "All" : Number(e.target.value))}
            className="text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg py-2 pl-3 pr-8 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.25rem 1.25rem",
              backgroundRepeat: "no-repeat",
            }}
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredReviews.map((review) => (
          <article
            key={review.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 font-display truncate">{review.customerName}</h3>
                <p className="text-xs text-slate-500 mt-1 truncate">{review.packageTitle}</p>
              </div>
              <ReviewStatusBadge status={review.status} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <StarRating rating={review.rating} />
              <span className="text-xs text-slate-400 font-medium">{review.reviewDate}</span>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-6">
              {review.comment}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <MessageSquare className="w-3.5 h-3.5" />
                {review.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onStatusChange(review.id, "Approved")}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(review.id, "Hidden")}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors cursor-pointer"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-slate-500 text-sm">No reviews match the selected rating.</p>
        </div>
      )}
    </div>
  );
}
