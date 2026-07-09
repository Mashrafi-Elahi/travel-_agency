import React, { useEffect, useMemo, useState } from "react";
import { travelApi } from "../../services/travelApi";
import { Destination } from "../../types/travel";
import SearchInput from "../common/SearchInput";
import EmptyState from "../common/EmptyState";
import DestinationCard from "./DestinationCard";
import DestinationEditorModal, { DestinationEditorValues } from "./DestinationEditorModal";
import { Globe2, MapPin, Package, Plus, Search, Sparkles, Star, Trash2, X } from "lucide-react";

export default function DestinationManager() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Editor modal
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [saving, setSaving] = useState(false);

  // Detail view popup
  const [viewingDestination, setViewingDestination] = useState<Destination | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await travelApi.getDestinations();
      setDestinations(data);
    } catch (err) {
      console.error("Failed to load destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const filteredDestinations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) =>
      [d.name, d.city, d.country, d.description].join(" ").toLowerCase().includes(q)
    );
  }, [destinations, search]);

  const popularCount = destinations.filter((d) => d.popular).length;
  const totalPackages = destinations.reduce((sum, d) => sum + (d.availablePackages ?? 0), 0);
  const countryCount = new Set(destinations.map((d) => d.country)).size;

  // ── Modal handlers ─────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingDestination(null);
    setShowModal(true);
  };

  const openEditModal = (destination: Destination) => {
    setEditingDestination(destination);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDestination(null);
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = async (values: DestinationEditorValues) => {
    setSaving(true);
    try {
      if (editingDestination) {
        const updated = await travelApi.updateDestination(editingDestination.id, values);
        setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        if (viewingDestination?.id === updated.id) setViewingDestination(updated);
      } else {
        const created = await travelApi.addDestination(values);
        setDestinations((prev) => [created, ...prev]);
      }
      closeModal();
    } catch {
      alert("Failed to save destination. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this destination?")) return;
    try {
      await travelApi.deleteDestination(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      if (viewingDestination?.id === id) setViewingDestination(null);
    } catch {
      alert("Failed to delete destination.");
    }
  };

  const handleTogglePopular = async (id: string) => {
    try {
      const updated = await travelApi.toggleDestinationPopular(id);
      setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      if (viewingDestination?.id === id) setViewingDestination(updated);
    } catch {
      alert("Failed to update popular status.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stat cards — mirrors dashboard style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Globe2 className="w-4 h-4" />
            Destinations
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">{destinations.length}</div>
          <p className="text-xs text-slate-400 mt-1">Managed locations in the catalog</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Star className="w-4 h-4" />
            Popular Picks
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">{popularCount}</div>
          <p className="text-xs text-slate-400 mt-1">Highlighted destinations for promotion</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Package className="w-4 h-4" />
            Linked Packages
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">{totalPackages}</div>
          <p className="text-xs text-slate-400 mt-1">Packages tied to these destinations</p>
        </div>
      </div>

      {/* Search + Add — mirrors packages toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search destinations by name, city, country..."
        />
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-600/10 hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* Count line */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Search className="w-4 h-4" />
        <span>
          Showing {filteredDestinations.length} of {destinations.length} destinations across{" "}
          {countryCount} {countryCount === 1 ? "country" : "countries"}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-xs text-center text-sm text-slate-500">
          Loading destinations...
        </div>
      ) : filteredDestinations.length === 0 ? (
        <EmptyState
          title="No destinations found"
          description="Try a broader search term or add a new destination to the catalog."
          actionLabel="Add Destination"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onClick={(): void => setViewingDestination(destination)}
              onEdit={(): void => openEditModal(destination)}
              onDelete={(): Promise<void> => handleDelete(destination.id)}
              onTogglePopular={(): Promise<void> => handleTogglePopular(destination.id)}
            />
          ))}
        </div>
      )}

      {/* ── Detail popup (click on card) ───────────────────────────────────── */}
      {viewingDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setViewingDestination(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 overflow-hidden border border-slate-100 animate-slide-up">
            {/* Image */}
            <div className="relative h-48 bg-slate-100">
              <img
                src={viewingDestination.image}
                alt={viewingDestination.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

              {/* Close */}
              <button
                type="button"
                onClick={() => setViewingDestination(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors cursor-pointer backdrop-blur-xs"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {viewingDestination.popular && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-amber-400/95 text-amber-950 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                )}
              </div>

              {/* Name */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-lg font-black text-white font-display leading-tight">
                  {viewingDestination.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5 text-white/80 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{viewingDestination.city}, {viewingDestination.country}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {viewingDestination.description}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Packages</p>
                  <p className="text-base font-black text-slate-900 font-display">
                    {viewingDestination.availablePackages ?? 0}
                  </p>
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Country</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{viewingDestination.country}</p>
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Status</p>
                  <p className={`text-sm font-bold ${viewingDestination.popular ? "text-amber-600" : "text-slate-500"}`}>
                    {viewingDestination.popular ? "Popular" : "Standard"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setViewingDestination(null); openEditModal(viewingDestination); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(viewingDestination.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-all shadow-md shadow-rose-500/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Editor modal (add / edit) ──────────────────────────────────────── */}
      <DestinationEditorModal
        open={showModal}
        destination={editingDestination}
        saving={saving}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
