"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Types ---
interface CartItem {
  id: number;
  title: string;
  condition: string;
  price: number;
  image: string;
  isFacultyVerified: boolean;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("campuskart_cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((i: { product?: CartItem; id?: number; title?: string; condition?: string; price?: number; image?: string; isFacultyVerified?: boolean; quantity: number }) => ({
        id: i.product?.id ?? i.id ?? 0,
        title: i.product?.title ?? i.title ?? "",
        condition: i.product?.condition ?? i.condition ?? "",
        price: i.product?.price ?? i.price ?? 0,
        image: i.product?.image ?? i.image ?? "",
        isFacultyVerified: i.product?.isFacultyVerified ?? i.isFacultyVerified ?? false,
        quantity: i.quantity,
      }));
    } catch { return []; }
  });

  useEffect(() => {
    const nested = cartItems.map((item) => ({ product: item, quantity: item.quantity }));
    localStorage.setItem("campuskart_cart", JSON.stringify(nested));
  }, [cartItems]);

  // Increase quantity of an item
  const increaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity — removes item if quantity reaches 0
  const decreaseQty = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item completely
  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Price calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 0; // always free pickup
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout handler — navigate to checkout page
  const handleCheckout = () => {
    router.push("/checkout");
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
        <Link href="/search" aria-label="Search products">
          <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">search</span>
          </button>
        </Link>
      </header>

      {/* ── Main Content ── */}
      <main className="pt-20 pb-44 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Your Cart ({totalItems})
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Review items before peer-to-peer campus pickup.
          </p>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[72px] text-outline-variant mb-4" aria-hidden="true">
              shopping_cart_off
            </span>
            <h2 className="font-headline-sm text-headline-sm font-semibold mb-2">Your cart is empty</h2>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-xs">
              Browse the marketplace and add items to get started.
            </p>
            <Link
              href="/"
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        )}

        {/* Cart Grid */}
        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Left: Product List ── */}
            <div className="lg:col-span-8 flex flex-col gap-4">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 items-center border border-outline-variant/40 shadow-sm"
                >
                  {/* Product Image */}
                  <Link href={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-surface-container overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-grow flex flex-col justify-between min-h-[128px]">

                    {/* Title + Delete */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h2 className="font-label-lg text-label-lg text-on-surface leading-snug">
                          {item.title}
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Condition: {item.condition}
                        </p>
                        {item.isFacultyVerified && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-on-secondary-container bg-secondary-container/30 px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]" aria-hidden="true"
                              style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            Faculty Verified
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-on-surface-variant hover:text-error transition-colors active:scale-95 flex-shrink-0"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                      </button>
                    </div>

                    {/* Price + Quantity Controls */}
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                      <span className="font-headline-sm text-headline-sm text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-outline-variant rounded-full overflow-hidden">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="px-3 py-1.5 hover:bg-surface-container transition-colors active:scale-90"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">remove</span>
                        </button>
                        <span className="px-4 py-1 font-label-lg text-label-lg border-x border-outline-variant min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="px-3 py-1.5 hover:bg-surface-container transition-colors active:scale-90"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust Badge */}
              <div className="flex items-start gap-3 bg-secondary-container/20 p-4 rounded-xl border border-secondary-container">
                <span
                  className="material-symbols-outlined text-on-secondary-container flex-shrink-0"
                  aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <p className="font-body-sm text-body-sm text-on-secondary-container">
                  <strong>Faculty Verified Listings:</strong> Seller IDs have been authenticated for academic integrity. All meetups happen in designated safe zones.
                </p>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <aside className="lg:col-span-4" aria-label="Order summary">
              <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4 border border-outline-variant/30 sticky top-20">
                <h2 className="font-label-lg text-label-lg text-on-surface border-b border-outline-variant pb-3">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-secondary-container font-medium">
                    <span>Delivery Fee</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true"
                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      $0.00 (Campus Pickup)
                    </span>
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-3 flex justify-between items-center">
                  <span className="font-label-lg text-label-lg text-on-surface">Total Amount</span>
                  <span className="font-headline-sm text-headline-sm text-primary">${total.toFixed(2)}</span>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant text-center italic">
                  Transaction occurs safely via CampusKart Escrow.
                </p>

                {/* Desktop Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="hidden md:block w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* ── Mobile: Fixed Bottom Bar ── */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50 md:hidden flex flex-col">
          {/* Checkout button */}
          <div className="w-full bg-surface-container-lowest/90 backdrop-blur-md px-4 py-3 border-t border-outline-variant">
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg shadow-lg active:scale-95 transition-all"
            >
              {`Proceed to Checkout · $${total.toFixed(2)}`}
            </button>
          </div>

          {/* Bottom Nav */}
          <nav className="bg-surface-container flex justify-around items-center h-16 px-2 w-full shadow-[0_-1px_4px_rgba(0,0,0,0.05)]" aria-label="Bottom navigation">
            <Link href="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined" aria-hidden="true">storefront</span>
              <span className="font-label-md text-label-md mt-0.5">Market</span>
            </Link>
            <Link href="/sell" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined" aria-hidden="true">add_circle</span>
              <span className="font-label-md text-label-md mt-0.5">Sell</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1">
              <span className="material-symbols-outlined" aria-hidden="true"
                style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              <span className="font-label-md text-label-md">Cart</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined" aria-hidden="true">person</span>
              <span className="font-label-md text-label-md mt-0.5">Profile</span>
            </Link>
          </nav>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="w-full py-8 mb-20 md:mb-0 bg-surface-container-lowest border-t border-outline-variant flex flex-col items-center gap-4 px-4 text-center">
        <h2 className="font-headline-sm text-headline-sm font-bold text-primary">CampusKart</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Safety Tips", "Academic Resources", "Verification Policy", "Support"].map((link) => (
            <a key={link} href="#" className="text-on-surface-variant hover:text-primary transition-colors underline font-body-sm text-body-sm">
              {link}
            </a>
          ))}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          &copy; 2025 CampusKart. Academic Integrity &amp; Safety First.
        </p>
      </footer>
    </div>
  );
}
