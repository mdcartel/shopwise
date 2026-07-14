'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Search, 
  SlidersHorizontal,
  Mail,
  History,
  X,
  Award,
  AlertTriangle,
  Brain,
  MessageCircle,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  XCircle,
  Truck,
  Calendar,
  AlertCircle
} from "lucide-react";
import type { Order } from "@/data/mock-data";
import { cn, formatCurrency } from "@/lib/utils";

export default function CustomersClient() {
  const router = useRouter();

  const { data: initialCustomers = [] } = useQuery({
    queryKey: ['customers-list'],
    queryFn: () => [] as any[],
  });

  const { data: initialOrders = [] } = useQuery({
    queryKey: ['orders-list'],
    queryFn: () => [] as any[],
  });

  const [activeTab, setActiveTab] = useState("crm");

  React.useEffect(() => {
    const saved = localStorage.getItem("customers-active-tab");
    if (saved) {
      setActiveTab(saved);
      localStorage.removeItem("customers-active-tab");
    }
  }, []);

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [crmSearch, setCrmSearch] = useState("");

  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("all");

  React.useEffect(() => {
    if (initialCustomers.length > 0 && customers.length === 0) {
      setCustomers(initialCustomers);
    }
  }, [initialCustomers, customers]);

  React.useEffect(() => {
    if (initialOrders.length > 0 && ordersList.length === 0) {
      setOrdersList(initialOrders);
    }
  }, [initialOrders, ordersList]);

  // Redirect to Inbox for delay apologies
  const handleActionDelay = (order: Order) => {
    localStorage.setItem("inbox-compose-to-email", order.customerEmail);
    localStorage.setItem("inbox-compose-to-name", order.customerName);
    localStorage.setItem("inbox-compose-subject", `Shipping Update: Order ${order.orderNumber}`);
    
    let draftText = `Hi ${order.customerName.split(" ")[0]},\n\nI wanted to reach out with an update on your order ${order.orderNumber}.\n\n`;
    if (order.orderNumber === "ORD-4892") {
      draftText += `Our system flag noticed that your package's tracking number has been inactive for a few days at the USPS facility. I've contacted their support team to resolve this, and we expect it to scan out by tomorrow.`;
    } else if (order.orderNumber === "ORD-4878") {
      draftText += `Regarding your Ceramic Planter exchange: our fulfillment team has prepared and dispatched your replacement terracotta planter. The package is now on its way via UPS.`;
    } else if (order.orderNumber === "ORD-4891") {
      draftText += `The Wooden Phone Stand is temporarily out-of-stock because our incoming supplier shipment is delayed at customs. We expect it to clear in 2 days and will dispatch it immediately.`;
    } else {
      draftText += `Your shipment is running slightly behind our initial estimated timeline. We're actively investigating this with the carrier to deliver it as quickly as possible.`;
    }
    draftText += `\n\nTo make up for this wait, here is a 15% discount code [SHOPWELL] for your next purchase.\n\nBest regards,\nMark\nShopWise Store Owner`;
    
    localStorage.setItem("inbox-compose-body", draftText);
    localStorage.setItem("inbox-compose-prompt", `Apology for shipment delay on ${order.orderNumber}`);
    localStorage.setItem("inbox-trigger-compose", "true");

    // Redirect to inbox
    router.push("/inbox");
  };

  // CRM filtering
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(crmSearch.toLowerCase()) || 
    c.email.toLowerCase().includes(crmSearch.toLowerCase())
  );

  // Orders filtering & metrics
  const filteredOrders = ordersList.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(ordersSearch.toLowerCase());
    
    const matchesStatus = ordersStatusFilter === "all" || o.status === ordersStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = ordersList.length;
  const delayedCount = ordersList.filter(o => o.status === "delayed").length;
  const pendingCount = ordersList.filter(o => o.status === "unfulfilled").length;
  const fulfilledCount = ordersList.filter(o => o.status === "fulfilled").length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
            <Users size={20} className="text-muted-foreground" />
            <span>Customers & Orders Workspace</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xl">
            Audit buyer intelligence summaries, view order fulfillment ledger metrics, and trigger automated support actions.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-border gap-4 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("crm")}
          className={cn(
            "pb-2 border-b-2 px-1 transition-colors cursor-pointer flex items-center gap-1.5",
            activeTab === "crm" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users size={12} />
          <span>CRM Directory</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={cn(
            "pb-2 border-b-2 px-1 transition-colors cursor-pointer flex items-center gap-1.5",
            activeTab === "orders" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <ShoppingBag size={12} />
          <span>Orders Ledger</span>
          {delayedCount > 0 && (
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          )}
        </button>
      </div>

      {activeTab === "crm" ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search Toolbar */}
          <div className="flex items-center gap-2 bg-card p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs w-full sm:max-w-xs">
              <Search size={14} className="text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search customer name, email..." 
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                value={crmSearch}
                onChange={(e) => setCrmSearch(e.target.value)}
              />
            </div>
          </div>

          {/* CRM Table */}
          <div className="rounded-xl border border-border bg-card overflow-x-auto shadow-md">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-accent/20 text-muted-foreground uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Orders</th>
                  <th className="p-4 text-right">LTV</th>
                  <th className="p-4">Last Purchase</th>
                  <th className="p-4">Communication Style</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredCustomers.map((c) => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-accent/35 transition-colors cursor-pointer"
                    onClick={() => setSelectedCustomerId(c.id)}
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-primary/10 border border-border flex items-center justify-center font-bold text-xs shrink-0">
                        {c.avatar}
                      </div>
                      <span className="font-semibold text-foreground">{c.name}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{c.email}</td>
                    <td className="p-4 text-center font-medium">{c.orders}</td>
                    <td className="p-4 text-right font-semibold text-foreground">{formatCurrency(c.lifetimeValue)}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(c.lastPurchase).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="p-4 text-muted-foreground truncate max-w-[150px]">
                       {c.communicationStyle.toLowerCase().includes("unknown") ? "—" : c.communicationStyle}
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Orders Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Orders</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-foreground">{totalCount}</span>
              </div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Delayed Deliveries</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-red-400">{delayedCount}</span>
                <span className="text-[10px] text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded uppercase">Needs Action</span>
              </div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Pending Pack</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-blue-400">{pendingCount}</span>
              </div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Fulfilled Today</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-emerald-400">{fulfilledCount}</span>
              </div>
            </div>
          </div>

          {/* Orders Ledger Box */}
          <div className="bg-card border border-border rounded-xl shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/45">
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {[
                  { id: "all", label: "All Orders", count: totalCount },
                  { id: "delayed", label: "Delayed", count: delayedCount },
                  { id: "unfulfilled", label: "Pending", count: pendingCount },
                  { id: "fulfilled", label: "Fulfilled", count: fulfilledCount }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrdersStatusFilter(tab.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all",
                      ordersStatusFilter === tab.id
                        ? "bg-primary border-primary text-primary-foreground shadow"
                        : "border-border hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs w-full sm:max-w-xs">
                <Search size={14} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search order number, name..."
                  className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground/60 w-full"
                  value={ordersSearch}
                  onChange={e => setOrdersSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-accent/15 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    <th className="p-4">Order / Customer</th>
                    <th className="p-4">Date Ordered</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">Logistics Status</th>
                    <th className="p-4">AI Co-Pilot Insight</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-accent/15 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-foreground text-sm">{o.orderNumber}</div>
                        <div className="text-muted-foreground font-medium mt-0.5">{o.customerName}</div>
                        <div className="text-[10px] text-muted-foreground/60 mt-0.5">{o.customerEmail}</div>
                      </td>

                      <td className="p-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>{new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                        <div className="text-[10px] mt-0.5">
                          {new Date(o.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      <td className="p-4 text-muted-foreground">
                        <div className="space-y-1">
                          {o.items.map((item: any, idx: number) => (
                            <div key={idx} className="font-medium text-foreground/80">
                              {item.productName} <span className="text-muted-foreground font-normal text-[10px]">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 font-bold text-foreground">
                        ${o.total.toFixed(2)}
                      </td>

                      <td className="p-4">
                        {o.status === "delayed" && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                              <AlertTriangle size={10} />
                              Delayed
                            </span>
                            <p className="text-[10px] text-muted-foreground leading-normal max-w-[160px]">
                              {o.delayReason}
                            </p>
                          </div>
                        )}
                        {o.status === "unfulfilled" && (
                          <span className="inline-flex items-center gap-1 text-[9px] bg-blue-500/15 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-full font-bold uppercase">
                            <Clock size={10} />
                            Pending Pack
                          </span>
                        )}
                        {o.status === "fulfilled" && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                              <CheckCircle2 size={10} />
                              Fulfilled
                            </span>
                            <div className="text-[9px] text-muted-foreground/60 flex items-center gap-1">
                              <Truck size={10} />
                              <span>{o.carrier} ({o.trackingNumber?.substring(0, 8)}...)</span>
                            </div>
                          </div>
                        )}
                        {o.status === "cancelled" && (
                          <span className="inline-flex items-center gap-1 text-[9px] bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full font-bold uppercase">
                            <XCircle size={10} />
                            Cancelled
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {o.aiInsight ? (
                          <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/[0.01] max-w-[220px]">
                            <span className="text-[9px] font-bold text-primary-foreground uppercase flex items-center gap-1">
                              <Sparkles size={10} className="animate-pulse" /> ShopWise Vector
                            </span>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                              {o.aiInsight}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {o.status === "delayed" ? (
                          <button
                            type="button"
                            onClick={() => handleActionDelay(o)}
                            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-[10px] uppercase hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Send size={11} />
                            <span>Send Delay Apology</span>
                          </button>
                        ) : o.status === "unfulfilled" ? (
                          <button
                            type="button"
                            onClick={() => alert(`Fulfillment generated for ${o.orderNumber}. Processing package label...`)}
                            className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent/40 font-semibold text-[10px] uppercase ml-auto flex items-center gap-1 cursor-pointer"
                          >
                            <span>Fulfill Package</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => alert(`Reviewing tracking stats for ${o.orderNumber}...`)}
                            className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent/40 font-semibold text-[10px] uppercase ml-auto flex items-center gap-1 cursor-pointer"
                          >
                            <span>Track Package</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground">
                        <AlertCircle size={20} className="mx-auto text-muted-foreground/45 mb-2" />
                        <span>No orders found matching the filter criteria.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SLIDING DRAWER PROFILE VIEW ─── */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomerId(null)}
              className="fixed inset-0 bg-black z-45"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl p-6 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Users size={14} />
                  <span>Customer Intelligence Sheet</span>
                </h3>
                <button 
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar Header */}
              <div className="flex items-center gap-4 py-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg">
                  {selectedCustomer.avatar}
                </div>
                 <div>
                   <h2 className="text-lg font-bold text-foreground">{selectedCustomer.name}</h2>
                   <p className="text-xs text-muted-foreground">{selectedCustomer.email}</p>
                 </div>
              </div>

              {/* Stats overview boxes */}
              <div className="grid grid-cols-2 gap-4 border-y border-border/60 py-4">
                <div className="text-center bg-accent/20 p-3 rounded-lg border border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Orders</span>
                  <p className="text-base font-bold text-foreground mt-0.5">{selectedCustomer.orders}</p>
                </div>
                <div className="text-center bg-accent/20 p-3 rounded-lg border border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Lifetime Value</span>
                  <p className="text-base font-bold text-foreground mt-0.5">{formatCurrency(selectedCustomer.lifetimeValue)}</p>
                </div>
              </div>

              {/* CRM Insights Sections */}
              <div className="space-y-5 py-6">
                {/* Communication style */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MessageCircle size={13} className="text-blue-400" />
                    <span>Communication Style</span>
                  </h4>
                   <div className="p-3 rounded-lg border border-border bg-card/60 text-xs text-foreground leading-relaxed">
                     {selectedCustomer.communicationStyle.toLowerCase().includes("unknown") ? "—" : selectedCustomer.communicationStyle}
                   </div>
                </div>

                {/* Co-Pilot memory notes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Brain size={13} className="text-purple-400" />
                    <span>Semantic Context Summary</span>
                  </h4>
                  <div className="p-3 rounded-lg border border-primary/20 bg-primary/[0.02] text-xs text-foreground leading-relaxed">
                    {selectedCustomer.memorySummary}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-border pt-4 flex gap-2">
                <button
                  onClick={() => {
                    localStorage.setItem("inbox-compose-to-email", selectedCustomer.email);
                    localStorage.setItem("inbox-compose-to-name", selectedCustomer.name);
                    localStorage.setItem("inbox-trigger-compose", "true");
                    router.push("/inbox");
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Mail size={12} />
                  <span>Send Direct Email</span>
                </button>
                <button
                  onClick={() => {
                    // Open historical orders tab filtered by customer email
                    setActiveTab("orders");
                    setOrdersSearch(selectedCustomer.email);
                    setSelectedCustomerId(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                >
                  <span>Open History</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
