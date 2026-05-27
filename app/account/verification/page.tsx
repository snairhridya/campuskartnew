"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const STEPS = [
  { icon: "email",         label: "Email Verified",       desc: "Your email address is confirmed."         },
  { icon: "badge",         label: "Student ID",           desc: "Upload your college student ID card."     },
  { icon: "school",        label: "Campus Affiliation",   desc: "Confirm your campus or institution."      },
  { icon: "verified_user", label: "Faculty Verified",     desc: "Request faculty verification badge."      },
];

export default function VerificationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);
  const [campusInput, setCampusInput] = useState(user?.user_metadata?.campus || "");
  const [campusSaved, setCampusSaved] = useState(false);
  const [facultyMsg, setFacultyMsg] = useState("");
  const [facultySent, setFacultySent] = useState(false);

  const emailVerified = !!user?.email_confirmed_at;

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setIdFile(file); setIdUploaded(true); }
  };

  const handleCampusSave = () => {
    setCampusSaved(true);
    setTimeout(() => setCampusSaved(false), 2500);
  };

  const handleFacultyRequest = () => {
    if (!facultyMsg.trim()) return;
    setFacultySent(true);
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
          <h1 className="font-headline-md text-headline-md text-on-surface">Verification</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Complete verification steps to build trust with buyers and sellers.</p>
        </div>

        {/* Progress summary */}
        <section className="bg-primary-container/30 border border-primary/20 rounded-2xl px-5 py-4 flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">verified_user</span>
          <div>
            <p className="font-label-lg text-label-lg text-on-surface">{emailVerified ? "Email verified" : "Verification pending"}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Complete all steps to get the Verified badge on your listings.</p>
          </div>
        </section>

        {/* Step 1 — Email */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">email</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Email Verified</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{user?.email || "—"}</p>
              </div>
            </div>
            {emailVerified
              ? <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-on-secondary-container bg-secondary-container/40 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Verified
                </span>
              : <span className="text-[12px] font-semibold text-on-error-container bg-error-container/30 px-3 py-1 rounded-full">Pending</span>
            }
          </div>
        </section>

        {/* Step 2 — Student ID */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">badge</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Student ID Upload</h2>
          </div>
          <div className="px-5 py-5 flex flex-col gap-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Upload a photo of your student ID card. Your name and institution should be clearly visible.
            </p>
            {idUploaded
              ? <div className="flex items-center gap-2 text-secondary font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {idFile?.name} uploaded — under review
                </div>
              : <label className="cursor-pointer inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90 transition-all w-fit">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  Upload Student ID
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleIdUpload} />
                </label>
            }
          </div>
        </section>

        {/* Step 3 — Campus */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">school</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Campus Affiliation</h2>
          </div>
          <div className="px-5 py-5 flex flex-col gap-3">
            <input
              type="text"
              placeholder="e.g. IIT Bombay, BITS Pilani…"
              value={campusInput}
              onChange={(e) => setCampusInput(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleCampusSave}
              className="w-fit bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
            >
              {campusSaved ? "Saved!" : "Confirm Campus"}
            </button>
          </div>
        </section>

        {/* Step 4 — Faculty Verified */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">verified_user</span>
            <h2 className="font-label-lg text-label-lg text-on-surface">Faculty Verification</h2>
          </div>
          <div className="px-5 py-5 flex flex-col gap-3">
            {facultySent
              ? <div className="flex items-center gap-2 text-secondary font-body-sm">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Request sent! Our team will review and get back to you.
                </div>
              : <>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Are you a faculty member or department? Tell us your role and institution to request the Faculty Verified badge.
                  </p>
                  <textarea
                    rows={3}
                    placeholder="e.g. Assistant Professor, Dept. of CS, XYZ University"
                    value={facultyMsg}
                    onChange={(e) => setFacultyMsg(e.target.value)}
                    className="w-full bg-surface-container rounded-xl px-4 py-3 font-body-md text-on-surface border border-outline-variant focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <button
                    onClick={handleFacultyRequest}
                    disabled={!facultyMsg.trim()}
                    className="w-fit bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit Request
                  </button>
                </>
            }
          </div>
        </section>
      </main>
    </div>
  );
}
