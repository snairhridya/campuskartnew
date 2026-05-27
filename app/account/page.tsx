"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", campus: "", bio: "" });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        campus: user.user_metadata?.campus || "",
        bio: user.user_metadata?.bio || "",
      });
    }
  }, [user]);

  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const filePath = `${user.id}/avatar.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("Avatar").upload(filePath, file, { upsert: true });
    if (uploadError) { setAvatarUploading(false); return; }
    const { data } = supabase.storage.from("Avatar").getPublicUrl(filePath);
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
    setAvatarUrl(data.publicUrl);
    setAvatarUploading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.updateUser({
      data: { full_name: profile.name, phone: profile.phone, campus: profile.campus, bio: profile.bio },
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);
    if (!passwords.newPass) { setPassError("Enter a new password."); return; }
    if (passwords.newPass.length < 6) { setPassError("Password must be at least 6 characters."); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError("Passwords do not match."); return; }
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass });
    if (error) { setPassError(error.message); return; }
    setPassSuccess(true);
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPassSuccess(false), 3000);
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
        <h1 className="font-headline-md text-headline-md text-on-surface">Edit Profile</h1>

        {/* Edit Profile */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">person</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Profile Info</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="px-5 py-5 flex flex-col gap-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-container flex items-center justify-center border-2 border-outline-variant flex-shrink-0">
                {avatarUrl
                  ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-primary">{profile.name.charAt(0) || "?"}</span>}
              </div>
              <div>
                <label className="cursor-pointer bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-sm flex items-center gap-2 hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  {avatarUploading ? "Uploading…" : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                </label>
                <p className="text-xs text-on-surface-variant mt-1">JPG, PNG — max 2 MB</p>
              </div>
            </div>

            {[
              { id: "name",   label: "Full Name",       type: "text",  key: "name"   },
              { id: "email",  label: "Email",            type: "email", key: "email"  },
              { id: "phone",  label: "Phone Number",     type: "tel",   key: "phone"  },
              { id: "campus", label: "Campus / College", type: "text",  key: "campus" },
            ].map(({ id, label, type, key }) => (
              <div key={id} className="flex flex-col gap-1">
                <label htmlFor={`acc-${id}`} className="font-label-md text-label-md text-on-surface-variant">{label}</label>
                <input
                  id={`acc-${id}`}
                  type={type}
                  value={profile[key as keyof typeof profile]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}

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

            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all">
              {profileSaved ? "Saved!" : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">lock</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword} className="px-5 py-5 flex flex-col gap-4">
            {[
              { field: "current",  label: "Current Password"     },
              { field: "newPass",  label: "New Password"         },
              { field: "confirm",  label: "Confirm New Password" },
            ].map(({ field, label }) => (
              <div key={field} className="flex flex-col gap-1">
                <label htmlFor={`pass-${field}`} className="font-label-md text-label-md text-on-surface-variant">{label}</label>
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
            {passError   && <p className="font-body-sm text-body-sm text-error">{passError}</p>}
            {passSuccess  && <p className="font-body-sm text-body-sm text-secondary">Password changed successfully!</p>}
            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 active:scale-95 transition-all">
              Update Password
            </button>
          </form>
        </section>

        {/* Danger Zone */}
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
