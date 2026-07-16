'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Radar, 
  Sparkles, 
  TrendingUp, 
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Check,
  X,
  ArrowUpRight,
  TrendingDown,
  Info,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { opportunities as mockOpportunities } from "@/data/mock-data";

export default function OpportunitiesClient() {
  const { data: initialOpportunities = [] } = useQuery({
    queryKey: ['opportunities-list'],
    queryFn: () => mockOpportunities,
  });

  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [scanning, setScanning] = useState(false);
  const [justScanned, setJustScanned] = useState(false);

  React.useEffect(() => {
    if (initialOpportunities.length > 0 && opportunities.length === 0) {
      setOpportunities(initialOpportunities);
    }
  }, [initialOpportunities, opportunities]);

  const handleApprove = (id: string) => {
    setOpportunities(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: "approved" as const };
      }
      return o;
    }));
    alert("Operational policy approved & active on storefront storefront.");
  };

  const handleDismiss = (id: string) => {
    setOpportunities(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: "dismissed" as const };
      }
      return o;
    }));
  };

  const triggerScan = () => {
    setScanning(true);
    setJustScanned(false);
    
    // Simulate active scan for 1.8s
    setTimeout(() => {
      setScanning(false);
      setJustScanned(true);
      
      // Reset after 3 seconds
      setTimeout(() => setJustScanned(false), 3000);
      
      // Optionally reset dismissed items back to pending as if we fetched new ones
      setOpportunities(prev => prev.map(o => {
        if (o.status === "dismissed") {
          return { ...o, status: "pending" as const };
        }
        return o;
      }));
    }, 1800);
  };

  const filteredOpportunities = opportunities.filter(o => {
    const matchesType = filterType === "all" || o.type === filterType;
    return matchesType && o.status !== "dismissed";
  });

  const getMetrics = () => {
    const pending = opportunities.filter(o => o.status === "pending");
    const totalConfidence = opportunities.reduce((acc, curr) => acc + curr.confidence, 0);
    const avgConfidence = opportunities.length > 0 ? Math.round(totalConfidence / opportunities.length) : 0;
    
    return {
      pendingCount: pending.length,
      impact: "$4,280/mo potential",
      confidence: avgConfidence
    };
  };

  const metrics = getMetrics();

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          border: "border-red-500/25 bg-red-500/[0.02] hover:border-red-500/40",
          text: "text-red-400",
          badge: "bg-red-500/10 text-red-400 border-red-500/20",
          glow: "bg-red-500 animate-ping"
        };
      case "high":
        return {
          border: "border-amber-500/25 bg-amber-500/[0.02] hover:border-amber-500/40",
          text: "text-amber-400",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          glow: "bg-amber-500 animate-ping"
        };
      case "medium":
        return {
          border: "border-blue-500/25 bg-blue-500/[0.02] hover:border-blue-500/40",
          text: "text-blue-400",
          badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          glow: "bg-blue-500"
        };
      default:
        return {
          border: "border-border bg-card hover:border-border/80",
          text: "text-muted-foreground",
          badge: "bg-muted text-muted-foreground border-border",
          glow: "bg-muted-foreground"
        };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Redesigned operational control header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
            <Radar size={20} className="text-primary-foreground animate-pulse" />
            <span>AI Business Radar Ops Deck</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xl">
            Audit realtime business signals, automate price elasticity optimizations, analyze bundling conversions, and deploy policies.
          </p>
        </div>

        {/* Scan Actions */}
        <button
          onClick={triggerScan}
          disabled={scanning}
          className="relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs transition-all active:scale-95 shadow-lg shadow-primary/20 shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
        >
          {scanning ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>Scanning Store Vectors...</span>
            </>
          ) : justScanned ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span>Sync Completed</span>
            </>
          ) : (
            <>
              <Radar size={13} className="animate-pulse" />
              <span>Scan for Signals</span>
            </>
          )}
        </button>
      </div>

      {/* Overview Metric Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Unresolved Signals</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">{metrics.pendingCount}</span>
            <span className="text-[10px] text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded uppercase">Requires Review</span>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Est. Monthly Impact</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-400">{metrics.impact.split(" ")[0]}</span>
            <span className="text-[10px] text-muted-foreground font-medium">revenue growth</span>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avg Co-Pilot Confidence</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-primary-foreground">{metrics.confidence}%</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">High Trust</span>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Automated Policies</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">
              {opportunities.filter(o => o.status === "approved").length} active
            </span>
            <span className="text-[10px] text-muted-foreground">synced production</span>
          </div>
        </div>
      </div>

      {/* Main Signal Workspace Stream */}
      <div className="space-y-6">
        
        {/* Classification Filters (Top & Distributed) */}
        <div className="bg-card border border-border p-3.5 rounded-xl flex w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full">
            {["all", "inventory", "bundle", "pricing", "customer", "supplier"].map((type) => {
              const count = opportunities.filter(o => (type === "all" || o.type === type) && o.status !== "dismissed").length;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer w-full text-center",
                    filterType === type 
                      ? "bg-primary border-primary text-primary-foreground shadow" 
                      : "border-border hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{type}</span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0",
                    filterType === type ? "bg-primary-foreground text-primary" : "bg-accent text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Signals List Stream */}
        <div className="space-y-4">
          <AnimatePresence>
            {scanning && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 border border-dashed border-primary/30 rounded-xl bg-primary/5 flex flex-col items-center justify-center text-center space-y-3"
              >
                <RefreshCw size={24} className="animate-spin text-primary-foreground" />
                <h4 className="font-semibold text-xs text-foreground">Analyzing Store Vectors...</h4>
                <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                  Querying database transaction logs, parsing supplier lead times, and calculating cross-purchase affinities.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.map((o) => {
                const colors = getPriorityColors(o.priority);
                const isPending = o.status === "pending";

                return (
                  <motion.div
                    key={o.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "rounded-xl border transition-all duration-300 relative overflow-hidden p-5 flex flex-col justify-between gap-4 shadow-md",
                      colors.border
                    )}
                  >
                    {/* Subtle gradient background accent */}
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

                    {/* Top Bar Details */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider", colors.badge)}>
                          {o.priority} Priority
                        </span>
                        <span className="text-[10px] bg-accent text-muted-foreground border border-border px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          {o.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground font-semibold">Match Score:</span>
                        <span className={cn("text-xs font-bold", colors.text)}>{o.confidence}%</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        {o.title}
                        {o.priority === "critical" && <ShieldAlert size={14} className="text-red-400 shrink-0" />}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{o.description}</p>
                    </div>

                    {/* Recommended Action & Impact Box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-accent/25 border border-border/40 text-[11px] items-center">
                      <div className="md:col-span-2 space-y-0.5">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold">Recommended Policy Action</span>
                        <p className="text-foreground font-medium leading-relaxed">{o.recommendedAction}</p>
                      </div>
                      <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-border/40 pt-2.5 md:pt-0 md:pl-3 flex flex-col justify-center">
                        <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                          <Zap size={10} /> Projected Impact
                        </span>
                        <p className="text-xs font-bold text-foreground mt-0.5">{o.expectedImpact}</p>
                      </div>
                    </div>

                    {/* Action Controls */}
                    {isPending ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <button
                          onClick={() => handleDismiss(o.id)}
                          className="flex-1 text-xs font-semibold py-2 rounded-lg border border-border bg-card hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                          Dismiss Signal
                        </button>
                        <button
                          onClick={() => handleApprove(o.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs transition-all cursor-pointer"
                        >
                          <span>Approve & Deploy Policy</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-accent/20 border border-dashed border-border/60 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {o.status === "approved" ? (
                          <>
                            <CheckCircle size={14} className="text-emerald-400" />
                            <span>Policy Deployed Successfully</span>
                          </>
                        ) : (
                          <>
                            <X size={14} />
                            <span>Signal Muted & Dismissed</span>
                          </>
                        )}
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredOpportunities.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground bg-card/20">
                No active radar signals detected in this classification.
              </div>
            )}
          </div>

        </div>

      </div>

    </motion.div>
  );
}
