'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  MessageSquare, 
  Package, 
  TrendingUp, 
  BookOpen, 
  Brain, 
  Users, 
  ShoppingBag, 
  Settings,
  X,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const commands = [
    { label: "Go to Dashboard", shortcut: "G D", category: "Navigation", icon: TrendingUp, action: () => { router.push("/"); setOpen(false); } },
    { label: "Open Owner Chat", shortcut: "G C", category: "Navigation", icon: MessageSquare, action: () => { router.push("/chat"); setOpen(false); } },
    { label: "Check Inbox", shortcut: "G I", category: "Navigation", icon: Mail, action: () => { router.push("/inbox"); setOpen(false); } },
    { label: "View Orders Ledger", shortcut: "G R", category: "Navigation", icon: ShoppingBag, action: () => { localStorage.setItem("customers-active-tab", "orders"); router.push("/customers"); setOpen(false); } },
    { label: "Inventory & Products", shortcut: "G V", category: "Navigation", icon: Package, action: () => { router.push("/inventory"); setOpen(false); } },
    { label: "Analyze Opportunities", shortcut: "G O", category: "Navigation", icon: Sparkles, action: () => { router.push("/opportunities"); setOpen(false); } },
    { label: "Activity", shortcut: "G J", category: "Navigation", icon: BookOpen, action: () => { router.push("/decisions"); setOpen(false); } },
    { label: "AI Context", shortcut: "G M", category: "Navigation", icon: Brain, action: () => { router.push("/memory"); setOpen(false); } },
    { label: "Customers CRM", shortcut: "G U", category: "Navigation", icon: Users, action: () => { router.push("/customers"); setOpen(false); } },
    { label: "System Settings", shortcut: "G S", category: "Navigation", icon: Settings, action: () => { router.push("/settings"); setOpen(false); } },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setOpen(false)}
      />

      {/* Palette Body */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-border px-3.5 py-3">
          <Search size={18} className="text-muted-foreground shrink-0 mr-2.5" />
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Type a command or search..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={() => setOpen(false)}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>

        {/* Command list */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Commands
              </div>
              {filteredCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={cmd.action}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-accent/80 transition-colors group"
                >
                  <cmd.icon size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
                  <span className="flex-1 font-medium">{cmd.label}</span>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted border border-border px-1.5 py-0.5 rounded shadow-sm">
                    {cmd.shortcut}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">No commands found.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try typing a different keyword.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center gap-4 border-t border-border bg-accent/20 px-4 py-2.5 text-[10px] text-muted-foreground font-medium">
          <span>
            <kbd className="font-mono">↑↓</kbd> to navigate
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> to select
          </span>
          <span>
            <kbd className="font-mono">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
