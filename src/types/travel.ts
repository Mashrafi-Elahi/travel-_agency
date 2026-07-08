export type PackageStatus = "Active" | "Inactive" | "Draft";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  status: PackageStatus;
}

export interface BookingInquiry {
  id: string;
  customerName: string;
  packageTitle: string;
  destination: string;
  date: string;
  status: BookingStatus;
}

export interface DashboardStats {
  totalBookings: number;
  revenue: number;
  totalPackages: number;
  pendingInquiries: number;
}
