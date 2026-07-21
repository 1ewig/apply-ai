'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/stores/useAnalysisStore';

interface ChatSyncMessage {
  id: string;
  role: string;
  content: string;
  type?: string;
  metaJson?: string;
}

function serialize(messages: ChatMessage[]): ChatSyncMessage[] {
  return messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    type: m.type,
    metaJson: m.meta ? JSON.stringify(m.meta) : undefined,
  }));
}

export function useChatSync(
  chatMessages: ChatMessage[],
  jobId: string | undefined,
  onSaveChanges: (id: string, data: Partial<{ chatMessages: ChatSyncMessage[] }>) => Promise<unknown>,
) {
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    lastSavedRef.current = '';
  }, [jobId]);

  useEffect(() => {
    if (chatMessages.length === 0) return;

    const msgs = serialize(chatMessages);
    const serialized = JSON.stringify(msgs);
    if (lastSavedRef.current === serialized) return;

    lastSavedRef.current = serialized;
    onSaveChanges(jobId ?? '', { chatMessages: msgs }).catch((err) => {
      console.error('Failed to sync chat history to Convex:', err);
    });
  }, [chatMessages, jobId, onSaveChanges]);
}
