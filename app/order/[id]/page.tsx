"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface OrderItem {
  title: string;
  condition: string;
  price: number;
  image: string;
  isFacultyVerified: boolean;
}

interface OrderDetail {
  id: string;
  date: string;
  status: "Completed" | "Pending Pickup" | "Cancelled";
  total: number;
  items: OrderItem[];
  seller: { name: string; rating: number; campus: string };
  meetupLocation: string;
  paymentMethod: string;
  timeline: { label: string; done: boolean; icon: string }[];
}

const ORDER_DATA: Record<string, OrderDetail> = {
  "CK-A7X92B": {
    id: "CK-A7X92B",
    date: "May 20, 2025",
    status: "Completed",
    total: 944.00,
    meetupLocation: "Central Library, Ground Floor",
    paymentMethod: "UPI",
    seller: { name: "Arjun Mehta", rating: 4.8, campus: "IIT Bombay" },
    items: [
      { title: "MacBook Pro (2022) - M2 Chip", condition: "Mint", price: 899.00, image: "/images/macbook.jpg", isFacultyVerified: true },
      { title: "Calculus: Early Transcendentals", condition: "Good", price: 45.00, image: "/images/textbook.jpg", isFacultyVerified: false },
    ],
    timeline: [
      { label: "Order Placed",       done: true,  icon: "check_circle"  },
      { label: "Seller Notified",    done: true,  icon: "notifications" },
      { label: "Campus Pickup Done", done: true,  icon: "handshake"     },
      { label: "Completed",          done: true,  icon: "verified"      },
    ],
  },
  "CK-P3M77K": {
    id: "CK-P3M77K",
    date: "May 10, 2025",
    status: "Pending Pickup",
    total: 129.00,
    meetupLocation: "Student Union Building, Lobby",
    paymentMethod: "Credit/Debit Card",
    seller: { name: "Priya Sharma", rating: 4.5, campus: "IIT Bombay" },
    items: [
      { title: "Engineering Graphics Set", condition: "Like New", price: 129.00, image: "/images/textbook.jpg", isFacultyVerified: true },
    ],
    timeline: [
      { label: "Order Placed",       done: true,  icon: "check_circle"  },
      { label: "Seller Notified",    done: true,  icon: "notifications" },
      { label: "Campus Pickup Done", done: false, icon: "handshake"     },
      { label: "Completed",          done: false, icon: "verified"      },
    ],
  },
  "CK-Q1Z55R": {
    id: "CK-Q1Z55R",
    date: "April 28, 2025",
    status: "Cancelled",
    total: 350.00,
    meetupLocation: "N/A",
    paymentMethod: "UPI",
    seller: { name: "Rohan Gupta", rating: 4.2, campus: "IIT Bombay" },
    items: [
      { title: "iPad 9th Gen (Wi-Fi, 64GB)", condition: "Good", price: 350.00, image: "/images/macbook.jpg", isFacultyVerified: false },
    ],
    timeline: [
      { label: "Order Placed",    done: true,  icon: "check_circle" },
      { label: "Seller Notified", done: true,  icon: "notifications"},
      { label: "Cancelled",       done: true,  icon: "cancel"       },
    ],
  },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  Completed:        { bg: "bg-secondary-container/30", text: "text-on-secondary-container", icon: "check_circle" },
  "Pending Pickup": { bg: "bg-tertiary-container/30",  text: "text-on-tertiary-container",  icon: "schedule"    },
  Cancelled:        { bg: "bg-error-container/30",      text: "text-on-error-container",     icon: "cancel"      },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = typeof params.id === "string" ? params.id : "";
  const order = ORDER_DATA[orderId];

  if (!order) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="material-symbols-outlined text-[64px] text-outline-variant" aria-hidden="true">receipt_long</span>
        <h1 className="font-headline-md text-headline-md">Order not found</h1>
        <p className="font-body-md text-on-surface-variant max-w-xs">
          We couldn't find order <strong>{orderId}</strong>. It may have been removed or the link is incorrect.
        </p>
        <Link href="/orders" className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:opacity-90 active:scale-95 transition-all">
          Back to Orders
        </Link>
      </div>
    );
  }

  const style = STATUS_STYLES[order.status];
  const subtotal = order.items.reduce((sum, i) => sum + i.price, 0);

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
        <div className="flex items-center gap-1">
          <Link href="/" aria-label="Home">
            <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">home</span>
            </button>
          </Link>
          <Link href="/orders" aria-label="Order history">
            <button className="p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">receipt_long</span>
            </button>
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-16 px-4 md:px-16 max-w-[900px] mx-auto space-y-5">

        {/* ── Order Header Card ── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
            <div>
              <h1 className="font-headline-sm text-headline-sm text-on-surface">{order.id}</h1>
              <p className="font-body-sm text-on-surface-variant mt-0.5">Placed on {order.date}</p>
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
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mt-3">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">location_on</span>
            <span>Meetup: {order.meetupLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mt-1.5">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">payments</span>
            <span>Payment: {order.paymentMethod}</span>
          </div>
        </div>

        {/* ── Order Timeline ── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <h2 className="font-label-lg text-label-lg text-on-surface mb-5">Order Status</h2>
          <ol className="relative border-l-2 border-outline-variant ml-4 space-y-5">
            {order.timeline.map((step, i) => (
              <li key={i} className="ml-6">
                <span className={`absolute -left-[13px] flex items-center justify-center w-6 h-6 rounded-full border-2 ${step.done ? "bg-secondary border-secondary" : "bg-surface border-outline-variant"}`}>
                  <span
                    className={`material-symbols-outlined text-[14px] ${step.done ? "text-on-secondary-fixed" : "text-on-surface-variant"}`}
                    style={{ fontVariationSettings: step.done ? "'FILL' 1" : "'FILL' 0" }}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </span>
                </span>
                <p className={`font-label-lg text-label-lg ${step.done ? "text-on-surface" : "text-on-surface-variant"}`}>
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Items ── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <h2 className="font-label-lg text-label-lg text-on-surface mb-4">Items Ordered</h2>
          <div className="flex flex-col gap-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-body-md text-on-surface leading-snug">{item.title}</p>
                  <p className="font-body-sm text-on-surface-variant mt-0.5">Condition: {item.condition}</p>
                  {item.isFacultyVerified && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-on-secondary-container bg-secondary-container/30 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">verified</span>
                      Faculty Verified
                    </span>
                  )}
                </div>
                <span className="font-label-lg text-label-lg text-primary flex-shrink-0">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Seller Info ── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <h2 className="font-label-lg text-label-lg text-on-surface mb-3">Seller Information</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">person</span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface">{order.seller.name}</p>
              <p className="font-body-sm text-on-surface-variant">{order.seller.campus}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
                <span className="font-body-sm text-on-surface-variant">{order.seller.rating} rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Price Summary ── */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <h2 className="font-label-lg text-label-lg text-on-surface mb-4">Price Summary</h2>
          <div className="flex flex-col gap-2.5 font-body-md text-body-md text-on-surface-variant">
            <div className="flex justify-between">
              <span>Subtotal ({order.items.length} item{order.items.length !== 1 ? "s" : ""})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-secondary-container font-medium">
              <span>Delivery Fee</span>
              <span>$0.00 (Campus Pickup)</span>
            </div>
          </div>
          <div className="border-t border-outline-variant mt-3 pt-3 flex justify-between items-center">
            <span className="font-label-lg text-label-lg text-on-surface">Total Paid</span>
            <span className="font-headline-sm text-headline-sm text-primary">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-label-lg text-label-lg text-center hover:opacity-90 active:scale-95 transition-all"
          >
            Back to Orders
          </Link>
          <Link
            href="/"
            className="flex-1 bg-surface-container-lowest border-2 border-primary text-primary py-4 rounded-xl font-label-lg text-label-lg text-center hover:bg-surface-container-low active:scale-95 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-8 bg-surface-container-lowest border-t border-outline-variant flex flex-col items-center gap-4 px-4 text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          &copy; 2025 CampusKart. Academic Integrity &amp; Safety First.
        </p>
      </footer>
    </div>
  );
}
