"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Generate a simple random order ID
const generateOrderId = () => "CK-" + Math.random().toString(36).substring(2, 8).toUpperCase();

const ORDER_STEPS = [
  { icon: "check_circle",     label: "Order Confirmed",       done: true  },
  { icon: "inventory_2",      label: "Seller Notified",       done: true  },
  { icon: "handshake",        label: "Campus Pickup Pending", done: false },
  { icon: "verified",         label: "Completed",             done: false },
];

export default function OrderConfirmationPage() {
  const [orderId, setOrderId] = useState("");

  // Generate order ID only on client to avoid hydration mismatch
  useEffect(() => {
    setOrderId(generateOrderId());
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">

      {/* ── Top Nav ── */}
      <nav className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-16 py-3 max-w-7xl mx-auto">
          <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary">
            CampusKart
          </Link>
          <Link href="/cart" aria-label="Cart">
            <span className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-full transition-all cursor-pointer" aria-hidden="true">
              shopping_cart
            </span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 md:px-0 py-12">

        {/* ── Success Card ── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center shadow-sm">

          {/* Animated checkmark */}
          <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
            <span
              className="material-symbols-outlined text-on-secondary-container text-[40px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              check_circle
            </span>
          </div>

          <h1 className="font-headline-md text-headline-md text-primary mb-2">
            Order Placed!
          </h1>
          <p className="font-body-md text-on-surface-variant mb-1">
            Your campus pickup has been confirmed.
          </p>
          {orderId && (
            <p className="font-label-lg text-label-lg text-secondary bg-secondary-container/20 inline-block px-4 py-1.5 rounded-full mt-2">
              Order ID: {orderId}
            </p>
          )}
        </div>

        {/* ── Order Status Timeline ── */}
        <div className="mt-6 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Order Status</h2>

          <ol className="relative border-l-2 border-outline-variant ml-4 space-y-6">
            {ORDER_STEPS.map((step, i) => (
              <li key={i} className="ml-6">
                {/* Step dot */}
                <span className={`absolute -left-[13px] flex items-center justify-center w-6 h-6 rounded-full border-2 ${step.done ? "bg-secondary border-secondary" : "bg-surface border-outline-variant"}`}>
                  <span
                    className={`material-symbols-outlined text-[14px] ${step.done ? "text-on-secondary-fixed" : "text-on-surface-variant"}`}
                    style={{ fontVariationSettings: step.done ? "'FILL' 1" : "'FILL' 0" }}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </span>
                </span>
                <p className={`font-label-lg text-label-lg ${step.done ? "text-on-surface" : "text-on-surface-variant"}`}>
                  {step.label}
                </p>
                {i === 0 && (
                  <p className="font-body-sm text-on-surface-variant mt-0.5">
                    Check your campus email for seller contact details.
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* ── What Happens Next ── */}
        <div className="mt-6 bg-secondary-container/20 border border-secondary-container rounded-2xl p-6">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">What Happens Next?</h2>
          <div className="space-y-3">
            {[
              { icon: "mail",         text: "The seller will message you within 24 hours to arrange a safe campus meetup." },
              { icon: "location_on",  text: "Meet at a designated safe zone on campus (library, student union, etc.)." },
              { icon: "handshake",    text: "Exchange the item, inspect it, and mark the order as complete." },
              { icon: "star",         text: "Leave a review to help future students make informed decisions!" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary flex-shrink-0 mt-0.5" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="font-body-sm text-on-surface-variant">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg text-center hover:opacity-90 active:scale-95 transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/search"
            className="flex-1 bg-surface-container-lowest border-2 border-primary text-primary py-4 rounded-xl font-label-lg text-label-lg text-center hover:bg-surface-container-low active:scale-95 transition-all"
          >
            Browse More Listings
          </Link>
        </div>

        {/* ── Trust Note ── */}
        <div className="mt-6 bg-primary-container rounded-xl p-4 flex items-center gap-3">
          <span
            className="material-symbols-outlined text-on-primary-container flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            shield_with_heart
          </span>
          <p className="font-body-sm text-on-primary-container">
            This transaction is protected by <strong>CampusKart Escrow</strong>. Payment is only released after you confirm receipt of the item.
          </p>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-surface-container border-t border-outline-variant py-6 mt-8 text-center">
        <p className="font-body-sm text-on-surface-variant">
          &copy; 2025 CampusKart &mdash; Academic Integrity &amp; Safety First.
        </p>
      </footer>
    </div>
  );
}
