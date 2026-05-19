import { Bot, User, Sparkles } from 'lucide-react';

export default function InterviewPrepPreview() {
  return (
    <div className="w-full p-4 space-y-3">
      <div className="flex gap-2 items-start">
        <div className="w-6 h-6 rounded-lg bg-[var(--accent-cyan)]/15 flex items-center justify-center shrink-0">
          <Bot className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
        </div>
        <div className="bg-white rounded-r-xl rounded-bl-xl p-2.5 border border-[var(--border)] max-w-[85%] shadow-sm">
          <p className="text-[9px] font-bold text-[var(--text-heading)]">AI Coach</p>
          <p className="text-[10px] text-[var(--text-body)] mt-0.5 leading-snug">
            "Tell me about a time you handled a tight deadline."
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-start justify-end">
        <div className="bg-[var(--accent)]/5 rounded-l-xl rounded-br-xl p-2.5 border border-[var(--accent)]/10 max-w-[85%] text-right shadow-sm">
          <p className="text-[9px] font-bold text-[var(--accent)]">You</p>
          <p className="text-[10px] text-[var(--text-body)] mt-0.5 leading-snug">
            "I reprioritized the backlog and shipped MVP..."
          </p>
        </div>
        <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-[var(--accent)]" />
        </div>
      </div>
      <div className="bg-[#ECFDF5] rounded-lg p-2.5 border border-[#A7F3D0] text-[9px] text-[#065F46] flex gap-1.5 items-center">
        <Sparkles className="w-3.5 h-3.5 text-[#10B981] shrink-0 animate-pulse" />
        <span><strong>Score: 92%</strong> — Excellent focus on outcomes, but mention metrics.</span>
      </div>
    </div>
  );
}
