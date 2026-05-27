"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Profile fields — pre-filled from Supabase user
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    campus: "",
    bio: "",
    upi: "",
    card: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        campus: user.user_metadata?.campus || "",
        bio: user.user_metadata?.bio || "",
        upi: user.user_metadata?.upi_id || "",
        card: user.user_metadata?.card_number || "",
      });
    }
  }, [user]);

  // Password fields
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    messages: true,
    priceDrops: false,
    newListings: false,
    promotions: false,
  });

  // Profile save — updates Supabase user metadata
  const [profileSaved, setProfileSaved] = useState(false);
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.updateUser({
      data: {
        full_name: profile.name,
        phone: profile.phone,
        campus: profile.campus,
        bio: profile.bio,
      },
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Password save — updates via Supabase Auth
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);
    if (!passwords.newPass) { setPassError("Enter a new password."); return; }
    if (passwords.newPass.length < 6) { setPassError("New password must be at least 6 characters."); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError("Passwords do not match."); return; }
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass });
    if (error) { setPassError(error.message); return; }
    setPassSuccess(true);
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Avatar upload
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const filePath = `${user.id}/avatar.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("Avatar").upload(filePath, file, { upsert: true });
    if (uploadError) { setAvatarUploading(false); return; }
    const { data } = supabase.storage.from("Avatar").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
    setAvatarUrl(publicUrl);
    setAvatarUploading(false);
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

      <main className="pt-20 pb-16 px-4 md:px-16 max-w-[680px] mx-auto space-y-6">

        <h1 className="font-headline-md text-headline-md text-on-surface">Account &amp; Security</h1>

        {/* ── Edit Profile ── */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">person</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Edit Profile</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="px-5 py-5 flex flex-col gap-4">

            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-container flex items-center justify-center border-2 border-outline-variant flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{profile.name.charAt(0) || "?"}</span>
                )}
              </div>
              <div>
                <label className="cursor-pointer bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-sm flex items-center gap-2 hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  {avatarUploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                </label>
                <p className="text-xs text-on-surface-variant mt-1">JPG, PNG — max 2MB</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="acc-name" className="font-label-md text-label-md text-on-surface-variant">Full Name</label>
              <input
                id="acc-name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="acc-email" className="font-label-md text-label-md text-on-surface-variant">Email</label>
              <input
                id="acc-email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="acc-phone" className="font-label-md text-label-md text-on-surface-variant">Phone Number</label>
              <input
                id="acc-phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="acc-campus" className="font-label-md text-label-md text-on-surface-variant">Campus / College</label>
              <input
                id="acc-campus"
                type="text"
                value={profile.campus}
                onChange={(e) => setProfile({ ...profile, campus: e.target.value })}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="acc-bio" className="font-label-md text-label-md text-on-surface-variant">Bio</label>
              <textarea
                id="acc-bio"
                rows={2}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all"
            >
              {profileSaved ? "✓ Saved!" : "Save Changes"}
            </button>
          </form>
        </section>

        {/* ── Change Password ── */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">lock</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword} className="px-5 py-5 flex flex-col gap-4">
            {["current", "newPass", "confirm"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label htmlFor={`pass-${field}`} className="font-label-md text-label-md text-on-surface-variant">
                  {field === "current" ? "Current Password" : field === "newPass" ? "New Password" : "Confirm New Password"}
                </label>
                <input
                  id={`pass-${field}`}
                  type="password"
                  placeholder="••••••••"
                  value={passwords[field as keyof typeof passwords]}
                  onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                  className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
            {passError && <p className="font-body-sm text-body-sm text-error">{passError}</p>}
            {passSuccess && <p className="font-body-sm text-body-sm text-secondary">Password changed successfully!</p>}
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Update Password
            </button>
          </form>
        </section>

        {/* ── Notifications ── */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">notifications</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Notifications</h2>
          </div>
          <ul className="divide-y divide-outline-variant/40">
            {(
              [
                { key: "orderUpdates", label: "Order Updates",       desc: "Status changes for your orders" },
                { key: "messages",     label: "Seller Messages",      desc: "Messages from buyers and sellers" },
                { key: "priceDrops",   label: "Price Drop Alerts",    desc: "When saved items drop in price" },
                { key: "newListings",  label: "New Listings",         desc: "Items matching your interests" },
                { key: "promotions",   label: "Promotions",           desc: "CampusKart deals and updates" },
              ] as { key: keyof typeof notifications; label: string; desc: string }[]
            ).map(({ key, label, desc }) => (
              <li key={key} className="flex items-center justify-between px-5 py-4 gap-4">
                <div>
                  <p className="font-body-md text-body-md text-on-surface">{label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={notifications[key]}
                  onClick={() => toggleNotif(key)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${notifications[key] ? "bg-primary" : "bg-outline-variant"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications[key] ? "translate-x-6" : "translate-x-0"}`}
                  />
                  <span className="sr-only">{notifications[key] ? "On" : "Off"}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Payment Methods ── */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">payments</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Payment Methods</h2>
          </div>
          <form className="px-5 py-5 flex flex-col gap-4" onSubmit={async (e) => {
            e.preventDefault();
            await supabase.auth.updateUser({ data: { upi_id: profile.upi, card_number: profile.card } });
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 2500);
          }}>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">account_balance</span> UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@okicici"
                value={profile.upi}
                onChange={(e) => setProfile({ ...profile, upi: e.target.value })}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">credit_card</span> Card Number (last 4 digits)
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="4242"
                value={profile.card}
                onChange={(e) => setProfile({ ...profile, card: e.target.value })}
                className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg hover:opacity-90 transition-all">
              Save Payment Info
            </button>
          </form>
        </section>

        {/* ── Danger Zone ── */}
        <section className="bg-surface-container-lowest border border-error/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-error/20">
            <span className="material-symbols-outlined text-error" aria-hidden="true">warning</span>
            <h2 className="font-label-lg text-label-lg text-error">Danger Zone</h2>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Deleting your account is permanent. All your listings, orders, and data will be removed.
            </p>
            <button
              className="w-full py-3 rounded-xl border-2 border-error text-error font-label-lg text-label-lg hover:bg-error-container/20 active:scale-95 transition-all"
              onClick={() => alert("Please contact support to delete your account.")}
            >
              Delete Account
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
