import React, { useMemo, useState } from "react";
import { Calendar, CreditCard, Filter } from "lucide-react";
import { PaymentRecord, PaymentStatus } from "../../types/travel";

interface PaymentTableProps {
  payments: PaymentRecord[];
  onStatusChange: (id: string, status: PaymentStatus) => void;
}

const paymentStatuses: PaymentStatus[] = ["Paid", "Unpaid", "Partial", "Refunded"];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, { bg: string; dot: string }> = {
    Paid: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      dot: "bg-emerald-500",
    },
    Unpaid: {
      bg: "bg-amber-50 text-amber-700 border-amber-200/60",
      dot: "bg-amber-500",
    },
    Partial: {
      bg: "bg-sky-50 text-sky-700 border-sky-200/60",
      dot: "bg-sky-500",
    },
    Refunded: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/60",
      dot: "bg-rose-500",
    },
  };
  const current = styles[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}

export default function PaymentTable({ payments, onStatusChange }: PaymentTableProps) {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">("All");

  const filteredPayments = useMemo(() => {
    if (statusFilter === "All") return payments;
    return payments.filter((payment) => payment.status === statusFilter);
  }, [payments, statusFilter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 font-display">Payment Ledger</h3>
          <p className="text-xs text-slate-500 mt-1">Review balances, methods, and settlement status</p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "All")}
            className="text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg py-2 pl-3 pr-8 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.25rem 1.25rem",
              backgroundRepeat: "no-repeat",
            }}
          >
            <option value="All">All Statuses</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/65 text-slate-500 font-semibold text-xs border-b border-slate-100">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-900 block">{payment.customerName}</span>
                  <span className="text-xs text-slate-400">Booking: {payment.bookingId}</span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{payment.packageTitle}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(payment.amount)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    {payment.method}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {payment.date}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={payment.status}
                    onChange={(e) => onStatusChange(payment.id, e.target.value as PaymentStatus)}
                    className="text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg py-1.5 pl-2.5 pr-8 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.25rem 1.25rem",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 text-sm text-slate-500">
          No payments match the selected status.
        </div>
      )}
    </div>
  );
}
