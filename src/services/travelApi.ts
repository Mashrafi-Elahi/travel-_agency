import { TravelPackage, BookingInquiry, DashboardStats, BookingStatus, Customer, CustomerNote, CustomerStatus, CustomerTag, Destination, PaymentRecord, PaymentStatus, Review, ReviewStatus, Inquiry, InquiryStatus } from "../types/travel";
import { mockPackages } from "../data/mockPackages";
import { mockBookings } from "../data/mockBookings";
import { mockStats } from "../data/mockStats";
import { mockCustomers } from "../data/mockCustomers";
import { mockPayments } from "../data/mockPayments";
import { mockReviews } from "../data/mockReviews";
import { mockInquiries } from "../data/mockInquiries";
import { mockDestinations } from "../data/mockDestinations";

// In-memory data store for the current browser session
let sessionPackages = [...mockPackages];
let sessionBookings = [...mockBookings];
let sessionCustomers: Customer[] = mockCustomers.map(c => ({ ...c, notes: [...c.notes], tags: [...c.tags] }));
let sessionDestinations: Destination[] = mockDestinations.map((destination) => ({ ...destination }));
let sessionPayments: PaymentRecord[] = mockPayments.map((payment) => ({ ...payment }));
let sessionReviews: Review[] = mockReviews.map((review) => ({ ...review }));
let sessionInquiries: Inquiry[] = mockInquiries.map((inquiry) => ({ ...inquiry }));

const destinationKey = (value: string) => value.trim().toLowerCase();

const hydrateDestinationCounts = (destinations: Destination[]): Destination[] => {
  return destinations.map((destination) => ({
    ...destination,
    availablePackages: sessionPackages.filter(
      (pkg) => destinationKey(pkg.destination) === destinationKey(`${destination.city}, ${destination.country}`)
    ).length,
  }));
};

const parsePackageDestination = (destination: string) => {
  const [cityPart = "", ...countryParts] = destination.split(",");
  const city = cityPart.trim();
  const country = countryParts.join(",").trim();

  return {
    city: city || destination.trim(),
    country: country || "Unknown",
  };
};

const defaultDestinationImage = "https://images.unsplash.com/photo-1502920917128-1aa500764b72?auto=format&fit=crop&w=1000&q=80";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const travelApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    
    // Calculate stats dynamically for realism
    const totalBookings = sessionBookings.length;
    const pendingInquiries = sessionInquiries.filter((inq) => inq.status === "New" || inq.status === "Contacted" || inq.status === "Follow-up").length;
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

  async addPackage(pkg: TravelPackage): Promise<TravelPackage> {
    await delay(200);
    const createdPackage = { ...pkg };
    sessionPackages = [createdPackage, ...sessionPackages];

    const destinationExists = sessionDestinations.some(
      (destination) => destinationKey(`${destination.city}, ${destination.country}`) === destinationKey(createdPackage.destination)
    );

    if (!destinationExists) {
      const parsed = parsePackageDestination(createdPackage.destination);
      sessionDestinations = [
        {
          id: `dest-${Date.now()}`,
          name: createdPackage.destination,
          city: parsed.city,
          country: parsed.country,
          image: createdPackage.image,
          description: `Auto-created destination linked to ${createdPackage.title}.`,
          popular: false,
        },
        ...sessionDestinations,
      ];
    }

    return createdPackage;
  },

  async getBookings(): Promise<BookingInquiry[]> {
    await delay(300);
    return [...sessionBookings];
  },

  // --- Destination Management API ---

  async getDestinations(): Promise<Destination[]> {
    await delay(300);
    return hydrateDestinationCounts(sessionDestinations).map((destination) => ({ ...destination }));
  },

  async addDestination(destination: Omit<Destination, "id" | "availablePackages">): Promise<Destination> {
    await delay(250);
    const createdDestination: Destination = {
      ...destination,
      id: `dest-${Date.now()}`,
      image: destination.image || defaultDestinationImage,
      availablePackages: 0,
    };
    sessionDestinations = [createdDestination, ...sessionDestinations];
    return { ...createdDestination };
  },

  async updateDestination(destinationId: string, updates: Partial<Omit<Destination, "id" | "availablePackages">>): Promise<Destination> {
    await delay(250);
    const index = sessionDestinations.findIndex((destination) => destination.id === destinationId);
    if (index === -1) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }

    sessionDestinations[index] = {
      ...sessionDestinations[index],
      ...updates,
    };

    return { ...hydrateDestinationCounts([sessionDestinations[index]])[0] };
  },

  async deleteDestination(destinationId: string): Promise<void> {
    await delay(250);
    const index = sessionDestinations.findIndex((destination) => destination.id === destinationId);
    if (index === -1) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }
    sessionDestinations = sessionDestinations.filter((destination) => destination.id !== destinationId);
  },

  async toggleDestinationPopular(destinationId: string): Promise<Destination> {
    await delay(200);
    const index = sessionDestinations.findIndex((destination) => destination.id === destinationId);
    if (index === -1) {
      throw new Error(`Destination with ID ${destinationId} not found`);
    }

    sessionDestinations[index] = {
      ...sessionDestinations[index],
      popular: !sessionDestinations[index].popular,
    };

    return { ...hydrateDestinationCounts([sessionDestinations[index]])[0] };
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

  // --- Payment & Revenue API ---

  async getPayments(): Promise<PaymentRecord[]> {
    await delay(300);
    return [...sessionPayments];
  },

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<PaymentRecord> {
    await delay(200);
    const index = sessionPayments.findIndex((payment) => payment.id === id);
    if (index === -1) {
      throw new Error(`Payment with ID ${id} not found`);
    }

    sessionPayments[index] = {
      ...sessionPayments[index],
      status,
    };

    return { ...sessionPayments[index] };
  },

  // --- Reviews API ---

  async getReviews(): Promise<Review[]> {
    await delay(300);
    return [...sessionReviews];
  },

  async updateReviewStatus(id: string, status: ReviewStatus): Promise<Review> {
    await delay(200);
    const index = sessionReviews.findIndex((review) => review.id === id);
    if (index === -1) {
      throw new Error(`Review with ID ${id} not found`);
    }

    sessionReviews[index] = {
      ...sessionReviews[index],
      status,
    };

    return { ...sessionReviews[index] };
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

  // --- Inquiry Management API ---

  async getInquiries(): Promise<Inquiry[]> {
    await delay(300);
    return sessionInquiries.map(i => ({ ...i }));
  },

  async updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    await delay(200);
    const index = sessionInquiries.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Inquiry with ID ${id} not found`);
    }
    sessionInquiries[index] = {
      ...sessionInquiries[index],
      status,
    };
    return { ...sessionInquiries[index] };
  },

  async assignInquiry(id: string, staff: string): Promise<Inquiry> {
    await delay(200);
    const index = sessionInquiries.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Inquiry with ID ${id} not found`);
    }
    sessionInquiries[index] = {
      ...sessionInquiries[index],
      assignedStaff: staff || undefined,
    };
    return { ...sessionInquiries[index] };
  },

  async convertInquiryToBooking(id: string): Promise<{ inquiry: Inquiry; booking: BookingInquiry }> {
    await delay(300);
    const index = sessionInquiries.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Inquiry with ID ${id} not found`);
    }

    const inquiry = sessionInquiries[index];
    if (inquiry.status === "Converted") {
      throw new Error(`Inquiry is already converted to booking`);
    }

    // Update status to Converted
    sessionInquiries[index] = {
      ...inquiry,
      status: "Converted"
    };

    // Create a new BookingInquiry
    const newBooking: BookingInquiry = {
      id: `bkg-${Date.now()}`,
      customerName: inquiry.customerName,
      packageTitle: inquiry.interestedPackage,
      destination: inquiry.destination,
      date: new Date().toISOString().split("T")[0],
      status: "Pending"
    };

    sessionBookings = [newBooking, ...sessionBookings];

    // Handle Customer record linking or creation
    const customerExists = sessionCustomers.some(
      (c) => c.name.toLowerCase() === inquiry.customerName.toLowerCase()
    );

    if (!customerExists) {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: inquiry.customerName,
        email: inquiry.email,
        phone: inquiry.phone,
        address: "Address not provided (Lead)",
        totalBookings: 1,
        totalSpent: 0,
        lastBookingDate: newBooking.date,
        avatar: inquiry.customerName.split(" ").map(n => n[0]).join(""),
        notes: [
          {
            id: `note-${Date.now()}`,
            text: `Converted from Inquiry ID: ${inquiry.id}. Original message: "${inquiry.message}"`,
            date: newBooking.date,
            author: "System"
          }
        ],
        status: "Active",
        tags: ["New"],
        joinDate: newBooking.date
      };
      sessionCustomers = [newCustomer, ...sessionCustomers];
    } else {
      const cIndex = sessionCustomers.findIndex(
        (c) => c.name.toLowerCase() === inquiry.customerName.toLowerCase()
      );
      if (cIndex !== -1) {
        sessionCustomers[cIndex] = {
          ...sessionCustomers[cIndex],
          totalBookings: sessionCustomers[cIndex].totalBookings + 1,
          lastBookingDate: newBooking.date
        };
      }
    }

    return {
      inquiry: { ...sessionInquiries[index] },
      booking: newBooking
    };
  }
};
