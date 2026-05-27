"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Listing {
  id: number;
  title: string;
  price: number;
  condition: string;
  category: string;
  image: string;
  status: "Active" | "Sold" | "Draft";
  views: number;
  postedDate: string;
  isFacultyVerified: boolean;
}

const MY_LISTINGS: Listing[] = [
  {
    id: 1,
    title: "MacBook Pro (2022) - M2 Chip",
    price: 899.00,
    condition: "Mint",
    category: "Electronics",
    image: "/images/macbook.jpg",
    status: "Active",
    views: 142,
    postedDate: "May 18, 2025",
    isFacultyVerified: true,
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    price: 45.00,
    condition: "Good",
    category: "Textbooks",
    image: "/images/textbook.jpg",
    status: "Sold",
    views: 87,
    postedDate: "May 10, 2025",
    isFacultyVerified: false,
  },
  {
    id: 3,
    title: "Engineering Graphics Set",
    price: 129.00,
    condition: "Like New",
    category: "Supplies",
    image: "/images/textbook.jpg",
    status: "Draft",
    views: 0,
    postedDate: "May 22, 2025",
    isFacultyVerified: false,
  },
];

const STATUS_STYLES: Record<Listing["status"], { bg: string; text: string; icon: string }> = {
  Active: { bg: "bg-secondary-container/30", text: "text-on-secondary-container", icon: "visibility"     },
  Sold:   { bg: "bg-primary-container/30",   text: "text-on-primary-container",   icon: "check_circle"  },
  Draft:  { bg: "bg-surface-container",      text: "text-on-surface-variant",     icon: "draft"         },
};

export default function SellPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | Listing["status"]>("All");
  const [showNewListingForm, setShowNewListingForm] = useState(false);

  // New listing form state
  const [formData, setFormData] = useState({
    title: "", category: "", price: "", condition: "Good", description: "",
  });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const tabs: Array<"All" | Listing["status"]> = ["All", "Active", "Sold", "Draft"];
  const filtered = filter === "All" ? MY_LISTINGS : MY_LISTINGS.filter((l) => l.status === filter);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.price || !formData.description) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setFormError("");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowNewListingForm(false);
      setFormData({ title: "", category: "", price: "", condition: "Good", description: "" });
    }, 2000);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">

      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-4 md:px-16 h-16">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-primary" aria-hidden="true">arrow_back</span>
          </button>
          <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary">
            CampusKart
          </Link>
        </div>
        <Link href="/cart" aria-label="Cart">
          <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">shopping_cart</span>
          </button>
        </Link>
      </header>

      <main className="pt-20 pb-28 px-4 md:px-16 max-w-[900px] mx-auto">

        {/* Page Title + New Listing Button */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">My Listings</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Manage and track your campus marketplace listings.
            </p>
          </div>
          <button
            onClick={() => setShowNewListingForm(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
            New Listing
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Active",    value: MY_LISTINGS.filter(l => l.status === "Active").length },
            { label: "Sold",      value: MY_LISTINGS.filter(l => l.status === "Sold").length   },
            { label: "Total Views", value: MY_LISTINGS.reduce((s, l) => s + l.views, 0)        },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center shadow-sm">
              <span className="font-headline-sm text-headline-sm text-primary">{stat.value}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-center">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div role="tablist" aria-label="Filter listings" className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                filter === tab
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4" aria-hidden="true">sell</span>
            <h2 className="font-headline-sm text-headline-sm mb-2">No {filter !== "All" ? filter.toLowerCase() : ""} listings</h2>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-xs">
              You haven't posted any listings yet. Start selling to your campus community!
            </p>
            <button
              onClick={() => setShowNewListingForm(true)}
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Post a Listing
            </button>
          </div>
        )}

        {/* Listing Cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((listing) => {
            const style = STATUS_STYLES[listing.status];
            return (
              <div
                key={listing.id}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex gap-4 items-start shadow-sm"
              >
                <Link href={`/product/${listing.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </Link>

                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <h2 className="font-label-lg text-label-lg text-on-surface leading-snug truncate">{listing.title}</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{listing.category} · {listing.condition}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm flex-shrink-0 ${style.bg} ${style.text}`}>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{style.icon}</span>
                      {listing.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-headline-sm text-headline-sm text-primary">${listing.price.toFixed(2)}</span>
                      <span className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[15px]" aria-hidden="true">visibility</span>
                        {listing.views} views
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded-full font-label-sm text-label-sm border border-outline-variant text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all"
                        onClick={() => alert("Edit functionality coming soon!")}
                      >
                        Edit
                      </button>
                      <Link
                        href={`/product/${listing.id}`}
                        className="px-3 py-1.5 rounded-full font-label-sm text-label-sm bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container flex justify-around items-center h-16 px-2 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] border-t border-outline-variant"
        aria-label="Bottom navigation"
      >
        <Link href="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined" aria-hidden="true">storefront</span>
          <span className="font-label-md text-label-md mt-0.5">Market</span>
        </Link>
        <Link href="/sell" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1" aria-current="page">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">add_circle</span>
          <span className="font-label-md text-label-md">Sell</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
          <span className="font-label-md text-label-md mt-0.5">Cart</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined" aria-hidden="true">person</span>
          <span className="font-label-md text-label-md mt-0.5">Profile</span>
        </Link>
      </nav>

      {/* ── New Listing Modal ── */}
      {showNewListingForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Post a New Listing</h2>
              <button
                onClick={() => { setShowNewListingForm(false); setFormError(""); }}
                className="p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">close</span>
              </button>
            </div>

            <form onSubmit={handlePost} className="px-6 py-5 flex flex-col gap-4">
              {submitted ? (
                <div className="flex flex-col items-center py-10 gap-3 text-center">
                  <span className="material-symbols-outlined text-[48px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                  <p className="font-headline-sm text-headline-sm text-on-surface">Listing Posted!</p>
                  <p className="font-body-sm text-on-surface-variant">Your item is now live on CampusKart.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="listing-title" className="font-label-md text-label-md text-on-surface">Title <span className="text-error">*</span></label>
                    <input
                      id="listing-title"
                      type="text"
                      placeholder="e.g. iPhone 14 Pro, DBMS Textbook"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="listing-category" className="font-label-md text-label-md text-on-surface">Category <span className="text-error">*</span></label>
                      <select
                        id="listing-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select...</option>
                        <option>Electronics</option>
                        <option>Textbooks</option>
                        <option>Supplies</option>
                        <option>Furniture</option>
                        <option>Clothing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="listing-condition" className="font-label-md text-label-md text-on-surface">Condition</label>
                      <select
                        id="listing-condition"
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                      >
                        <option>Mint</option>
                        <option>Like New</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Parts Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="listing-price" className="font-label-md text-label-md text-on-surface">Price ($) <span className="text-error">*</span></label>
                    <input
                      id="listing-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="listing-desc" className="font-label-md text-label-md text-on-surface">Description <span className="text-error">*</span></label>
                    <textarea
                      id="listing-desc"
                      rows={3}
                      placeholder="Describe your item — condition details, included accessories, pickup location..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {formError && (
                    <p className="font-body-sm text-body-sm text-error">{formError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all shadow-sm mt-1"
                  >
                    Post Listing
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
