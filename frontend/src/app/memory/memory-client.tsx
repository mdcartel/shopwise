'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  BrainCircuit, 
  Search, 
  SlidersHorizontal,
  Bookmark,
  Database,
  Plus
} from "lucide-react";
import { MemoryCard } from "@/components/ai/AIComponents";
import { cn } from "@/lib/utils";
import { memories as mockMemories } from "@/data/mock-data";

export default function MemoryClient() {
  const { data: initialMemories = [] } = useQuery({
    queryKey: ['memories-list'],
    queryFn: () => mockMemories,
  });

  const [memories, setMemories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  React.useEffect(() => {
    if (initialMemories.length > 0 && memories.length === 0) {
      setMemories(initialMemories);
    }
  }, [initialMemories, memories]);

  const filteredMemories = memories.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(search.toLowerCase()) || 
      m.summary.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
      
    const matchesCategory = categoryFilter === "all" || m.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddMemory = () => {
    const title = prompt("Enter memory title:");
    if (!title) return;
    const summary = prompt("Enter memory summary:");
    if (!summary) return;

    const newMem = {
      id: Date.now().toString(),
      type: "owner" as const,
      title,
      summary,
      importance: "medium" as const,
      lastUsed: new Date(),
      createdAt: new Date(),
      tags: ["manual-entry"],
      relatedEntities: ["Mark (Owner)"]
    };
    
    setMemories(prev => [newMem, ...prev]);
    alert("New memory injected into ShopWise semantic index!");
  };

  const handleEditMemory = (id: string) => {
    const mem = memories.find(m => m.id === id);
    if (!mem) return;

    const newTitle = prompt("Edit memory title:", mem.title);
    if (newTitle === null) return;
    
    const newSummary = prompt("Edit memory summary:", mem.summary);
    if (newSummary === null) return;

    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          title: newTitle || m.title,
          summary: newSummary || m.summary,
          lastUsed: new Date()
        };
      }
      return m;
    }));
    alert("Memory context modified successfully!");
  };

  const handleDeleteMemory = (id: string) => {
    if (confirm("Are you sure you want to delete this memory context from the AI semantic index?")) {
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-card to-purple-500/[0.03] p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 rounded-bl-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
              <BrainCircuit size={20} className="text-purple-400" />
              <span>AI Context</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-xl">
              ShopWise logs store history, preferences, and patterns into vector memory to build institutional context.
            </p>
          </div>

          <button 
            onClick={handleAddMemory}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all active:scale-95 shrink-0"
          >
            <Plus size={14} />
            <span>Inject Context</span>
          </button>
        </div>
      </div>

      {/* Toolbar controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs w-full sm:max-w-xs">
          <Search size={14} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search memories, tags..." 
            className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">Category:</span>
          <div className="flex flex-wrap gap-2">
            {["all", "business", "customer", "owner", "decision"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase transition-colors",
                  categoryFilter === cat 
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30" 
                    : "border-border text-muted-foreground hover:bg-accent/40"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.length > 0 ? (
          filteredMemories.map((m) => (
            <MemoryCard
              key={m.id}
              title={m.title}
              summary={m.summary}
              importance={m.importance}
              lastUsed={new Date(m.lastUsed).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              createdAt={new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              tags={m.tags}
              category={m.type}
              onEdit={() => handleEditMemory(m.id)}
              onDelete={() => handleDeleteMemory(m.id)}
            />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center bg-card/25 text-muted-foreground text-xs font-semibold">
            No memories match the filter context.
          </div>
        )}
      </div>

    </motion.div>
  );
}
