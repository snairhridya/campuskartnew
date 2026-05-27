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

export default function HelpCenterPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
          <h1 className="font-headline-md text-headline-md text-on-surface">Help Center</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Find answers to common questions.</p>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary">help</span>
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
                  <span className={`material-symbols-outlined text-on-surface-variant text-[20px] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>expand_more</span>
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

        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary">mail</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Contact Support</h2>
          </div>
          <form onSubmit={handleSend} className="px-5 py-5 flex flex-col gap-4">
            {formSent ? (
              <div className="flex flex-col items-center py-6 gap-2 text-center">
                <span className="material-symbols-outlined text-[40px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="font-label-lg text-label-lg text-on-surface">Message sent!</p>
                <p className="font-body-sm text-on-surface-variant">We&apos;ll reply to your campus email within 24 hours.</p>
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
                <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all">
                  Send Message
                </button>
              </>
            )}
          </form>
        </section>
      </main>

      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">&copy; 2025 CampusKart. Academic Integrity &amp; Safety First.</p>
      </footer>
    </div>
  );
}
