import React from "react";
import { DashboardStats as StatsType } from "../../types/travel";
import SummaryCard from "./SummaryCard";
import { ShoppingBag, DollarSign, Map, HelpCircle } from "lucide-react";

interface DashboardStatsProps {
  stats: StatsType;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Bookings */}
      <SummaryCard
        title="Total Bookings"
        value={stats.totalBookings.toLocaleString()}
        icon={<ShoppingBag className="w-5 h-5" />}
        iconBgColor="bg-blue-50"
        iconTextColor="text-blue-600"
        description="Completed & active sales"
        trend={{ value: "+12.4%", isPositive: true }}
      />

      {/* Total Revenue */}
      <SummaryCard
        title="Total Revenue"
        value={`$${stats.revenue.toLocaleString()}`}
        icon={<DollarSign className="w-5 h-5" />}
        iconBgColor="bg-emerald-50"
        iconTextColor="text-emerald-600"
        description="Generated over the time"
        trend={{ value: "+8.2%", isPositive: true }}
      />

      {/* Total Packages */}
      <SummaryCard
        title="Active Packages"
        value={stats.totalPackages}
        icon={<Map className="w-5 h-5" />}
        iconBgColor="bg-purple-50"
        iconTextColor="text-purple-600"
        description="Curated itineraries listed"
        trend={{ value: "+2 new", isPositive: true }}
      />

      {/* Pending Inquiries */}
      <SummaryCard
        title="Pending Inquiries"
        value={stats.pendingInquiries}
        icon={<HelpCircle className="w-5 h-5" />}
        iconBgColor="bg-amber-50"
        iconTextColor="text-amber-600"
        description="Requires customer support"
        trend={{ value: "-4% vs last week", isPositive: true }}
      />
    </div>
  );
}
