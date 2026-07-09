export type PackageStatus = "Active" | "Inactive" | "Draft";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";
export type PaymentStatus = "Pending" | "Paid" | "Partial" | "Refunded";

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
  customerEmail: string;
  customerPhone: string;
  packageTitle: string;
  destination: string;
  date: string;
  travelDate: string;
  numberOfTravelers: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}

export type CustomerStatus = "Active" | "Suspended" | "Banned";
export type CustomerTag = "VIP" | "Frequent" | "New" | "At-Risk" | "Corporate";

export interface CustomerNote {
  id: string;
  text: string;
  date: string;
  author: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  avatar: string; // initials
  notes: CustomerNote[];
  status: CustomerStatus;
  tags: CustomerTag[];
  joinDate: string;
}

export interface DashboardStats {
  totalBookings: number;
  revenue: number;
  totalPackages: number;
  pendingInquiries: number;
}
