"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// Which tab is active: "login" or "signup"
type Tab = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>("login");

  // Login form state
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError]       = useState("");
  const [loginLoading, setLoginLoading]   = useState(false);

  // Signup form state
  const [signupName, setSignupName]               = useState("");
  const [signupEmail, setSignupEmail]             = useState("");
  const [signupPassword, setSignupPassword]       = useState("");
  const [signupConfirm, setSignupConfirm]         = useState("");
  const [signupTerms, setSignupTerms]             = useState(false);
  const [signupError, setSignupError]             = useState("");
  const [signupLoading, setSignupLoading]         = useState(false);

  // ── Login handler ──────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoginLoading(false);
    if (error) { setLoginError(error); return; }
    router.push("/");
  };

  // ── Signup handler ─────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setSignupError("Please fill in all fields.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (!signupTerms) {
      setSignupError("Please accept the terms to continue.");
      return;
    }
    setSignupLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setSignupLoading(false);
    if (error) { setSignupError(error); return; }
    setActiveTab("login");
    setSignupName(""); setSignupEmail(""); setSignupPassword(""); setSignupConfirm(""); setSignupTerms(false);
    setLoginError("Account created! Please check your email to confirm, then login.");
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">

      {/* ── Top App Bar ── */}
      <header className="w-full sticky top-0 z-50 bg-surface-container-lowest shadow-sm border-b border-outline-variant">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
              CampusKart
            </Link>
            <nav className="hidden md:flex gap-10">
              {["Textbooks", "Electronics", "Bikes & Transport", "Dorm Essentials"].map((cat) => (
                <Link key={cat} href="/" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors">
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/cart" aria-label="Cart">
              <button className="p-2 hover:bg-surface-container rounded-lg transition-all text-on-surface-variant">
                <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-grow relative flex items-center justify-center py-10 overflow-hidden">

        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(#001b3d 0.5px, transparent 0.5px)", backgroundSize: "24px 24px", opacity: 0.05 }} />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container rounded-full blur-[120px] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-container rounded-full blur-[120px] opacity-10 pointer-events-none" />

        <div className="w-full max-w-[440px] mx-4 z-10 flex flex-col items-center">

          {/* ── Auth Card ── */}
          <div className="w-full rounded-xl shadow-sm border border-outline-variant overflow-hidden" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)" }}>

            {/* Tab Headers */}
            <div className="flex border-b border-outline-variant" role="tablist">
              {(["login", "signup"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 font-label-lg text-label-lg transition-all border-b-2 capitalize ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {tab === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            <div className="p-8">

              {/* ── LOGIN FORM ── */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-6" noValidate>
                  <div className="space-y-1">
                    <h1 className="font-headline-sm text-headline-sm text-primary">Welcome Back</h1>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Enter your university credentials to continue.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="login-email" className="font-label-md text-label-md text-on-surface">
                        Email Address
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary-container rounded-lg px-4 py-3 font-body-md outline-none transition-all"
                      />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <label htmlFor="login-password" className="font-label-md text-label-md text-on-surface">
                          Password
                        </label>
                        <a href="#" className="font-label-md text-label-md text-secondary hover:underline">
                          Forgot Password?
                        </a>
                      </div>
                      <input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary-container rounded-lg px-4 py-3 font-body-md outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Error message */}
                  {loginError && (
                    <p className="text-error font-body-sm text-body-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">error</span>
                      {loginError}
                    </p>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-primary text-on-primary py-3.5 rounded-lg font-label-lg text-label-lg hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loginLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Logging in...
                      </>
                    ) : "Login"}
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-grow border-t border-outline-variant" />
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                      Or login with
                    </span>
                    <div className="flex-grow border-t border-outline-variant" />
                  </div>

                  {/* SSO Button */}
                  <button
                    type="button"
                    className="w-full border border-outline-variant text-primary py-3 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    University SSO
                  </button>

                  {/* Switch to Signup */}
                  <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                    New to CampusKart?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                      className="text-secondary font-semibold hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              )}

              {/* ── SIGNUP FORM ── */}
              {activeTab === "signup" && (
                <form onSubmit={handleSignup} className="space-y-6" noValidate>
                  <div className="space-y-1">
                    <h1 className="font-headline-sm text-headline-sm text-primary">Create Account</h1>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Join the official campus marketplace.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="signup-name" className="font-label-md text-label-md text-on-surface">
                        Full Name
                      </label>
                      <input
                        id="signup-name"
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Alex Johnson"
                        className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary-container rounded-lg px-4 py-3 font-body-md outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="signup-email" className="font-label-md text-label-md text-on-surface">
                        Email Address
                      </label>
                      <input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary-container rounded-lg px-4 py-3 font-body-md outline-none transition-all"
                      />
                    </div>

                    {/* Password + Confirm */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="signup-password" className="font-label-md text-label-md text-on-surface">
                          Password
                        </label>
                        <input
                          id="signup-password"
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary-container rounded-lg px-4 py-3 font-body-md outline-none transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="signup-confirm" className="font-label-md text-label-md text-on-surface">
                          Confirm
                        </label>
                        <input
                          id="signup-confirm"
                          type="password"
                          value={signupConfirm}
                          onChange={(e) => setSignupConfirm(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary-container rounded-lg px-4 py-3 font-body-md outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={signupTerms}
                      onChange={(e) => setSignupTerms(e.target.checked)}
                      className="mt-1 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer"
                    />
                    <label htmlFor="terms" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                      I agree to the{" "}
                      <a href="#" className="text-secondary hover:underline">Safety Guidelines</a>
                      {" "}and{" "}
                      <a href="#" className="text-secondary hover:underline">Terms of Service</a>.
                    </label>
                  </div>

                  {/* Error message */}
                  {signupError && (
                    <p className="text-error font-body-sm text-body-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">error</span>
                      {signupError}
                    </p>
                  )}

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full bg-primary text-on-primary py-3.5 rounded-lg font-label-lg text-label-lg hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {signupLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating account...
                      </>
                    ) : "Sign Up"}
                  </button>

                  {/* Switch to Login */}
                  <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-secondary font-semibold hover:underline"
                    >
                      Login here
                    </button>
                  </p>
                </form>
              )}
            </div>

            {/* Trust Footer */}
            <div className="bg-surface-container p-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]" aria-hidden="true"
                style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="font-label-md text-label-md text-on-surface">
                Academic Identity Verified Environment
              </span>
            </div>
          </div>

          {/* Help text */}
          <p className="mt-6 font-body-sm text-body-sm text-on-surface-variant text-center max-w-sm">
            Need help? Visit our{" "}
            <a href="#" className="text-secondary font-semibold hover:underline">Support Center</a>
            {" "}for assistance with account recovery or verification.
          </p>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full mt-auto bg-surface-container border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-6 max-w-[1280px] mx-auto gap-4">
          <div>
            <span className="font-headline-sm text-headline-sm font-bold text-primary block">CampusKart</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              &copy; 2025 CampusKart. Built for the academic community.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Support Center", "Safety Guidelines", "Terms of Service", "Privacy Policy", "Contact Us"].map((link) => (
              <a key={link} href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors underline">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
