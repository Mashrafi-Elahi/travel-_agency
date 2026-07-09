import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Destination } from "../../types/travel";
import { X } from "lucide-react";

export type DestinationEditorValues = {
  name: string;
  city: string;
  country: string;
  image: string;
  description: string;
  popular: boolean;
};

type DestinationEditorModalProps = {
  open: boolean;
  destination: Destination | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: DestinationEditorValues) => Promise<void>;
};

const emptyValues: DestinationEditorValues = {
  name: "",
  city: "",
  country: "",
  image: "",
  description: "",
  popular: false,
};

export default function DestinationEditorModal({
  open,
  destination,
  saving = false,
  onClose,
  onSave,
}: DestinationEditorModalProps) {
  const [values, setValues] = useState<DestinationEditorValues>(emptyValues);

  useEffect(() => {
    if (!open) return;
    setValues({
      name: destination?.name ?? "",
      city: destination?.city ?? "",
      country: destination?.country ?? "",
      image: destination?.image ?? "",
      description: destination?.description ?? "",
      popular: destination?.popular ?? false,
    });
  }, [destination, open]);

  if (!open) return null;

  const field =
    (key: keyof DestinationEditorValues) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(values);
  };

  const inputCls =
    "w-full text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800 placeholder-slate-400";
  const labelCls =
    "text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1";

  // Portal so fixed overlay covers the FULL screen, not just the content area
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — full screen */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10 border border-slate-100 animate-slide-up">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              {destination ? "Edit Destination" : "Add New Destination"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {destination
                ? "Update this destination's catalog entry."
                : "Populate details to add a destination to the catalog."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-3.5">

          {/* Destination Name */}
          <div>
            <label className={labelCls}>Destination Name</label>
            <input
              type="text"
              required
              value={values.name}
              onChange={field("name")}
              placeholder="e.g. Bali Escape"
              className={inputCls}
            />
          </div>

          {/* City + Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input
                type="text"
                required
                value={values.city}
                onChange={field("city")}
                placeholder="e.g. Bali"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input
                type="text"
                required
                value={values.country}
                onChange={field("country")}
                placeholder="e.g. Indonesia"
                className={inputCls}
              />
            </div>
          </div>

          {/* Image URL + Featured */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Image URL</label>
              <input
                type="url"
                required
                value={values.image}
                onChange={field("image")}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Featured</label>
              <select
                value={values.popular ? "yes" : "no"}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, popular: e.target.value === "yes" }))
                }
                className={inputCls + " cursor-pointer"}
              >
                <option value="no">Standard</option>
                <option value="yes">Popular</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              required
              rows={1}
              value={values.description}
              onChange={field("description")}
              placeholder="Describe what makes this destination special."
              className={inputCls + " resize-none"}
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3.5 border-t border-slate-50 flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-all shadow-md shadow-brand-600/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : destination ? "Save Changes" : "Add Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body   // ← renders outside the layout's overflow container
  );
}
