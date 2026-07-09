import React from "react";
import { Inquiry, InquiryStatus } from "../../types/travel";
import { X, Calendar, User, Mail, Phone, MapPin, CheckCircle, ArrowRight, UserCheck, MessageSquare, ExternalLink } from "lucide-react";

interface InquiryDetailModalProps {
  inquiry: Inquiry;
  staffList: string[];
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onAssignStaff: (id: string, staff: string) => void;
  onConvert: (id: string) => void;
  onClose: () => void;
  isUpdating: boolean;
}

export default function InquiryDetailModal({
  inquiry,
  staffList,
  onStatusChange,
  onAssignStaff,
  onConvert,
  onClose,
  isUpdating,
}: InquiryDetailModalProps) {
  
  const getStatusBadgeStyles = (status: InquiryStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Contacted":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Follow-up":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      case "Converted":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "Closed":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return "bg-slate-50 text-slate-500 border border-slate-100";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 border border-slate-100 animate-scale-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Inquiry ID: {inquiry.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(inquiry.status)}`}>
                {inquiry.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">Inquiry Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Info Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Customer Info */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Customer Information
              </h4>
              <div className="space-y-3 mt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Name</span>
                  <span className="text-sm font-semibold text-slate-800">{inquiry.customerName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email Address</span>
                  <a 
                    href={`mailto:${inquiry.email}`}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {inquiry.email}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Phone Number</span>
                  <a 
                    href={`tel:${inquiry.phone}`}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {inquiry.phone}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Package Details */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Package Preference
              </h4>
              <div className="space-y-3 mt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Interested Package</span>
                  <span className="text-sm font-semibold text-slate-800">{inquiry.interestedPackage}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Destination</span>
                  <span className="text-sm font-semibold text-slate-800">{inquiry.destination}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Inquiry Date</span>
                  <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {inquiry.date}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Message */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Customer Message
            </h4>
            <div className="bg-slate-50 border-l-4 border-brand-500 rounded-r-xl p-4.5 text-sm text-slate-700 leading-relaxed font-medium italic relative">
              &ldquo;{inquiry.message}&rdquo;
            </div>
          </div>

          {/* Interactive controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {/* Status change dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                Update Status
              </label>
              <select
                value={inquiry.status}
                onChange={(e) => onStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                disabled={isUpdating}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-700 cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Assign Staff dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Assign Staff Member
              </label>
              <select
                value={inquiry.assignedStaff || ""}
                onChange={(e) => onAssignStaff(inquiry.id, e.target.value)}
                disabled={isUpdating}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-700 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {staffList.map((staff) => (
                  <option key={staff} value={staff}>
                    {staff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-lg transition-colors cursor-pointer"
          >
            Close Details
          </button>

          <div className="flex items-center gap-3">
            {inquiry.status !== "Converted" && inquiry.status !== "Closed" && (
              <button
                type="button"
                onClick={() => onConvert(inquiry.id)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-brand-600/10 cursor-pointer disabled:opacity-50"
              >
                Convert to Booking
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {inquiry.status === "Converted" && (
              <span className="inline-flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg shadow-xs">
                <CheckCircle className="w-4 h-4" /> Converted to Booking
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
