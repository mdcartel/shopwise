'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Package, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Truck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Coins,
  BookOpenCheck,
  Brain,
  Info,
  ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { 
  opportunities, 
  decisions, 
  memories,
  products as mockProducts
} from "@/data/mock-data";
import { cn, formatCurrency } from "@/lib/utils";

export default function InventoryClient() {
  const { data: initialProducts = [] } = useQuery({
    queryKey: ['products-list'],
    queryFn: () => mockProducts,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [reorderQty, setReorderQty] = useState(50);

  // Load products when query hydrates
  React.useEffect(() => {
    if (initialProducts.length > 0 && products.length === 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts, products]);

  // Set default selected ID once products are loaded
  React.useEffect(() => {
    if (products.length > 0 && !selectedId) {
      setSelectedId(products[0].id);
    }
  }, [products, selectedId]);

  const selectedProduct = products.find(p => p.id === selectedId);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleReorder = (id: string, qty: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = p.stock + qty;
        let newStatus: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
        let runout = "30+ days";

        if (newStock === 0) {
          newStatus = "out-of-stock";
          runout = "Out of stock";
        } else if (newStock <= 15) {
          newStatus = "low-stock";
          runout = `${Math.ceil(newStock / 2.4)} days`;
        }

        return {
          ...p,
          stock: newStock,
          status: newStatus,
          predictedRunout: runout
        };
      }
      return p;
    }));
    alert(`Dispatched restock order of ${qty} units. Stock levels will update immediately.`);
  };

  // Filter and sort products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (typeof valA === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
    }
    return sortOrder === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  // Helper to generate a 7-day mock sales history chart dataset based on total sales
  const getSalesHistory = (totalSales: number) => {
    const base = Math.round(totalSales / 25); // scaling factor
    return [
      { day: "Mon", sales: Math.round(base * 0.8) },
      { day: "Tue", sales: Math.round(base * 1.1) },
      { day: "Wed", sales: Math.round(base * 0.9) },
      { day: "Thu", sales: Math.round(base * 1.2) },
      { day: "Fri", sales: Math.round(base * 1.0) },
      { day: "Sat", sales: Math.round(base * 1.5) },
      { day: "Sun", sales: Math.round(base * 0.7) },
    ];
  };

  // Filter linked opportunities, decisions and memories
  const productOpportunities = selectedProduct ? opportunities.filter(o => 
    o.title.toLowerCase().includes(selectedProduct.name.toLowerCase()) || 
    o.description.toLowerCase().includes(selectedProduct.name.toLowerCase())
  ) : [];

  const productDecisions = selectedProduct ? decisions.filter(d => 
    d.decision.toLowerCase().includes(selectedProduct.name.toLowerCase()) || 
    d.reasoning.toLowerCase().includes(selectedProduct.name.toLowerCase())
  ) : [];

  const productMemories = selectedProduct ? memories.filter(m => 
    m.title.toLowerCase().includes(selectedProduct.name.toLowerCase()) || 
    m.summary.toLowerCase().includes(selectedProduct.name.toLowerCase()) ||
    m.relatedEntities.some(e => e.toLowerCase().includes(selectedProduct.name.toLowerCase()))
  ) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase">
            <CheckCircle size={10} />
            In Stock
          </span>
        );
      case "low-stock":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase">
            <AlertTriangle size={10} />
            Low Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold uppercase">
            <XCircle size={10} />
            Out of Stock
          </span>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
            <Package size={20} className="text-muted-foreground" />
            <span>Inventory & Products Workspace</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            Audit item metrics, analyze sales trends, view semantic AI context, and restock products in one unified panel.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Products List Catalog (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs w-full sm:max-w-xs">
              <Search size={14} className="text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search name, SKU..." 
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Selector filters */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <SlidersHorizontal size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground">Category:</span>
                <select 
                  className="bg-background text-xs text-foreground border border-border rounded-lg px-2 py-1 outline-none cursor-pointer"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Status:</span>
                <select 
                  className="bg-background text-xs text-foreground border border-border rounded-lg px-2 py-1 outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid View of Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedProducts.map((p) => {
              const isSelected = p.id === selectedId;
              
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                    setMobileInspectorOpen(true);
                  }}
                  className={cn(
                    "w-full text-left rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col justify-between cursor-pointer",
                    isSelected ? "border-primary ring-1 ring-primary" : "border-border"
                  )}
                >
                  {/* Top image wrapper */}
                  <div className="w-full h-24 bg-accent/20 border-b border-border/40 flex items-center justify-center text-3xl relative">
                    <span>{p.image}</span>
                    <span className="absolute top-2 right-2">
                      {getStatusBadge(p.status)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 w-full flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-xs text-foreground truncate">{p.name}</h3>
                        <span className="text-xs font-bold text-foreground">{formatCurrency(p.price)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mt-1">
                        <span>{p.sku}</span>
                        <span>{p.category}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-2 text-[10px]">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase font-semibold">Stock</span>
                        <p className={cn(
                          "font-bold mt-0.5",
                          p.stock <= 5 ? "text-red-400" : p.stock <= 15 ? "text-amber-400" : "text-foreground"
                        )}>
                          {p.stock} units
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase font-semibold">Sales Volume</span>
                        <p className="font-bold text-foreground mt-0.5">{p.sales} sold</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {sortedProducts.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground bg-card/20">
                No items match your filter parameters.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Consolidated Inspector Panel (1/3 width) - Desktop only */}
        <div className="hidden lg:block lg:col-span-1 h-[calc(100vh-12rem)] sticky top-6">
          <AnimatePresence mode="wait">
            {selectedProduct ? (
              <motion.div
                key={selectedProduct.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-border bg-card h-full flex flex-col overflow-hidden shadow-xl"
              >
                {/* Visual Header */}
                <div className="relative p-6 bg-gradient-to-br from-primary/10 to-card border-b border-border flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-background border border-border/80 flex items-center justify-center text-4xl shrink-0">
                    {selectedProduct.image}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] bg-primary/20 text-foreground px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                      {selectedProduct.category}
                    </span>
                    <h2 className="font-bold text-sm text-foreground truncate mt-1.5">{selectedProduct.name}</h2>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{selectedProduct.sku}</p>
                  </div>
                </div>

                {/* Scrollable details area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 divide-y divide-border/40">
                  
                  {/* Description & Performance Row */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Item Profile</h3>
                    <p className="text-xs text-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-dashed border-border/40">
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase font-semibold">Restocking Buffer</span>
                        <p className="text-xs font-bold text-foreground mt-0.5">{selectedProduct.predictedRunout}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-muted-foreground uppercase font-semibold">AI Index Performance</span>
                        <p className={cn(
                          "text-xs font-bold mt-0.5 uppercase",
                          selectedProduct.performance === "excellent" ? "text-emerald-400" : "text-blue-400"
                        )}>
                          {selectedProduct.performance}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sales History Chart */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">7-Day Sales Volume</h3>
                      <span className="text-[10px] text-muted-foreground font-semibold">Total: {selectedProduct.sales} units</span>
                    </div>
                    <div className="w-full">
                      <ResponsiveContainer width="100%" height={120}>
                        <AreaChart data={getSalesHistory(selectedProduct.sales)} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={8} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: 9 }}
                            labelStyle={{ fontWeight: "bold" }}
                          />
                          <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={1.5} fillOpacity={1} fill="url(#salesGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Insights (Opportunities) */}
                  <div className="pt-4 space-y-2">
                    <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                      <Sparkles size={10} className="text-primary-foreground" />
                      <span>AI Insights & Warnings</span>
                    </h3>
                    
                    {productOpportunities.length > 0 ? (
                      <div className="space-y-2.5">
                        {productOpportunities.map(o => (
                          <div key={o.id} className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-1">
                            <div className="flex items-center justify-between text-[9px]">
                              <span className={cn(
                                "font-bold uppercase px-1.5 py-0.5 rounded",
                                o.priority === "critical" ? "bg-red-500/10 text-red-400" : "bg-primary/20 text-foreground"
                              )}>
                                {o.priority}
                              </span>
                              <span className="text-muted-foreground font-semibold">Confidence: {o.confidence}%</span>
                            </div>
                            <p className="text-xs font-semibold text-foreground">{o.title}</p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{o.description}</p>
                            <p className="text-[10px] text-emerald-400 font-bold pt-0.5">Impact: {o.expectedImpact}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg border border-border bg-accent/10 space-y-1">
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold uppercase">
                          <Info size={10} />
                          <span>Stability Report</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Predicted demand is stable at <strong>{selectedProduct.predictedDemand}%</strong>. Safety buffers are optimal. Recommended restock lead time is {selectedProduct.predictedRunout}.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Context (Memories) */}
                  <div className="pt-4 space-y-2">
                    <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                      <Brain size={10} className="text-purple-400" />
                      <span>AI Context & Memory Vector</span>
                    </h3>
                    
                    {productMemories.length > 0 ? (
                      <div className="space-y-2">
                        {productMemories.map(m => (
                          <div key={m.id} className="p-3 rounded-lg border border-purple-500/10 bg-purple-500/[0.02] space-y-1">
                            <div className="flex items-center justify-between text-[9px] text-purple-400 font-bold uppercase">
                              <span>{m.type} preference</span>
                              <span>{m.importance} priority</span>
                            </div>
                            <p className="text-xs font-semibold text-foreground">{m.title}</p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{m.summary}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">No historical semantic preferences logged for this product.</p>
                    )}
                  </div>

                  {/* Recent Co-pilot Actions (Decisions) */}
                  <div className="pt-4 space-y-2">
                    <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                      <BookOpenCheck size={10} className="text-muted-foreground" />
                      <span>Recent Co-Pilot Actions</span>
                    </h3>
                    
                    {productDecisions.length > 0 ? (
                      <div className="space-y-2">
                        {productDecisions.map(d => (
                          <div key={d.id} className="p-3 rounded-lg border border-border bg-card space-y-1">
                            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                              <span className="font-semibold">{d.category}</span>
                              <span>{new Date(d.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            </div>
                            <p className="text-xs font-semibold text-foreground">{d.decision}</p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">Reasoning: {d.reasoning}</p>
                            {d.impact && <p className="text-[10px] text-emerald-400 font-semibold mt-1">Result: {d.impact}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">No recent autonomous actions recorded for this item.</p>
                    )}
                  </div>

                  {/* Restock & Supplier Controls */}
                  <div className="pt-4 pb-4 space-y-3">
                    <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Supply Chain</h3>
                    <div className="rounded-lg bg-accent/20 p-3 text-[11px] space-y-2 border border-border/40">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Partner Supplier:</span>
                        <strong className="text-foreground">{selectedProduct.supplier}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Unit Value:</span>
                        <strong className="text-foreground">{formatCurrency(selectedProduct.price)}</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] text-muted-foreground uppercase font-semibold block">Restock Batch Size</label>
                      <div className="flex gap-2">
                        <input 
                          type="number"
                          value={reorderQty}
                          onChange={(e) => setReorderQty(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-20 bg-background text-xs text-foreground border border-border rounded-lg px-2 py-1.5 outline-none focus:border-primary/50 text-center"
                        />
                        <button
                          onClick={() => handleReorder(selectedProduct.id, reorderQty)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                        >
                          <Truck size={12} />
                          <span>Dispatch Purchase Order</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/40 h-full flex flex-col items-center justify-center text-center p-8">
                <Package size={36} className="text-muted-foreground opacity-30 mb-3" />
                <p className="text-xs font-medium text-muted-foreground">Select a product to inspect details</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* MOBILE DRAWER INSPECTOR */}
      <AnimatePresence>
        {mobileInspectorOpen && selectedProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileInspectorOpen(false)}
              className="fixed inset-0 bg-black/45 z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-card border-l border-border shadow-2xl p-6 z-50 overflow-y-auto lg:hidden animate-in slide-in-from-right duration-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Package size={14} />
                  <span>Product Intelligence Sheet</span>
                </h3>
                <button 
                  onClick={() => setMobileInspectorOpen(false)}
                  className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Visual Header */}
              <div className="relative py-6 bg-gradient-to-br from-primary/10 to-card border-b border-border flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-background border border-border/80 flex items-center justify-center text-4xl shrink-0">
                  {selectedProduct.image}
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] bg-primary/20 text-foreground px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                    {selectedProduct.category}
                  </span>
                  <h2 className="font-bold text-sm text-foreground truncate mt-1.5">{selectedProduct.name}</h2>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{selectedProduct.sku}</p>
                </div>
              </div>

              {/* Details Body */}
              <div className="space-y-5 py-5 divide-y divide-border/40 text-xs">
                {/* Item Profile */}
                <div className="space-y-2">
                  <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Item Profile</h3>
                  <p className="text-xs text-foreground leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-dashed border-border/40">
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase font-semibold">Restocking Buffer</span>
                      <p className="text-xs font-bold text-foreground mt-0.5">{selectedProduct.predictedRunout}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground uppercase font-semibold">AI Index Performance</span>
                      <p className={cn(
                        "text-xs font-bold mt-0.5 uppercase",
                        selectedProduct.performance === "excellent" ? "text-emerald-400" : "text-blue-400"
                      )}>
                        {selectedProduct.performance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sales History Chart */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">7-Day Sales Volume</h3>
                    <span className="text-[10px] text-muted-foreground font-semibold">Total: {selectedProduct.sales} units</span>
                  </div>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={120}>
                      <AreaChart data={getSalesHistory(selectedProduct.sales)} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="salesGradMobile" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={8} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={8} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: 9 }}
                          labelStyle={{ fontWeight: "bold" }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={1.5} fillOpacity={1} fill="url(#salesGradMobile)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Insights (Opportunities) */}
                <div className="pt-4 space-y-2">
                  <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                    <Sparkles size={10} className="text-primary-foreground" />
                    <span>AI Insights & Warnings</span>
                  </h3>
                  
                  {productOpportunities.length > 0 ? (
                    <div className="space-y-2.5">
                      {productOpportunities.map(o => (
                        <div key={o.id} className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-1">
                          <div className="flex items-center justify-between text-[9px]">
                            <span className={cn(
                              "font-bold uppercase px-1.5 py-0.5 rounded",
                              o.priority === "critical" ? "bg-red-500/10 text-red-400" : "bg-primary/20 text-foreground"
                            )}>
                              {o.priority}
                            </span>
                            <span className="text-muted-foreground font-semibold">Confidence: {o.confidence}%</span>
                          </div>
                          <p className="text-xs font-semibold text-foreground">{o.title}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{o.description}</p>
                          <p className="text-[10px] text-emerald-400 font-bold pt-0.5">Impact: {o.expectedImpact}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border border-border bg-accent/10 space-y-1">
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold uppercase">
                        <Info size={10} />
                        <span>Stability Report</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Predicted demand is stable at <strong>{selectedProduct.predictedDemand}%</strong>. Safety buffers are optimal. Recommended restock lead time is {selectedProduct.predictedRunout}.
                      </p>
                    </div>
                  )}
                </div>

                {/* AI Context (Memories) */}
                <div className="pt-4 space-y-2">
                  <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                    <Brain size={10} className="text-purple-400" />
                    <span>AI Context & Memory Vector</span>
                  </h3>
                  
                  {productMemories.length > 0 ? (
                    <div className="space-y-2">
                      {productMemories.map(m => (
                        <div key={m.id} className="p-3 rounded-lg border border-purple-500/10 bg-purple-500/[0.02] space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-purple-400 font-bold uppercase">
                            <span>{m.type} preference</span>
                            <span>{m.importance} priority</span>
                          </div>
                          <p className="text-xs font-semibold text-foreground">{m.title}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{m.summary}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic">No historical semantic preferences logged for this product.</p>
                  )}
                </div>

                {/* Restock & Supplier Controls */}
                <div className="pt-4 pb-4 space-y-3 border-b border-border/40">
                  <h3 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Supply Chain</h3>
                  <div className="rounded-lg bg-accent/20 p-3 text-[11px] space-y-2 border border-border/40">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Partner Supplier:</span>
                      <strong className="text-foreground">{selectedProduct.supplier}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Unit Value:</span>
                      <strong className="text-foreground">{formatCurrency(selectedProduct.price)}</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] text-muted-foreground uppercase font-semibold block">Restock Batch Size</label>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        value={reorderQty}
                        onChange={(e) => setReorderQty(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-20 bg-background text-xs text-foreground border border-border rounded-lg px-2 py-1.5 outline-none focus:border-primary/50 text-center"
                      />
                      <button
                        onClick={() => handleReorder(selectedProduct.id, reorderQty)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                      >
                        <Truck size={12} />
                        <span>Dispatch Purchase Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
