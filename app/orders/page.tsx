"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  title: string;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: "Completed" | "Pending Pickup" | "Cancelled";
  total: number;
  items: OrderItem[];
  image: string;
}


const STATUS_STYLES: Record<Order["status"], { bg: string; text: string; icon: string }> = {
  Completed:       { bg: "bg-secondary-container/30", text: "text-on-secondary-container", icon: "check_circle" },
  "Pending Pickup": { bg: "bg-tertiary-container/30",  text: "text-on-tertiary-container",  icon: "schedule"     },
  Cancelled:       { bg: "bg-error-container/30",      text: "text-on-error-container",      icon: "cancel"       },
};

export default function OrdersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | Order["status"]>("All");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Only fetch orders placed by this user (IDs stored in localStorage)
    let myOrderIds: number[] = [];
    try {
      const saved = localStorage.getItem("campuskart_my_orders");
      myOrderIds = saved ? JSON.parse(saved) : [];
    } catch {}

    if (myOrderIds.length === 0) {
      setOrders([]);
      return;
    }

    supabase
      .from("orders")
      .select("*")
      .in("id", myOrderIds)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setOrders(data.map((o) => ({
            id: `CK-${o.id}`,
            date: new Date(o.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            status: o.status as Order["status"],
            total: o.total,
            items: o.items || [],
            image: o.items?.[0]?.image || "/images/macbook.jpg",
          })));
        }
      });
  }, []);

  const tabs: Array<"All" | Order["status"]> = ["All", "Completed", "Pending Pickup", "Cancelled"];

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

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
        <Link href="/cart" aria-label="Cart">
          <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">shopping_cart</span>
          </button>
        </Link>
      </header>

      {/* ── Main Content ── */}
      <main className="pt-20 pb-24 px-4 md:px-16 max-w-[900px] mx-auto">

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-headline-md text-headline-md text-on-surface">Order History</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Track and manage your campus marketplace orders.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter orders"
          className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                filter === tab
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Order Cards */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4" aria-hidden="true">
              receipt_long
            </span>
            <h2 className="font-headline-sm text-headline-sm mb-2">No orders found</h2>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-xs">
              You have no {filter !== "All" ? filter.toLowerCase() : ""} orders yet.
            </p>
            <Link
              href="/"
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {filtered.map((order) => {
            const style = STATUS_STYLES[order.status] ?? STATUS_STYLES["Pending Pickup"];
            return (
              <div
                key={order.id}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-sm"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface">{order.id}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{order.date}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm ${style.bg} ${style.text}`}>
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      {style.icon}
                    </span>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="flex gap-4 mb-4 flex-wrap">
                  <div className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={order.image}
                      alt={order.items[0]?.title ?? "Order item"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    {order.items.map((item, i) => (
                      <p key={i} className="font-body-md text-on-surface leading-snug">
                        {item.title}
                      </p>
                    ))}
                    {order.items.length > 1 && (
                      <p className="font-body-sm text-on-surface-variant mt-0.5">
                        +{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between border-t border-outline-variant pt-4 flex-wrap gap-3">
                  <p className="font-headline-sm text-headline-sm text-primary">
                    ${order.total.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    {order.status === "Completed" && (
                      <button
                        className="px-4 py-2 rounded-full font-label-md text-label-md border border-primary text-primary hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
                        onClick={() => alert("Reorder functionality coming soon!")}
                      >
                        Reorder
                      </button>
                    )}
                    <Link
                      href={`/order/${order.id}`}
                      className="px-4 py-2 rounded-full font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant flex flex-col items-center gap-4 px-4 text-center">
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
