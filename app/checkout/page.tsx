"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PAYMENT_OPTIONS = [
  { id: "upi",  icon: "account_balance_wallet", label: "UPI",                  desc: "Pay via Google Pay, PhonePe, or BHIM" },
  { id: "card", icon: "credit_card",            label: "Credit / Debit Card",   desc: "Visa, Mastercard, RuPay and more" },
  { id: "cod",  icon: "payments",               label: "Cash on Delivery (COD)", desc: "Pay at campus pickup point" },
];

interface CartItem {
  id: number;
  title: string;
  qty: number;
  price: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("campuskart_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCartItems(parsed.map((i: { product: { id: number; title: string; price: number; image: string }; quantity: number }) => ({
          id: i.product.id,
          title: i.product.title,
          qty: i.quantity,
          price: i.product.price,
          image: i.product.image,
        })));
      }
    } catch {}
  }, []);

  // Form state
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "" });
  const [payment, setPayment] = useState("upi");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Price calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total    = subtotal;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Full name is required";
    if (!form.phone.trim())   e.phone   = "Phone number is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.pincode.trim()) e.pincode = "Pincode is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Place order → save to Supabase → clear cart → navigate to confirmation
  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    const { data } = await supabase.from("orders").insert({
      status: "Pending Pickup",
      total,
      items: cartItems,
    }).select("id").single();

    // Save this order's ID to localStorage so only this user sees it in Orders
    if (data?.id) {
      try {
        const saved = localStorage.getItem("campuskart_my_orders");
        const myOrders: number[] = saved ? JSON.parse(saved) : [];
        myOrders.unshift(data.id);
        localStorage.setItem("campuskart_my_orders", JSON.stringify(myOrders));
      } catch {}
    }

    localStorage.removeItem("campuskart_cart");
    router.push("/order-confirmation");
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">

      {/* ── Top Nav ── */}
      <nav className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-16 py-3 mx-auto max-w-7xl">
          <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary active:scale-95 transition-transform">
            CampusKart
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Textbooks", "Electronics", "Bikes & Transport", "Dorm Essentials"].map((cat) => (
              <Link key={cat} href="/" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors">
                {cat}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/cart" aria-label="Cart">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 hover:bg-surface-container rounded-full transition-all" aria-hidden="true">shopping_cart</span>
            </Link>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 hover:bg-surface-container rounded-full transition-all" aria-hidden="true">notifications</span>
            <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm border border-outline-variant">
              YO
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-16 py-8 pb-32 md:pb-10">

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-on-surface-variant">
          <Link href="/cart" className="font-label-md text-label-md hover:text-primary transition-colors">Cart</Link>
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span>
          <span className="font-label-md text-label-md text-primary font-bold" aria-current="page">Checkout</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left Column: Forms ── */}
          <div className="flex-grow space-y-6 lg:max-w-[65%]">

            {/* Section 1 — Delivery Details */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary" aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                <h2 className="font-headline-sm text-headline-sm text-primary">Delivery Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className={`font-label-lg text-label-lg transition-colors ${errors.name ? "text-error" : form.name ? "text-primary" : "text-on-surface-variant"}`}>
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className={`w-full bg-surface-container-low border rounded-lg p-3 font-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all ${errors.name ? "border-error" : "border-outline-variant"}`}
                  />
                  {errors.name && <p className="text-error text-[12px] font-label-md">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="phone" className={`font-label-lg text-label-lg transition-colors ${errors.phone ? "text-error" : form.phone ? "text-primary" : "text-on-surface-variant"}`}>
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full bg-surface-container-low border rounded-lg p-3 font-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all ${errors.phone ? "border-error" : "border-outline-variant"}`}
                  />
                  {errors.phone && <p className="text-error text-[12px] font-label-md">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label htmlFor="address" className={`font-label-lg text-label-lg transition-colors ${errors.address ? "text-error" : form.address ? "text-primary" : "text-on-surface-variant"}`}>
                    Campus Address / Dorm / Building *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="e.g. West Quad, Room 402"
                    className={`w-full bg-surface-container-low border rounded-lg p-3 font-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all ${errors.address ? "border-error" : "border-outline-variant"}`}
                  />
                  {errors.address && <p className="text-error text-[12px] font-label-md">{errors.address}</p>}
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="pincode" className={`font-label-lg text-label-lg transition-colors ${errors.pincode ? "text-error" : form.pincode ? "text-primary" : "text-on-surface-variant"}`}>
                    Pincode / Zip *
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    value={form.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    placeholder="48109"
                    className={`w-full bg-surface-container-low border rounded-lg p-3 font-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary outline-none transition-all ${errors.pincode ? "border-error" : "border-outline-variant"}`}
                  />
                  {errors.pincode && <p className="text-error text-[12px] font-label-md">{errors.pincode}</p>}
                </div>
              </div>
            </section>

            {/* Section 2 — Payment Method */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary" aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                <h2 className="font-headline-sm text-headline-sm text-primary">Payment Method</h2>
              </div>

              <fieldset className="space-y-3">
                <legend className="sr-only">Select payment method</legend>
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all group ${payment === option.id ? "border-secondary bg-secondary-container/10" : "border-outline-variant hover:bg-surface-container-low"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={payment === option.id}
                      onChange={() => setPayment(option.id)}
                      className="w-5 h-5 text-secondary border-outline-variant focus:ring-secondary"
                    />
                    <div className="ml-4 flex items-center gap-4 flex-grow">
                      <span className={`material-symbols-outlined transition-colors ${payment === option.id ? "text-secondary" : "text-on-surface-variant group-hover:text-secondary"}`} aria-hidden="true">
                        {option.icon}
                      </span>
                      <div>
                        <p className="font-body-md font-semibold text-on-surface">{option.label}</p>
                        <p className="font-body-sm text-on-surface-variant">{option.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </fieldset>
            </section>
          </div>

          {/* ── Right Column: Order Summary ── */}
          <aside className="w-full lg:w-[35%]" aria-label="Order summary">
            <div className="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant pb-3">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-20 h-24 rounded-lg bg-surface-container overflow-hidden border border-outline-variant flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-body-md font-bold text-on-surface line-clamp-2">{item.title}</h3>
                        <p className="font-label-md text-label-md text-on-surface-variant mt-1">Qty: {item.qty}</p>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-primary">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-outline-variant pt-4">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="font-body-md">Subtotal</span>
                  <span className="font-body-md">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span className="font-body-md">Delivery Fee</span>
                  <span className="font-label-md bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                    Campus Pickup ($0.00)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-dashed border-outline-variant">
                  <span className="font-body-lg font-bold text-primary">Total Price</span>
                  <span className="font-headline-sm text-headline-sm text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Trust Signal */}
              <div className="flex flex-col gap-1 pt-3 border-t border-outline-variant">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true"
                    style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span className="font-label-md text-label-md font-bold">Verified Student Transaction</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant leading-tight">
                  Your transaction is secured with CampusKart&apos;s peer-to-peer escrow system.
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 bg-primary-container p-4 rounded-xl flex items-center gap-4 border border-outline-variant/20">
              <div className="h-10 w-10 bg-on-primary-container rounded-full flex items-center justify-center text-primary-container flex-shrink-0">
                <span className="material-symbols-outlined" aria-hidden="true">shield_with_heart</span>
              </div>
              <p className="font-body-sm text-on-primary-container">
                CampusKart uses <strong>Academic-Grade Security</strong> to protect your data.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-primary-container text-on-primary-container mt-8">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-16 py-8 max-w-7xl mx-auto border-t border-white/10">
          <div>
            <p className="font-headline-sm text-headline-sm font-bold">CampusKart</p>
            <p className="font-body-sm text-on-primary-container/80">&copy; 2025 CampusKart. Academic Vitality in Trade.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["About Us", "Safety Guidelines", "Faculty Portal", "Student Support"].map((link) => (
              <a key={link} href="#" className="font-body-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors hover:underline">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-surface-container shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 rounded-t-xl" aria-label="Mobile navigation">
        {[
          { href: "/",       icon: "home",          label: "Home",    active: false },
          { href: "/search", icon: "search",         label: "Search",  active: false },
          { href: "/sell",   icon: "add_box",        label: "Sell",    active: false },
          { href: "/cart",   icon: "shopping_cart",  label: "Cart",    active: false },
          { href: "/profile",icon: "person",         label: "Account", active: false },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors active:scale-90">
            <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
            <span className="font-label-md text-label-md mt-0.5">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
