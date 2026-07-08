# Travel Agency Dashboard MVP

A highly-polished, responsive **Travel Agency Dashboard Frontend MVP** built with **React**, **TypeScript**, and **Vite**. This application serves as a comprehensive visual control room for managing travel itineraries, packages, and tracking customer inquiries and bookings with real-time in-memory status changes and metric synchronization.

---

## Key Features

1. **Analytical Summary Indicators**:
   * **Total Bookings**: Interactive counter tracking overall sales.
   * **Total Revenue**: Calculates financial earnings based on confirmed and completed bookings.
   * **Active Packages**: Displays the total count of listed packages.
   * **Pending Inquiries**: Tracks outstanding customer support requests.

2. **Travel Package & Destination Catalog**:
   * View card listings showcasing beautiful images, pricing, ratings, destinations, categories, and status tags (`Active`, `Inactive`, `Draft`).
   * Add a custom travel package through a high-fidelity modal form that dynamically updates the list and statistics.

3. **Dynamic Filtering and Searching**:
   * Search packages or destinations instantly.
   * Select travel categories via custom filter chips.
   * Filter package statuses on-the-fly.

4. **Booking and Inquiry Control**:
   * Tabular list showing customer names, dates, destination details, and booking status.
   * Update individual booking status dropdowns (`Pending`, `Confirmed`, `Completed`, `Cancelled`) with automatic, in-memory updates that recalculate financial revenue and pending queues immediately.

5. **Responsive Modern Design**:
   * Seamless layout optimized for desktop, tablets, and mobile devices.
   * Custom modern navigation sidebar with responsive backdrop sliding panel on mobile screen widths.

---

## Technology Stack

* **Core UI Framework**: React (v19)
* **Programming Language**: TypeScript
* **Build System & Dev Server**: Vite
* **Styling Engine**: Tailwind CSS (v4) with custom premium color gradients
* **Icon Set**: Lucide React

---

## How to Run locally

Follow these quick commands to spin up the local development server:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Production build**:
   ```bash
   npm run build
   ```

---

## Future Backend API Connection

This application features a modular service layer located at `src/services/travelApi.ts`. All data requests (fetching packages, dashboard counters, and status updates) are fully asynchronous and use mock Promises.

Connecting a real production API (Express, NestJS, Django, etc.) can be achieved smoothly by updating the `travelApi.ts` endpoints:

```typescript
// Example replacement in src/services/travelApi.ts
export const travelApi = {
  async getPackages(): Promise<TravelPackage[]> {
    const response = await fetch("/api/packages");
    return response.json();
  }
}
```
