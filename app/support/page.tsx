"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FAQS = [
  {
    q: "How does campus pickup work?",
    a: "Once your order is confirmed, the seller will contact you within 24 hours to arrange a meetup at a safe campus location like the library, student union, or cafeteria.",
  },
  {
    q: "What is CampusKart Escrow?",
    a: "CampusKart holds your payment securely until you confirm receipt of the item. This protects both buyers and sellers from fraud.",
  },
  {
    q: "How do I get Faculty Verified?",
    a: "Faculty verification is done by campus administrators. Contact your campus coordinator or email us with your institutional ID.",
  },
  {
    q: "Can I return an item?",
    a: "Returns are managed between buyer and seller. We recommend inspecting the item before completing the transaction at the meetup.",
  },
  {
    q: "How do I report a suspicious listing?",
    a: "Tap the three-dot menu on any listing and select 'Report'. Our team reviews all reports within 24 hours.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. CampusKart uses industry-standard encryption. We never store your full card details on our servers.",
  },
];

const SAFETY_TIPS = [
  { icon: "location_on",   tip: "Always meet in a public, well-lit campus location — library, student union, or cafeteria." },
  { icon: "group",         tip: "Bring a friend if you can, especially for high-value items like laptops or phones." },
  { icon: "visibility",   tip: "Inspect the item thoroughly before confirming the transaction." },
  { icon: "verified_user", tip: "Prefer Faculty Verified sellers for extra peace of mind." },
  { icon: "lock",          tip: "Never share your CampusKart password or OTP with anyone, including the seller." },
  { icon: "report",        tip: "Report any suspicious behavior immediately using the in-app report button." },
];

export default function SupportPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"help" | "safety" | "about">("help");

  // Contact form
  const [form, setForm] = useState({ subject: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    setFormSent(true);
    setForm({ subject: "", message: "" });
    setTimeout(() => setFormSent(false), 3000);
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
        <Link href="/profile" aria-label="Profile">
          <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">person</span>
          </button>
        </Link>
      </header>

      <main className="pt-20 pb-16 px-4 md:px-16 max-w-[720px] mx-auto">

        <h1 className="font-headline-md text-headline-md text-on-surface mb-6">Support</h1>

        {/* Section Tabs */}
        <div role="tablist" className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {(["help", "safety", "about"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeSection === tab}
              onClick={() => setActiveSection(tab)}
              className={`px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                activeSection === tab
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab === "help" ? "Help Center" : tab === "safety" ? "Safety Tips" : "About"}
            </button>
          ))}
        </div>

        {/* ── Help Center ── */}
        {activeSection === "help" && (
          <div className="flex flex-col gap-5">

            {/* FAQs */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary" aria-hidden="true">help</span>
                <h2 className="font-label-lg text-label-lg text-on-surface">Frequently Asked Questions</h2>
              </div>
              <ul className="divide-y divide-outline-variant/40">
                {FAQS.map((faq, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-container transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      <span className="font-body-md text-body-md text-on-surface">{faq.q}</span>
                      <span
                        className={`material-symbols-outlined text-on-surface-variant text-[20px] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      >
                        expand_more
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4">
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{faq.a}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Contact Us */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary" aria-hidden="true">mail</span>
                <h2 className="font-label-lg text-label-lg text-on-surface">Contact Support</h2>
              </div>
              <form onSubmit={handleSend} className="px-5 py-5 flex flex-col gap-4">
                {formSent ? (
                  <div className="flex flex-col items-center py-6 gap-2 text-center">
                    <span className="material-symbols-outlined text-[40px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                    <p className="font-label-lg text-label-lg text-on-surface">Message sent!</p>
                    <p className="font-body-sm text-on-surface-variant">We'll reply to your campus email within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="support-subject" className="font-label-md text-label-md text-on-surface-variant">Subject</label>
                      <select
                        id="support-subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select a topic...</option>
                        <option>Order Issue</option>
                        <option>Seller / Buyer Problem</option>
                        <option>Payment Issue</option>
                        <option>Account Problem</option>
                        <option>Report a Listing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="support-msg" className="font-label-md text-label-md text-on-surface-variant">Message</label>
                      <textarea
                        id="support-msg"
                        rows={4}
                        placeholder="Describe your issue in detail..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                      Send Message
                    </button>
                  </>
                )}
              </form>
            </section>
          </div>
        )}

        {/* ── Safety Tips ── */}
        {activeSection === "safety" && (
          <div className="flex flex-col gap-5">
            <div className="bg-secondary-container/20 border border-secondary-container rounded-2xl p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-on-secondary-container text-[28px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">shield</span>
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
                    <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
                    <p className="font-body-md text-body-md text-on-surface">{item.tip}</p>
                  </li>
                ))}
              </ul>
            </section>

            <div className="bg-primary-container rounded-2xl p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-on-primary-container flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">emergency</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface mb-1">Emergency?</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  If you feel unsafe during a meetup, leave immediately and contact campus security or call 112.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── About ── */}
        {activeSection === "about" && (
          <div className="flex flex-col gap-5">
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
                  <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{item.icon}</span>
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
              {["Privacy Policy", "Terms of Service", "Academic Integrity Policy", "Cookie Policy"].map((item, i, arr) => (
                <button
                  key={item}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-container transition-colors font-body-md text-body-md text-on-surface ${i < arr.length - 1 ? "border-b border-outline-variant/40" : ""}`}
                  onClick={() => alert(`${item} — coming soon!`)}
                >
                  {item}
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">chevron_right</span>
                </button>
              ))}
            </section>

            <p className="font-body-sm text-body-sm text-on-surface-variant text-center pb-4">
              &copy; 2025 CampusKart. Academic Integrity &amp; Safety First.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
