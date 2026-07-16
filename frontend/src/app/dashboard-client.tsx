'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  Mail, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { AIRecommendationCard } from "@/components/ai/AIComponents";
import { RevenueChart, InventoryChart } from "@/components/charts/DashboardCharts";
import { cn, getGreeting } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<any>> = {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Mail,
  Sparkles
};

export default function DashboardClient() {
  // Access pre-fetched query data
  const { data: kpiList = [] } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => [] as any[], // Fallback
  });

  const { data: initialPriorities = [] } = useQuery({
    queryKey: ['priorities'],
    queryFn: () => [] as any[],
  });

  const { data: initialActivities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => [] as any[],
  });

  const [priorityList, setPriorityList] = useState(initialPriorities);

  // Sync state if query updates (optional but good)
  React.useEffect(() => {
    if (initialPriorities.length > 0 && priorityList.length === 0) {
      setPriorityList(initialPriorities);
    }
  }, [initialPriorities, priorityList]);

  const handleAction = (id: string) => {
    alert(`Initiating action for recommendation: ${id}`);
    setPriorityList(prev => prev.filter(p => p.id !== id));
  };

  const getKPIColor = (title: string) => {
    switch (title) {
      case "Low Stock": return "text-red-400";
      case "Open Emails": return "text-amber-400";
      case "AI Opportunities": return "text-primary-foreground";
      default: return "text-foreground";
    }
  };

  const getKPIBg = (title: string) => {
    switch (title) {
      case "Low Stock": return "bg-red-500/10 border-red-500/20";
      case "Open Emails": return "bg-amber-500/10 border-amber-500/20";
      case "AI Opportunities": return "bg-primary/20 border-primary/20";
      default: return "bg-secondary border-border";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "customer": return <Users size={12} className="text-blue-400" />;
      case "inventory": return <AlertTriangle size={12} className="text-red-400" />;
      case "decision": return <CheckCircle2 size={12} className="text-emerald-400" />;
      case "email": return <Mail size={12} className="text-amber-400" />;
      default: return <Sparkles size={12} className="text-primary-foreground" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ─── Greeting / Summary Card ─── */}
      <div className="relative rounded-2xl border border-border bg-gradient-to-r from-card to-card/65 p-6 overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-bl-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
              {getGreeting()}, Mark.
              <Sparkles size={20} className="text-primary-foreground animate-pulse" />
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
              ShopWise co-pilot is fully synced. Today, we have inventory stockouts approaching on <span className="text-red-400 font-semibold">2 items</span>, and detected <span className="text-emerald-400 font-semibold">3 new customer-specific bundle opportunities</span>.
            </p>
          </div>
          
          {/* Quick Metrics mini-badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background/50 p-3 rounded-xl border border-border/80">
            <div className="text-center px-2">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Revenue today</span>
              <p className="text-sm font-bold text-foreground mt-0.5">$4.2K</p>
            </div>
            <div className="text-center px-2 border-l border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Orders today</span>
              <p className="text-sm font-bold text-foreground mt-0.5">38</p>
            </div>
            <div className="text-center px-2 border-l border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Pending emails</span>
              <p className="text-sm font-bold text-amber-400 mt-0.5">5</p>
            </div>
            <div className="text-center px-2 border-l border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Stock alerts</span>
              <p className="text-sm font-bold text-red-400 mt-0.5">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiList.map((kpi) => {
          const Icon = iconMap[kpi.icon] || DollarSign;
          const kpiColor = getKPIColor(kpi.title);
          const kpiBg = getKPIBg(kpi.title);
          return (
            <div 
              key={kpi.id} 
              className={cn(
                "rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200",
                kpiBg
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground truncate">{kpi.title}</span>
                <Icon size={14} className={cn("text-muted-foreground shrink-0", kpiColor)} />
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className={cn("text-lg font-bold tracking-tight", kpiColor)}>{kpi.value}</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  kpi.trend >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {kpi.trend >= 0 ? "+" : ""}{kpi.trend}%
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 block mt-1 truncate">{kpi.description}</span>
            </div>
          );
        })}
      </div>

      {/* ─── Main Section Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recommendations & Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Priorities Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Today's Priorities</h2>
              <span className="text-xs text-muted-foreground">{priorityList.length} items</span>
            </div>
            
            {priorityList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityList.slice(0, 2).map((item) => (
                  <AIRecommendationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    confidence={item.confidence}
                    actionLabel={item.action}
                    type={item.type}
                    onAction={() => handleAction(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card/10">
                <p className="text-sm text-muted-foreground">All recommended priorities resolved!</p>
              </div>
            )}
          </div>

          {/* Revenue Analytics Chart */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Revenue & Performance Trends</h3>
                <p className="text-xs text-muted-foreground">Detailed weekly store transaction volume</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <TrendingUp size={12} />
                <span>+12.5% vs Last Week</span>
              </div>
            </div>
            <RevenueChart />
          </div>

        </div>

        {/* Right Column: Activity Timeline & Stock Check */}
        <div className="space-y-6">
          
          {/* Recent Activity */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <span>Co-Pilot Log</span>
              </h3>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Realtime</span>
            </div>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {initialActivities.slice(0, 6).map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== initialActivities.slice(0, 6).length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full border border-border bg-background flex items-center justify-center ring-8 ring-card">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5">
                          <p className="text-xs font-semibold text-foreground">{activity.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{activity.description}</p>
                          <span className="text-[10px] text-muted-foreground/60 block mt-1">
                            {new Date(activity.timestamp).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mini Inventory Warning Alert */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-sm">Predicted Inventory Demands</h3>
            <InventoryChart />
          </div>

        </div>

      </div>
    </motion.div>
  );
}
