import { TravelPackage, BookingInquiry, DashboardStats, BookingStatus } from "../types/travel";
import { mockPackages } from "../data/mockPackages";
import { mockBookings } from "../data/mockBookings";
import { mockStats } from "../data/mockStats";

// In-memory data store for the current browser session
let sessionPackages = [...mockPackages];
let sessionBookings = [...mockBookings];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const travelApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    
    // Calculate stats dynamically for realism
    const totalBookings = sessionBookings.length;
    const pendingInquiries = sessionBookings.filter((b) => b.status === "Pending").length;
    const totalPackages = sessionPackages.length;
    
    // Calculate simulated revenue from Confirmed and Completed bookings
    const activeBookings = sessionBookings.filter(
      (b) => b.status === "Confirmed" || b.status === "Completed"
    );
    
    const calculatedRevenue = activeBookings.reduce((sum, booking) => {
      const pkg = sessionPackages.find((p) => p.title === booking.packageTitle);
      return sum + (pkg?.price || 1500);
    }, 0);

    return {
      totalBookings,
      revenue: calculatedRevenue > 0 ? calculatedRevenue : mockStats.revenue,
      totalPackages,
      pendingInquiries,
    };
  },

  async getPackages(): Promise<TravelPackage[]> {
    await delay(300);
    return [...sessionPackages];
  },

  async getBookings(): Promise<BookingInquiry[]> {
    await delay(300);
    return [...sessionBookings];
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<BookingInquiry> {
    await delay(200);
    const index = sessionBookings.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    sessionBookings[index] = {
      ...sessionBookings[index],
      status,
    };
    
    return { ...sessionBookings[index] };
  },
};
