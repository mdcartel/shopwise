'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Inbox, 
  Package2, 
  Radar, 
  BookOpenCheck, 
  BrainCircuit, 
  Users2, 
  ShoppingBag, 
  Settings2,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Command,
  HelpCircle,
  ExternalLink,
  LogOut,
  User,
  Check,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "../shared/CommandPalette";
import { emails as initialEmails } from "@/data/mock-data";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const currentPath = usePathname();

  const [unreadEmailsCount, setUnreadEmailsCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("shopwise-unread-count");
    if (saved !== null) {
      setUnreadEmailsCount(parseInt(saved, 10));
    } else {
      setUnreadEmailsCount(initialEmails.filter(e => e.status === "unread").length);
    }

    const handleUnreadUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      setUnreadEmailsCount(customEvent.detail);
      localStorage.setItem("shopwise-unread-count", String(customEvent.detail));
    };

    window.addEventListener("shopwise-unread-emails", handleUnreadUpdate);
    return () => {
      window.removeEventListener("shopwise-unread-emails", handleUnreadUpdate);
    };
  }, []);

  // Listen for keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Owner Chat", href: "/chat", icon: MessageSquareCode },
    { label: "Inbox", href: "/inbox", icon: Inbox, badge: unreadEmailsCount > 0 ? String(unreadEmailsCount) : undefined },
    { label: "Inventory & Products", href: "/inventory", icon: Package2 },
    { label: "Business Radar", href: "/opportunities", icon: Radar, badge: "AI" },
    { label: "Activity", href: "/decisions", icon: BookOpenCheck },
    { label: "AI Context", href: "/memory", icon: BrainCircuit },
    { label: "Customers & Orders", href: "/customers", icon: Users2 },
    { label: "Settings", href: "/settings", icon: Settings2 },
  ];



  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* ─── SIDEBAR ─── */}
      <aside 
        className={cn(
          "relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-30",
          sidebarCollapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo / Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold tracking-tight">
              S
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                shopwise
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded border border-border bg-card hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-2 text-sm font-medium transition-all group relative duration-150",
                  isActive 
                    ? "bg-secondary text-primary border-l-2 border-primary" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                
                {item.badge && !sidebarCollapsed && (
                  <span className={cn(
                    "ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide uppercase",
                    item.badge === "Low" ? "bg-destructive/15 text-red-500" :
                    item.badge === "AI" ? "bg-primary/20 text-foreground border border-primary/20" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed mode */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 hidden group-hover:block bg-popover text-popover-foreground text-xs font-semibold px-2 py-1 rounded shadow-lg border border-border whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-2">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/30 border border-border/40">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm border border-border">
                M
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">Mark Robinson</p>
                <p className="text-[10px] text-muted-foreground truncate">Owner • VIP Seller</p>
              </div>
              <Sparkles size={14} className="text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm border border-border cursor-pointer">
                M
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card/60 backdrop-blur-md px-6 z-20">
          {/* Search bar mock trigger */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center w-full gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent/40 text-muted-foreground text-xs text-left transition-all"
            >
              <Search size={14} />
              <span>Search dashboard, products...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Profile Menu Placeholder */}
            <div className="h-8 w-8 rounded-full border border-border bg-accent flex items-center justify-center font-bold text-xs">
              M
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-background/95 p-6 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Command Palette Component */}
      <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
    </div>
  );
}
