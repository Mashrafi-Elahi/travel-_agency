import React, { useMemo } from "react";
import { CreditCard, DollarSign, Receipt, RotateCcw } from "lucide-react";
import { PaymentRecord } from "../../types/travel";

interface PaymentSummaryProps {
  payments: PaymentRecord[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export default function PaymentSummary({ payments }: PaymentSummaryProps) {
  const summary = useMemo(() => {
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidAmount = payments
      .filter((payment) => payment.status === "Paid")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const unpaidAmount = payments
      .filter((payment) => payment.status === "Unpaid" || payment.status === "Partial")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const refundedAmount = payments
      .filter((payment) => payment.status === "Refunded")
      .reduce((sum, payment) => sum + payment.amount, 0);

    return [
      {
        label: "Total Revenue",
        value: formatCurrency(totalRevenue),
        icon: <DollarSign className="w-5 h-5 text-slate-700" />,
        iconBg: "bg-slate-100 border-slate-200",
      },
      {
        label: "Paid Amount",
        value: formatCurrency(paidAmount),
        icon: <CreditCard className="w-5 h-5 text-emerald-700" />,
        iconBg: "bg-emerald-50 border-emerald-100",
      },
      {
        label: "Unpaid Amount",
        value: formatCurrency(unpaidAmount),
        icon: <Receipt className="w-5 h-5 text-amber-700" />,
        iconBg: "bg-amber-50 border-amber-100",
      },
      {
        label: "Refunded Amount",
        value: formatCurrency(refundedAmount),
        icon: <RotateCcw className="w-5 h-5 text-rose-700" />,
        iconBg: "bg-rose-50 border-rose-100",
      },
    ];
  }, [payments]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {summary.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {item.label}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2 font-display leading-none">
                {item.value}
              </h3>
            </div>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.iconBg}`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
