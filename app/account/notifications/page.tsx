"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NOTIF_ITEMS = [
  { key: "orderUpdates", label: "Order Updates",    desc: "Status changes for your orders",         default: true  },
  { key: "messages",     label: "Seller Messages",  desc: "Messages from buyers and sellers",       default: true  },
  { key: "priceDrops",   label: "Price Drop Alerts",desc: "When saved items drop in price",         default: false },
  { key: "newListings",  label: "New Listings",     desc: "Items matching your interests",          default: false },
  { key: "promotions",   label: "Promotions",       desc: "CampusKart deals and updates",           default: false },
] as const;

type NotifKey = (typeof NOTIF_ITEMS)[number]["key"];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>(() =>
    Object.fromEntries(NOTIF_ITEMS.map((n) => [n.key, n.default])) as Record<NotifKey, boolean>
  );
  const [saved, setSaved] = useState(false);

  const toggle = (key: NotifKey) => setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
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
          <h1 className="font-headline-md text-headline-md text-on-surface">Notifications</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Choose what you want to be notified about.</p>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-outline-variant/40">
            {NOTIF_ITEMS.map(({ key, label, desc }) => (
              <li key={key} className="flex items-center justify-between px-5 py-4 gap-4">
                <div>
                  <p className="font-body-md text-body-md text-on-surface">{label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={notifs[key]}
                  onClick={() => toggle(key)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${notifs[key] ? "bg-primary" : "bg-outline-variant"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifs[key] ? "translate-x-6" : "translate-x-0"}`} />
                  <span className="sr-only">{notifs[key] ? "On" : "Off"}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all"
        >
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </main>
    </div>
  );
}
