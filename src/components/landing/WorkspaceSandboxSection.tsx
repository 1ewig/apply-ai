"use client";

import { useReveal } from '@/utils/useReveal';
import SectionHeader from './SectionHeader';
import Card from '../ui/Card';
import { AlignLeft, Sparkles, PencilLine, Eye } from 'lucide-react';

export default function WorkspaceSandboxSection() {
  const ref = useReveal();

  return (
    <section id="sandbox" className="section-gap bg-slate-50 border-t border-slate-100">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Core Workspace"
          title="The Side-by-Side Tailoring Sandbox"
          subtitle="Recruiters filter out fully AI-written resumes. ApplyAI puts you in the driver's seat with a desktop-grade, distraction-free editing environment."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-10">
          {/* Copywriting Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[var(--text-heading)] leading-tight">
                AI is your Co-Pilot.<br />
                You are the Driver.
              </h3>
              <p className="text-sm md:text-base text-[var(--text-body)] leading-relaxed">
                Automated generic black-box resume writers spit out identical robotic templates. ApplyAI combines rapid LLM matching with a professional editor so you retain absolute control over your story.
              </p>
            </div>

            <div className="space-y-4">
              {/* Point 1 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)] flex items-center justify-center shrink-0">
                  <AlignLeft className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[var(--text-heading)]">Zero Tab-Switching</h5>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">Your resume editor, target job posting, and real-time AI suggestions sit inside a unified, three-column panel.</p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <PencilLine className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[var(--text-heading)]">Distraction-Free Monospace</h5>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">Write and tweak bullet points inside a clean monospaced layout built for precise, typographic clarity.</p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[var(--text-heading)]">Granular Bullet Rewrites</h5>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">Instead of rewrites that don't sound like you, get side-by-side phrasing optimizations with exact professional justifications.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive visual Sandbox Mockup */}
          <div className="lg:col-span-7 bg-[#0F172A] rounded-[24px] p-4 md:p-6 shadow-[var(--shadow-float)] border border-slate-800">
            {/* Mock Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">tailoring_sandbox.log</span>
              <div className="w-4 h-4 rounded bg-slate-800" />
            </div>

            {/* Mock Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1: Monospace Editor */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">Column 2 • Monospace Resume</span>
                  <div className="font-mono text-[9px] text-slate-300 space-y-2 leading-relaxed">
                    <p className="text-slate-500">// Tailor experience for Stripe requirements</p>
                    <p>
                      - Maintained clean, well-commented codebases using type-safe React architectures.
                    </p>
                    <p className="border-l-2 border-[var(--color-accent-cyan)] pl-2 text-white bg-[var(--color-accent-cyan)]/5 py-1">
                      - Spearheaded development of modular APIs in TypeScript... <span className="animate-pulse bg-[var(--color-accent-cyan)] text-transparent">|</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-3">
                  <span className="text-[8px] font-mono text-slate-500">Ln 42, Col 12</span>
                </div>
              </div>

              {/* Column 2: AI Suggestions */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between min-h-[220px]">
                <div>
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider block mb-2 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    AI Bullet Rewrite
                  </span>
                  
                  <div className="space-y-3">
                    <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                      <span className="text-[8px] font-bold text-rose-400 block uppercase tracking-wider font-mono">Original</span>
                      <p className="font-mono text-[9px] text-slate-400 mt-1">Maintained codebases using React...</p>
                    </div>

                    <div className="rounded-lg bg-emerald-950/20 p-2 border border-emerald-900/30">
                      <span className="text-[8px] font-bold text-emerald-400 block uppercase tracking-wider font-mono">Suggested</span>
                      <p className="font-mono text-[9px] text-emerald-200 mt-1">Architected type-safe React 19 component trees, slashing bundle sizes by 28%...</p>
                    </div>

                    <p className="text-[9px] text-slate-400 italic leading-snug">
                      <strong>Rationale</strong>: Connects your performance capabilities directly to Stripe's focus on high-speed dashboard metrics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
