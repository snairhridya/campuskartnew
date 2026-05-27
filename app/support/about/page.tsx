"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-4 md:px-16 h-16">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all" aria-label="Go back">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary">CampusKart</Link>
        </div>
      </header>

      <main className="pt-20 pb-16 px-4 md:px-16 max-w-[720px] mx-auto space-y-5">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">About CampusKart</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Learn more about our platform.</p>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm text-center">
          <h2 className="font-headline-md text-headline-md text-primary mb-1">CampusKart</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Version 1.0.0</p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            CampusKart is a peer-to-peer marketplace built exclusively for college students. Buy and sell textbooks, electronics, and supplies — safely, on campus.
          </p>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          {[
            { icon: "verified_user", label: "Faculty Verified Listings",  desc: "Sellers authenticated by campus faculty for trust." },
            { icon: "handshake",     label: "Safe Campus Pickup",          desc: "All transactions happen at designated safe zones." },
            { icon: "lock",          label: "CampusKart Escrow",           desc: "Payment held safely until item is received." },
            { icon: "school",        label: "Academic Integrity",          desc: "Built to support student communities responsibly." },
          ].map((item, i, arr) => (
            <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-outline-variant/40" : ""}`}>
              <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">{item.label}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-outline-variant">
            <p className="font-label-lg text-label-lg text-on-surface">Legal</p>
          </div>
          <Link href="/legal" className="flex items-center justify-between px-5 py-4 hover:bg-surface-container transition-colors font-body-md text-body-md text-on-surface border-b border-outline-variant/40">
            Privacy Policy &amp; Terms of Service
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </Link>
          <Link href="/legal" className="flex items-center justify-between px-5 py-4 hover:bg-surface-container transition-colors font-body-md text-body-md text-on-surface">
            Academic Integrity Policy
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </Link>
        </section>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center pb-4">
          &copy; 2025 CampusKart. Academic Integrity &amp; Safety First.
        </p>
      </main>
    </div>
  );
}
