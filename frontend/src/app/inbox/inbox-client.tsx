'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Inbox as InboxIcon,
  Mail, 
  Trash2, 
  AlertCircle, 
  Check, 
  X, 
  Edit3, 
  CheckCircle2, 
  Sparkles,
  Search,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Clock,
  ChevronLeft
} from "lucide-react";
import { customers, products, emails as mockEmails } from "@/data/mock-data";
import { generateQwenEmailReply, generateQwenEmailCompose } from "@/lib/qwen";
import { cn } from "@/lib/utils";

export default function InboxClient() {
  const { data: initialEmails = [] } = useQuery({
    queryKey: ['emails-list'],
    queryFn: () => mockEmails,
  });

  const [emails, setEmailList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeMobileView, setActiveMobileView] = useState<"list" | "detail">("list");
  const [draftText, setDraftText] = useState("");
  const [search, setSearch] = useState("");

  // AI & Qwen integration states
  const [generating, setGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Outbound composing states
  const [isComposing, setIsComposing] = useState(false);
  const [composeToEmail, setComposeToEmail] = useState("");
  const [composeToName, setComposeToName] = useState("");
  const [customToEmail, setCustomToEmail] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [aiPromptText, setAiPromptText] = useState("");

  const [isOpenToDropdown, setIsOpenToDropdown] = useState(false);
  const [searchTermTo, setSearchTermTo] = useState("");

  const selectedEmail = emails.find(e => e.id === selectedId);

  // Initialize emails on query load
  React.useEffect(() => {
    if (initialEmails.length > 0 && emails.length === 0) {
      setEmailList(initialEmails.map((email: any) => ({
        ...email,
        thread: [
          {
            id: `orig-${email.id}`,
            from: email.from,
            fromEmail: email.fromEmail,
            body: email.body,
            timestamp: email.timestamp,
            isOutbound: false
          },
          ...(email.status === "replied" && email.suggestedReply ? [
            {
              id: `reply-${email.id}`,
              from: "ShopWise Store (You)",
              fromEmail: "mark.robinson@gmail.com",
              body: email.suggestedReply,
              timestamp: new Date(new Date(email.timestamp).getTime() + 1800000),
              isOutbound: true
            }
          ] : [])
        ]
      })));
    }
  }, [initialEmails, emails]);

  // Set default selected ID once emails are loaded
  React.useEffect(() => {
    if (emails.length > 0 && !selectedId && !isComposing) {
      setSelectedId(emails[0].id);
    }
  }, [emails, selectedId, isComposing]);

  // Initialize draft when selecting an email
  React.useEffect(() => {
    if (selectedEmail) {
      setDraftText(selectedEmail.suggestedReply || "");
      setApiError(null);
    }
  }, [selectedId]);

  // Sync unread count to layout side panel badge dynamically
  React.useEffect(() => {
    if (emails.length > 0) {
      const unreadCount = emails.filter(e => e.status === "unread").length;
      localStorage.setItem("shopwise-unread-count", String(unreadCount));
      window.dispatchEvent(new CustomEvent("shopwise-unread-emails", { detail: unreadCount }));
    }
  }, [emails]);

  // Listen for navigation-triggered compose actions (e.g. from Orders delays page)
  React.useEffect(() => {
    const trigger = localStorage.getItem("inbox-trigger-compose");
    if (trigger === "true") {
      setIsComposing(true);
      setComposeToEmail(localStorage.getItem("inbox-compose-to-email") || "");
      setComposeToName(localStorage.getItem("inbox-compose-to-name") || "");
      setComposeSubject(localStorage.getItem("inbox-compose-subject") || "");
      setComposeBody(localStorage.getItem("inbox-compose-body") || "");
      setAiPromptText(localStorage.getItem("inbox-compose-prompt") || "");
      
      // Clear localStorage triggers
      localStorage.removeItem("inbox-trigger-compose");
      localStorage.removeItem("inbox-compose-to-email");
      localStorage.removeItem("inbox-compose-to-name");
      localStorage.removeItem("inbox-compose-subject");
      localStorage.removeItem("inbox-compose-body");
      localStorage.removeItem("inbox-compose-prompt");
    }
  }, []);

  const handleSendReply = () => {
    if (!draftText.trim() || !selectedEmail) return;

    const replyMessage = {
      id: Date.now().toString(),
      from: "ShopWise Store (You)",
      fromEmail: "mark.robinson@gmail.com",
      body: draftText,
      timestamp: new Date(),
      isOutbound: true
    };

    setEmailList(prev => prev.map(e => {
      if (e.id === selectedEmail.id) {
        return {
          ...e,
          status: "replied" as const,
          preview: draftText.substring(0, 60) + "...",
          suggestedReply: "", // Clear suggestion since we replied
          thread: [...(e.thread || []), replyMessage]
        };
      }
      return e;
    }));

    setDraftText("");
    alert("Response sent successfully!");
  };

  const handleGenerateAI = async () => {
    if (!selectedEmail) return;
    setGenerating(true);
    setApiError(null);
    try {
      const currentCustomer = customers.find(
        c => c.email === selectedEmail.fromEmail || c.name === selectedEmail.from
      );
      const reply = await generateQwenEmailReply({
        customerName: selectedEmail.from,
        customerEmail: selectedEmail.fromEmail,
        customerStatus: currentCustomer?.status || "new",
        communicationStyle: currentCustomer?.communicationStyle,
        memorySummary: currentCustomer?.memorySummary,
        emailSubject: selectedEmail.subject,
        emailBody: selectedEmail.body
      });

      setEmailList(prev => prev.map(e => {
        if (e.id === selectedEmail.id) {
          return { ...e, suggestedReply: reply };
        }
        return e;
      }));
      setDraftText(reply);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Failed to generate reply");
    } finally {
      setGenerating(false);
    }
  };

  // Derived unique suppliers from products catalog with generated emails
  const suppliers = Array.from(new Set(products.map(p => p.supplier)))
    .filter(Boolean)
    .map((sup, idx) => ({
      id: `sup-${idx}`,
      name: sup,
      email: sup.toLowerCase().replace(/[^a-z0-9]/g, "") + "@supplier.com"
    }));

  const filteredCustomersDropdown = customers.filter(c =>
    c.name.toLowerCase().includes(searchTermTo.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTermTo.toLowerCase())
  );

  const filteredSuppliersDropdown = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTermTo.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTermTo.toLowerCase())
  );

  const handleAIComposeGenerate = async () => {
    const targetEmail = composeToEmail === "custom" ? customToEmail : composeToEmail;
    const targetName = composeToEmail === "custom" 
      ? (composeToName || "Recipient") 
      : (customers.find(c => c.email === composeToEmail)?.name || suppliers.find(s => s.email === composeToEmail)?.name || "Recipient");
      
    if (!targetEmail || !aiPromptText) {
      alert("Please specify a recipient and enter an AI prompt description.");
      return;
    }
    setGenerating(true);
    setApiError(null);
    try {
      const currentCustomer = customers.find(c => c.email === targetEmail);
      
      const reply = await generateQwenEmailCompose({
        customerName: targetName,
        customerEmail: targetEmail,
        customerContext: currentCustomer?.memorySummary,
        prompt: aiPromptText
      });

      setComposeBody(reply);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Failed to generate custom email");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendOutbound = () => {
    const targetEmail = composeToEmail === "custom" ? customToEmail : composeToEmail;
    const resolvedName = composeToEmail === "custom"
      ? (composeToName || "Recipient")
      : (customers.find(c => c.email === composeToEmail)?.name || suppliers.find(s => s.email === composeToEmail)?.name || "Recipient");

    if (!targetEmail || !composeBody) {
      alert("Recipient and body cannot be empty.");
      return;
    }

    const newEmail = {
      id: Date.now().toString(),
      from: "ShopWise Store (You)",
      fromEmail: "mark.robinson@gmail.com",
      to: resolvedName,
      toEmail: targetEmail,
      subject: composeSubject || "(No Subject)",
      body: composeBody,
      preview: composeBody.substring(0, 60) + "...",
      timestamp: new Date(),
      status: "sent" as const,
      priority: "medium" as const,
      avatar: resolvedName.substring(0, 2).toUpperCase(),
      suggestedReply: "",
      thread: [
        {
          id: `outbound-${Date.now()}`,
          from: "ShopWise Store (You)",
          fromEmail: "mark.robinson@gmail.com",
          body: composeBody,
          timestamp: new Date(),
          isOutbound: true
        }
      ]
    };

    setEmailList(prev => [newEmail, ...prev]);
    setIsComposing(false);
    setSelectedId(newEmail.id);
    alert(`Email successfully sent to ${resolvedName} (${targetEmail})!`);

    // Reset compose states
    setComposeToEmail("");
    setComposeToName("");
    setCustomToEmail("");
    setComposeSubject("");
    setComposeBody("");
    setAiPromptText("");
  };

  const filteredEmails = emails.filter(e => 
    e.from.toLowerCase().includes(search.toLowerCase()) || 
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8.5rem)] rounded-xl border border-border bg-card overflow-hidden shadow-xl"
    >
      
      {/* ─── EMAIL LIST SIDEBAR (1/3 width) ─── */}
      <div className={cn(
        "flex flex-col border-r border-border h-full bg-card/60 overflow-hidden min-h-0",
        activeMobileView === "detail" ? "hidden lg:flex" : "flex"
      )}>
        
        {/* Search */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <InboxIcon size={16} className="text-muted-foreground" />
              <h2 className="font-semibold text-sm">Inbox</h2>
              <span className="text-[10px] bg-primary/20 text-foreground px-2 py-0.5 rounded font-bold uppercase">
                {emails.filter(e => e.status === "unread").length} unread
              </span>
            </div>
            <button
              onClick={() => {
                setIsComposing(true);
                setSelectedId("");
                setActiveMobileView("detail");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold text-[10px] uppercase cursor-pointer"
            >
              <Plus size={11} />
              <span>Compose</span>
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs">
            <Search size={14} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search sender, subject..." 
              className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/40">
          {filteredEmails.map((email) => {
            const isSelected = email.id === selectedId;
            const isUnread = email.status === "unread";
            return (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedId(email.id);
                  setIsComposing(false);
                  setActiveMobileView("detail");
                  if (email.status === "unread") {
                    setEmailList(prev => prev.map(e => {
                      if (e.id === email.id) {
                        return { ...e, status: "read" as const };
                      }
                      return e;
                    }));
                  }
                }}
                className={cn(
                  "w-full text-left p-4 hover:bg-accent/40 transition-colors flex gap-3 relative",
                  isSelected ? "bg-accent/70" : ""
                )}
              >
                {/* Unread side pill */}
                {isUnread && (
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-1 rounded bg-primary" />
                )}

                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-border flex items-center justify-center font-bold text-xs shrink-0">
                  {email.avatar}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={cn(
                        "truncate transition-all duration-150",
                        isUnread ? "font-bold text-foreground" : "font-normal text-muted-foreground"
                      )}>
                        {email.from}
                      </span>
                      {isUnread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_#3b82f6] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">
                      {new Date(email.timestamp).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs truncate transition-all duration-150",
                    isUnread ? "font-semibold text-foreground/95" : "font-normal text-muted-foreground/75"
                  )}>
                    {email.subject}
                  </p>
                  <p className={cn(
                    "text-[11px] truncate mt-0.5 transition-all duration-150",
                    isUnread ? "font-medium text-muted-foreground" : "font-normal text-muted-foreground/50"
                  )}>
                    {email.preview}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {email.priority === "high" && email.status !== "replied" && (
                      <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                        High
                      </span>
                    )}
                    {email.status === "sent" && (
                      <span className="text-[9px] bg-blue-500/15 text-blue-400 border border-blue-500/25 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                        <Send size={10} />
                        Sent
                      </span>
                    )}
                    {email.status === "replied" && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Replied
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* ─── EMAIL VIEWPORT (2/3 width) ─── */}
      <div className={cn(
        "lg:col-span-2 flex flex-col h-full bg-card overflow-hidden min-h-0",
        activeMobileView === "list" ? "hidden lg:flex" : "flex"
      )}>
        {isComposing ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => {
                  setIsComposing(false);
                  if (emails.length > 0) {
                    setSelectedId(emails[0].id);
                  }
                  setActiveMobileView("list");
                }}
                className="flex lg:hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer self-start mb-2"
              >
                <ChevronLeft size={16} />
                <span>Back to Inbox</span>
              </button>
              <div>
                <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">New Outbound Message</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Compose a custom message or use Qwen AI to draft one using customer data context.</p>
              </div>
            </div>

            {/* Inputs & Form area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* To Recipient Custom Search Select */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">To (Recipient)</label>
                
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsOpenToDropdown(!isOpenToDropdown)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary/50 flex items-center justify-between cursor-pointer text-left"
                >
                  {composeToEmail ? (
                    <span className="font-semibold">
                      {composeToEmail === "custom" 
                        ? `${composeToName || "Custom Address"} (${customToEmail || "Type Email..."})`
                        : `${composeToName} (${composeToEmail})`}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select a Recipient (Customer, Supplier, etc.)</span>
                  )}
                  <span className="text-[10px] text-muted-foreground">▼</span>
                </button>

                {/* Dropdown Options List */}
                {isOpenToDropdown && (
                  <>
                    {/* Backdrop to close */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsOpenToDropdown(false)}
                    />
                    
                    <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-20 max-h-[250px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* Search box inside dropdown */}
                      <div className="p-2 border-b border-border bg-accent/25 flex items-center gap-1.5 text-xs">
                        <Search size={12} className="text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search customers or suppliers..."
                          value={searchTermTo}
                          onChange={(e) => setSearchTermTo(e.target.value)}
                          className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground/60 w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Scrollable list */}
                      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 text-xs">
                        {/* Custom option */}
                        <button
                          type="button"
                          onClick={() => {
                            setComposeToEmail("custom");
                            setComposeToName("");
                            setCustomToEmail("");
                            setIsOpenToDropdown(false);
                            setSearchTermTo("");
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-accent flex items-center gap-2 cursor-pointer font-semibold text-primary bg-primary/5 border border-primary/15"
                        >
                          <Mail size={12} className="text-primary-foreground" />
                          <span>+ Enter Custom Address...</span>
                        </button>

                        {/* CRM Customers */}
                        {filteredCustomersDropdown.length > 0 && (
                          <div className="space-y-1">
                            <div className="px-2.5 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-accent/15 rounded">
                              CRM Customers
                            </div>
                            {filteredCustomersDropdown.map(c => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setComposeToEmail(c.email);
                                  setComposeToName(c.name);
                                  setIsOpenToDropdown(false);
                                  setSearchTermTo("");
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-accent flex items-center justify-between cursor-pointer"
                              >
                                <span className="font-semibold text-foreground">{c.name}</span>
                                <span className="text-[10px] text-muted-foreground">{c.email}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Suppliers */}
                        {filteredSuppliersDropdown.length > 0 && (
                          <div className="space-y-1">
                            <div className="px-2.5 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-accent/15 rounded">
                              Suppliers
                            </div>
                            {filteredSuppliersDropdown.map(s => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setComposeToEmail(s.email);
                                  setComposeToName(s.name);
                                  setIsOpenToDropdown(false);
                                  setSearchTermTo("");
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-accent flex items-center justify-between cursor-pointer"
                              >
                                <span className="font-semibold text-foreground">{s.name}</span>
                                <span className="text-[10px] text-muted-foreground">{s.email}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {filteredCustomersDropdown.length === 0 && filteredSuppliersDropdown.length === 0 && (
                          <div className="text-center p-3 text-[11px] text-muted-foreground">
                            No matching contacts found
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {composeToEmail === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Recipient Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={composeToName}
                      onChange={(e) => setComposeToName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Recipient Email</label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={customToEmail}
                      onChange={(e) => setCustomToEmail(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Subject</label>
                <input
                  type="text"
                  placeholder="Enter email subject line..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary/50"
                />
              </div>

              {/* AI Draft Assist Panel */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/[0.01] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary-foreground uppercase flex items-center gap-1">
                    <Sparkles size={11} className="animate-pulse" /> Qwen AI Outbound Draft Co-Pilot
                  </span>
                  <span className="text-[9px] bg-accent border border-border px-1.5 py-0.5 rounded font-medium text-muted-foreground uppercase">
                    API Helper
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">Describe what you want to communicate, and Qwen will generate a customized draft incorporating customer CRM memory vectors.</p>
                <div className="flex gap-2">
                  <input
                     type="text"
                     placeholder="e.g. Write a win-back email offering a 15% discount for their birthday"
                     value={aiPromptText}
                     onChange={(e) => setAiPromptText(e.target.value)}
                     className="flex-1 p-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary/40 placeholder:text-muted-foreground/60"
                  />
                  <button
                     type="button"
                     onClick={handleAIComposeGenerate}
                     disabled={generating || !composeToEmail}
                     className="px-3 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    <span>Generate Draft</span>
                  </button>
                </div>
                {apiError && (
                  <p className="text-[10px] text-red-400 font-semibold mt-1">Error: {apiError}</p>
                )}
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Message Body</label>
                <textarea
                  placeholder="Write your email content here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full min-h-[180px] p-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary/50 leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-border bg-accent/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsComposing(false);
                  if (emails.length > 0) {
                    setSelectedId(emails[0].id);
                  }
                  setActiveMobileView("list");
                }}
                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent/40 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendOutbound}
                disabled={!composeBody.trim() || (!composeToEmail && composeToEmail !== "custom")}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        ) : selectedEmail ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header details */}
            <div className="p-6 border-b border-border bg-card/40 flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => setActiveMobileView("list")}
                className="flex lg:hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer self-start"
              >
                <ChevronLeft size={16} />
                <span>Back to Inbox</span>
              </button>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-base text-foreground">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {selectedEmail.status === "sent" ? (
                      <>
                        <span className="font-semibold text-foreground">To: {selectedEmail.to}</span>
                        <span>&lt;{selectedEmail.toEmail}&gt;</span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-foreground">{selectedEmail.from}</span>
                        <span>&lt;{selectedEmail.fromEmail}&gt;</span>
                      </>
                    )}
                    <span>•</span>
                    <span>
                      {selectedEmail.status === "sent" ? "Sent" : "Received"}{" "}
                      {new Date(selectedEmail.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
                
                {selectedEmail.status !== "replied" && (
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                    selectedEmail.priority === "high" ? "bg-red-500/15 text-red-400 border-red-500/20" : "bg-muted text-muted-foreground"
                  )}>
                    {selectedEmail.priority} priority
                  </span>
                )}
              </div>
            </div>

            {/* Email Message Chat History Feed */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 bg-accent/10 border-b border-border flex flex-col">
              {selectedEmail.thread?.map((msg: any) => {
                const isOutbound = msg.isOutbound;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-200",
                      isOutbound ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none",
                      isOutbound 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-primary/10 border border-border text-foreground"
                    )}>
                      {isOutbound ? "ME" : selectedEmail.avatar}
                    </div>
                    {/* Bubble */}
                    <div className="space-y-1">
                      <div className={cn("flex items-center gap-1.5 text-[10px] text-muted-foreground", isOutbound ? "justify-end" : "justify-start")}>
                        <span className="font-semibold text-foreground/70">{msg.from}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={cn(
                        "rounded-2xl p-4 text-xs leading-relaxed shadow-sm whitespace-pre-line",
                        isOutbound 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-card border border-border text-foreground rounded-tl-sm"
                      )}>
                        {msg.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Always Visible Text Composer & AI Draft Assist */}
            <div className="p-6 bg-accent/25 space-y-4 border-t border-border">
              
              {/* Optional AI suggestion banner */}
              {selectedEmail.suggestedReply && !draftText.trim() && selectedEmail.status !== "replied" && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles size={14} className="text-primary-foreground animate-pulse" />
                    <span>AI Co-Pilot has generated a response draft for this inquiry.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraftText(selectedEmail.suggestedReply)}
                    className="text-[10px] font-bold text-primary hover:underline uppercase cursor-pointer"
                  >
                    Insert Draft
                  </button>
                </div>
              )}

              {/* Loader or Error */}
              {generating && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded bg-card border border-border">
                  <RefreshCw size={12} className="animate-spin text-primary-foreground" />
                  <span>Drafting response with Qwen AI...</span>
                </div>
              )}
              {apiError && (
                <div className="text-xs text-red-400 p-2 rounded bg-red-500/5 border border-red-500/10">
                  Failed to generate draft: {apiError}
                </div>
              )}

              {/* Composer Input Area */}
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card overflow-hidden focus-within:border-primary/50 transition-colors">
                  <textarea
                    className="w-full min-h-[90px] p-4 bg-transparent outline-none text-xs leading-relaxed text-foreground resize-none"
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    placeholder={
                      selectedEmail.status === "sent"
                        ? "Type a follow-up email..."
                        : "Type your reply to this customer..."
                    }
                  />
                  <div className="flex items-center justify-between px-4 py-2 bg-accent/30 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span>Drafting Outbox Reply</span>
                    <span>{draftText.length} characters</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generating}
                    className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent/40 text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={13} className="text-primary-foreground animate-pulse" />
                    <span>{selectedEmail.suggestedReply ? "Regenerate with AI" : "Ask Co-Pilot to Draft"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {draftText.trim() && (
                      <button
                        type="button"
                        onClick={() => setDraftText("")}
                        className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent/40 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={!draftText.trim() || generating}
                      className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Mail size={40} className="text-muted-foreground opacity-30 mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Select an email conversation to audit</p>
          </div>
        )}
      </div>

    </motion.div>
  );
}
