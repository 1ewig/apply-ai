import { create } from 'zustand';
import { AgentTask, ResumeEdit } from '@/ai/agent';

const LOADING_PHASES = [
  'Initializing ApplyAI secure analyzer...',
  'Parsing resume structure and key sections...',
  'Extracting technical skills and core competencies...',
  'Analyzing job description requirements...',
  'Calculating semantic match and keywords coverage...',
  'Evaluating score breakdown across all dimensions...',
  'Generating optimized resume bullets and suggestions...',
  'Formulating targeted interview prep strategy...',
  'Building cover letter draft and skill roadmap...',
  'Running ATS compatibility check...',
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?:
    | 'user'
    | 'agent-thinking'
    | 'agent-text'
    | 'diff-card'
    | 'diff-batch'
    | 'tool-call'
    | 'score-update'
    | 'system-event'
    | 'user-input-request';
  meta?: any;
}

interface AnalysisStore {
  // Existing fields
  isLoading: boolean;
  loadingPhase: number;
  phases: string[];
  error: string | null;
  errorTitle: string | null;
  retryAction: (() => void) | null;
  successMessage: string | null;
  successTitle: string | null;
  analyzingJobId: string | null;
  abortController: AbortController | null;

  // New session tailoring fields
  activeSessionId: string | null;
  resumeSections: Record<string, string> | null;
  taskPlan: AgentTask[] | null;
  editHistory: ResumeEdit[];
  rejectedEditsLog: string[];
  overallScore: number;
  readinessTier: 'poor' | 'fair' | 'good' | 'strong' | null;
  parsedResume: { heading: string; content: string }[];
  quickWins: string[];
  blockers: string[];
  chatMessages: ChatMessage[];

  // Existing methods
  startAnalysis: (jobId?: string | null) => void;
  setPhase: (phase: number) => void;
  setError: (error: string | null, retryAction?: (() => void) | null, errorTitle?: string | null) => void;
  clearError: () => void;
  setSuccess: (message: string | null, title?: string | null) => void;
  clearSuccess: () => void;
  finishAnalysis: () => void;
  setAbortController: (controller: AbortController | null) => void;

  // New session tailoring methods
  initializeSession: (
    sessionId: string,
    blueprint: {
      overallScore: number;
      readinessTier: 'poor' | 'fair' | 'good' | 'strong';
      tasks: AgentTask[];
      parsedResume: { heading: string; content: string }[];
      quickWins: string[];
      blockers: string[];
    },
    roleTitle?: string,
    companyName?: string
  ) => void;
  updateTaskStatus: (taskId: string, status: AgentTask['status']) => void;
  proposeEdit: (edit: ResumeEdit) => void;
  acceptEdit: (editId: string) => void;
  rejectEdit: (editId: string) => void;
  modifyEdit: (editId: string, newAfterContent: string) => void;
  undoLastEdit: () => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  // Existing state defaults
  isLoading: false,
  loadingPhase: 0,
  phases: LOADING_PHASES,
  error: null,
  errorTitle: null,
  retryAction: null,
  successMessage: null,
  successTitle: null,
  analyzingJobId: null,
  abortController: null,

  // New state defaults
  activeSessionId: null,
  resumeSections: null,
  taskPlan: null,
  editHistory: [],
  rejectedEditsLog: [],
  overallScore: 0,
  readinessTier: null,
  parsedResume: [],
  quickWins: [],
  blockers: [],
  chatMessages: [],

  // Existing actions
  startAnalysis: (jobId) =>
    set({
      isLoading: true,
      loadingPhase: 0,
      error: null,
      errorTitle: null,
      retryAction: null,
      successMessage: null,
      successTitle: null,
      analyzingJobId: jobId || null,
    }),
  setPhase: (phase) => set({ loadingPhase: phase }),
  setError: (error, retryAction, errorTitle) =>
    set((state) => ({
      isLoading: false,
      error,
      retryAction: retryAction !== undefined ? retryAction : state.retryAction,
      errorTitle: errorTitle !== undefined ? errorTitle : state.errorTitle,
      successMessage: null,
      successTitle: null,
      analyzingJobId: null,
    })),
  clearError: () =>
    set({
      error: null,
      errorTitle: null,
      retryAction: null,
      analyzingJobId: null,
      abortController: null,
    }),
  setSuccess: (message, title) =>
    set({
      successMessage: message,
      successTitle: title || 'Success',
      error: null,
      errorTitle: null,
      retryAction: null,
      analyzingJobId: null,
      abortController: null,
    }),
  clearSuccess: () => set({ successMessage: null, successTitle: null }),
  finishAnalysis: () => set({ isLoading: false, analyzingJobId: null, abortController: null }),
  setAbortController: (controller) => set({ abortController: controller }),

  // New session tailoring actions
  initializeSession: (sessionId, blueprint, roleTitle, companyName) =>
    set({
      activeSessionId: sessionId,
      overallScore: blueprint.overallScore,
      readinessTier: blueprint.readinessTier,
      taskPlan: blueprint.tasks,
      parsedResume: blueprint.parsedResume,
      quickWins: blueprint.quickWins,
      blockers: blueprint.blockers,
      resumeSections: (blueprint.parsedResume || []).reduce((acc, sec) => {
        acc[sec.heading.toUpperCase()] = sec.content;
        return acc;
      }, {} as Record<string, string>),
      editHistory: [],
      rejectedEditsLog: [],
      chatMessages: [
        {
          id: 'welcome-message',
          role: 'assistant' as const,
          content: roleTitle && companyName
            ? `Hi! I've analyzed your resume against the job description for **${roleTitle}** at **${companyName}**.\n\nI have created a tailored tailoring plan for you. Let's get started on the highest priority items.`
            : `Hi! I've analyzed your resume against the job description.\n\nI have created a tailored tailoring plan for you. Let's get started on the highest priority items.`,
          type: 'agent-text' as const,
        },
      ],
    }),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      taskPlan:
        state.taskPlan?.map((t) => (t.id === taskId ? { ...t, status } : t)) || null,
    })),

  proposeEdit: (edit) =>
    set((state) => {
      const msgId = `proposal-${edit.id}`;
      // Check if proposal chat message already exists to avoid duplication
      if (state.chatMessages.some((m) => m.id === msgId)) return {};

      return {
        chatMessages: [
          ...state.chatMessages,
          {
            id: msgId,
            role: 'assistant' as const,
            content: edit.reasoning,
            type: 'diff-card' as const,
            meta: edit,
          },
        ],
      };
    }),

  acceptEdit: (editId) =>
    set((state) => {
      // Find proposal message
      const msgIndex = state.chatMessages.findIndex((m) => m.id === `proposal-${editId}`);
      if (msgIndex === -1) return {};

      const msg = state.chatMessages[msgIndex];
      const edit = msg.meta as ResumeEdit;
      if (!edit || edit.status !== 'proposed') return {};

      const updatedEdit: ResumeEdit = { ...edit, status: 'accepted' };

      // Update resume text sections
      const sections = { ...state.resumeSections };
      const sectionKey = edit.sectionKey;
      if (sections[sectionKey]) {
        // Simple search-and-replace text block modification
        if (sections[sectionKey].includes(edit.beforeContent)) {
          sections[sectionKey] = sections[sectionKey].replace(
            edit.beforeContent,
            edit.afterContent
          );
        } else {
          // Fallback to append if replacement target not found
          sections[sectionKey] = sections[sectionKey] + '\n' + edit.afterContent;
        }
      } else {
        sections[sectionKey] = edit.afterContent;
      }

      // Calculate score increment
      const newScore = Math.min(100, state.overallScore + edit.scoreImpact);

      // Create new chat messages
      const updatedMessages = [...state.chatMessages] as ChatMessage[];
      updatedMessages[msgIndex] = {
        ...msg,
        meta: updatedEdit,
      } as ChatMessage;

      updatedMessages.push({
        id: `system-accept-${editId}`,
        role: 'system' as const,
        content: `Accepted change in ${edit.sectionKey}.`,
        type: 'system-event' as const,
      });

      updatedMessages.push({
        id: `score-up-${editId}`,
        role: 'system' as const,
        content: `${edit.sectionKey.toUpperCase()}: Overall Score ${state.overallScore} → ${newScore}`,
        type: 'score-update' as const,
        meta: { before: state.overallScore, after: newScore },
      });

      return {
        resumeSections: sections,
        overallScore: newScore,
        editHistory: [...state.editHistory, updatedEdit],
        chatMessages: updatedMessages,
      };
    }),

  rejectEdit: (editId) =>
    set((state) => {
      const msgIndex = state.chatMessages.findIndex((m) => m.id === `proposal-${editId}`);
      if (msgIndex === -1) return {};

      const msg = state.chatMessages[msgIndex];
      const edit = msg.meta as ResumeEdit;
      if (!edit || edit.status !== 'proposed') return {};

      const updatedEdit: ResumeEdit = { ...edit, status: 'rejected' };

      const updatedMessages = [...state.chatMessages] as ChatMessage[];
      updatedMessages[msgIndex] = {
        ...msg,
        meta: updatedEdit,
      } as ChatMessage;

      updatedMessages.push({
        id: `system-reject-${editId}`,
        role: 'system' as const,
        content: `Rejected change in ${edit.sectionKey}.`,
        type: 'system-event' as const,
      });

      // Post follow-up acknowledgment from agent
      updatedMessages.push({
        id: `agent-reject-ack-${editId}`,
        role: 'assistant' as const,
        content: `Understood, we won't make that change. Let me know if we should try a different direction or move on to the next item.`,
        type: 'agent-text' as const,
      });

      return {
        rejectedEditsLog: [...state.rejectedEditsLog, editId],
        chatMessages: updatedMessages,
      };
    }),

  modifyEdit: (editId, newAfterContent) =>
    set((state) => {
      const msgIndex = state.chatMessages.findIndex((m) => m.id === `proposal-${editId}`);
      if (msgIndex === -1) return {};

      const msg = state.chatMessages[msgIndex];
      const edit = msg.meta as ResumeEdit;
      if (!edit) return {};

      const updatedEdit: ResumeEdit = { ...edit, afterContent: newAfterContent, status: 'modified' };

      const updatedMessages = [...state.chatMessages] as ChatMessage[];
      updatedMessages[msgIndex] = {
        ...msg,
        meta: updatedEdit,
      } as ChatMessage;

      return {
        chatMessages: updatedMessages,
      };
    }),

  undoLastEdit: () =>
    set((state) => {
      if (state.editHistory.length === 0) return {};

      const lastEdit = state.editHistory[state.editHistory.length - 1];
      const remainingHistory = state.editHistory.slice(0, -1);

      // Revert resume section text changes
      const sections = { ...state.resumeSections };
      const sectionKey = lastEdit.sectionKey;
      if (sections[sectionKey]) {
        if (sections[sectionKey].includes(lastEdit.afterContent)) {
          sections[sectionKey] = sections[sectionKey].replace(
            lastEdit.afterContent,
            lastEdit.beforeContent
          );
        }
      }

      // Revert overall score change
      const newScore = Math.max(0, state.overallScore - lastEdit.scoreImpact);

      // Add undo alert event message to chat history
      const updatedMessages = [
        ...state.chatMessages,
        {
          id: `undo-${lastEdit.id}-${Date.now()}`,
          role: 'system' as const,
          content: `Undone edit: reverted text in ${lastEdit.sectionKey}. Score is now ${newScore}.`,
          type: 'system-event' as const,
        },
      ] as ChatMessage[];

      // Re-propose the edit card as 'proposed' instead of 'accepted'
      const originalProposalIndex = updatedMessages.findIndex(
        (m) => m.id === `proposal-${lastEdit.id}`
      );
      if (originalProposalIndex !== -1) {
        updatedMessages[originalProposalIndex] = {
          ...updatedMessages[originalProposalIndex],
          meta: { ...lastEdit, status: 'proposed' },
        } as ChatMessage;
      }

      return {
        resumeSections: sections,
        overallScore: newScore,
        editHistory: remainingHistory,
        chatMessages: updatedMessages,
      };
    }),

  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        } as ChatMessage,
      ],
    })),

  setChatMessages: (messages) => set({ chatMessages: messages }),
}));
