"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setUpi(user.user_metadata?.upi_id || "");
      setCard(user.user_metadata?.card_number || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.updateUser({ data: { upi_id: upi, card_number: card } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-4 md:px-16 h-16">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all" aria-label="Go back">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">arrow_back</span>
          </button>
          <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary">CampusKart</Link>
        </div>
        <Link href="/profile" aria-label="Profile">
          <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">person</span>
          </button>
        </Link>
      </header>

      <main className="pt-20 pb-16 px-4 md:px-16 max-w-[680px] mx-auto space-y-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Payment Methods</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Add or update your payment details for faster checkout.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* UPI */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">account_balance</span>
              <h2 className="font-label-lg text-label-lg text-on-surface">UPI</h2>
            </div>
            <div className="px-5 py-5">
              <label htmlFor="upi" className="font-label-md text-label-md text-on-surface-variant block mb-2">UPI ID</label>
              <input
                id="upi"
                type="text"
                placeholder="yourname@okicici"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-on-surface-variant mt-2">Enter your UPI handle to receive payments from buyers.</p>
            </div>
          </section>

          {/* Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">credit_card</span>
              <h2 className="font-label-lg text-label-lg text-on-surface">Debit / Credit Card</h2>
            </div>
            <div className="px-5 py-5">
              <label htmlFor="card" className="font-label-md text-label-md text-on-surface-variant block mb-2">Last 4 Digits</label>
              <input
                id="card"
                type="text"
                maxLength={4}
                placeholder="4242"
                value={card}
                onChange={(e) => setCard(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-on-surface-variant mt-2">We only store the last 4 digits for display purposes.</p>
            </div>
          </section>

          {/* Accepted Methods Info */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl px-5 py-5 shadow-sm">
            <p className="font-label-md text-label-md text-on-surface mb-3">Accepted on CampusKart</p>
            <div className="flex flex-wrap gap-3">
              {["UPI", "Google Pay", "PhonePe", "Paytm", "Net Banking", "Cash on Pickup"].map((m) => (
                <span key={m} className="bg-surface-container text-on-surface-variant font-body-sm text-body-sm px-3 py-1.5 rounded-full border border-outline-variant">
                  {m}
                </span>
              ))}
            </div>
          </section>

          <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all">
            {saved ? "Saved!" : "Save Payment Info"}
          </button>
        </form>
      </main>
    </div>
  );
}
