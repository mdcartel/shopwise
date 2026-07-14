import React from "react";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  BrainCircuit, 
  HelpCircle, 
  Check, 
  X, 
  Eye, 
  Zap,
  ArrowRight,
  ShieldCheck,
  Pencil,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── CONFIDENCE BADGE ───
interface ConfidenceBadgeProps {
  score: number;
}
export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  // Color based on confidence levels
  const colorClass = 
    score >= 90 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" :
    score >= 80 ? "text-blue-400 border-blue-500/20 bg-blue-500/10" :
    "text-amber-400 border-amber-500/20 bg-amber-500/10";

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide uppercase",
      colorClass
    )}>
      <Sparkles size={10} className="animate-pulse" />
      <span>{score}% Match</span>
    </div>
  );
}

// ─── AI RECOMMENDATION CARD ───
interface AIRecommendationCardProps {
  title: string;
  description: string;
  confidence: number;
  actionLabel: string;
  onAction?: () => void;
  type?: "warning" | "opportunity" | "info" | "urgent";
}
export function AIRecommendationCard({
  title,
  description,
  confidence,
  actionLabel,
  onAction,
  type = "opportunity"
}: AIRecommendationCardProps) {
  const borderHighlight = 
    type === "warning" || type === "urgent" 
      ? "border-amber-500/30 hover:border-amber-500/50 shadow-amber-500/[0.02]"
      : "border-primary/30 hover:border-primary/50 shadow-primary/[0.02]";

  return (
    <div className={cn(
      "relative rounded-xl border bg-card p-5 transition-all duration-300 shadow-lg group hover:shadow-xl hover:-translate-y-0.5",
      borderHighlight
    )}>
      {/* Background radial gradient accent */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-bl-full blur-2xl pointer-events-none group-hover:bg-primary/8 transition-all" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {type === "warning" || type === "urgent" ? (
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <AlertTriangle size={14} />
            </div>
          ) : (
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary-foreground border border-primary/20">
              <Sparkles size={14} className="text-white" />
            </div>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {type === "warning" || type === "urgent" ? "Risk Mitigation" : "AI Opportunity"}
          </span>
        </div>
        <ConfidenceBadge score={confidence} />
      </div>

      <h4 className="font-semibold text-sm text-foreground mt-3 group-hover:text-primary transition-colors">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
        {description}
      </p>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
        <button 
          onClick={onAction}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          <span>{actionLabel}</span>
          <ArrowRight size={12} />
        </button>
        <button className="flex items-center justify-center h-8 px-2.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground text-xs font-medium hover:bg-accent/40">
          <HelpCircle size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── MEMORY CARD ───
interface MemoryCardProps {
  title: string;
  summary: string;
  importance: "critical" | "high" | "medium" | "low";
  lastUsed: string;
  createdAt: string;
  tags: string[];
  category: string;
  onEdit?: () => void;
  onDelete?: () => void;
}
export function MemoryCard({
  title,
  summary,
  importance,
  lastUsed,
  createdAt,
  tags,
  category,
  onEdit,
  onDelete
}: MemoryCardProps) {
  return (
    <div className="group relative rounded-xl border border-border bg-card/40 p-5 hover:bg-card/70 hover:border-border/80 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
            <BrainCircuit size={13} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
            {category} Memory
          </span>
        </div>
        <span className={cn(
          "text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wide uppercase",
          importance === "critical" ? "bg-red-500/10 text-red-400 border-red-500/20" :
          importance === "high" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
          "bg-muted text-muted-foreground border-border"
        )}>
          {importance}
        </span>
      </div>

      <h4 className="font-semibold text-sm mt-3">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{summary}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3.5">
        {tags.map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-accent/40 text-muted-foreground border border-border/40">
            #{t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground/60 font-medium">
        <div className="flex flex-col">
          <span>Created {createdAt}</span>
          <span className="text-[9px] text-muted-foreground/45 mt-0.5">Last query: {lastUsed}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button 
              onClick={onEdit} 
              title="Modify Context"
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <Pencil size={11} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={onDelete} 
              title="Delete Context"
              className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DECISION CARD ───
interface DecisionCardProps {
  decision: string;
  reasoning: string;
  evidence: string[];
  confidence: number;
  status: "executed" | "pending" | "overridden" | "rejected";
  timestamp: string;
  category: string;
  impact?: string;
  onApprove?: () => void;
  onReject?: () => void;
}
export function DecisionCard({
  decision,
  reasoning,
  evidence,
  confidence,
  status,
  timestamp,
  category,
  impact,
  onApprove,
  onReject
}: DecisionCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="rounded-xl border border-border bg-card/60 overflow-hidden hover:border-border/80 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <ShieldCheck size={13} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {category}
            </span>
          </div>
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wide uppercase shrink-0",
            status === "executed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
            status === "pending" ? "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse" :
            "bg-red-500/10 text-red-400 border-red-500/20"
          )}>
            {status}
          </span>
        </div>

        <h4 className="font-semibold text-sm mt-3">{decision}</h4>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{reasoning}</p>

        {impact && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
            <Zap size={12} className="shrink-0" />
            <span className="font-medium">Impact: {impact}</span>
          </div>
        )}

        {/* Expandable Evidence */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/40 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span>Auditable Evidence & Insights</span>
              <ConfidenceBadge score={confidence} />
            </h5>
            <ul className="space-y-1.5 pl-4 list-disc text-[11px] text-muted-foreground leading-relaxed">
              {evidence.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
          <span className="text-[10px] text-muted-foreground/60 font-medium">{timestamp}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded hover:bg-accent/40 flex items-center gap-1 font-medium"
            >
              <Eye size={12} />
              <span>{expanded ? "Hide Audit" : "Audit Reason"}</span>
            </button>

            {status === "pending" && (
              <>
                <button 
                  onClick={onReject}
                  className="p-1 rounded-md border border-border hover:bg-red-500/10 hover:text-red-400 text-muted-foreground transition-all"
                >
                  <X size={13} />
                </button>
                <button 
                  onClick={onApprove}
                  className="p-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-all"
                >
                  <Check size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OPPORTUNITY CARD ───
interface OpportunityCardProps {
  title: string;
  description: string;
  confidence: number;
  expectedImpact: string;
  recommendedAction: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "approved" | "dismissed";
  onApprove?: () => void;
  onDismiss?: () => void;
}
export function OpportunityCard({
  title,
  description,
  confidence,
  expectedImpact,
  recommendedAction,
  priority,
  status,
  onApprove,
  onDismiss
}: OpportunityCardProps) {
  const badgeColors = 
    priority === "critical" ? "bg-red-500/15 text-red-400 border-red-500/20" :
    priority === "high" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" :
    "bg-muted text-muted-foreground border-border";

  return (
    <div className="rounded-xl border border-border bg-card/40 hover:border-border/80 transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wide uppercase",
            badgeColors
          )}>
            {priority} Priority
          </span>
          <ConfidenceBadge score={confidence} />
        </div>

        <h4 className="font-semibold text-sm mt-3">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>

        {/* Expected Impact box */}
        <div className="mt-4 p-3 rounded-lg bg-primary/[0.03] border border-primary/20 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium">Expected Impact</span>
            <span className="text-foreground font-semibold">{expectedImpact}</span>
          </div>
          <div className="text-[11px] text-muted-foreground border-t border-border/30 pt-1.5">
            <span className="font-semibold text-foreground/80">Rec Action:</span> {recommendedAction}
          </div>
        </div>

        {status === "pending" ? (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
            <button 
              onClick={onDismiss}
              className="flex-1 text-xs font-semibold py-1.5 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-all"
            >
              Dismiss
            </button>
            <button 
              onClick={onApprove}
              className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              Approve & Deploy
            </button>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-border/40 text-center text-xs font-semibold text-muted-foreground bg-accent/25 py-1 rounded">
            Opportunity {status}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BUSINESS INSIGHT CARD ───
interface BusinessInsightCardProps {
  title: string;
  value: string;
  trend: number;
  description: string;
}
export function BusinessInsightCard({
  title,
  value,
  trend,
  description
}: BusinessInsightCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 relative overflow-hidden group hover:border-border/80 transition-all">
      <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-full pointer-events-none" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
      <div className="flex items-baseline gap-2 mt-1.5">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        <span className={cn(
          "text-xs font-bold",
          trend >= 0 ? "text-emerald-400" : "text-red-400"
        )}>
          {trend >= 0 ? "+" : ""}{trend}%
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
    </div>
  );
}
