'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpenCheck, 
  Search, 
  SlidersHorizontal,
  CheckCircle,
  Clock,
  ChevronDown
} from "lucide-react";
import { DecisionCard } from "@/components/ai/AIComponents";
import { cn } from "@/lib/utils";

export default function DecisionsClient() {
  const { data: initialDecisions = [] } = useQuery({
    queryKey: ['decisions-list'],
    queryFn: () => [] as any[],
  });

  const [decisions, setDecisions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  React.useEffect(() => {
    if (initialDecisions.length > 0 && decisions.length === 0) {
      setDecisions(initialDecisions);
    }
  }, [initialDecisions, decisions]);

  const handleApprove = (id: string) => {
    setDecisions(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, status: "executed" as const };
      }
      return d;
    }));
    alert("Decision approved for execution.");
  };

  const handleReject = (id: string) => {
    setDecisions(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, status: "rejected" as const };
      }
      return d;
    }));
    alert("Decision rejected.");
  };

  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = d.decision.toLowerCase().includes(search.toLowerCase()) || d.reasoning.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(decisions.map(d => d.category)));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
            <BookOpenCheck size={20} className="text-muted-foreground" />
            <span>Autonomous Activity</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse the history of store policies, customer optimizations, and supply chain choices co-pilot made.
          </p>
        </div>
      </div>

      {/* Toolbar controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs w-full sm:max-w-xs">
          <Search size={14} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search decisions, evidence..." 
            className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">Category:</span>
          <select 
            className="bg-background text-xs text-foreground border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary/50"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Decision timeline layout */}
      <div className="space-y-4">
        {filteredDecisions.length > 0 ? (
          filteredDecisions.map((d) => (
            <DecisionCard
              key={d.id}
              decision={d.decision}
              reasoning={d.reasoning}
              evidence={d.evidence}
              confidence={d.confidence}
              status={d.status}
              timestamp={new Date(d.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              category={d.category}
              impact={d.impact}
              onApprove={() => handleApprove(d.id)}
              onReject={() => handleReject(d.id)}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card/25 text-muted-foreground text-xs font-semibold">
            No journal entries match the filters.
          </div>
        )}
      </div>

    </motion.div>
  );
}
