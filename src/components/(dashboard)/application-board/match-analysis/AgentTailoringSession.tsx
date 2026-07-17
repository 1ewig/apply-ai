'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Undo, 
  Check, 
  X, 
  MessageSquare, 
  FileText, 
  ArrowLeft,
  ChevronRight,
  Pin,
  PinOff,
  User,
  Compass,
  Zap,
  Flame,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAnalysisStore, ChatMessage } from '@/stores/useAnalysisStore';
import Button from '@/components/ui/Button';

interface AgentTailoringSessionProps {
  onBackClick: () => void;
}

export default function AgentTailoringSession({ onBackClick }: AgentTailoringSessionProps) {
  const {
    taskPlan,
    overallScore,
    chatMessages,
    editHistory,
    rejectedEditsLog,
    resumeSections,
    jdExtract,
    updateTaskStatus,
    acceptEdit,
    rejectEdit,
    undoLastEdit,
    addChatMessage,
  } = useAnalysisStore();

  const [inputVal, setInputVal] = useState('');
  const [isRightPanelPinned, setIsRightPanelPinned] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'resume' | 'jd'>('resume');

  // Command handlers
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    // Log the user message
    addChatMessage({
      role: 'user',
      content: inputVal,
      type: 'user',
    });

    const val = inputVal.trim();
    setInputVal('');

    // Simulate basic commands
    setTimeout(() => {
      if (val.startsWith('/')) {
        addChatMessage({
          role: 'system',
          content: `Command Executed: ${val}`,
          type: 'system-event',
        });
      } else {
        // Simple agent response simulation
        addChatMessage({
          role: 'assistant',
          content: `I received your guidance: "${val}". Let's incorporate that into the next resume optimization pass.`,
          type: 'agent-text',
        });
      }
    }, 1000);
  };

  const handleChipClick = (text: string) => {
    addChatMessage({
      role: 'user',
      content: text,
      type: 'user',
    });
    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: `Analyzing this input details. Let's look at the sections where this fits best.`,
        type: 'agent-text',
      });
    }, 800);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-surface)] text-[var(--text-body)]">
      {/* 1. LEFT SIDEBAR (22% width) - Task & Score List */}
      <aside className="w-[22%] border-r border-[var(--border)] flex flex-col bg-opacity-30 bg-[var(--bg-dark-gray)]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBackClick} className="rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="font-bold text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-cyan)]">APPLYAI TAILORING</h2>
            <p className="text-xs text-[var(--text-muted)]">Agentic Session</p>
          </div>
        </div>

        {/* Match Score Display */}
        <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Overall Match</span>
            <span className="text-xs font-bold text-[var(--accent-yellow)]">{overallScore}%</span>
          </div>
          <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-cyan)] to-[var(--accent-yellow)]"
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-[var(--text-muted)]">
            <span>Edits: {editHistory.length} applied</span>
            <span>Rejected: {rejectedEditsLog.length}</span>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] px-2 mb-2 tracking-wider uppercase">Tailoring Tasks</h3>
          {taskPlan && taskPlan.length > 0 ? (
            taskPlan.map((task) => (
              <div 
                key={task.id} 
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  task.status === 'active' 
                    ? 'border-[var(--accent)] bg-[var(--accent)] bg-opacity-5' 
                    : 'border-[var(--border)] hover:border-gray-500'
                }`}
                onClick={() => updateTaskStatus(task.id, task.status === 'active' ? 'completed' : 'active')}
              >
                <div className="flex items-start gap-2">
                  {/* Status Bullet */}
                  <div className="mt-1">
                    {task.status === 'completed' && <Check className="w-4 h-4 text-green-500" />}
                    {task.status === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse mt-1" />}
                    {task.status === 'pending' && <div className="w-2.5 h-2.5 rounded-full border border-gray-400 mt-1" />}
                    {task.status === 'needs_input' && <AlertTriangle className="w-4 h-4 text-[var(--accent-yellow)]" />}
                    {task.status === 'skipped' && <div className="w-2.5 h-2.5 bg-gray-600 rounded-full mt-1" />}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`text-xs font-medium ${task.status === 'completed' ? 'line-through text-[var(--text-muted)]' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[var(--text-muted)] capitalize">{task.section}</span>
                      <span className="text-[10px] bg-[var(--border)] px-1.5 py-0.5 rounded text-[var(--text-muted)]">
                        {task.estimatedClicks} clicks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              Generating active task list...
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-card)]">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs flex items-center justify-center gap-1.5" 
            onClick={undoLastEdit}
            disabled={editHistory.length === 0}
          >
            <Undo className="w-3.5 h-3.5" /> Undo Last Edit
          </Button>
        </div>
      </aside>

      {/* 2. CENTER PANEL (50-72% width based on right panel state) */}
      <section className="flex-1 flex flex-col bg-[var(--bg-main)]">
        {/* Active Task Info */}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface)] flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" /> 
              {taskPlan?.find(t => t.status === 'active')?.title || 'No active task selected'}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Steer the agent edits below or type commands directly.
            </p>
          </div>
        </div>

        {/* Chat Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.role === 'assistant' 
                    ? 'bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white' 
                    : msg.role === 'system'
                    ? 'bg-gray-800 text-[var(--text-muted)]'
                    : 'bg-[var(--accent-yellow)] text-gray-950'
                }`}>
                  {msg.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : msg.role === 'system' ? <Compass className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Content Box */}
                <div className="space-y-2 flex-1">
                  {/* Diff Cards / Special Renders */}
                  {msg.type === 'diff-card' && msg.meta ? (
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg max-w-lg">
                      {/* Diff header */}
                      <div className="px-4 py-2 bg-[var(--bg-dark-gray)] bg-opacity-50 border-b border-[var(--border)] flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
                          {msg.meta.sectionKey} • Proposal
                        </span>
                        <span className="text-[10px] font-bold text-green-500 bg-green-500 bg-opacity-10 px-2 py-0.5 rounded">
                          +{msg.meta.scoreImpact} Score
                        </span>
                      </div>
                      
                      {/* Diff content */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs italic text-[var(--text-muted)]">{msg.meta.reasoning}</p>
                        
                        {/* Before */}
                        <div className="text-xs p-2 rounded bg-red-950 bg-opacity-20 border-l-2 border-red-500 text-red-200">
                          <div className="text-[9px] uppercase tracking-wider font-bold mb-1 opacity-70">Original</div>
                          <div>{msg.meta.beforeContent}</div>
                        </div>

                        {/* After */}
                        <div className="text-xs p-2 rounded bg-green-950 bg-opacity-20 border-l-2 border-green-500 text-green-200">
                          <div className="text-[9px] uppercase tracking-wider font-bold mb-1 opacity-70">Suggested Tailoring</div>
                          <div>{msg.meta.afterContent}</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {msg.meta.status === 'proposed' ? (
                        <div className="px-4 py-3 bg-[var(--bg-dark-gray)] bg-opacity-30 border-t border-[var(--border)] flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => rejectEdit(msg.meta.id)}
                          >
                            Reject
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)]"
                            onClick={() => acceptEdit(msg.meta.id)}
                          >
                            Accept Edit
                          </Button>
                        </div>
                      ) : (
                        <div className="px-4 py-2 border-t border-[var(--border)] text-xs text-center font-bold bg-opacity-20 bg-gray-500">
                          {msg.meta.status === 'accepted' && <span className="text-green-400">✓ Change Applied to Resume</span>}
                          {msg.meta.status === 'rejected' && <span className="text-red-400">✗ Proposal Declined</span>}
                        </div>
                      )}
                    </div>
                  ) : msg.type === 'score-update' ? (
                    <div className="bg-[var(--bg-card)] border border-green-500 border-opacity-30 rounded-xl px-4 py-2 flex items-center gap-2 text-xs text-green-300">
                      <Flame className="w-4 h-4 text-[var(--accent-yellow)] animate-pulse" />
                      <span>{msg.content}</span>
                    </div>
                  ) : msg.type === 'system-event' ? (
                    <div className="text-xs text-[var(--text-muted)] italic px-2">
                      {msg.content}
                    </div>
                  ) : (
                    // Regular Text
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                        : 'bg-[var(--bg-card)] border border-[var(--border)] rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Bar & Command Surface */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)] space-y-3">
          {/* Quick chips (Fast-reply options) */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            <button 
              className="px-3 py-1 rounded-full bg-[var(--border)] hover:bg-gray-600 text-[var(--text-body)] shrink-0 transition"
              onClick={() => handleChipClick('Focus on experience section')}
            >
              @experience
            </button>
            <button 
              className="px-3 py-1 rounded-full bg-[var(--border)] hover:bg-gray-600 text-[var(--text-body)] shrink-0 transition"
              onClick={() => handleChipClick('Rewrite professional summary')}
            >
              /rewrite summary
            </button>
            <button 
              className="px-3 py-1 rounded-full bg-[var(--border)] hover:bg-gray-600 text-[var(--text-body)] shrink-0 transition"
              onClick={() => handleChipClick('Add must-have keywords')}
            >
              + keywords check
            </button>
          </div>

          <form onSubmit={handleSendCommand} className="flex gap-2">
            <input 
              type="text"
              placeholder="Ask agent, type commands (/rewrite) or mention sections (@skills)..."
              className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--accent)] transition"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <Button type="submit" size="sm" className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-semibold rounded-xl">
              Send Command
            </Button>
          </form>
        </div>
      </section>

      {/* 3. RIGHT PANEL (28% width) - Live Document Reference */}
      {isRightPanelPinned && (
        <aside className="w-[28%] border-l border-[var(--border)] flex flex-col bg-[var(--bg-card)]">
          {/* Tabs header */}
          <div className="px-4 py-3 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-dark-gray)] bg-opacity-30">
            <div className="flex gap-2">
              <button 
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${
                  rightPanelTab === 'resume' ? 'bg-[var(--border)] text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
                onClick={() => setRightPanelTab('resume')}
              >
                Tailored Resume
              </button>
              <button 
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${
                  rightPanelTab === 'jd' ? 'bg-[var(--border)] text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
                onClick={() => setRightPanelTab('jd')}
              >
                Job Description
              </button>
            </div>
            
            <button 
              className="text-[var(--text-muted)] hover:text-white"
              onClick={() => setIsRightPanelPinned(false)}
              title="Collapse Panel"
            >
              <PinOff className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reference content rendering */}
          <div className="flex-1 overflow-y-auto p-5 text-xs font-mono text-[var(--text-muted)] line-clamp-none">
            {rightPanelTab === 'resume' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest pb-2 border-b border-[var(--border)] font-sans">
                  <span>Draft Preview</span>
                  <span className="text-[var(--accent-cyan)] font-bold">Auto-syncing</span>
                </div>
                {resumeSections ? (
                  Object.entries(resumeSections).map(([sectionName, text]) => (
                    <div key={sectionName} className="space-y-1.5">
                      <h4 className="font-bold text-[10px] text-white uppercase font-sans tracking-wide">
                        {sectionName}
                      </h4>
                      <p className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border)] leading-relaxed whitespace-pre-wrap text-[11px]">
                        {text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-gray-600 font-sans">
                    No active resume loaded.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest pb-2 border-b border-[var(--border)] font-sans">
                  <span>Job Requirements</span>
                </div>
                {jdExtract ? (
                  <div className="space-y-4 font-sans text-[11px] leading-relaxed">
                    <div>
                      <span className="text-white font-semibold">Title:</span> {jdExtract.roleTitle}
                    </div>
                    <div>
                      <span className="text-white font-semibold">Seniority:</span> {jdExtract.seniorityLevel}
                    </div>
                    <div>
                      <span className="text-white font-semibold">Company Context:</span>
                      <p className="bg-[var(--bg-main)] p-2.5 rounded border border-[var(--border)] mt-1 text-[10px]">
                        {jdExtract.companyContext}
                      </p>
                    </div>
                    <div>
                      <span className="text-white font-semibold block mb-1">Must-Have Keywords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {jdExtract.mustHaveKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-red-500 bg-opacity-15 border border-red-500 border-opacity-30 text-red-300 text-[10px]">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-semibold block mb-1">Nice-To-Have Keywords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {jdExtract.niceToHaveKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-blue-500 bg-opacity-15 border border-blue-500 border-opacity-30 text-blue-300 text-[10px]">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-semibold block mb-1">Responsibilities:</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px] text-[var(--text-muted)]">
                        {jdExtract.coreResponsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-600 font-sans">
                    No active job description details.
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Floating button if panel is collapsed */}
      {!isRightPanelPinned && (
        <button 
          className="fixed right-6 bottom-20 p-3 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-cyan)] text-white shadow-lg transition duration-200 z-50 flex items-center gap-1.5 text-xs font-semibold"
          onClick={() => setIsRightPanelPinned(true)}
        >
          <Pin className="w-4 h-4" /> Pin Reference Panel
        </button>
      )}
    </div>
  );
}
