'use client'

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Order } from "@/app/types/order";
import { 
  getOrderChannel, 
  getChannelMeta, 
  formatRs, 
  toMonthKey, 
  formatMonthName, 
  SalesChannel 
} from "@/app/lib/order-utils";
import ManualSaleModal from "../(component)/ManualSaleModal";
import { 
  PlusIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  MagnifyingGlassIcon,
  ReceiptIcon
} from "@phosphor-icons/react";

const statusClasses: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  processing: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  shipped: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
};

export default function MonthlySalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data: Order[] = await res.json();
      setOrders(data);

      // Default selected month to current month
      const currentMonthKey = toMonthKey(new Date());
      setSelectedMonth(currentMonthKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Compute all available months from order history
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    // Always include current month
    monthSet.add(toMonthKey(new Date()));

    orders.forEach((o) => {
      if (o.createdAt) {
        const key = toMonthKey(o.createdAt);
        if (key) monthSet.add(key);
      }
    });

    return Array.from(monthSet).sort().reverse();
  }, [orders]);

  // Filter orders by month and channel and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Exclude cancelled from sales stats
      if (order.status === "cancelled") return false;

      // Month filter
      if (selectedMonth !== "all") {
        const orderMonth = toMonthKey(order.createdAt);
        if (orderMonth !== selectedMonth) return false;
      }

      // Channel filter
      const channel = getOrderChannel(order);
      if (channelFilter !== "all" && channel !== channelFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
        const matchName = fullName.includes(q);
        const matchId = String(order.id).includes(q) || (order.trackingId || "").toLowerCase().includes(q);
        const matchPhone = (order.phoneNum || "").toLowerCase().includes(q);
        const matchCity = (order.city || "").toLowerCase().includes(q);
        if (!matchName && !matchId && !matchPhone && !matchCity) return false;
      }

      return true;
    });
  }, [orders, selectedMonth, channelFilter, searchQuery]);

  // Monthly KPI Aggregates
  const monthStats = useMemo(() => {
    const totalSalesCount = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
    const averageOrderValue = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0;
    const deliveredCount = filteredOrders.filter(o => o.status === "delivered").length;
    const pendingCount = filteredOrders.filter(o => o.status === "pending" || o.status === "processing").length;

    // Channel Breakdown in current filtered view
    const channelCounts: Record<SalesChannel, { count: number; revenue: number }> = {
      instagram: { count: 0, revenue: 0 },
      reference: { count: 0, revenue: 0 },
      website: { count: 0, revenue: 0 },
      whatsapp: { count: 0, revenue: 0 },
      direct: { count: 0, revenue: 0 },
    };

    filteredOrders.forEach((o) => {
      const ch = getOrderChannel(o);
      const rev = Number(o.totalAmount) || 0;
      channelCounts[ch].count += 1;
      channelCounts[ch].revenue += rev;
    });

    return {
      totalSalesCount,
      totalRevenue,
      averageOrderValue,
      deliveredCount,
      pendingCount,
      channelCounts
    };
  }, [filteredOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 sm:p-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-xl bg-neutral-200" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-28 rounded-2xl bg-neutral-200" />
            <div className="h-28 rounded-2xl bg-neutral-200" />
            <div className="h-28 rounded-2xl bg-neutral-200" />
            <div className="h-28 rounded-2xl bg-neutral-200" />
          </div>
          <div className="h-80 rounded-2xl bg-neutral-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 sm:p-10 flex items-center justify-center">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center max-w-md">
          <p className="text-base font-bold text-rose-800">Error loading sales data</p>
          <p className="text-xs text-rose-600 mt-1">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="mt-4 px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Performance & Analytics
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Live Data
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[Gebuk] text-neutral-900 mt-1">
              Monthly Sales History
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Review monthly sales volume, track Instagram & referral revenue, and inspect every dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition active:scale-[0.98]"
            >
              <PlusIcon className="size-4" />
              <span>Record Offline / Insta Sale</span>
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 shrink-0">
              <CalendarIcon className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Select Time Period
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-black"
                >
                  <option value="all">All Time (Full History)</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonthName(m)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick channel tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "All Channels" },
              { id: "instagram", label: "Instagram" },
              { id: "reference", label: "Reference" },
              { id: "website", label: "Website" },
              { id: "whatsapp", label: "WhatsApp" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setChannelFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  channelFilter === tab.id
                    ? "bg-black text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Monthly Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Total Sales Done */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Sales Done in Month
              </p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShoppingBagIcon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900">
              {monthStats.totalSalesCount}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {selectedMonth === "all" ? "Total all-time orders" : `Total orders in ${formatMonthName(selectedMonth)}`}
            </p>
          </div>

          {/* Card: Total Revenue */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Monthly Revenue
              </p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <CurrencyDollarIcon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-emerald-700">
              {formatRs(monthStats.totalRevenue)}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Gross income from verified orders
            </p>
          </div>

          {/* Card: Average Order Value */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Average Sale Value
              </p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                <ChartBarIcon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900">
              {formatRs(monthStats.averageOrderValue)}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Average basket size per sale
            </p>
          </div>

          {/* Card: Fulfillment Health */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Fulfillment Status
              </p>
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                <CheckCircleIcon className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-emerald-700">
                {monthStats.deliveredCount}
              </span>
              <span className="text-xs font-semibold text-neutral-500">
                delivered
              </span>
              {monthStats.pendingCount > 0 && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  {monthStats.pendingCount} pending
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Completed vs in-transit parcels
            </p>
          </div>

        </div>

        {/* 2. Channel Performance Breakdown Cards */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Sales by Origin & Channel ({selectedMonth === "all" ? "All Time" : formatMonthName(selectedMonth)})
              </h2>
              <p className="text-xs text-neutral-500">
                Breakdown of sales originating from Instagram DMs, Friends/Referrals, WhatsApp, and Online Store.
              </p>
            </div>
            <span className="text-xs font-bold text-neutral-400">
              {monthStats.totalSalesCount} total sales
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Instagram */}
            <div className="p-4 rounded-xl border border-fuchsia-100 bg-fuchsia-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-800">
                  📸 Instagram
                </span>
                <span className="text-xs font-bold text-fuchsia-900">
                  {monthStats.channelCounts.instagram.count} sales
                </span>
              </div>
              <p className="text-xl font-black text-fuchsia-900">
                {formatRs(monthStats.channelCounts.instagram.revenue)}
              </p>
              <div className="w-full bg-fuchsia-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-fuchsia-600 h-full rounded-full"
                  style={{
                    width: `${monthStats.totalRevenue > 0 ? (monthStats.channelCounts.instagram.revenue / monthStats.totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Reference */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                  🤝 Reference
                </span>
                <span className="text-xs font-bold text-indigo-900">
                  {monthStats.channelCounts.reference.count} sales
                </span>
              </div>
              <p className="text-xl font-black text-indigo-900">
                {formatRs(monthStats.channelCounts.reference.revenue)}
              </p>
              <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full"
                  style={{
                    width: `${monthStats.totalRevenue > 0 ? (monthStats.channelCounts.reference.revenue / monthStats.totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Website Store */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                  🌐 Website Store
                </span>
                <span className="text-xs font-bold text-neutral-900">
                  {monthStats.channelCounts.website.count} sales
                </span>
              </div>
              <p className="text-xl font-black text-neutral-900">
                {formatRs(monthStats.channelCounts.website.revenue)}
              </p>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-neutral-800 h-full rounded-full"
                  style={{
                    width: `${monthStats.totalRevenue > 0 ? (monthStats.channelCounts.website.revenue / monthStats.totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* WhatsApp & Direct */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  💬 WhatsApp / Direct
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  {monthStats.channelCounts.whatsapp.count + monthStats.channelCounts.direct.count} sales
                </span>
              </div>
              <p className="text-xl font-black text-emerald-900">
                {formatRs(monthStats.channelCounts.whatsapp.revenue + monthStats.channelCounts.direct.revenue)}
              </p>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${monthStats.totalRevenue > 0 ? ((monthStats.channelCounts.whatsapp.revenue + monthStats.channelCounts.direct.revenue) / monthStats.totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3. Detailed Monthly Sales Log & Table */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
          
          {/* Table Header & Search Filter */}
          <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Sales Records ({filteredOrders.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Chronological list of all sales completed in this period.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search buyer, order, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-neutral-50 pl-9 pr-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mx-auto">
                <ReceiptIcon className="size-6" />
              </div>
              <p className="text-sm font-bold text-neutral-700">No sales found for this period</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                No orders match your selected filters. You can record an offline sale from Instagram or a reference now.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl"
              >
                <PlusIcon className="size-3.5" />
                <span>Record a Sale Now</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl divide-y divide-neutral-200 text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Order & Channel</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Items Sold</th>
                    <th className="px-6 py-3.5">Amount & Method</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredOrders.map((order) => {
                    const channel = getOrderChannel(order);
                    const meta = getChannelMeta(channel);

                    const dateFormatted = new Date(order.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    });
                    const timeFormatted = new Date(order.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    return (
                      <tr key={order.id} className="hover:bg-neutral-50/80 transition">
                        
                        {/* Order & Channel */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-900">
                              #ORD-{order.id}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.bg}`}>
                              <span>{meta.iconEmoji}</span>
                              <span>{meta.label}</span>
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                            {order.trackingId}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-neutral-900">
                            {order.firstName} {order.lastName}
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {order.city} • {order.phoneNum}
                          </p>
                        </td>

                        {/* Items Sold */}
                        <td className="px-6 py-4">
                          <div className="space-y-0.5 max-w-xs">
                            {order.items?.map((it, i) => (
                              <div key={i} className="text-[11px] text-neutral-800 truncate">
                                <span className="font-bold">{it.quantity}x</span> {it.productName}
                                {it.variantLabel ? ` (${it.variantLabel})` : ""}
                              </div>
                            ))}
                            {(!order.items || order.items.length === 0) && (
                              <span className="text-[11px] text-neutral-400">Fragrance package</span>
                            )}
                          </div>
                        </td>

                        {/* Amount & Method */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-black text-neutral-900">
                            Rs. {Number(order.totalAmount).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 capitalize">
                            {order.paymentMethod || "COD"}
                            {order.paymentStatus === "paid" && (
                              <span className="text-emerald-700 font-bold ml-1">• Paid</span>
                            )}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusClasses[order.status] ?? "bg-neutral-100 text-neutral-700"}`}>
                            {order.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">
                          <p>{dateFormatted}</p>
                          <p className="text-[10px] text-neutral-400">{timeFormatted}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Link
                            href={`/admin/manageOrders/${order.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 hover:border-black hover:bg-neutral-50 transition"
                          >
                            <span>Inspect & Invoice</span>
                          </Link>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Manual Sale Form Modal */}
      <ManualSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchOrders()}
      />
    </div>
  );
}

