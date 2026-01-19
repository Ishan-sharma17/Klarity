import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Zap, Bot, User as UserIcon, Activity, Calendar, BrainCircuit, Heart, ShieldCheck, ChevronRight, Sunrise, Clock, Mail, CheckSquare, ListTodo, Calendar as CalendarIcon, ChevronDown, Minimize2 } from 'lucide-react';
import { chatWithKlarity, generateGhostTasks, generateMorningBrief, MorningBrief } from '../services/geminiService.ts';
import { Task, User, ChatMessage } from '../types.ts';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  user: User;
  onAddTasks: (tasks: Task[]) => void;
  initialMode?: 'ASSISTANT' | 'REFLECT';
  forceExpandBrief?: boolean;
  onBriefExpanded?: () => void;
}

// --- MORNING BRIEF CARD COMPONENT ---

const MorningBriefCard: React.FC<{ 
    tasks: Task[]; 
    user: User; 
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ tasks, user, isExpanded, onToggle }) => {
    const [brief, setBrief] = useState<MorningBrief | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only load if expanded or if we want to preload
        const loadBrief = async () => {
            setLoading(true);
            const data = await generateMorningBrief(tasks, user);
            setTimeout(() => {
                setBrief(data);
                setLoading(false);
            }, 800);
        };
        loadBrief();
    }, [tasks, user]); // Reload if tasks change

    const currentDate = new Date().getDate();
    const currentMonth = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();

    // Timeline Row Component
    const TimelineRow = ({ 
        icon, 
        title, 
        narrative, 
        badge, 
        isLast = false, 
        dateBadge 
    }: any) => (
        <div className="flex gap-5 relative group">
            {/* Timeline Column */}
            <div className="flex flex-col items-center shrink-0 w-12">
                {dateBadge ? (
                    <div className="w-12 h-12 rounded-2xl bg-[#202022] border border-zinc-700 flex flex-col items-center justify-center relative z-10 shadow-lg mb-1">
                        <span className="text-[9px] font-bold text-red-500 uppercase leading-none mb-0.5">{dateBadge.month}</span>
                        <span className="text-lg font-bold text-white leading-none">{dateBadge.day}</span>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#202022] border border-zinc-700 flex items-center justify-center relative z-10 shadow-lg text-blue-400 mb-1">
                        {icon}
                    </div>
                )}
                
                {/* Connecting Line */}
                {!isLast && (
                    <div className="w-px bg-zinc-800 h-full absolute top-12 bottom-[-16px] left-1/2 -translate-x-1/2"></div>
                )}
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-8">
                <h4 className="text-base font-bold text-white mb-2">{title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                    {narrative}
                </p>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1.5 bg-[#27272a] rounded-lg text-[11px] font-bold text-zinc-300 border border-zinc-700/50">
                        {badge}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-zinc-300 bg-transparent hover:bg-zinc-800 transition-colors">
                        Read More
                    </button>
                </div>
            </div>
        </div>
    );

    // Collapsed State
    if (!isExpanded) {
        return (
            <div 
                onClick={onToggle}
                className="bg-[#18181b] border border-zinc-800 p-4 rounded-2xl cursor-pointer flex items-center justify-between shadow-sm hover:border-zinc-700 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 border border-amber-500/20">
                        <Sunrise size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-500 transition-colors">Morning Brief</h3>
                        <p className="text-xs text-zinc-500">Tap to view your daily summary</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                    <ChevronDown size={16} />
                </div>
            </div>
        );
    }

    // Expanded State (Loading)
    if (loading) {
        return (
            <div className="bg-[#121214] rounded-[32px] p-8 border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
                <Sunrise size={48} className="text-zinc-500 relative z-10 animate-pulse" />
                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-zinc-200">Analyzing your day...</h3>
                    <p className="text-sm text-zinc-500">Scanning calendar, emails, and tasks.</p>
                </div>
            </div>
        );
    }

    if (!brief) return null;

    // Expanded State (Content)
    return (
        <div className="bg-[#121214] rounded-[32px] p-6 sm:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                        {brief.headline}
                    </h2>
                    <p className="text-sm text-zinc-400 font-medium">
                        {brief.subHeadline}
                    </p>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    className="text-zinc-500 hover:text-zinc-300 bg-[#202022] p-2 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Timeline */}
            <div className="relative z-10">
                
                {/* Calendar */}
                <TimelineRow 
                    dateBadge={{ month: currentMonth, day: currentDate }}
                    title="Calendar"
                    narrative={brief.calendar.narrative}
                    badge={brief.calendar.countLabel}
                />

                {/* Mail */}
                <TimelineRow 
                    icon={<Mail size={18} className="text-blue-500" />}
                    title="Mail"
                    narrative={brief.mail.narrative}
                    badge={brief.mail.countLabel}
                />

                {/* Reminders */}
                <TimelineRow 
                    icon={<ListTodo size={18} className="text-amber-500" />}
                    title="Reminders"
                    narrative={brief.tasks.narrative}
                    badge={brief.tasks.countLabel}
                    isLast={true}
                />

            </div>
            
            <div className="mt-2 text-center border-t border-zinc-800/50 pt-4">
                 <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="text-xs font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">
                     Close Brief
                 </button>
            </div>
        </div>
    );
};

// ... (Rest of AISidebar.tsx content: ReflectionView, AISidebar component) ...

// --- REFLECTIVE PULSE COMPONENTS ---

const ReflectionView: React.FC<{ tasks: Task[]; user: User; onComplete: () => void }> = ({ tasks, user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [mood, setMood] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [invisibleWork, setInvisibleWork] = useState('');
    const [intent, setIntent] = useState('');

    const meetingCount = tasks.filter(t => t.tags.some(tag => tag.toLowerCase().includes('meeting'))).length + 5; 
    const completedCount = tasks.filter(t => t.status === 'DONE').length;
    const ghostCount = tasks.filter(t => t.isGhost).length;
    const isOverloaded = user.burnoutScore > 70;

    useEffect(() => {
        const suggestions = [];
        if (meetingCount > 8) suggestions.push('Heavy Meeting Load');
        if (isOverloaded) suggestions.push('Context Switching');
        if (completedCount > 5) suggestions.push('Flow State Achieved');
        if (ghostCount > 0) suggestions.push('Unplanned Work');
        setSelectedTags(suggestions);
    }, [meetingCount, isOverloaded, completedCount, ghostCount]);

    const handleToggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) setSelectedTags(prev => prev.filter(t => t !== tag));
        else setSelectedTags(prev => [...prev, tag]);
    };

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
            <div className="px-6 py-6 bg-slate-50 dark:bg-zinc-800/50 border-b border-klarity-border dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    <Activity size={14} />
                    System Context
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-1">Your Week at a Glance</h2>
                <div className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                    Klarity detected <strong className="text-slate-800 dark:text-zinc-200">{meetingCount} meetings</strong> and <strong className="text-slate-800 dark:text-zinc-200">{ghostCount} unplanned tasks</strong> this week. 
                    {isOverloaded ? " Your workload signals were higher than usual." : " Your flow metrics looked balanced."}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">
                        How did this workload feel?
                    </label>
                    <div className="flex justify-between items-center px-2">
                        {['😫', 'bad', 'neutral', 'good', '🤩'].map((emoji, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setMood(idx)}
                                className={`text-2xl p-3 rounded-full transition-all duration-200 
                                    ${mood === idx 
                                        ? 'bg-semantic-ai/10 scale-125 shadow-sm' 
                                        : 'hover:bg-slate-100 dark:hover:bg-zinc-800 grayscale hover:grayscale-0 opacity-70 hover:opacity-100'
                                    }
                                `}
                            >
                                {['😣', '😕', '😐', '🙂', '😌'][idx]}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
                        What influenced your week?
                        <span className="block text-xs font-normal text-slate-500 dark:text-zinc-500 mt-1">Klarity pre-selected these based on your activity data.</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['Heavy Meeting Load', 'Context Switching', 'Deep Work', 'Unplanned Work', 'Clear Goals', 'Technical Debt', 'Team Support'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleToggleTag(tag)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                                    ${selectedTags.includes(tag)
                                        ? 'bg-semantic-ai text-white border-semantic-ai shadow-sm'
                                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-slate-300'
                                    }
                                `}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                        What didn't show up in your tasks?
                    </label>
                    <textarea 
                        value={invisibleWork}
                        onChange={(e) => setInvisibleWork(e.target.value)}
                        placeholder="e.g. Helped junior devs, unplanned incident response..."
                        className="w-full h-24 p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-semantic-ai/20 focus:border-semantic-ai outline-none resize-none transition-all placeholder:text-slate-400"
                    />
                </section>

                <section>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                        Intent for next week
                    </label>
                    <div className="relative">
                        <Sparkles size={14} className="absolute left-3 top-3 text-semantic-ai" />
                        <input 
                            type="text"
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                            placeholder="e.g. Block out Tuesday for deep work"
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-semantic-ai/20 focus:border-semantic-ai outline-none"
                        />
                    </div>
                </section>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 text-xs text-slate-500 dark:text-zinc-500">
                    <ShieldCheck size={14} className="shrink-0 mt-0.5 text-emerald-500" />
                    <p>Your reflections are private. Managers only see aggregated team health trends, never your raw inputs.</p>
                </div>
            </div>

            <div className="p-4 border-t border-klarity-border dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button 
                    onClick={onComplete}
                    className="w-full py-3 bg-semantic-ai text-white rounded-xl font-semibold shadow-lg shadow-semantic-ai/20 hover:bg-violet-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Heart size={16} className="fill-white/20" />
                    Complete Reflection
                </button>
            </div>
        </div>
    );
};

// --- MAIN AI SIDEBAR ---

const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onClose, tasks, user, onAddTasks, initialMode = 'ASSISTANT', forceExpandBrief, onBriefExpanded }) => {
  const [activeTab, setActiveTab] = useState<'ASSISTANT' | 'REFLECT'>('ASSISTANT');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: `Hi ${user.name.split(' ')[0]}, I'm Klarity. I've analyzed your workload. You have ${tasks.filter(t=>t.priority === 'HIGH' || t.priority === 'CRITICAL').length} high priority items pending. How can I help?`, timestamp: new Date() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (initialMode) setActiveTab(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
      if (forceExpandBrief) {
          setActiveTab('ASSISTANT');
          setBriefExpanded(true);
          if (onBriefExpanded) onBriefExpanded();
      }
  }, [forceExpandBrief, onBriefExpanded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (input.toLowerCase().includes('ghost') || input.toLowerCase().includes('ad-hoc')) {
         const ghostTasksRaw = await generateGhostTasks("Analysis of recent Slack and Email activity showing unlogged requests.");
         const ghostTasks = ghostTasksRaw.map((t, i) => ({
             ...t,
             id: `ghost-${Date.now()}-${i}`,
             status: 'TODO',
             assignee: user,
             dueDate: new Date().toISOString().split('T')[0]
         } as Task));
         
         onAddTasks(ghostTasks);
         setMessages(prev => [...prev, { role: 'ai', text: `I've detected and added ${ghostTasks.length} ghost tasks to your board.`, timestamp: new Date() }]);
         setLoading(false);
         return;
    }

    const aiResponseText = await chatWithKlarity(userMsg.text, { tasks, user });
    setMessages(prev => [...prev, { role: 'ai', text: aiResponseText, timestamp: new Date() }]);
    setLoading(false);
  };

  const handleReflectionComplete = () => {
      setActiveTab('ASSISTANT');
      setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "Thanks for reflecting! I've updated your workload calibration. Your 'Meeting Heavy' tag has been logged to help protect your focus time next week.", 
          timestamp: new Date() 
      }]);
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-[450px] bg-white dark:bg-[#09090b] shadow-2xl border-l border-klarity-border dark:border-zinc-800 transform transition-transform duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-klarity-border dark:border-zinc-800 bg-white dark:bg-[#09090b] shrink-0">
            <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
                <button 
                    onClick={() => setActiveTab('ASSISTANT')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'ASSISTANT' ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700'}`}
                >
                    <Sparkles size={14} />
                    Assistant
                </button>
                <button 
                    onClick={() => setActiveTab('REFLECT')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'REFLECT' ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700'}`}
                >
                    <BrainCircuit size={14} />
                    Reflect
                </button>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={18} />
            </button>
        </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-50/50 dark:bg-[#09090b]">
        
        {activeTab === 'REFLECT' && (
            <ReflectionView tasks={tasks} user={user} onComplete={handleReflectionComplete} />
        )} 
        
        {activeTab === 'ASSISTANT' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Morning Brief Card - Embedded */}
                    <MorningBriefCard 
                        tasks={tasks} 
                        user={user} 
                        isExpanded={briefExpanded} 
                        onToggle={() => setBriefExpanded(!briefExpanded)} 
                    />

                    {/* Signal Card (Only show if brief is collapsed to save space) */}
                    {!briefExpanded && (
                        <div className="bg-[#18181b] p-5 rounded-2xl border border-zinc-800 shadow-sm relative overflow-hidden group">
                            {/* Decorative Flash */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[40px] pointer-events-none"></div>
                            
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <div className="flex items-center gap-2 text-[11px] font-extrabold text-semantic-ai uppercase tracking-wider">
                                    <Zap size={14} className="fill-current" />
                                    Current Signal
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">Live</span>
                            </div>
                            <p className="text-sm text-zinc-300 leading-relaxed font-medium mb-3">
                                Your burnout score is trending up (42%). You have 4 hours of meetings today.
                            </p>
                            <button 
                                onClick={() => setActiveTab('REFLECT')}
                                className="text-xs font-bold text-semantic-ai hover:text-violet-400 flex items-center gap-1 group/link transition-colors"
                            >
                                Start weekly reflection <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    <div className="space-y-4 pt-2">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-zinc-800 ${m.role === 'ai' ? 'bg-[#202022] text-semantic-ai' : 'bg-zinc-800 text-zinc-400'}`}>
                                    {m.role === 'ai' ? <Bot size={16} /> : <UserIcon size={16} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm leading-relaxed ${m.role === 'ai' ? 'bg-[#18181b] border border-zinc-800 text-zinc-300 rounded-tl-none' : 'bg-semantic-ai text-white rounded-tr-none'}`}>
                                    {m.text}
                                    <div className={`text-[10px] mt-2 opacity-60 font-medium ${m.role === 'ai' ? 'text-zinc-500' : 'text-purple-100'}`}>
                                        {m.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-[#202022] border border-zinc-800 text-semantic-ai flex items-center justify-center shrink-0">
                                    <Sparkles size={14} className="animate-spin" />
                                </div>
                                <div className="p-4 bg-[#18181b] border border-zinc-800 rounded-2xl text-sm text-zinc-500 italic rounded-tl-none">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-[#09090b] border-t border-klarity-border dark:border-zinc-800 shrink-0">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about tasks, burnout, or schedule..."
                            className="w-full pl-5 pr-12 py-4 bg-slate-50 dark:bg-[#18181b] border-transparent focus:bg-white dark:focus:bg-[#18181b] border dark:border-zinc-800 rounded-2xl text-sm focus:ring-1 focus:ring-semantic-ai focus:border-semantic-ai focus:outline-none transition-all text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-semantic-ai text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="text-[10px] text-center text-slate-400 dark:text-zinc-600 mt-3 font-medium">
                        Klarity AI can make mistakes. Please verify important tasks.
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AISidebar;