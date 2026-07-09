import React, { useState, useMemo } from "react";
import { Inquiry, InquiryStatus } from "../../types/travel";
import { Calendar, User, MapPin, Mail, Phone, MessageSquare, CheckCircle, ArrowRight, UserCheck } from "lucide-react";

interface InquiryTableProps {
  inquiries: Inquiry[];
  staffList: string[];
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onAssignStaff: (id: string, staff: string) => void;
  onConvert: (id: string) => void;
  onViewDetails: (inquiry: Inquiry) => void;
  isUpdating: string | null;
}

export default function InquiryTable({
  inquiries,
  staffList,
  onStatusChange,
  onAssignStaff,
  onConvert,
  onViewDetails,
  isUpdating,
}: InquiryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const statuses: (InquiryStatus | "All")[] = ["All", "New", "Contacted", "Follow-up", "Converted", "Closed"];

  // Filter and search logic
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch = inq.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  // Color mapping for status badges
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
    <div className="space-y-6">
      {/* Search & Status Tab Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden rounded-xl transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="text-xs text-slate-400 font-semibold">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-1">
          {statuses.map((status) => {
            const isActive = statusFilter === status;
            const count = status === "All" 
              ? inquiries.length 
              : inquiries.filter(i => i.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer relative ${
                  isActive
                    ? "bg-brand-50 text-brand-600 font-bold border border-brand-100 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {status}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table view */}
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-semibold">No inquiries found matching filters.</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/65 text-slate-500 font-semibold text-xs border-b border-slate-100">
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Interest & Destination</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Staff Assigned</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Customer details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs border border-brand-100/50">
                          {inq.customerName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <span 
                            onClick={() => onViewDetails(inq)} 
                            className="font-bold text-slate-900 block hover:text-brand-600 hover:underline cursor-pointer"
                          >
                            {inq.customerName}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5 font-medium flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {inq.email}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5 font-medium flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {inq.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Interest & Destination */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-semibold text-slate-800 block truncate max-w-[200px]">{inq.interestedPackage}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{inq.destination}</span>
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-slate-500 flex items-center gap-1.5 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {inq.date}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(inq.status)}`}>
                        {inq.status}
                      </span>
                    </td>

                    {/* Staff Assigned */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <select
                          value={inq.assignedStaff || ""}
                          onChange={(e) => onAssignStaff(inq.id, e.target.value)}
                          disabled={isUpdating === inq.id}
                          className="text-xs font-semibold bg-transparent text-slate-700 hover:text-slate-900 border-b border-dashed border-slate-300 hover:border-slate-500 pb-0.5 focus:outline-hidden cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {staffList.map((staff) => (
                            <option key={staff} value={staff}>
                              {staff}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetails(inq)}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold border border-slate-200/60 transition-colors cursor-pointer"
                          title="View customer message & details"
                        >
                          Details
                        </button>
                        
                        {inq.status !== "Converted" && inq.status !== "Closed" && (
                          <button
                            onClick={() => onConvert(inq.id)}
                            disabled={isUpdating === inq.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                            title="Convert inquiry to active pending booking"
                          >
                            Convert
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        
                        {inq.status === "Converted" && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Booked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
