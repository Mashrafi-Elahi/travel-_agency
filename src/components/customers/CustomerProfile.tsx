import React, { useState, useEffect } from "react";
import { Customer, CustomerNote, BookingInquiry, BookingStatus, CustomerStatus, CustomerTag, TravelPackage } from "../../types/travel";
import { travelApi } from "../../services/travelApi";
import {
  X, Mail, Phone, MapPin, CalendarDays, MessageSquarePlus, StickyNote, Send,
  User, Clock, Plane, Package, ShieldCheck, ShieldAlert, ShieldBan, Trash2,
  Tag, MailPlus, AlertTriangle, Sparkles, BrainCircuit, RefreshCw, FileText,
  Copy, Check
} from "lucide-react";

interface CustomerProfileProps {
  customer: Customer;
  bookings: BookingInquiry[];
  packages?: TravelPackage[];
  onClose: () => void;
  onAddNote: (customerId: string, noteText: string) => Promise<void>;
  onStatusChange: (customerId: string, status: CustomerStatus) => Promise<void>;
  onDelete: (customerId: string) => Promise<void>;
  onTagToggle: (customerId: string, tag: CustomerTag) => Promise<void>;
}

const bookingStatusStyles: Record<BookingStatus, { bg: string; dot: string }> = {
  Pending: { bg: "bg-amber-500/5 text-amber-600/90 border-amber-500/10", dot: "bg-amber-400" },
  Confirmed: { bg: "bg-sky-500/5 text-sky-600/90 border-sky-500/10", dot: "bg-sky-400" },
  Cancelled: { bg: "bg-rose-500/5 text-rose-600/90 border-rose-500/10", dot: "bg-rose-400" },
  Completed: { bg: "bg-emerald-500/5 text-emerald-600/90 border-emerald-500/10", dot: "bg-emerald-400" },
};

const allTags: CustomerTag[] = ["VIP", "Frequent", "New", "At-Risk", "Corporate"];
const tagColors: Record<string, string> = {
  VIP: "bg-violet-500/5 text-violet-600 border-violet-500/10", Frequent: "bg-blue-500/5 text-blue-600 border-blue-500/10",
  New: "bg-emerald-500/5 text-emerald-600 border-emerald-500/10", "At-Risk": "bg-rose-500/5 text-rose-600 border-rose-500/10",
  Corporate: "bg-slate-500/5 text-slate-600 border-slate-500/10",
};

type ProfileTab = "overview" | "bookings" | "notes" | "ai" | "admin";

interface AiInsights {
  travelPersona: string;
  preferredClimate: string;
  churnRisk: "Low" | "Medium" | "High";
  confidenceScore: number;
  recommendedDestinationReason: string;
  suggestedAction: string;
}

export default function CustomerProfile({
  customer,
  bookings,
  packages = [],
  onClose,
  onAddNote,
  onStatusChange,
  onDelete,
  onTagToggle
}: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [noteText, setNoteText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // AI Specific States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [selectedPkgTitle, setSelectedPkgTitle] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const customerBookings = bookings.filter((b) => b.customerName === customer.name);
  const activePackages = packages.filter(p => p.status === "Active");

  const fetchAiInsights = async () => {
    setAiLoading(true);
    try {
      const data = await travelApi.getCustomerAiInsights(customer.id);
      setAiInsights(data);
      if (activePackages.length > 0 && !selectedPkgTitle) {
        setSelectedPkgTitle(activePackages[0].title);
      }
    } catch (err) {
      console.error("AI Insight retrieval failed", err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ai" && !aiInsights) {
      fetchAiInsights();
    }
  }, [activeTab]);

  const handleGenerateEmail = async () => {
    if (!selectedPkgTitle) return;
    setEmailLoading(true);
    try {
      const email = await travelApi.generateAiOfferEmail(customer.id, selectedPkgTitle);
      setGeneratedEmail(email);
      setCopied(false);
    } catch (err) {
      alert("Failed to generate AI email pitch.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddNote(customer.id, noteText.trim());
      setNoteText("");
    } catch {
      alert("Failed to add note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: CustomerStatus) => {
    setIsChangingStatus(true);
    try {
      await onStatusChange(customer.id, status);
    } catch {
      alert("Failed to update status.");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(customer.id);
      onClose();
    } catch {
      alert("Failed to delete customer.");
      setIsDeleting(false);
    }
  };

  const tabs: { id: ProfileTab; label: React.ReactNode; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Bookings", count: customerBookings.length },
    { id: "notes", label: "Notes", count: customer.notes.length },
    {
      id: "ai",
      label: (
        <span className="flex items-center gap-1 text-indigo-500 font-bold">
          <Sparkles className="w-3.5 h-3.5 fill-indigo-500/10" />
          AI Copilot
        </span>
      )
    },
    { id: "admin", label: "Admin" },
  ];

  const statusActions: { status: CustomerStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { status: "Active", label: "Activate Account", icon: <ShieldCheck className="w-4 h-4" />, color: "bg-emerald-500/5 text-emerald-700 border-emerald-200/50 hover:bg-emerald-500/10" },
    { status: "Suspended", label: "Suspend Account", icon: <ShieldAlert className="w-4 h-4" />, color: "bg-amber-500/5 text-amber-700 border-amber-200/50 hover:bg-amber-500/10" },
    { status: "Banned", label: "Ban Account", icon: <ShieldBan className="w-4 h-4" />, color: "bg-rose-500/5 text-rose-700 border-rose-200/50 hover:bg-rose-500/10" },
  ];

  const statusBanner = customer.status !== "Active" ? (
    <div className={`mx-7 mt-4 rounded-xl border p-3 flex items-center gap-3 ${customer.status === "Banned" ? "bg-rose-500/5 border-rose-500/10" : "bg-amber-500/5 border-amber-500/10"}`}>
      {customer.status === "Banned" ? <ShieldBan className="w-4 h-4 text-rose-600 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />}
      <span className={`text-[11px] font-bold ${customer.status === "Banned" ? "text-rose-700/80" : "text-amber-700/80"}`}>
        This account is {customer.status.toLowerCase()}. Outbound outreach is locked.
      </span>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Soft translucent backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      
      {/* Frosted glass container */}
      <div className="animate-scale-in relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] w-full max-w-2xl max-h-[92vh] overflow-hidden z-10 border border-white/60 flex flex-col">

        {/* HEADER: Smoky glass with subtle ambient glow spots */}
        <div className="relative bg-slate-900/90 backdrop-blur-md px-7 pt-7 pb-5 shrink-0 border-b border-white/10">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer z-10"><X className="w-5 h-5" /></button>

          <div className="relative flex items-center gap-5">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg border border-white/25 shrink-0 ${customer.status !== "Active" ? "grayscale" : ""}`}>{customer.avatar}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-display tracking-tight truncate">{customer.name}</h2>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${customer.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/20" : customer.status === "Suspended" ? "bg-amber-500/10 text-amber-400 border-amber-400/20" : "bg-rose-500/10 text-rose-400 border-rose-400/20"}`}>{customer.status}</span>
              </div>
              <p className="text-slate-400 text-[11px] font-medium mt-0.5 font-mono">{customer.id} · Joined {customer.joinDate}</p>
            </div>
          </div>

          {/* Frosted Glass Metrics */}
          <div className="relative grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center shadow-xs">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block mb-1">Bookings</span>
              <span className="text-lg font-black text-white font-display leading-none">{customer.totalBookings}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center shadow-xs">
              <span className="text-[9px] font-bold text-teal-300 uppercase tracking-wider block mb-1">Total Spent</span>
              <span className="text-lg font-black text-teal-300 font-display leading-none">${customer.totalSpent.toLocaleString()}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center shadow-xs">
              <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider block mb-1">Last Booking</span>
              <span className="text-xs font-extrabold text-indigo-100 font-display mt-0.5 block leading-none">{customer.lastBookingDate}</span>
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="px-7 bg-slate-50/50 backdrop-blur-xs border-b border-slate-100 flex gap-1 shrink-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${activeTab === tab.id ? "text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && (<span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${activeTab === tab.id ? "bg-slate-200 text-slate-800" : "bg-slate-200/50 text-slate-500"}`}>{tab.count}</span>)}
              </span>
              {activeTab === tab.id && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-slate-800 rounded-full" />}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto bg-slate-50/20">
          {statusBanner}

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="p-7 space-y-6 animate-fade-in-up">
              {customer.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {customer.tags.map((tag) => (<span key={tag} className={`text-[9px] font-bold px-2 py-0.5 rounded border ${tagColors[tag] || "bg-slate-50 text-slate-500 border-slate-200"}`}>{tag}</span>))}
                </div>
              )}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-3.5 h-3.5" />Contact Information</h4>
                <div className="bg-white/40 backdrop-blur-xs rounded-xl border border-white/60 divide-y divide-slate-100/50 shadow-2xs overflow-hidden">
                  {[{ icon: <Mail className="w-4 h-4 text-indigo-500" />, bg: "bg-indigo-50/50", label: "Email", value: customer.email },
                    { icon: <Phone className="w-4 h-4 text-teal-500" />, bg: "bg-teal-50/50", label: "Phone", value: customer.phone },
                    { icon: <MapPin className="w-4 h-4 text-slate-500" />, bg: "bg-slate-100/50", label: "Address", value: customer.address }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3.5 px-5 py-3 hover:bg-white/60 transition-colors">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 border border-slate-100/30`}>{item.icon}</div>
                      <div className="min-w-0"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span><span className="text-xs font-semibold text-slate-700 truncate block mt-0.5">{item.value}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              {customerBookings.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Plane className="w-3.5 h-3.5" />Recent Trips</h4>
                    <button onClick={() => setActiveTab("bookings")} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer">See all {customerBookings.length} →</button>
                  </div>
                  <div className="space-y-2">
                    {customerBookings.slice(0, 3).map((b) => { const s = bookingStatusStyles[b.status]; return (
                      <div key={b.id} className="bg-white/40 backdrop-blur-xs rounded-xl border border-white/60 p-3 flex items-center justify-between hover:bg-white/60 transition-all shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0"><div className="w-8 h-8 rounded-lg bg-slate-100/50 flex items-center justify-center shrink-0"><Package className="w-3.5 h-3.5 text-slate-400" /></div>
                          <div className="min-w-0"><span className="text-xs font-bold text-slate-700 block truncate">{b.packageTitle}</span><span className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{b.destination} · {b.date}</span></div></div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${s.bg} shrink-0 ml-3`}><span className={`w-1 h-1 rounded-full ${s.dot}`} />{b.status}</span>
                      </div>); })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="p-7 animate-fade-in-up">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5" />Booking History ({customerBookings.length})</h4>
              {customerBookings.length > 0 ? (
                <div className="space-y-2.5">
                  {customerBookings.map((b) => { const s = bookingStatusStyles[b.status]; return (
                    <div key={b.id} className="bg-white/40 backdrop-blur-xs rounded-xl border border-white/60 p-3.5 hover:bg-white/60 transition-all shadow-2xs">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-lg bg-slate-100/50 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-slate-400" /></div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 block truncate">{b.packageTitle}</span>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                              <span className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-300" />{b.destination}</span>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1"><CalendarDays className="w-3 h-3 text-slate-300" />{b.date}</span>
                              <span className="text-[9px] text-slate-400 font-mono">{b.id}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${s.bg} shrink-0`}><span className={`w-1 h-1 rounded-full ${s.dot}`} />{b.status}</span>
                      </div>
                    </div>); })}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-100/30 rounded-xl border border-dashed border-slate-200"><Plane className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-xs text-slate-400 font-semibold">No bookings found</p></div>
              )}
            </div>
          )}

          {/* NOTES */}
          {activeTab === "notes" && (
            <div className="p-7 space-y-4 animate-fade-in-up">
              <form onSubmit={handleAddNote}>
                <div className="bg-white/40 backdrop-blur-xs rounded-xl border border-white/60 p-4 shadow-2xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5"><MessageSquarePlus className="w-3.5 h-3.5 text-slate-400" />Add a New Note</label>
                  <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write an administrative note..." rows={3} className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500/50 transition-all text-slate-800 placeholder-slate-400 resize-none" />
                  <div className="flex items-center justify-end mt-2.5">
                    <button type="submit" disabled={!noteText.trim() || isSubmitting} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg transition-all cursor-pointer"><Send className="w-3 h-3" />{isSubmitting ? "Saving..." : "Save Note"}</button>
                  </div>
                </div>
              </form>
              {customer.notes.length > 0 ? (
                <div className="space-y-2.5">
                  {customer.notes.map((note) => (
                    <div key={note.id} className="bg-white/45 border border-white/60 rounded-xl p-3.5 shadow-2xs">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{note.text}</p>
                      <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-100/40">
                        <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1"><User className="w-3 h-3" />{note.author}</span>
                        <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" />{note.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-100/30 rounded-xl border border-dashed border-slate-200"><StickyNote className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-xs text-slate-400 font-semibold">No notes yet</p></div>
              )}
            </div>
          )}

          {/* AI COPILOT */}
          {activeTab === "ai" && (
            <div className="p-7 space-y-5 animate-fade-in-up">
              {aiLoading ? (
                <div className="text-center py-16">
                  <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto mb-2.5" />
                  <p className="text-xs font-semibold text-slate-600">Model generating insights...</p>
                </div>
              ) : aiInsights ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Frosted AI Cards */}
                    <div className="bg-indigo-500/5 backdrop-blur-xs rounded-xl border border-indigo-500/10 p-3.5">
                      <div className="flex items-center gap-1.5 text-indigo-700/80 mb-2">
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">AI Persona Profile</span>
                      </div>
                      <span className="text-sm font-extrabold text-slate-800 block font-display">{aiInsights.travelPersona}</span>
                      <div className="mt-3 pt-2.5 border-t border-indigo-500/10 flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                        <span>Confidence Level</span>
                        <span>{aiInsights.confidenceScore}%</span>
                      </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-xs rounded-xl border border-white/60 p-3.5">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Retention Health</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Churn Danger</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${
                          aiInsights.churnRisk === "Low" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
                          aiInsights.churnRisk === "Medium" ? "bg-amber-500/5 text-amber-600 border-amber-500/10" :
                          "bg-rose-500/5 text-rose-600 border-rose-500/10"
                        }`}>{aiInsights.churnRisk}</span>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-100/50">
                        <span className="text-[9px] text-slate-400 block font-semibold">Inferred Climate Style</span>
                        <span className="text-xs font-bold text-slate-700 mt-0.5 block">{aiInsights.preferredClimate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/30 backdrop-blur-xs rounded-xl p-3.5 border border-white/60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recommendation Reasoning</span>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{aiInsights.recommendedDestinationReason}</p>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/40 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[8px] font-extrabold text-indigo-800/80 uppercase tracking-wider block">Suggested Next Action</span>
                        <span className="text-xs font-bold text-slate-800 mt-0.5 block">{aiInsights.suggestedAction}</span>
                      </div>
                    </div>
                  </div>

                  {customer.status === "Active" ? (
                    <div className="border-t border-slate-200/30 pt-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <MailPlus className="w-3.5 h-3.5 text-slate-400" />
                        AI Smart Pitch Generator
                      </h4>
                      <div className="bg-white/40 backdrop-blur-xs rounded-xl border border-white/60 p-3.5 shadow-2xs space-y-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Catalog Recommendations</label>
                            <select
                              value={selectedPkgTitle}
                              onChange={(e) => setSelectedPkgTitle(e.target.value)}
                              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 focus:outline-hidden focus:border-brand-500 cursor-pointer"
                            >
                              {activePackages.map(p => (
                                <option key={p.id} value={p.title}>{p.title} (${p.price})</option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={handleGenerateEmail}
                            disabled={emailLoading || !selectedPkgTitle}
                            className="sm:self-end inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                          >
                            <Sparkles className="w-3 h-3 fill-white/10" />
                            {emailLoading ? "Writing..." : "Generate Pitch"}
                          </button>
                        </div>

                        {generatedEmail && (
                          <div className="relative bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-white/15">
                            <button
                              onClick={handleCopyEmail}
                              className="absolute top-2.5 right-2.5 p-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white cursor-pointer"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap pr-6 max-h-52 overflow-y-auto">
                              {generatedEmail}
                            </pre>
                            {copied && (
                              <span className="absolute bottom-2.5 right-2.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/50">
                                Copied!
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          )}

          {/* ADMIN */}
          {activeTab === "admin" && (
            <div className="p-7 space-y-6 animate-fade-in-up">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2"><Tag className="w-3.5 h-3.5" />Manage Tags</h4>
                <div className="bg-white/40 backdrop-blur-xs rounded-xl border border-white/60 p-4 shadow-2xs">
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map((tag) => {
                      const isActive = customer.tags.includes(tag);
                      return (<button key={tag} onClick={() => onTagToggle(customer.id, tag)} className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer ${isActive ? tagColors[tag] || "bg-slate-100 text-slate-700 border-slate-200" : "bg-white text-slate-400 border-slate-200 border-dashed hover:border-slate-350"}`}>{isActive ? "✓ " : "+ "}{tag}</button>);
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" />Account Status Action</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {statusActions.filter((a) => a.status !== customer.status).map((action) => (
                    <button key={action.status} onClick={() => handleStatusChange(action.status)} disabled={isChangingStatus}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all text-xs font-bold cursor-pointer disabled:opacity-50 ${action.color}`}>
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2.5 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" />Danger Zone</h4>
                <div className="bg-rose-500/5 rounded-xl border border-rose-500/10 p-4">
                  {!showDeleteConfirm ? (
                    <div className="flex items-center justify-between">
                      <div><span className="text-xs font-bold text-rose-950 block">Delete Customer Profile</span><span className="text-[10px] text-rose-700/60 mt-0.5 block">Permanently erase this profile and booking matches.</span></div>
                      <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold text-rose-700 bg-white hover:bg-rose-100/50 border border-rose-200 rounded-md transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] text-rose-700 font-bold">This is irreversible. Confirm deletion?</p>
                      <div className="flex items-center gap-2">
                        <button onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:bg-rose-300 rounded-md transition-all cursor-pointer">{isDeleting ? "Deleting..." : "Confirm Delete"}</button>
                        <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-white rounded-md transition-colors cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
