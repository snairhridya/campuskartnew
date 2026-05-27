"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SavedItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string;
  category: string;
  image: string;
  isFacultyVerified: boolean;
  seller: string;
  savedDate: string;
}

const INITIAL_SAVED: SavedItem[] = [
  {
    id: 1,
    title: "MacBook Pro (2022) - M2 Chip",
    price: 899.00,
    originalPrice: 1299.00,
    condition: "Mint",
    category: "Electronics",
    image: "/images/macbook.jpg",
    isFacultyVerified: true,
    seller: "Prof. Sarah Miller (CS)",
    savedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    price: 45.00,
    originalPrice: 120.00,
    condition: "Good",
    category: "Textbooks",
    image: "/images/textbook.jpg",
    isFacultyVerified: false,
    seller: "James Chen",
    savedDate: "5 days ago",
  },
  {
    id: 3,
    title: "Engineering Graphics Set",
    price: 129.00,
    condition: "Like New",
    category: "Supplies",
    image: "/images/textbook.jpg",
    isFacultyVerified: true,
    seller: "Priya Sharma",
    savedDate: "1 week ago",
  },
];

export default function SavedPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<SavedItem[]>(INITIAL_SAVED);

  const removeItem = (id: number) => {
    setSaved((prev) => prev.filter((item) => item.id !== id));
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

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-headline-md text-headline-md text-on-surface">Saved Items</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {saved.length} item{saved.length !== 1 ? "s" : ""} saved for later.
          </p>
        </div>

        {/* Empty State */}
        {saved.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[72px] text-outline-variant mb-4" aria-hidden="true">
              favorite
            </span>
            <h2 className="font-headline-sm text-headline-sm mb-2">No saved items yet</h2>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-xs">
              Tap the heart icon on any listing to save it here for later.
            </p>
            <Link
              href="/"
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        )}

        {/* Saved Items Grid */}
        {saved.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {saved.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm flex flex-col"
              >
                {/* Image */}
                <Link href={`/product/${item.id}`} className="relative block">
                  <div className="w-full h-44 bg-surface-container overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {item.isFacultyVerified && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-semibold text-on-secondary-container bg-secondary-container/90 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">verified</span>
                      Faculty Verified
                    </span>
                  )}
                  {/* Remove / Unsave button */}
                  <button
                    onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 active:scale-90 transition-all"
                    aria-label={`Remove ${item.title} from saved`}
                  >
                    <span className="material-symbols-outlined text-[22px]" style={{ color: "#ba1a1a", fontVariationSettings: "'FILL' 1" }} aria-hidden="true">favorite</span>
                  </button>
                </Link>

                {/* Info */}
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-outline uppercase">{item.category}</span>
                    <h2 className="font-label-lg text-label-lg text-on-surface leading-snug mt-0.5 line-clamp-2">{item.title}</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {item.condition} · Saved {item.savedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-outline-variant/40">
                    <span className="font-headline-sm text-headline-sm text-primary">${item.price.toFixed(2)}</span>
                    {item.originalPrice && (
                      <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/product/${item.id}`}
                    className="w-full text-center bg-primary text-on-primary py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
                  >
                    View Listing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <Link href="/sell" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined" aria-hidden="true">add_circle</span>
          <span className="font-label-md text-label-md mt-0.5">Sell</span>
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
    </div>
  );
}
