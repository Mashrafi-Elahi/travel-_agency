import React from "react";
import { BookingInquiry, BookingStatus } from "../../types/travel";
import StatusBadge from "./StatusBadge";
import StatusSelect from "./StatusSelect";
import { Calendar, User, MapPin, CreditCard, Eye, Ban } from "lucide-react";

interface BookingTableProps {
  bookings: BookingInquiry[];
  onStatusChange: (id: string, status: BookingStatus) => void;
  onViewDetails: (booking: BookingInquiry) => void;
  isUpdating: string | null;
}

export default function BookingTable({ bookings, onStatusChange, onViewDetails, isUpdating }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-xs">
        <p className="text-slate-500 text-sm">No bookings or inquiries found!.</p>
      </div>
    );
  }

  const paymentStyles: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Partial: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-slate-50 text-slate-700 border-slate-200",
    Refunded: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 font-display">Recent Bookings & Inquiries</h3>
          <p className="text-xs text-slate-500 mt-1">Manage active travel requests, payment progress, and confirmation statuses</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-50 text-slate-600">
          {bookings.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/65 text-slate-500 font-semibold text-xs border-b border-slate-100">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Trip</th>
              <th className="px-6 py-4">Booking / Travel</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors align-top">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-200/50 shrink-0">
                      {booking.customerName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">{booking.customerName}</span>
                      <span className="text-xs text-slate-400 block">ID: {booking.id}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {booking.customerEmail}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 block">{booking.customerPhone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <span className="font-medium text-slate-800 block">{booking.packageTitle}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {booking.destination}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">Travelers: {booking.numberOfTravelers}</span>
                    <span className="text-xs font-semibold text-slate-700 block mt-1">${booking.totalAmount.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1.5">
                    <span className="text-slate-600 flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Booked {booking.date}
                    </span>
                    <span className="text-slate-600 flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Travel {booking.travelDate}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <StatusBadge status={booking.status} />
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${paymentStyles[booking.paymentStatus]}`}>
                      <CreditCard className="w-3 h-3" />
                      {booking.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-2">
                    <StatusSelect
                      status={booking.status}
                      onChange={(newStatus) => onStatusChange(booking.id, newStatus)}
                      disabled={isUpdating === booking.id || booking.status === "Cancelled"}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetails(booking)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatusChange(booking.id, "Cancelled")}
                        disabled={booking.status === "Cancelled" || isUpdating === booking.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
