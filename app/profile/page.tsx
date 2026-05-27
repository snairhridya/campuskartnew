"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const PROFILE = {
  name: "Campus Member",
  email: "",
  campus: "Campus Member",
  joined: "2024",
  avatar: null,
  stats: { bought: 0, sold: 0, rating: 5.0 },
  isFacultyVerified: false,
};

const MENU_SECTIONS = [
  {
    title: "Orders & Activity",
    items: [
      { icon: "receipt_long",    label: "Order History",    href: "/orders",  badge: null },
      { icon: "sell",            label: "My Listings",      href: "/sell",    badge: "4"  },
      { icon: "favorite",        label: "Saved Items",      href: "/saved",   badge: null },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: "person",          label: "Edit Profile",     href: "/account", badge: null },
      { icon: "notifications",   label: "Notifications",    href: "/account", badge: "3"  },
      { icon: "payments",        label: "Payment Methods",  href: "/account", badge: null },
      { icon: "verified_user",   label: "Verification",     href: "/account", badge: null },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help",            label: "Help Center",      href: "/support", badge: null },
      { icon: "shield",          label: "Safety Tips",      href: "/support", badge: null },
      { icon: "info",            label: "About CampusKart", href: "/support", badge: null },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    if (logoutConfirm) {
      await signOut();
      router.push("/login");
    } else {
      setLogoutConfirm(true);
      setTimeout(() => setLogoutConfirm(false), 3000);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">

      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-4 md:px-16 h-16">
        <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary">
          CampusKart
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/cart" aria-label="Cart">
            <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">shopping_cart</span>
            </button>
          </Link>
          <Link href="/search" aria-label="Search">
            <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">search</span>
            </button>
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-28 px-4 md:px-16 max-w-[680px] mx-auto">

        {/* ── Avatar + Info Card ── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex items-center gap-5 shadow-sm mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-[36px] font-bold text-on-primary-container select-none overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt={user?.user_metadata?.full_name || PROFILE.name} className="w-full h-full object-cover" />
            ) : (
              (user?.user_metadata?.full_name || PROFILE.name).charAt(0)
            )}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline-sm text-headline-sm text-on-surface">{user?.user_metadata?.full_name || PROFILE.name}</h1>
              {PROFILE.isFacultyVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-secondary-container bg-secondary-container/30 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">verified</span>
                  Verified
                </span>
              )}
            </div>
            <p className="font-body-sm text-on-surface-variant mt-0.5 truncate">{user?.email || PROFILE.email}</p>
            <div className="flex items-center gap-1 mt-0.5 font-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">school</span>
              <span>{user?.user_metadata?.campus || PROFILE.campus}</span>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Bought",     value: PROFILE.stats.bought },
            { label: "Sold",       value: PROFILE.stats.sold   },
            { label: "Rating",     value: `${PROFILE.stats.rating}★`},
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center shadow-sm">
              <span className="font-headline-sm text-headline-sm text-primary">{stat.value}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── Menu Sections ── */}
        <div className="flex flex-col gap-4">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              <p className="font-label-sm text-label-sm text-on-surface-variant px-5 pt-4 pb-1 uppercase tracking-wide">
                {section.title}
              </p>
              <ul>
                {section.items.map((item, i) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-4 px-5 py-4 hover:bg-surface-container-low active:bg-surface-container transition-colors ${
                        i < section.items.length - 1 ? "border-b border-outline-variant/40" : ""
                      }`}
                    >
                      <span className="material-symbols-outlined text-primary" aria-hidden="true">{item.icon}</span>
                      <span className="flex-grow font-body-md text-body-md text-on-surface">{item.label}</span>
                      {item.badge && (
                        <span className="bg-primary text-on-primary text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">chevron_right</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Joined Info ── */}
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-6">
          Member since {PROFILE.joined}
        </p>

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className={`w-full mt-4 py-4 rounded-xl font-label-lg text-label-lg border-2 active:scale-95 transition-all ${
            logoutConfirm
              ? "border-error text-error hover:bg-error-container/20"
              : "border-outline text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          {logoutConfirm ? "Tap again to confirm logout" : "Logout"}
        </button>
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
        <Link href="/profile" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1" aria-current="page">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">person</span>
          <span className="font-label-md text-label-md">Profile</span>
        </Link>
      </nav>

      {/* ── Footer ── */}
      <footer className="hidden md:block w-full py-8 bg-surface-container-lowest border-t border-outline-variant text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          &copy; 2025 CampusKart. Academic Integrity &amp; Safety First.
        </p>
      </footer>
    </div>
  );
}
