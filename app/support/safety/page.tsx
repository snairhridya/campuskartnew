"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const SAFETY_TIPS = [
  { icon: "location_on",   tip: "Always meet in a public, well-lit campus location — library, student union, or cafeteria." },
  { icon: "group",         tip: "Bring a friend if you can, especially for high-value items like laptops or phones." },
  { icon: "visibility",    tip: "Inspect the item thoroughly before confirming the transaction." },
  { icon: "verified_user", tip: "Prefer Faculty Verified sellers for extra peace of mind." },
  { icon: "lock",          tip: "Never share your CampusKart password or OTP with anyone, including the seller." },
  { icon: "report",        tip: "Report any suspicious behavior immediately using the in-app report button." },
];

export default function SafetyTipsPage() {
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
          <h1 className="font-headline-md text-headline-md text-on-surface">Safety Tips</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Stay safe while buying and selling on campus.</p>
        </div>

        <div className="bg-secondary-container/20 border border-secondary-container rounded-2xl p-5 flex items-start gap-3">
          <span className="material-symbols-outlined text-on-secondary-container text-[28px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          <div>
            <p className="font-label-lg text-label-lg text-on-surface mb-1">Your safety is our priority</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              CampusKart is built for peer-to-peer campus transactions. Follow these tips to stay safe.
            </p>
          </div>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-outline-variant/40">
            {SAFETY_TIPS.map((item, i) => (
              <li key={i} className="flex items-start gap-4 px-5 py-4">
                <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">{item.icon}</span>
                <p className="font-body-md text-body-md text-on-surface">{item.tip}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-primary-container rounded-2xl p-5 flex items-start gap-3">
          <span className="material-symbols-outlined text-on-primary-container flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
          <div>
            <p className="font-label-lg text-label-lg text-on-surface mb-1">Emergency?</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              If you feel unsafe during a meetup, leave immediately and contact campus security or call 112.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">&copy; 2025 CampusKart. Academic Integrity &amp; Safety First.</p>
      </footer>
    </div>
  );
}
