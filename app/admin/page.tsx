"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "admin1234@gmail.com";

interface Order {
  id: number;
  created_at: string;
  status: string;
  total: number;
  items: { title: string; price: number; image?: string }[];
  user_email?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "users">("orders");

  useEffect(() => {
    const isAdmin = localStorage.getItem("campuskart_admin") === "true";
    if (!isAdmin) { router.replace("/login"); return; }
    setAuthed(true);

    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("campuskart_admin");
    router.replace("/login");
  };

  if (!authed) return null;

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const statusCount = (s: string) => orders.filter(o => o.status === s).length;

  // Derive unique users from orders (by user_email if present, else group by rough heuristic)
  const userMap = new Map<string, { email: string; orderCount: number; totalSpent: number; lastOrder: string }>();
  orders.forEach(o => {
    const key = o.user_email || `user_${o.id % 100}`;
    const existing = userMap.get(key);
    if (existing) {
      existing.orderCount++;
      existing.totalSpent += o.total || 0;
      if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at;
    } else {
      userMap.set(key, { email: o.user_email || "—", orderCount: 1, totalSpent: o.total || 0, lastOrder: o.created_at });
    }
  });
  const users = Array.from(userMap.values());

  return (
    <div className="min-h-screen bg-[#f4f6fb]">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
          </span>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">CampusKart Admin</h1>
            <p className="text-xs text-gray-400">{ADMIN_EMAIL}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders",    value: orders.length,               icon: "receipt_long",   color: "bg-blue-500"   },
            { label: "Total Revenue",   value: `₹${totalRevenue.toFixed(0)}`, icon: "payments",     color: "bg-green-500"  },
            { label: "Pending Pickup",  value: statusCount("Pending Pickup"), icon: "schedule",      color: "bg-amber-500"  },
            { label: "Completed",       value: statusCount("Completed"),      icon: "check_circle",  color: "bg-emerald-500" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${stat.color} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["orders", "users"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab === "orders" ? `Orders (${orders.length})` : `Users (${users.length})`}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">All Orders</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <span className="material-symbols-outlined text-[48px] mb-2">receipt_long</span>
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Order ID", "Date", "Items", "Total", "Status"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-primary">CK-{order.id}</td>
                        <td className="px-5 py-4 text-gray-500">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          <div className="flex flex-col gap-0.5">
                            {(order.items || []).slice(0, 2).map((item, i) => (
                              <span key={i} className="truncate max-w-[200px]">{item.title}</span>
                            ))}
                            {(order.items || []).length > 2 && (
                              <span className="text-gray-400 text-xs">+{order.items.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">₹{(order.total || 0).toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Completed"       ? "bg-emerald-100 text-emerald-700" :
                            order.status === "Pending Pickup"  ? "bg-amber-100 text-amber-700"     :
                            order.status === "Cancelled"       ? "bg-red-100 text-red-600"          :
                                                                 "bg-gray-100 text-gray-600"
                          }`}>
                            {order.status || "Pending Pickup"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Users</h2>
              <p className="text-xs text-gray-400">Based on order activity</p>
            </div>
            {users.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <span className="material-symbols-outlined text-[48px] mb-2">group</span>
                <p className="text-sm">No users yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["#", "User", "Orders", "Total Spent", "Last Order"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">{i + 1}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                              {u.email !== "—" ? u.email.charAt(0).toUpperCase() : "?"}
                            </div>
                            <span className="text-gray-700">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">{u.orderCount}</td>
                        <td className="px-5 py-4 font-semibold text-gray-900">₹{u.totalSpent.toFixed(2)}</td>
                        <td className="px-5 py-4 text-gray-500">
                          {new Date(u.lastOrder).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
