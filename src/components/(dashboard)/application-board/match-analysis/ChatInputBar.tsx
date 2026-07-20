'use client';

import { Send } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface ChatInputBarProps {
  inputVal: string;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onChipClick: (chipText: string) => void;
}

export default function ChatInputBar({
  inputVal,
  onInputChange,
  onSubmit,
  onChipClick,
}: ChatInputBarProps) {
  return (
    <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)] space-y-3 shrink-0">
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
        <button
          type="button"
          className="px-3 py-1 rounded-full bg-[var(--border)] hover:bg-gray-600 text-[var(--text-body)] shrink-0 transition cursor-pointer select-none"
          onClick={() => onChipClick('Summarize my sections')}
        >
          @sections summary
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded-full bg-[var(--border)] hover:bg-gray-600 text-[var(--text-body)] shrink-0 transition cursor-pointer select-none"
          onClick={() => onChipClick('Show parsing details')}
        >
          /show details
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask agent, type commands or steer edits..."
          className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--accent)] transition text-[var(--text-body)] placeholder:text-[var(--text-muted)]"
          value={inputVal}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <Button
          type="submit"
          size="sm"
          className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-semibold rounded-xl select-none"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}
