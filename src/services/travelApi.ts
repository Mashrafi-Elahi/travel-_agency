import {
  TravelPackage,
  BookingInquiry,
  DashboardStats,
  BookingStatus,
  Customer,
  CustomerNote,
  CustomerStatus,
  CustomerTag,
  Destination,
  PaymentRecord,
  Review,
} from "../types/travel";
import { mockPackages } from "../data/mockPackages";
import { mockBookings } from "../data/mockBookings";
import { mockStats } from "../data/mockStats";
import { mockCustomers } from "../data/mockCustomers";

// In-memory data store for the current browser session
let sessionPackages = [...mockPackages];
let sessionBookings = [...mockBookings];
let sessionCustomers: Customer[] = mockCustomers.map(c => ({ ...c, notes: [...c.notes], tags: [...c.tags] }));
let sessionDestinations: Destination[] = [];
let sessionPayments: PaymentRecord[] = [];
let sessionReviews: Review[] = [];

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

  async addPackage(pkg: Omit<TravelPackage, "id">): Promise<TravelPackage> {
    await delay(250);
    const newPackage: TravelPackage = {
      id: `pkg-${Date.now()}`,
      ...pkg,
    };
    sessionPackages = [newPackage, ...sessionPackages];
    return { ...newPackage };
  },

  async updatePackage(id: string, changes: Partial<Omit<TravelPackage, "id">>): Promise<TravelPackage> {
    await delay(250);
    const index = sessionPackages.findIndex((pkg) => pkg.id === id);
    if (index === -1) {
      throw new Error(`Package with ID ${id} not found`);
    }

    sessionPackages[index] = {
      ...sessionPackages[index],
      ...changes,
    };

    return { ...sessionPackages[index] };
  },

  async deletePackage(id: string): Promise<void> {
    await delay(200);
    const index = sessionPackages.findIndex((pkg) => pkg.id === id);
    if (index === -1) {
      throw new Error(`Package with ID ${id} not found`);
    }

    sessionPackages = sessionPackages.filter((pkg) => pkg.id !== id);
  },

  async getBookings(): Promise<BookingInquiry[]> {
    await delay(300);
    return [...sessionBookings];
  },

  async getDestinations(): Promise<Destination[]> {
    await delay(250);
    return sessionDestinations.map((destination) => ({ ...destination }));
  },

  async getPayments(): Promise<PaymentRecord[]> {
    await delay(250);
    return sessionPayments.map((payment) => ({ ...payment }));
  },

  async getReviews(): Promise<Review[]> {
    await delay(250);
    return sessionReviews.map((review) => ({ ...review }));
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

  // --- Customer Management API ---

  async getCustomers(): Promise<Customer[]> {
    await delay(300);
    return sessionCustomers.map(c => ({ ...c, notes: [...c.notes], tags: [...c.tags] }));
  },

  async getCustomerById(id: string): Promise<Customer> {
    await delay(200);
    const customer = sessionCustomers.find((c) => c.id === id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    return { ...customer, notes: [...customer.notes], tags: [...customer.tags] };
  },

  async addCustomerNote(customerId: string, noteText: string): Promise<CustomerNote> {
    await delay(200);
    const index = sessionCustomers.findIndex((c) => c.id === customerId);
    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    const newNote: CustomerNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      date: new Date().toISOString().split("T")[0],
      author: "Mashrafe Elahi",
    };

    sessionCustomers[index] = {
      ...sessionCustomers[index],
      notes: [newNote, ...sessionCustomers[index].notes],
    };

    return { ...newNote };
  },

  async updateCustomerStatus(customerId: string, status: CustomerStatus): Promise<Customer> {
    await delay(300);
    const index = sessionCustomers.findIndex((c) => c.id === customerId);
    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    sessionCustomers[index] = {
      ...sessionCustomers[index],
      status,
    };

    return { ...sessionCustomers[index], notes: [...sessionCustomers[index].notes], tags: [...sessionCustomers[index].tags] };
  },

  async deleteCustomer(customerId: string): Promise<void> {
    await delay(300);
    const index = sessionCustomers.findIndex((c) => c.id === customerId);
    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    sessionCustomers = sessionCustomers.filter((c) => c.id !== customerId);
  },

  async toggleCustomerTag(customerId: string, tag: CustomerTag): Promise<Customer> {
    await delay(200);
    const index = sessionCustomers.findIndex((c) => c.id === customerId);
    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    const currentTags = [...sessionCustomers[index].tags];
    const tagIndex = currentTags.indexOf(tag);

    if (tagIndex >= 0) {
      currentTags.splice(tagIndex, 1);
    } else {
      currentTags.push(tag);
    }

    sessionCustomers[index] = {
      ...sessionCustomers[index],
      tags: currentTags,
    };

    return { ...sessionCustomers[index], notes: [...sessionCustomers[index].notes], tags: [...currentTags] };
  },

  // --- AI Insights API ---
  async getCustomerAiInsights(customerId: string): Promise<{
    travelPersona: string;
    preferredClimate: string;
    churnRisk: "Low" | "Medium" | "High";
    confidenceScore: number;
    recommendedDestinationReason: string;
    suggestedAction: string;
  }> {
    await delay(600); // Simulate model inference latency
    const customer = sessionCustomers.find((c) => c.id === customerId);
    if (!customer) throw new Error("Customer not found");

    // Dynamic AI response generation based on actual history
    let travelPersona = "Exploratory Traveler";
    let preferredClimate = "Temperate";
    let churnRisk: "Low" | "Medium" | "High" = "Medium";
    let recommendedDestinationReason = "Based on general traveler tendencies.";
    let suggestedAction = "Send introductory catalog update.";

    const hasVip = customer.tags.includes("VIP");
    const hasFrequent = customer.tags.includes("Frequent");
    
    if (customer.totalSpent > 8000 || hasVip) {
      travelPersona = "Premium Luxury Explorer";
      preferredClimate = "Mediterranean / Tropical Escapes";
      churnRisk = "Low";
      recommendedDestinationReason = "Customer prioritizes high-end packages with ratings above 4.8. Recommending Mediterranean or private luxury resort packages.";
      suggestedAction = "Offer high-touch concierge booking call with executive travel coordinator.";
    } else if (customer.totalBookings >= 3 || hasFrequent) {
      travelPersona = "Frequent Adventure Seeker";
      preferredClimate = "Alpine / Outdoor Activities";
      churnRisk = "Low";
      recommendedDestinationReason = "Frequent booking history shows high resilience to travel complexity. Likes cultural and historical excursions.";
      suggestedAction = "Enroll in the Exclusive Mile-High Travelers loyalty circle.";
    } else if (customer.status === "Suspended" || customer.status === "Banned") {
      travelPersona = "Inactive Profile";
      preferredClimate = "N/A";
      churnRisk = "High";
      recommendedDestinationReason = "Account flagged by safety system.";
      suggestedAction = "Compliance review required before outbound outreach.";
    } else if (customer.totalBookings === 0) {
      travelPersona = "High-Intent Cold Lead";
      preferredClimate = "Undecided";
      churnRisk = "High";
      recommendedDestinationReason = "Profile created but no bookings made yet. High churn threat if not converted within 30 days.";
      suggestedAction = "Draft first-booking welcome incentive voucher (10% Off).";
    }

    return {
      travelPersona,
      preferredClimate,
      churnRisk,
      confidenceScore: Math.floor(Math.random() * 15) + 82, // 82% to 96%
      recommendedDestinationReason,
      suggestedAction,
    };
  },

  async generateAiOfferEmail(customerId: string, packageTitle: string): Promise<string> {
    await delay(800); // Simulate generative model latency
    const customer = sessionCustomers.find((c) => c.id === customerId);
    if (!customer) throw new Error("Customer not found");

    return `Subject: Handpicked Travel Offer: ${packageTitle} for ${customer.name.split(" ")[0]}! ✈️

Dear ${customer.name.split(" ")[0]},

We noticed you've been planning your next adventure, and our Travel Copilot curated a special recommendation just for you: the ${packageTitle}! 

Based on your preferred travel style and past destinations, we believe you'll find this itinerary matches your tastes perfectly. As one of our valued customers, we can guarantee priority booking window openings and complimentary airport lounge access if confirmed this week.

Let me know if you would like me to lock in this itinerary or customize the flight dates for you!

Best regards,
Mashrafe Elahi
Travel Intelligence Team`;
  },
};

