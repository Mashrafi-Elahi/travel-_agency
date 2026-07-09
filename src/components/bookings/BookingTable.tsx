import React from "react";
import { BookingInquiry, BookingStatus } from "../../types/travel";
import StatusBadge from "./StatusBadge";
import StatusSelect from "./StatusSelect";
import { Calendar, User, MapPin } from "lucide-react";

interface BookingTableProps {
  bookings: BookingInquiry[];
  onStatusChange: (id: string, status: BookingStatus) => void;
  isUpdating: string | null; // Keeps track of which booking is currently being updated
}

export default function BookingTable({ bookings, onStatusChange, isUpdating }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-xs">
        <p className="text-slate-500 text-sm">No bookings or inquiries found!.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 font-display">Recent Bookings & Inquiries</h3>
          <p className="text-xs text-slate-500 mt-1">Manage active travel requests & confirmation statuses</p>
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
              <th className="px-6 py-4">Package Details</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-200/50">
                      {booking.customerName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">{booking.customerName}</span>
                      <span className="text-xs text-slate-400">ID: {booking.id}</span>
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
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {booking.date}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center">
                    <StatusSelect
                      status={booking.status}
                      onChange={(newStatus) => onStatusChange(booking.id, newStatus)}
                      disabled={isUpdating === booking.id}
                    />
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
