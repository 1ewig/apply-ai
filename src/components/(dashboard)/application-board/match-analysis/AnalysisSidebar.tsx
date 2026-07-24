'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  CheckCircle2,
  Circle,
  HelpCircle,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import Button from '@/components/ui/Button';
import type { AgentTask } from '@/agent/types';

interface AnalysisSidebarProps {
  overallScore?: number;
  onBackClick?: () => void;
  readinessTier?: 'poor' | 'fair' | 'good' | 'strong' | null;
  taskPlan?: AgentTask[] | null;
}

const getTierStyles = (tier: string) => {
  switch (tier.toLowerCase()) {
    case 'strong':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-emerald-500/5';
    case 'good':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-cyan-500/5';
    case 'fair':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-amber-500/5';
    case 'poor':
    default:
      return 'bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-rose-500/5';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    case 'info':
    default:
      return <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/10 shrink-0" />;
    case 'active':
    case 'working':
      return (
        <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-40 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
        </div>
      );
    case 'needs_input':
      return <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />;
    case 'skipped':
      return <Circle className="w-4 h-4 text-[var(--text-muted)] opacity-50 shrink-0" />;
    case 'pending':
    default:
      return <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />;
  }
};

export default function AnalysisSidebar({
  overallScore = 0,
  onBackClick,
  readinessTier,
  taskPlan = [],
}: AnalysisSidebarProps) {

  return (
    <aside className="w-[22%] border-r border-[var(--border)] flex flex-col bg-[var(--bg-card)]/50 backdrop-blur-sm shrink-0 h-full overflow-hidden select-none">
      {/* Header */}
      <div className="h-[72px] px-4 border-b border-[var(--border)] flex items-center gap-3 bg-[var(--bg-card)]/30 shrink-0">
        <Button variant="ghost" size="sm" onClick={onBackClick} className="rounded-full hover:bg-[var(--border)] transition">
          <ArrowLeft className="w-4 h-4 text-[var(--text-body)]" />
        </Button>
        <div className="w-8 h-8 grid grid-cols-2 gap-1 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--accent-cyan)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-extrabold text-base text-[var(--text-heading)] leading-none">ApplyAI</h1>
          <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase">Workspace</span>
        </div>
      </div>

      {/* Match Score Circular Display */}
      <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-surface)]/20 flex flex-col items-center gap-4 relative overflow-hidden shrink-0">
        {/* Decorative subtle background glow */}
        <div className="absolute w-24 h-24 rounded-full bg-[var(--accent)]/10 filter blur-xl -top-6 -right-6 pointer-events-none" />

        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="41"
              stroke="var(--border)"
              strokeWidth="5"
              fill="transparent"
            />
            {/* Progress track */}
            <motion.circle
              cx="50"
              cy="50"
              r="41"
              stroke="url(#sidebarScoreGradient)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray="257.61"
              initial={{ strokeDashoffset: 257.61 }}
              animate={{ strokeDashoffset: 257.61 - (257.61 * overallScore) / 100 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="sidebarScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-display font-black text-[var(--text-heading)] tracking-tight">
              {overallScore}%
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-extrabold font-sans">
              Overall Match
            </span>
          </div>
        </div>

        {/* Readiness Tier Badge */}
        {readinessTier && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border shadow-sm transition ${getTierStyles(readinessTier)}`}>
            {readinessTier} Match
          </div>
        )}


      </div>

      {/* Main Checklist / Details View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* Checklist Section */}
        {taskPlan && taskPlan.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5 text-left">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> 
              Tailoring Roadmap
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {taskPlan.map((task) => (
                <div 
                  key={task.id} 
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface)]/20 hover:-translate-y-px transition-all duration-200 flex items-start justify-between gap-3"
                >
                  <div className="flex gap-2.5 items-start min-w-0">
                    <span className="mt-0.5 shrink-0">{getSeverityIcon(task.severity)}</span>
                    <div className="min-w-0 text-left">
                      <p className="text-[11px] font-bold text-[var(--text-heading)] leading-tight line-clamp-2" title={task.title}>
                        {task.title}
                      </p>
                      <span className="text-[8px] uppercase tracking-wider text-[var(--text-muted)] mt-1 inline-block font-mono bg-[var(--bg-main)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                        {task.section}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 mt-0.5">
                    {getStatusIcon(task.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-card)]/50 shrink-0">
        <button
          onClick={onBackClick}
          className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] hover:scale-[1.01] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Exit Workspace
        </button>
      </div>
    </aside>
  );
}
