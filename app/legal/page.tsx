"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LegalPage() {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface min-h-screen">

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-4 md:px-16 h-16">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all" aria-label="Go back">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary">CampusKart</Link>
        </div>
      </header>

      <main className="pt-20 pb-16 px-4 md:px-16 max-w-[720px] mx-auto space-y-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Legal</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Last updated: May 2025</p>
        </div>

        {/* Privacy Policy */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary">privacy_tip</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Privacy Policy</h2>
          </div>
          <div className="px-5 py-5 space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <p><strong className="text-on-surface">Information We Collect</strong><br />
            We collect information you provide when registering, listing items, or placing orders — including your name, email address, campus, and payment details. We also collect usage data such as pages visited and search queries.</p>

            <p><strong className="text-on-surface">How We Use Your Information</strong><br />
            Your information is used to operate the marketplace, process transactions, communicate order updates, and improve the platform. We do not sell your personal data to third parties.</p>

            <p><strong className="text-on-surface">Data Storage</strong><br />
            Your data is securely stored using Supabase (PostgreSQL). Some preferences are stored locally on your device using browser localStorage for a faster experience.</p>

            <p><strong className="text-on-surface">Cookies</strong><br />
            CampusKart uses minimal cookies required for authentication and session management. No third-party advertising cookies are used.</p>

            <p><strong className="text-on-surface">Your Rights</strong><br />
            You may request deletion of your account and associated data at any time by contacting our support team.</p>

            <p><strong className="text-on-surface">Contact</strong><br />
            For privacy-related queries, email us at <span className="text-primary">privacy@campuskart.app</span>.</p>
          </div>
        </section>

        {/* Terms of Service */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary">gavel</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Terms of Service</h2>
          </div>
          <div className="px-5 py-5 space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            <p><strong className="text-on-surface">1. Acceptance</strong><br />
            By using CampusKart, you agree to these terms. If you do not agree, please do not use the platform.</p>

            <p><strong className="text-on-surface">2. Eligibility</strong><br />
            CampusKart is intended for students, faculty, and staff of affiliated educational institutions. You must be at least 16 years old to use this service.</p>

            <p><strong className="text-on-surface">3. Listings & Transactions</strong><br />
            Sellers are responsible for the accuracy of their listings. CampusKart is a platform that connects buyers and sellers — we are not party to the transaction itself. All sales are final unless otherwise agreed between buyer and seller.</p>

            <p><strong className="text-on-surface">4. Prohibited Items</strong><br />
            You may not list illegal items, counterfeit goods, weapons, drugs, or any item that violates campus policy. Violations will result in account suspension.</p>

            <p><strong className="text-on-surface">5. Academic Integrity</strong><br />
            CampusKart strictly prohibits the sale of completed assignments, essays, or any material intended to facilitate academic dishonesty.</p>

            <p><strong className="text-on-surface">6. Limitation of Liability</strong><br />
            CampusKart is not liable for any loss, damage, or dispute arising from transactions between users. Use the platform at your own risk and always meet in safe, public campus locations.</p>

            <p><strong className="text-on-surface">7. Changes to Terms</strong><br />
            We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>

            <p><strong className="text-on-surface">Contact</strong><br />
            For legal inquiries, email <span className="text-primary">legal@campuskart.app</span>.</p>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">&copy; 2025 CampusKart. Academic Integrity &amp; Safety First.</p>
      </footer>
    </div>
  );
}
