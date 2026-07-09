import React from "react";
import { TravelPackage } from "../../types/travel";
import PackageCard from "./PackageCard";
import EmptyState from "../common/EmptyState";

interface PackageGridProps {
  packages: TravelPackage[];
  onResetFilters?: () => void;
  onEditPackage: (pkg: TravelPackage) => void;
  onDeletePackage: (pkg: TravelPackage) => void;
}

export default function PackageGrid({ packages, onResetFilters, onEditPackage, onDeletePackage }: PackageGridProps) {
  if (packages.length === 0) {
    return (
      <EmptyState
        title="No packages found"
        description="Try relaxing your search terms or picking a different category and status to view the packages."
        actionLabel="Clear Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          onEdit={onEditPackage}
          onDelete={onDeletePackage}
        />
      ))}
    </div>
  );
}
