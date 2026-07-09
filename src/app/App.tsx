import React, { useState, useEffect, useMemo } from "react";
import { travelApi } from "../services/travelApi";
import { SidebarTab } from "../components/layout/Sidebar";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardStats from "../components/dashboard/DashboardStats";
import PackageFilter from "../components/packages/PackageFilter";
import PackageGrid from "../components/packages/PackageGrid";
import DestinationManager from "../components/destinations/DestinationManager";
import BookingTable from "../components/bookings/BookingTable";
import CustomerStats from "../components/customers/CustomerStats";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerProfile from "../components/customers/CustomerProfile";
import PaymentSummary from "../components/payments/PaymentSummary";
import PaymentTable from "../components/payments/PaymentTable";
import ReviewList from "../components/reviews/ReviewList";
import SearchInput from "../components/common/SearchInput";
import LoadingState from "../components/common/LoadingState";
import { TravelPackage, BookingInquiry, DashboardStats as StatsType, BookingStatus, PackageStatus, Customer, CustomerStatus, CustomerTag } from "../types/travel";
import { Compass, CalendarDays, Plus, Filter, RefreshCw, Layers, X, Users } from "lucide-react";

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<SidebarTab>("overview");

  // Core data states
  const [stats, setStats] = useState<StatsType | null>(null);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [bookings, setBookings] = useState<BookingInquiry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter/Search states
  const [packageSearch, setPackageSearch] = useState<string>("");
  const [packageCategory, setPackageCategory] = useState<string>("All");
  const [packageStatus, setPackageStatus] = useState<string>("All");

  const [bookingSearch, setBookingSearch] = useState<string>("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("All");

  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string>("All");
  const [customerSort, setCustomerSort] = useState<string>("name-asc");

  // Operation states
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [packageModalMode, setPackageModalMode] = useState<PackageModalMode | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState<PackageFormState>(createPackageForm());
  const [isSavingPackage, setIsSavingPackage] = useState(false);

  // Fetch initial dashboard and list datasets
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, packagesData, bookingsData, customersData, inquiriesData, paymentsData, reviewsData] = await Promise.all([
        travelApi.getDashboardStats(),
        travelApi.getPackages(),
        travelApi.getBookings(),
        travelApi.getCustomers(),
        travelApi.getInquiries(),
        travelApi.getPayments(),
        travelApi.getReviews(),
      ]);
      setStats(statsData);
      setPackages(packagesData);
      setBookings(bookingsData);
      setCustomers(customersData);
      setInquiries(inquiriesData);
      setPayments(paymentsData);
      setReviews(reviewsData);
    } catch (err) {
      console.error("Error loading travel agency data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync / Recalculate stats whenever bookings or packages change
  const syncStats = async () => {
    try {
      const statsData = await travelApi.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error syncing dashboard stats:", err);
    }
  };

  const refreshCatalog = async () => {
    try {
      const [packagesData, statsData] = await Promise.all([
        travelApi.getPackages(),
        travelApi.getDashboardStats(),
      ]);
      setPackages(packagesData);
      setStats(statsData);
    } catch (err) {
      console.error("Error refreshing package catalog:", err);
      alert("Failed to refresh package catalog.");
    }
  };

  const openCreatePackageModal = () => {
    setEditingPackageId(null);
    setPackageForm(createPackageForm());
    setPackageModalMode("create");
  };

  const openEditPackageModal = (pkg: TravelPackage) => {
    setEditingPackageId(pkg.id);
    setPackageForm({
      title: pkg.title,
      destination: pkg.destination,
      category: pkg.category,
      price: String(pkg.price),
      duration: pkg.duration,
      image: pkg.image,
      rating: String(pkg.rating),
      status: pkg.status,
      description: pkg.description,
    });
    setPackageModalMode("edit");
  };

  const closePackageModal = () => {
    setPackageModalMode(null);
    setEditingPackageId(null);
    setPackageForm(createPackageForm());
  };

  // Update booking status action
  const handleBookingStatusChange = async (id: string, newStatus: BookingStatus) => {
    setIsUpdating(id);
    try {
      // Async API call updating local memory store
      await travelApi.updateBookingStatus(id, newStatus);
      
      // Update local state directly to prevent double-spinning loader
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      
      // Recalculate financial revenue / pending stats immediately
      await syncStats();
    } catch (err) {
      alert("Failed to update booking status. Please try again.");
    } finally {
      setIsUpdating(null);
    }
  };

  // --- Inquiry Handlers ---

  const handleUpdateInquiryStatus = async (id: string, newStatus: InquiryStatus) => {
    setIsUpdating(id);
    try {
      const updated = await travelApi.updateInquiryStatus(id, newStatus);
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
      setSelectedInquiry((prev) => (prev && prev.id === id ? updated : prev));
      await syncStats();
    } catch (err) {
      alert("Failed to update inquiry status. Please try again.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAssignInquiry = async (id: string, staffName: string) => {
    setIsUpdating(id);
    try {
      const updated = await travelApi.assignInquiry(id, staffName);
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
      setSelectedInquiry((prev) => (prev && prev.id === id ? updated : prev));
    } catch (err) {
      alert("Failed to assign staff to inquiry. Please try again.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleConvertInquiry = async (id: string) => {
    setIsUpdating(id);
    try {
      const result = await travelApi.convertInquiryToBooking(id);
      
      // Update inquiries state (the status changed to "Converted")
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? result.inquiry : inq)));
      setSelectedInquiry((prev) => (prev && prev.id === id ? result.inquiry : prev));
      
      // Add the new booking
      setBookings((prev) => [result.booking, ...prev]);
      
      // Sync dashboard stats
      await syncStats();

      // Refresh customers list if we auto-created a customer
      const customersData = await travelApi.getCustomers();
      setCustomers(customersData);

      alert(`Successfully converted inquiry to a pending booking! Booking ID: ${result.booking.id}`);
    } catch (err) {
      alert("Failed to convert inquiry to booking. Please try again.");
    } finally {
      setIsUpdating(null);
    }
  };

  // Extract unique categories and statuses for filtering selectors
  const categories = useMemo(() => {
    return Array.from(new Set(packages.map((p) => p.category)));
  }, [packages]);

  const statuses: PackageStatus[] = ["Active", "Inactive", "Draft"];

  // Handle create/edit package submit
  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.title.trim() || !packageForm.destination.trim() || !packageForm.price.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const priceNum = parseFloat(packageForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const ratingNum = parseFloat(packageForm.rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      alert("Please enter a rating between 0 and 5.");
      return;
    }

    if (!packageForm.description.trim()) {
      alert("Please add a short package description.");
      return;
    }

    const nextPackage: TravelPackage = {
      id: editingPackageId || `pkg-${Date.now()}`,
      title: packageForm.title.trim(),
      destination: packageForm.destination.trim(),
      category: packageForm.category,
      image: packageForm.image.trim(),
      price: priceNum,
      duration: packageForm.duration,
      rating: ratingNum,
      status: packageForm.status,
      description: packageForm.description.trim(),
    };

    setIsSavingPackage(true);
    try {
      if (packageModalMode === "edit") {
        setPackages((prev) =>
          prev.map((pkg) => (pkg.id === nextPackage.id ? nextPackage : pkg))
        );
      } else {
        await travelApi.addPackage(nextPackage);
        setPackages((prev) => [nextPackage, ...prev]);
      }

      await syncStats();
      closePackageModal();
    } catch (error) {
      alert(
        packageModalMode === "edit"
          ? "Failed to update package. Please try again."
          : "Failed to add package. Please try again."
      );
    } finally {
      setIsSavingPackage(false);
    }
  };

  const handleDeletePackage = async (pkg: TravelPackage) => {
    const confirmed = window.confirm(`Delete package \"${pkg.title}\"?`);
    if (!confirmed) return;

    setPackages((prev) => prev.filter((item) => item.id !== pkg.id));
    await syncStats();
  };

  // Reset filters
  const handleResetFilters = () => {
    setPackageSearch("");
    setPackageCategory("All");
    setPackageStatus("All");
  };

  // Filter packages based on search query, category, and status
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(packageSearch.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(packageSearch.toLowerCase());
      const matchesCategory =
        packageCategory === "All" || pkg.category === packageCategory;
      const matchesStatus =
        packageStatus === "All" || pkg.status === packageStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [packages, packageSearch, packageCategory, packageStatus]);

  // Filter bookings based on search query and status dropdown
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.packageTitle.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.destination.toLowerCase().includes(bookingSearch.toLowerCase());
      const matchesStatus =
        bookingStatusFilter === "All" || b.status === bookingStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  // Filter customers based on search query and status
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesStatus = customerStatusFilter === "All" || c.status === customerStatusFilter;
      if (!matchesStatus) return false;
      if (!customerSearch) return true;
      const search = customerSearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.address.toLowerCase().includes(search)
      );
    });
  }, [customers, customerSearch, customerStatusFilter]);

  // Handle adding a note to a customer
  const handleAddCustomerNote = async (customerId: string, noteText: string) => {
    const newNote = await travelApi.addCustomerNote(customerId, noteText);
    setCustomers((prev) => prev.map((c) => c.id === customerId ? { ...c, notes: [newNote, ...c.notes] } : c));
    setSelectedCustomer((prev) => prev && prev.id === customerId ? { ...prev, notes: [newNote, ...prev.notes] } : prev);
  };

  // Handle changing customer account status (ban/suspend/activate)
  const handleCustomerStatusChange = async (customerId: string, status: CustomerStatus) => {
    const updated = await travelApi.updateCustomerStatus(customerId, status);
    setCustomers((prev) => prev.map((c) => c.id === customerId ? updated : c));
    setSelectedCustomer((prev) => prev && prev.id === customerId ? updated : prev);
  };

  // Handle deleting a customer
  const handleDeleteCustomer = async (customerId: string) => {
    await travelApi.deleteCustomer(customerId);
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    setSelectedCustomer(null);
  };

  // Handle toggling a tag on a customer
  const handleToggleCustomerTag = async (customerId: string, tag: CustomerTag) => {
    const updated = await travelApi.toggleCustomerTag(customerId, tag);
    setCustomers((prev) => prev.map((c) => c.id === customerId ? updated : c));
    setSelectedCustomer((prev) => prev && prev.id === customerId ? updated : prev);
  };

  // Handle changing payment settlement status
  const handlePaymentStatusChange = async (id: string, status: PaymentStatus) => {
    try {
      const updated = await travelApi.updatePaymentStatus(id, status);
      setPayments((prev) => prev.map((payment) => payment.id === id ? updated : payment));
    } catch (err) {
      alert("Failed to update payment status. Please try again.");
    }
  };

  // Handle approving or hiding customer reviews
  const handleReviewStatusChange = async (id: string, status: ReviewStatus) => {
    try {
      const updated = await travelApi.updateReviewStatus(id, status);
      setReviews((prev) => prev.map((review) => review.id === id ? updated : review));
    } catch (err) {
      alert("Failed to update review status. Please try again.");
    }
  };

  // Render variables depending on activeTab
  const headerTitleMap: Record<SidebarTab, string> = {
    overview: "Console Dashboard",
    packages: "Travel Packages Catalog",
    destinations: "Destination Management",
    bookings: "Bookings & Inquiries Manager",
    inquiries: "Inquiry Management",
    customers: "Customer Management",
    payments: "Payments & Revenue",
    reviews: "Reviews & Ratings",
  };

  const headerSubtitleMap: Record<SidebarTab, string> = {
    overview: "Real-time summary of sales, listings performance, and support inquiries",
    packages: "Add, filter, and audit high-performing destination itineraries and listings",
    bookings: "Manage customer reservations, track departures, and confirm payments",
    inquiries: "Review client inquiries before booking, assign staff, and convert hot leads to bookings",
    customers: "View customer profiles, booking history, and manage notes",
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerTitle={headerTitleMap[activeTab]}
      headerSubtitle={headerSubtitleMap[activeTab]}
    >
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-xs my-8">
          <LoadingState message="Connecting to secure database and loading listings..." />
        </div>
      ) : (
        <>
          {/* 1. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              {/* Dynamic summary metric cards */}
              {stats && <DashboardStats stats={stats} />}

              {/* Grid content split between featured items and bookings */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left - Recent Bookings Column (span 2) */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-slate-500" />
                      <h3 className="text-base font-bold text-slate-800 font-display">Active Action Items</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
                    >
                      View All Bookings
                    </button>
                  </div>
                  <BookingTable
                    bookings={bookings.slice(0, 5)} // Top 5 bookings for summary screen
                    onStatusChange={handleBookingStatusChange}
                    isUpdating={isUpdating}
                  />
                </div>

                {/* Right - Featured Packages Column (span 1) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-slate-500" />
                      <h3 className="text-base font-bold text-slate-800 font-display">Hot Packages</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("packages")}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
                    >
                      Explore Catalog
                    </button>
                  </div>

                  {/* Vertical mini preview of active packages */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Highly Rated Available Tours
                    </div>
                    <div className="divide-y divide-slate-50 space-y-3">
                      {packages
                        .filter((p) => p.status === "Active")
                        .slice(0, 4)
                        .map((pkg) => (
                          <div key={pkg.id} className="flex items-center gap-3.5 pt-3 first:pt-0">
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate font-display">
                                {pkg.title}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-medium truncate">
                                {pkg.destination} • {pkg.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-slate-900 block">
                                ${pkg.price}
                              </span>
                              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                                ★ {pkg.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PACKAGES CATALOG VIEW */}
          {activeTab === "packages" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <SearchInput
                  value={packageSearch}
                  onChange={setPackageSearch}
                  placeholder="Search packages by title or destination..."
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={refreshCatalog}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Catalog
                  </button>
                  <button
                    type="button"
                    onClick={openCreatePackageModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-600/10 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Travel Package
                  </button>
                </div>
              </div>

              {/* Filter controls panel */}
              <PackageFilter
                selectedCategory={packageCategory}
                onCategoryChange={setPackageCategory}
                selectedStatus={packageStatus}
                onStatusChange={setPackageStatus}
                categories={categories}
                statuses={statuses}
              />

              {/* Count Indicator */}
              <div className="text-xs text-slate-400 font-medium">
                Showing {filteredPackages.length} of {packages.length} packages listed
              </div>

              {/* Grid of Results */}
              <PackageGrid
                packages={filteredPackages}
                onResetFilters={handleResetFilters}
                onEditPackage={openEditPackageModal}
                onDeletePackage={handleDeletePackage}
              />
            </div>
          )}

          {/* 3. BOOKINGS VIEW */}
          {activeTab === "bookings" && (
            <div className="space-y-6 animate-fade-in">
              {/* Bookings Filters Row */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <SearchInput
                  value={bookingSearch}
                  onChange={setBookingSearch}
                  placeholder="Search customer, package title, or destination..."
                />

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status Group:
                  </span>
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="text-xs font-semibold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg py-2 pl-3 pr-8 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.25rem 1.25rem",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <option value="All">All Booking Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Found {filteredBookings.length} matching inquiries or confirmations
              </div>

              {/* Main Booking Table Grid */}
              <BookingTable
                bookings={filteredBookings}
                onStatusChange={handleBookingStatusChange}
                isUpdating={isUpdating}
              />
            </div>
          )}

          {/* 4. CUSTOMERS VIEW */}
          {activeTab === "customers" && (
            <div className="space-y-6 animate-fade-in">
              <CustomerStats customers={customers} />

              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <SearchInput
                  value={customerSearch}
                  onChange={setCustomerSearch}
                  placeholder="Search by name, email, phone, or address..."
                />
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>Showing {filteredCustomers.length} of {customers.length} customers</span>
                </div>
              </div>

              <CustomerTable
                customers={filteredCustomers}
                onViewProfile={(customer) => setSelectedCustomer(customer)}
                statusFilter={customerStatusFilter}
                onStatusFilterChange={setCustomerStatusFilter}
                sortBy={customerSort}
                onSortChange={setCustomerSort}
              />
            </div>
          )}
        </>
      )}

      {/* --- PACKAGE DIALOG MODAL --- */}
      {packageModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={closePackageModal}
          />

          {/* Form container */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10 border border-slate-100 animate-slide-up">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {packageModalMode === "edit" ? "Edit Travel Package" : "Create Travel Itinerary"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {packageModalMode === "edit"
                    ? "Update the listing content, pricing, and publication status."
                    : "Populate details to launch a new travel product package"}
                </p>
              </div>
              <button
                onClick={closePackageModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePackageSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Package Title
                </label>
                <input
                  type="text"
                  required
                  value={packageForm.title}
                  onChange={(e) => setPackageForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Hawaiian Cruise Getaway"
                  className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={packageForm.destination}
                    onChange={(e) => setPackageForm((prev) => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g. Honolulu, USA"
                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Category
                  </label>
                  <select
                    value={packageForm.category}
                    onChange={(e) => setPackageForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                      image: prev.image || packageImageByCategory[e.target.value] || packageImageByCategory.Beach,
                    }))}
                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 cursor-pointer"
                  >
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="City Break">City Break</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 1499"
                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Duration
                  </label>
                  <select
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 cursor-pointer"
                  >
                    <option value="3 days">3 days</option>
                    <option value="4 days">4 days</option>
                    <option value="5 days">5 days</option>
                    <option value="6 days">6 days</option>
                    <option value="7 days">7 days</option>
                    <option value="8 days">8 days</option>
                    <option value="9 days">9 days</option>
                    <option value="10 days">10 days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Rating
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="5"
                    step="0.1"
                    value={packageForm.rating}
                    onChange={(e) => setPackageForm((prev) => ({ ...prev, rating: e.target.value }))}
                    placeholder="e.g. 4.8"
                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Listing Status
                  </label>
                  <select
                    value={packageForm.status}
                    onChange={(e) => setPackageForm((prev) => ({ ...prev, status: e.target.value as PackageStatus }))}
                    className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={packageForm.image}
                  onChange={(e) => setPackageForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                  className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={packageForm.description}
                  onChange={(e) => setPackageForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the itinerary highlights, inclusions, and audience."
                  className="w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={closePackageModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPackage}
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-all shadow-md shadow-brand-600/10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingPackage
                    ? "Saving..."
                    : packageModalMode === "edit"
                      ? "Save Changes"
                      : "Publish Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CUSTOMER PROFILE MODAL --- */}
      {selectedCustomer && (
        <CustomerProfile
          customer={selectedCustomer}
          bookings={bookings}
          packages={packages}
          onClose={() => setSelectedCustomer(null)}
          onAddNote={handleAddCustomerNote}
          onStatusChange={handleCustomerStatusChange}
          onDelete={handleDeleteCustomer}
          onTagToggle={handleToggleCustomerTag}
        />
      )}

      {/* --- INQUIRY DETAILS MODAL --- */}
      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          staffList={mockStaff}
          onStatusChange={handleUpdateInquiryStatus}
          onAssignStaff={handleAssignInquiry}
          onConvert={handleConvertInquiry}
          onClose={() => setSelectedInquiry(null)}
          isUpdating={isUpdating === selectedInquiry.id}
        />
      )}
    </DashboardLayout>
  );
}
