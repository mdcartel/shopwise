'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings2, 
  Save, 
  BrainCircuit, 
  Eye, 
  Bell, 
  Bot,
  Link2,
  RefreshCw,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { customers, products } from "@/data/mock-data";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("connections");
  const [themeMode, setThemeMode] = useState("dark");
  const [memoryWeight, setMemoryWeight] = useState(70);

  // Connections states
  const [shopifyConnected, setShopifyConnected] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(true);
  const [woocommerceConnected, setWoocommerceConnected] = useState(false);
  const [etsyConnected, setEtsyConnected] = useState(false);
  const [syncingShopify, setSyncingShopify] = useState(false);
  const [syncingGmail, setSyncingGmail] = useState(false);

  const handleSave = () => {
    alert("Settings successfully applied & co-pilot weights updated!");
  };

  const tabs = [
    { id: "connections", label: "Integrations & Connections", icon: Link2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "ai", label: "AI Preferences", icon: Bot },
    { id: "memory", label: "Memory Settings", icon: BrainCircuit },
    { id: "appearance", label: "Appearance", icon: Eye },
  ];

  // Derived unique suppliers from products catalog with generated emails
  const suppliers = Array.from(new Set(products.map(p => p.supplier)))
    .filter(Boolean)
    .map((sup, idx) => ({
      id: `sup-${idx}`,
      name: sup,
      email: sup.toLowerCase().replace(/[^a-z0-9]/g, "") + "@supplier.com"
    }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground m-0 flex items-center gap-2">
            <Settings2 size={20} className="text-muted-foreground" />
            <span>Store Settings & Tuning</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Tune co-pilot thresholds, verify autonomous parameters, and edit styling.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 active:scale-95 transition-all shadow-md shrink-0"
        >
          <Save size={14} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation sidebar */}
        <div className="flex flex-row overflow-x-auto md:flex-col space-x-2 md:space-x-0 md:space-y-1 bg-card border border-border p-2 rounded-xl scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors shrink-0",
                activeTab === tab.id 
                  ? "bg-accent text-foreground" 
                  : "text-muted-foreground hover:bg-accent/40"
              )}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content viewport */}
        <div className="md:col-span-3 rounded-xl border border-border bg-card p-6 shadow-md min-h-[350px]">

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-sm border-b border-border/40 pb-2">Channels & Realtime Alerts</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">SMS Alert Channels</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">Send urgent inventory stockout alerts to +1 (555) 019-2834</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
                </div>
                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                  <div>
                    <p className="font-semibold">Daily AI Opportunity Briefings</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">Receive a compiled summary in email every morning at 8:00 AM</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
                </div>
              </div>
            </div>
          )}


          {activeTab === "ai" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-sm border-b border-border/40 pb-2">Co-Pilot Reasoning Dialect</h3>
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Reasoning Depth</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none text-foreground">
                    <option>Exhaustive Reasoning & Audits (Highly recommended)</option>
                    <option>Concise Action Summaries Only</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Business Strategy Focus</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none text-foreground">
                    <option>Maximize Margin & Net AOV</option>
                    <option>Maximize Conversion Volume (Gross Orders)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "memory" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-sm border-b border-border/40 pb-2">Semantic memory variables</h3>
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-semibold">Contextual Memory Weight (Fuzzy Matching)</p>
                    <span className="font-bold text-primary-foreground">{memoryWeight}% weight</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Adjusts how heavily past store decisions affect new recommendations.</p>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary" 
                    value={memoryWeight}
                    onChange={(e) => setMemoryWeight(Number(e.target.value))}
                  />
                </div>
                <div className="flex justify-between border-t border-border/40 pt-4">
                  <div>
                    <p className="font-semibold">Log Store History in Vector Memories</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">Auto-updates customer profiles dynamically based on their interaction timeline</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
                </div>
              </div>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="space-y-6">
              <div className="border-b border-border/40 pb-3">
                <h3 className="font-semibold text-sm">Channel Integrations & API Sync</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Integrate ShopWise AI Co-Pilot with external commerce stores, mail accounts, and supply channels.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shopify */}
                <div className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col justify-between gap-4",
                  shopifyConnected ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-border bg-card"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#96bf48]/10 border border-[#96bf48]/20 flex items-center justify-center font-bold text-base text-[#96bf48]">
                        S
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-foreground">Shopify</h4>
                        <span className="text-[10px] text-muted-foreground">Ecommerce Storefront</span>
                      </div>
                    </div>
                    {shopifyConnected ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Connected
                      </span>
                    ) : (
                      <span className="text-[9px] bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded font-bold uppercase">
                        Offline
                      </span>
                    )}
                  </div>

                  {shopifyConnected ? (
                    <div className="space-y-3">
                      <div className="text-[10px] text-muted-foreground leading-relaxed space-y-1">
                        <div className="flex justify-between">
                          <span>Store domain:</span>
                          <strong className="text-foreground">shopwise-store.myshopify.com</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Catalog Sync:</span>
                          <strong className="text-foreground font-semibold">12 Items active</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Last sync:</span>
                          <span>Today, 10:14 PM</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <button
                          onClick={() => {
                            setSyncingShopify(true);
                            setTimeout(() => {
                              setSyncingShopify(false);
                              alert("Shopify inventory & orders catalog successfully synchronized!");
                            }, 1200);
                          }}
                          disabled={syncingShopify}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-accent/40 text-[10px] font-semibold text-foreground cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={10} className={cn("text-muted-foreground", syncingShopify ? "animate-spin" : "")} />
                          <span>{syncingShopify ? "Syncing..." : "Sync Store"}</span>
                        </button>
                        <button
                          onClick={() => {
                            if(confirm("Disconnect Shopify storefront? Co-pilot will stop syncing orders and inventory.")) {
                              setShopifyConnected(false);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-red-500/10 hover:bg-red-500/10 text-[10px] font-semibold text-red-400 cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">Sync inventory levels, fetch new transaction logs, and auto-fulfill orders directly through Shopify API.</p>
                      <button
                        onClick={() => {
                          setShopifyConnected(true);
                          alert("Shopify storefront connected (Mocked sync initialized)!");
                        }}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold hover:opacity-90 transition-all cursor-pointer"
                      >
                        Connect Shopify Store
                      </button>
                    </div>
                  )}
                </div>

                {/* Gmail */}
                <div className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col justify-between gap-4",
                  gmailConnected ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-border bg-card"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-base text-red-400">
                        M
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-foreground">Gmail</h4>
                        <span className="text-[10px] text-muted-foreground">Customer Support Inbox</span>
                      </div>
                    </div>
                    {gmailConnected ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Connected
                      </span>
                    ) : (
                      <span className="text-[9px] bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded font-bold uppercase">
                        Offline
                      </span>
                    )}
                  </div>

                  {gmailConnected ? (
                    <div className="space-y-3">
                      <div className="text-[10px] text-muted-foreground leading-relaxed space-y-1">
                        <div className="flex justify-between">
                          <span>Authorized ID:</span>
                          <strong className="text-foreground">mark.robinson@gmail.com</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Inbox Status:</span>
                          <strong className="text-foreground font-semibold">Syncing real-time</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Last checked:</span>
                          <span>Just now</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <button
                          onClick={() => {
                            setSyncingGmail(true);
                            setTimeout(() => {
                              setSyncingGmail(false);
                              alert("Gmail customer support tickets synced!");
                            }, 1000);
                          }}
                          disabled={syncingGmail}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-accent/40 text-[10px] font-semibold text-foreground cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={10} className={cn("text-muted-foreground", syncingGmail ? "animate-spin" : "")} />
                          <span>{syncingGmail ? "Checking..." : "Check Inbox"}</span>
                        </button>
                        <button
                          onClick={() => {
                            if(confirm("Disconnect Gmail account? ShopWise will lose access to draft email replies.")) {
                              setGmailConnected(false);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-red-500/10 hover:bg-red-500/10 text-[10px] font-semibold text-red-400 cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">Sync incoming support mails, authorize draft reply templates, and send outbound customer relations emails.</p>
                      <button
                        onClick={() => {
                          setGmailConnected(true);
                          alert("Gmail client authorized (Mocked sync initialized)!");
                        }}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold hover:opacity-90 transition-all cursor-pointer"
                      >
                        Connect Gmail Inbox
                      </button>
                    </div>
                  )}
                </div>

                {/* WooCommerce */}
                <div className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col justify-between gap-4",
                  woocommerceConnected ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-border bg-card"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-base text-indigo-400">
                        W
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-foreground">WooCommerce</h4>
                        <span className="text-[10px] text-muted-foreground">Self-Hosted Storefront</span>
                      </div>
                    </div>
                    {woocommerceConnected ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Connected
                      </span>
                    ) : (
                      <span className="text-[9px] bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded font-bold uppercase">
                        Offline
                      </span>
                    )}
                  </div>

                  {woocommerceConnected ? (
                    <div className="space-y-3">
                      <div className="text-[10px] text-muted-foreground leading-relaxed space-y-1">
                        <div className="flex justify-between">
                          <span>Endpoint:</span>
                          <strong className="text-foreground">shop.customdomain.com</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <strong className="text-foreground font-semibold">Fully integrated</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setWoocommerceConnected(false);
                          alert("WooCommerce integration deactivated.");
                        }}
                        className="w-full py-1.5 rounded-lg border border-red-500/10 hover:bg-red-500/10 text-[10px] font-semibold text-red-400 cursor-pointer"
                      >
                        Disconnect Integration
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">Link your self-hosted WordPress WooCommerce storefront via REST API keys to synchronize items and customer stats.</p>
                      <button
                        onClick={() => {
                          setWoocommerceConnected(true);
                          alert("WooCommerce storefront connected (Mocked sync initialized)!");
                        }}
                        className="w-full py-2 bg-secondary border border-border rounded-lg text-[10px] font-semibold hover:bg-accent/40 transition-all cursor-pointer"
                      >
                        Connect WooCommerce
                      </button>
                    </div>
                  )}
                </div>

                {/* Etsy */}
                <div className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col justify-between gap-4",
                  etsyConnected ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-border bg-card"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-base text-orange-400">
                        E
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-foreground">Etsy</h4>
                        <span className="text-[10px] text-muted-foreground">Handmade Goods Marketplace</span>
                      </div>
                    </div>
                    {etsyConnected ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Connected
                      </span>
                    ) : (
                      <span className="text-[9px] bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded font-bold uppercase">
                        Offline
                      </span>
                    )}
                  </div>

                  {etsyConnected ? (
                    <div className="space-y-3">
                      <div className="text-[10px] text-muted-foreground leading-relaxed space-y-1">
                        <div className="flex justify-between">
                          <span>Listing sync:</span>
                          <strong className="text-foreground">3 Live collections</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Channel:</span>
                          <strong className="text-foreground font-semibold">Etsy Marketplace</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEtsyConnected(false);
                          alert("Etsy connection deactivated.");
                        }}
                        className="w-full py-1.5 rounded-lg border border-red-500/10 hover:bg-red-500/10 text-[10px] font-semibold text-red-400 cursor-pointer"
                      >
                        Disconnect Integration
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">Sync custom catalog listings, review customer feedback scores, and track artisan inventory levels.</p>
                      <button
                        onClick={() => {
                          setEtsyConnected(true);
                          alert("Etsy integration connected (Mocked sync initialized)!");
                        }}
                        className="w-full py-2 bg-secondary border border-border rounded-lg text-[10px] font-semibold hover:bg-accent/40 transition-all cursor-pointer"
                      >
                        Connect Etsy Store
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-sm border-b border-border/40 pb-2">Appearance overrides</h3>
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Default Interface Mode</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 font-medium cursor-pointer">
                      <input type="radio" name="theme" checked={themeMode === "dark"} onChange={() => setThemeMode("dark")} className="accent-primary" />
                      <span>Dark Theme (Premium Minimalist)</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium cursor-pointer">
                      <input type="radio" name="theme" checked={themeMode === "light"} onChange={() => setThemeMode("light")} className="accent-primary" />
                      <span>Light Theme</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
