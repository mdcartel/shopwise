'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Sparkles, 
  Send, 
  User, 
  BrainCircuit, 
  HelpCircle, 
  Clock,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { chatMessages as mockChatMessages, suggestedPrompts } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { generateQwenChatResponse } from "@/lib/qwen";

export default function ChatClient() {
  const { data: initialMessages = [] } = useQuery({
    queryKey: ['chat-history'],
    queryFn: () => mockChatMessages,
  });

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: textToSend,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const responseText = await generateQwenChatResponse(textToSend, updatedMessages);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: responseText,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Qwen chat response generation error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: "Sorry Mark, I'm experiencing issues communicating with the Qwen service. Please verify your connection status and API key configuration.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-8.5rem)] rounded-xl border border-border bg-card overflow-hidden shadow-xl"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-foreground">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Owner Co-Pilot Chat</h2>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Synced & Learning</p>
          </div>
        </div>
        
        <button 
          onClick={() => setMessages(mockChatMessages)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:bg-accent/40"
        >
          <RefreshCw size={12} />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg: any) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div 
              key={msg.id}
              className={cn(
                "flex gap-4.5 max-w-3xl",
                isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border",
                isAssistant 
                  ? "bg-primary/15 text-primary-foreground border-primary/25" 
                  : "bg-accent text-foreground border-border"
              )}>
                {isAssistant ? <BrainCircuit size={14} /> : <User size={14} />}
              </div>

              {/* Message box */}
              <div className="space-y-1">
                <div className={cn(
                  "rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                  isAssistant 
                    ? "bg-accent/30 text-foreground border border-border/80 rounded-tl-sm whitespace-pre-line" 
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  {msg.content}
                </div>
                
                <span className={cn(
                  "text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-1",
                  isAssistant ? "justify-start" : "justify-end"
                )}>
                  <Clock size={10} />
                  {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-4.5 max-w-3xl mr-auto animate-pulse">
            <div className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center bg-primary/15 border border-primary/25 text-primary-foreground">
              <BrainCircuit size={14} />
            </div>
            <div className="bg-accent/30 text-muted-foreground border border-border/80 rounded-2xl rounded-tl-sm p-4 text-xs font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              <span>ShopWise is auditing logs...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts / Input area */}
      <div className="p-4 border-t border-border bg-card/40">
        
        {/* Suggested prompts list */}
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
            >
              <span>{prompt}</span>
              <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-background text-sm text-foreground outline-none border border-border rounded-xl px-4 py-2.5 focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
            placeholder="Ask co-pilot about inventory forecast, emails, or decisions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          />
          <button
            onClick={() => handleSend(input)}
            className="h-10 w-10 shrink-0 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
