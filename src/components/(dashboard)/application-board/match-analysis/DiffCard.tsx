'use client';

import { useState, useEffect } from 'react';
import type { ResumeEdit } from '@/agent/types';
import Button from '@/components/ui/Button';

interface DiffCardProps {
  edit: ResumeEdit;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string, content: string) => void;
}

export default function DiffCard({ edit, onAccept, onReject, onModify }: DiffCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(edit.afterContent);

  useEffect(() => {
    setText(edit.afterContent);
  }, [edit.afterContent]);

  return (
    <div className="w-full max-w-md border border-[var(--border)] rounded-2xl bg-[var(--bg-surface)]/10 overflow-hidden backdrop-blur-md text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-fade-up select-none">
      <div className="px-4 py-2.5 bg-[var(--bg-card)]/70 border-b border-[var(--border)] flex justify-between items-center text-xs">
        <span className="font-extrabold uppercase tracking-widest text-[var(--accent-cyan)] font-mono text-[9px]">
          {edit.sectionKey} section tweak
        </span>
        {edit.scoreImpact > 0 && edit.status !== 'accepted' && edit.status !== 'rejected' && (
          <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25 text-[9px] tracking-wider uppercase">
            +{edit.scoreImpact}% Match Impact
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {edit.reasoning && (
          <p className="text-xs text-[var(--text-body)] leading-relaxed italic">
            {edit.reasoning}
          </p>
        )}

        <div className="space-y-2">
          {edit.beforeContent && (
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs">
              <span className="text-[9px] uppercase tracking-wider text-rose-400/80 font-extrabold block mb-1">Original Text</span>
              <p className="text-rose-300 line-through whitespace-pre-wrap leading-relaxed font-mono text-[11px]">{edit.beforeContent}</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400/80 font-extrabold block mb-1">Tailored Suggestion</span>
            {isEditing ? (
              <textarea
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-2.5 text-xs font-mono text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] transition h-28 resize-none custom-scrollbar"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <p className="text-emerald-300 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">{edit.afterContent}</p>
            )}
          </div>
        </div>
      </div>

      {edit.status === 'proposed' || edit.status === 'modified' ? (
        <div className="px-4 py-3 bg-[var(--bg-card)]/60 border-t border-[var(--border)] flex justify-between items-center gap-2">
          {isEditing ? (
            <div className="flex gap-2 w-full justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-bold text-white select-none cursor-pointer"
                  onClick={() => {
                    onModify(edit.id, text);
                    setIsEditing(false);
                  }}
                >
                  Save Tweaks
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[var(--text-muted)] hover:text-white font-bold select-none cursor-pointer"
                  onClick={() => {
                    setText(edit.afterContent);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 font-bold text-white select-none cursor-pointer"
                  onClick={() => onAccept(edit.id)}
                >
                  Approve Tweak
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-[var(--border)] text-[var(--text-body)] hover:text-white font-bold select-none cursor-pointer"
                  onClick={() => onReject(edit.id)}
                >
                  Reject
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] font-bold select-none cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Modify Suggestion
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="px-4 py-2.5 bg-[var(--bg-card)]/40 border-t border-[var(--border)] text-xs text-[var(--text-muted)] flex items-center justify-between font-mono">
          <span>Outcome status:</span>
          <span className={edit.status === 'accepted' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {edit.status === 'accepted' ? 'Approved & Incorporated' : 'Rejected'}
          </span>
        </div>
      )}
    </div>
  );
}
