export type PackageStatus = "Active" | "Inactive" | "Draft";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";
export type PaymentStatus = "Pending" | "Paid" | "Unpaid" | "Partial" | "Refunded";

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  image: string;
  description: string;
  popular: boolean;
  availablePackages?: number;
}

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  category: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  status: PackageStatus;
  description: string;
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

export type InquiryStatus = "New" | "Contacted" | "Follow-up" | "Converted" | "Closed";

export interface Inquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  interestedPackage: string;
  destination: string;
  message: string;
  date: string;
  status: InquiryStatus;
  assignedStaff?: string;
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

export interface PaymentRecord {
  id: string;
  bookingId: string;
  customerName: string;
  packageTitle: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
}

export type ReviewStatus = "Approved" | "Hidden" | "Pending";

export interface Review {
  id: string;
  customerName: string;
  packageTitle: string;
  rating: number;
  comment: string;
  reviewDate: string;
  status: ReviewStatus;
}
