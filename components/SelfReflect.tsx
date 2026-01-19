import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Zap, 
  Calendar, 
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertOctagon,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Users,
  History,
  X,
  ListTodo,
  AlertTriangle,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Clock,
  Unlock,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  LineChart,
  Line
} from 'recharts';
import { ViewMode, Task, User } from '../types.ts';
import { CURRENT_USER, INITIAL_TASKS } from '../constants.ts';
import KlarityOrb from './KlarityOrb.tsx';
import { generateWeeklyReport, generateReflectionDraft, WeeklyInsight, ReflectionDraft } from '../services/geminiService.ts';

interface SelfReflectProps {
    tasks?: Task[];
    user?: User;
    currentView?: ViewMode;
    onViewChange?: (view: ViewMode) => void;
}

// --- OPTIMIZED CHECK-IN WIZARD (3 STEPS) ---

const WeeklyCheckInWizard: React.FC<{ 
    tasks: Task[]; 
    user: User; 
    onClose: () => void;
    onComplete: () => void;
}> = ({ tasks, user, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    
    // State
    const [workload, setWorkload] = useState<'Light' | 'Balanced' | 'Heavy' | null>(null);
    const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
    const [hasBlockers, setHasBlockers] = useState<boolean | null>(null);
    const [selectedBlockerCauses, setSelectedBlockerCauses] = useState<string[]>([]);
    const [privateNote, setPrivateNote] = useState('');
    const [shareAnonymous, setShareAnonymous] = useState(true);

    // Constants
    const FACTORS = [
        "Meetings", "Task complexity", "External dependencies", 
        "Context switching", "Personal energy", "Unplanned work", "Other"
    ];
    
    const BLOCKER_TYPES = [
        "Waiting on Review", "Unclear Requirements", "Technical Debt", 
        "Resource Unavailable", "Personal", "Other"
    ];

    useEffect(() => {
        const loadDraft = async () => {
            setLoading(true);
            const draft = await generateReflectionDraft(tasks, user);
            
            setTimeout(() => {
                setWorkload(draft.workloadRating);
                
                // Map AI factors
                const mappedFactors = draft.factors.filter(f => FACTORS.includes(f));
                if (mappedFactors.length > 0) setSelectedFactors(mappedFactors);
                else if (draft.workloadRating === 'Heavy') setSelectedFactors(['Unplanned work', 'Task complexity']);
                else setSelectedFactors(['Task complexity']);

                setHasBlockers(draft.hasBlockers);
                // Pre-fill blocker causes if AI suggested relevant ones
                if (draft.blockerCauses) {
                    const mappedCauses = draft.blockerCauses.filter(c => BLOCKER_TYPES.includes(c));
                    if (mappedCauses.length > 0) setSelectedBlockerCauses(mappedCauses);
                }

                setLoading(false);
            }, 1000);
        };
        loadDraft();
    }, []);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else onComplete();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else onClose();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse"></div>
                    <KlarityOrb user={user} size="lg" />
                </div>
                <h2 className="mt-8 text-lg font-bold text-slate-800 dark:text-zinc-200 animate-pulse">AI is preparing your reflection...</h2>
                <p className="text-slate-500 dark:text-zinc-500 text-sm mt-2">Analyzing task completion, calendar density, and focus blocks.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pt-10 px-6 h-full flex flex-col">
            <div className="flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-1">Weekly Reflection</h1>
                        <p className="text-slate-500 dark:text-zinc-400">Take a moment to reflect on your week</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30 text-xs font-medium">
                        <ShieldCheck size={14} /> Privacy Protected
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mb-8 overflow-hidden flex">
                    <div className={`h-full bg-semantic-ai transition-all duration-500 ease-out`} style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
                <p className="text-sm text-slate-400 dark:text-zinc-500 mb-6">Step {step} of 3</p>

                {/* --- STEP 1: WORKLOAD & DRIVERS --- */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 mb-2">How was your workload this week?</h2>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-4">Be honest—this data helps track personal capacity trends.</p>
                            <div className="grid grid-cols-3 gap-4">
                                {['Light', 'Balanced', 'Heavy'].map((rating) => (
                                    <button 
                                        key={rating}
                                        onClick={() => setWorkload(rating as any)}
                                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all
                                            ${workload === rating 
                                                ? rating === 'Heavy' 
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                                                    : rating === 'Balanced' 
                                                        ? 'border-semantic-ai bg-semantic-aiLight dark:bg-semantic-ai/20' 
                                                        : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'
                                            }
                                        `}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${rating === 'Heavy' ? 'bg-red-500' : rating === 'Balanced' ? 'bg-semantic-ai' : 'bg-emerald-500'}`}></div>
                                        <span className={`font-bold ${workload === rating ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-600 dark:text-zinc-400'}`}>{rating}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Factors - Conditional visibility based on workload selection or just always visible for ease */}
                        <div className={`transition-all duration-500 ${workload ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'}`}>
                            <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-200 mb-3">What drove this?</h3>
                            <div className="flex flex-wrap gap-2">
                                {FACTORS.map(factor => (
                                    <button
                                        key={factor}
                                        onClick={() => {
                                            if (selectedFactors.includes(factor)) setSelectedFactors(selectedFactors.filter(f => f !== factor));
                                            else setSelectedFactors([...selectedFactors, factor]);
                                        }}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all
                                            ${selectedFactors.includes(factor)
                                                ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                                                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                            }
                                        `}
                                    >
                                        {factor}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STEP 2: BLOCKERS & CHALLENGES --- */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 mb-2">Did you experience any blockers?</h2>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">Dependencies, unclear requirements, or technical issues.</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button 
                                    onClick={() => setHasBlockers(true)}
                                    className={`p-6 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all
                                        ${hasBlockers === true 
                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                                            : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <AlertTriangle size={24} className={hasBlockers === true ? 'fill-amber-500/20' : ''} />
                                    <span className="font-bold text-lg">Yes</span>
                                </button>
                                <button 
                                    onClick={() => { setHasBlockers(false); setSelectedBlockerCauses([]); }}
                                    className={`p-6 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all
                                        ${hasBlockers === false
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                                            : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <CheckCircle size={24} className={hasBlockers === false ? 'fill-emerald-500/20' : ''} />
                                    <span className="font-bold text-lg">No</span>
                                </button>
                            </div>
                        </div>

                        {/* Conditional Detail Section */}
                        {hasBlockers && (
                            <div className="animate-in slide-in-from-top-4 fade-in duration-300 p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-3">What was the primary cause?</h3>
                                <div className="flex flex-wrap gap-2">
                                    {BLOCKER_TYPES.map(cause => (
                                        <button
                                            key={cause}
                                            onClick={() => {
                                                if (selectedBlockerCauses.includes(cause)) setSelectedBlockerCauses(selectedBlockerCauses.filter(c => c !== cause));
                                                else setSelectedBlockerCauses([...selectedBlockerCauses, cause]);
                                            }}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all
                                                ${selectedBlockerCauses.includes(cause)
                                                    ? 'bg-amber-100 dark:bg-amber-800 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-600'
                                                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-amber-300'
                                                }
                                            `}
                                        >
                                            {cause}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- STEP 3: WRAP UP & SHARE --- */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 mb-2">Finalize your check-in</h2>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">Add any private notes for your future self.</p>
                            
                            <div className="relative">
                                <textarea 
                                    value={privateNote}
                                    onChange={(e) => setPrivateNote(e.target.value)}
                                    className="w-full h-40 p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl resize-none focus:ring-2 focus:ring-semantic-ai/20 focus:border-semantic-ai outline-none text-slate-800 dark:text-zinc-200 text-sm leading-relaxed"
                                    placeholder="E.g. I felt really productive on Wednesday because..."
                                ></textarea>
                                <div className="absolute top-4 right-4 text-slate-300 dark:text-zinc-600 pointer-events-none">
                                    <Lock size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Privacy Toggle Card */}
                        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${shareAnonymous ? 'bg-semantic-aiLight dark:bg-semantic-ai/20 text-semantic-ai dark:text-violet-300' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'}`}>
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Share Anonymously</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5 max-w-[200px] sm:max-w-none">
                                        Your manager will see team aggregates, not your individual response.
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShareAnonymous(!shareAnonymous)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${shareAnonymous ? 'bg-semantic-ai' : 'bg-slate-300 dark:bg-zinc-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shareAnonymous ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="py-6 flex justify-between items-center border-t border-slate-100 dark:border-zinc-800 mt-6">
                <button onClick={handleBack} className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium flex items-center gap-2">
                    <ArrowLeft size={16} /> Back
                </button>
                <button 
                    onClick={handleNext} 
                    disabled={step === 1 && !workload}
                    className="px-6 py-2.5 bg-semantic-ai hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-md shadow-semantic-ai/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 active:scale-95"
                >
                    {step === 3 ? 'Complete Check-in' : 'Continue'} 
                    {step !== 3 && <ArrowRight size={16} />}
                </button>
            </div>
        </div>
    );
};

const CompletionScreen: React.FC<{ onViewReport: () => void, onViewHistory: () => void }> = ({ onViewReport, onViewHistory }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in zoom-in duration-300">
        <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
            <Check size={48} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 mb-3">You're all set!</h2>
        <p className="text-slate-500 dark:text-zinc-400 max-w-md mb-10 leading-relaxed">
            Your reflection has been logged. This data helps improve team health and balance workload distribution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
             <button onClick={onViewReport} className="px-8 py-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                View My Pulse
             </button>
             <button onClick={onViewHistory} className="px-8 py-3 bg-semantic-ai text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-semantic-ai/20">
                Review History
             </button>
        </div>
    </div>
);

// --- HISTORY VIEW COMPONENTS ---

// Updated data to match the screenshot precisely
const HISTORY_CHART_DATA = [
    { name: 'W1', workload: 52, meetings: 27 },
    { name: 'W2', workload: 80, meetings: 34 },
    { name: 'W3', workload: 80, meetings: 32 },
    { name: 'W4', workload: 80, meetings: 30 },
    { name: 'W5', workload: 52, meetings: 25 },
    { name: 'W6', workload: 50, meetings: 22 },
    { name: 'W7', workload: 22, meetings: 18 },
    { name: 'W8', workload: 52, meetings: 24 },
];

const PAST_CHECKINS = [
    { date: 'Feb 26 - Mar 3', rating: 'balanced', tags: [], meetings: 24, shared: true },
    { date: 'Feb 19-25', rating: 'light', tags: [], meetings: 18, shared: false },
    { date: 'Feb 12-18', rating: 'balanced', tags: [], meetings: 22, shared: true },
    { date: 'Feb 5-11', rating: 'balanced', tags: [], meetings: 25, shared: true },
    { date: 'Jan 29 - Feb 4', rating: 'heavy', tags: [], meetings: 30, shared: true },
    { date: 'Jan 22-28', rating: 'heavy', tags: ['Blocker'], meetings: 32, shared: false },
    { date: 'Jan 15-21', rating: 'heavy', tags: ['Blocker'], meetings: 35, shared: true },
    { date: 'Jan 8-14', rating: 'balanced', tags: [], meetings: 28, shared: true },
];

// Custom Tooltip for interactivity
const ChartTooltip = ({ active, payload, label, suffix = '', color }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-bold text-slate-400 mb-1 uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-lg font-bold">{payload[0].value}{suffix}</span>
          </div>
        </div>
      );
    }
    return null;
};

const ReflectionHistory: React.FC = () => {
    // Calculate Averages for Summary Header
    const avgWorkload = Math.round(HISTORY_CHART_DATA.reduce((acc, curr) => acc + curr.workload, 0) / HISTORY_CHART_DATA.length);
    const avgMeetings = Math.round(HISTORY_CHART_DATA.reduce((acc, curr) => acc + curr.meetings, 0) / HISTORY_CHART_DATA.length);

    return (
        <div className="h-full overflow-y-auto bg-slate-50 dark:bg-[#0f1115] p-6 lg:p-10 pb-20 no-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-1">Personal History</h1>
                    <p className="text-sm text-slate-500 dark:text-zinc-500">Your weekly check-ins and trends over time</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Lock size={12} /> Private to You
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck size={12} /> Privacy Protected
                    </span>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-[#eafcfc] dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30 rounded-xl p-4 flex gap-3 items-start mb-8 shadow-sm">
                <Info size={18} className="text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-cyan-900 dark:text-cyan-200 leading-snug">
                    <span className="font-bold">This does not measure focus or productivity.</span> Use your history to reflect on patterns in your workload experience over time.
                </p>
            </div>

            {/* Charts Row - Improved Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Workload Experience Trend */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 flex flex-col shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <div className="flex gap-2 items-center mb-1">
                                <TrendingUp size={18} className="text-blue-500" />
                                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-base">Workload Experience Trend</h3>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wide">Authoritative</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-500">Your self-reported workload over 8 weeks</p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{avgWorkload}%</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Intensity</div>
                        </div>
                    </div>
                    
                    <div className="flex-1 h-[220px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart data={HISTORY_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 11}} 
                                    domain={[0, 100]} 
                                    ticks={[0, 20, 40, 60, 80]}
                                />
                                <ReferenceLine y={50} stroke="#3b82f6" strokeDasharray="3 3" opacity={0.3} label={{ position: 'insideBottomRight', value: 'Balance', fill: '#3b82f6', fontSize: 10, opacity: 0.8 }} />
                                <Tooltip content={<ChartTooltip color="#3b82f6" />} cursor={{stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.5}} />
                                <Line 
                                    type="monotone" 
                                    dataKey="workload" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "#eff6ff", strokeWidth: 4 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-4 pt-4 border-t border-slate-50 dark:border-zinc-800">
                        This reflects how work felt to you. Your perception is the authoritative signal.
                    </p>
                </div>

                {/* Meeting Load Trend */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 flex flex-col shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <div className="flex gap-2 items-center mb-1">
                                <Clock size={18} className="text-slate-400" />
                                <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-base">Meeting Load Trend</h3>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Context</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-500">Structural pressure from calendar (% of week)</p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{avgMeetings}%</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Load</div>
                        </div>
                    </div>

                    <div className="flex-1 h-[220px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart data={HISTORY_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 11}} 
                                    domain={[0, 40]} 
                                    ticks={[0, 9, 18, 27, 36]}
                                />
                                <ReferenceLine y={20} stroke="#94a3b8" strokeDasharray="3 3" opacity={0.3} />
                                <Tooltip content={<ChartTooltip suffix="%" color="#94a3b8" />} cursor={{stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.5}} />
                                <Line 
                                    type="monotone" 
                                    dataKey="meetings" 
                                    stroke="#94a3b8" 
                                    strokeWidth={3} 
                                    dot={false} 
                                    activeDot={{ r: 6, fill: "#94a3b8", stroke: "#f1f5f9", strokeWidth: 4 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-4 pt-4 border-t border-slate-50 dark:border-zinc-800">
                        Context only. Low meetings ≠ availability. High meetings ≠ workload.
                    </p>
                </div>
            </div>

            {/* Past Check-Ins */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-2">
                    <History size={20} className="text-semantic-ai" />
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-zinc-100">Past Check-Ins</h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-500">Your weekly reflections and sharing history</p>
                    </div>
                </div>
                
                <div className="divide-y divide-slate-50 dark:divide-zinc-800">
                    {PAST_CHECKINS.map((checkin, idx) => (
                        <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer gap-4">
                            <div className="flex items-center gap-6">
                                <div className="text-slate-400 dark:text-zinc-600">
                                    <Calendar size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-zinc-200 w-32 tabular-nums">{checkin.date}</span>
                                
                                <div className="flex gap-2 items-center">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize border shadow-sm
                                        ${checkin.rating === 'heavy' 
                                            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' 
                                            : checkin.rating === 'light' 
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'}
                                    `}>
                                        {checkin.rating}
                                    </span>

                                    {checkin.tags.map(tag => (
                                        <span key={tag} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-8 pl-10 sm:pl-0">
                                <span className="text-xs text-slate-500 dark:text-zinc-500 font-medium tabular-nums">{checkin.meetings}% meetings</span>
                                {checkin.shared ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <Check size={14} /> Shared
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-zinc-600">
                                        <Lock size={12} /> Private
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-800/30 text-center border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-500">
                    This history is visible only to you. Use it to reflect on patterns in your workload experience over time.
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const SelfReflect: React.FC<SelfReflectProps> = ({ tasks = INITIAL_TASKS, user = CURRENT_USER, currentView, onViewChange }) => {
  const [data, setData] = useState<WeeklyInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
        if (currentView === ViewMode.REFLECT_CHECKIN || currentView === ViewMode.REFLECT_HISTORY) return; // Skip if in wizard mode or history
        setLoading(true);
        // Simulate network delay for "AI Processing" feel
        await new Promise(r => setTimeout(r, 800));
        const report = await generateWeeklyReport(tasks, user);
        setData(report);
        setLoading(false);
    };
    fetchData();
  }, [currentView]);

  // Handle Wizard Logic
  if (currentView === ViewMode.REFLECT_CHECKIN) {
      if (isCompleted) {
          return <CompletionScreen 
                    onViewReport={() => onViewChange && onViewChange(ViewMode.SELF_REFLECT)} 
                    onViewHistory={() => onViewChange && onViewChange(ViewMode.REFLECT_HISTORY)}
                 />;
      }
      return <WeeklyCheckInWizard 
                tasks={tasks} 
                user={user} 
                onClose={() => onViewChange && onViewChange(ViewMode.SELF_REFLECT)} 
                onComplete={() => setIsCompleted(true)} 
             />;
  }
  
  // Handle History Logic
  if (currentView === ViewMode.REFLECT_HISTORY) {
      return <ReflectionHistory />;
  }

  // --- DASHBOARD VIEW (Original) ---
  
  if (loading) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0f1115]">
              <div className="relative">
                  <div className="absolute inset-0 bg-semantic-ai/20 blur-xl rounded-full animate-pulse"></div>
                  <KlarityOrb user={user} size="lg" />
              </div>
              <h2 className="mt-8 text-lg font-bold text-slate-800 dark:text-zinc-200 animate-pulse">Synthesizing your week...</h2>
              <p className="text-slate-500 dark:text-zinc-500 text-sm mt-2">Analyzing cognitive load, calendar patterns, and focus depth.</p>
          </div>
      );
  }

  if (!data) return null;

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-[#0f1115] p-6 lg:p-10 pb-20 no-scrollbar">
      
      {/* 1. Header & Privacy Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
             <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">My Pulse</h1>
                <span className="bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700 uppercase tracking-wide">Live</span>
             </div>
             <p className="text-sm text-slate-500 dark:text-zinc-500 flex items-center gap-2">
                Weekly Workload Reflection • Last updated 2 hours ago
             </p>
         </div>
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium text-slate-600 dark:text-zinc-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                Private to you
             </div>
             <button 
                onClick={() => onViewChange && onViewChange(ViewMode.REFLECT_CHECKIN)}
                className="flex items-center gap-2 px-4 py-2 bg-semantic-ai dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
             >
                Start Check-in <ArrowUpRight size={16} />
             </button>
         </div>
      </div>

      {/* 2. Hero Section: Current State (Preserved as requested) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
         {/* Main Pulse Card */}
         <div className="lg:col-span-2 bg-gradient-to-br from-white to-violet-50/30 dark:from-zinc-900 dark:to-zinc-900/50 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 flex items-center relative overflow-hidden shadow-sm group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-violet-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-violet-500/10 transition-colors duration-500"></div>
            
            <div className="flex-1 z-10">
               <div className="flex items-center gap-3 mb-4">
                  <KlarityOrb user={user} size="md" />
                  <span className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Current State</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-100 mb-2">
                  You are in <span className="text-semantic-ai dark:text-violet-400">Flow</span>.
               </h2>
               <p className="text-slate-600 dark:text-zinc-400 max-w-lg text-sm md:text-base leading-relaxed">
                  Your cognitive load is balanced. You've maintained high focus scores for 3 consecutive days. Great rhythm!
               </p>

               <div className="mt-8 flex gap-3">
                  <div className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 shadow-sm flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Energy</span>
                      <span className="font-bold text-emerald-500">High</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 shadow-sm flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Capacity</span>
                      <span className="font-bold text-semantic-ai">85%</span>
                  </div>
               </div>
            </div>
            
            <div className="hidden sm:block z-10 pr-8">
               <div className="w-32 h-32 rounded-full border-4 border-violet-100 dark:border-violet-900/30 flex items-center justify-center relative">
                   <div className="absolute inset-0 border-4 border-semantic-ai rounded-full border-t-transparent animate-spin-slow" style={{ animationDuration: '10s' }}></div>
                   <div className="text-center">
                       <div className="text-3xl font-bold text-slate-800 dark:text-zinc-100">85</div>
                       <div className="text-[10px] text-slate-400 font-bold uppercase">Rhythm</div>
                   </div>
               </div>
            </div>
         </div>

         {/* Insights Sidebar - Updated Design */}
         <div className="bg-[#121214] dark:bg-[#0c0c0e] text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/5 h-full min-h-[320px]">
             {/* Background Decoration */}
             <div className="absolute -top-6 -right-6 text-white/5 transform rotate-12 pointer-events-none">
                 <Sparkles size={180} strokeWidth={1} />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-8">
                    <Sparkles size={18} className="text-violet-400" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200/80">Klarity Insights</span>
                </div>
                
                <div className="space-y-6">
                    <div className="flex gap-4 items-start group">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                        <p className="text-[15px] font-medium leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            Your best deep work happens on <strong className="text-white">Wednesdays</strong> (avg 5.5h).
                        </p>
                    </div>
                    
                    <div className="flex gap-4 items-start group">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                        <p className="text-[15px] font-medium leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            High context switching detected on <strong className="text-white">Thursdays</strong> due to fragmented meetings.
                        </p>
                    </div>
                </div>
             </div>
             
             <div className="relative z-10 mt-8">
                 <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 border border-white/5 hover:border-white/10 hover:shadow-lg hover:shadow-violet-500/10">
                    View All Trends
                 </button>
             </div>
         </div>
      </div>

      {/* --- NEW SECTION: AI Weekly Synthesis --- */}
      
      <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">AI Weekly Synthesis</h2>
            <span className="bg-violet-100 dark:bg-violet-900/30 text-semantic-ai dark:text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800 uppercase tracking-wide">Beta</span>
          </div>

          {/* Executive Summary */}
          <div className="bg-[#1e1e24] dark:bg-[#121214] rounded-2xl p-6 border border-violet-500/30 relative overflow-hidden mb-8 shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-semantic-ai to-purple-400"></div>
              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                      <Sparkles size={20} className="text-violet-400" />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-white mb-2">Executive Summary</h3>
                      <p className="text-zinc-300 text-sm leading-relaxed">{data.summary}</p>
                  </div>
              </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Completion Rate */}
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-zinc-500">
                      <Zap size={16} className="text-semantic-ai" />
                      <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-slate-900 dark:text-zinc-100">{data.completionRate.value}%</span>
                  </div>
                  <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500`}>
                      <TrendingDown size={10} /> {data.completionRate.trend}% from last week
                  </div>
              </div>

              {/* Backlog Volume */}
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-zinc-500">
                      <ListTodo size={16} className="text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Backlog Volume</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-slate-900 dark:text-zinc-100">{data.backlog.value} tasks</span>
                  </div>
                  <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500`}>
                      <TrendingUp size={10} /> {data.backlog.trend}
                  </div>
              </div>

              {/* Cognitive Load */}
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-zinc-500">
                      <BrainCircuit size={16} className="text-semantic-ai" />
                      <span className="text-xs font-bold uppercase tracking-wider">Cognitive Load</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{data.cognitiveLoadLevel.status}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500`}>
                      <TrendingUp size={10} /> {data.cognitiveLoadLevel.trend}
                  </div>
              </div>

              {/* Weekly Activity */}
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-zinc-500">
                      <Activity size={16} className="text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Weekly Activity</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100">{data.activityLevel.status}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500`}>
                      <TrendingDown size={10} /> {data.activityLevel.trend}
                  </div>
              </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Radar Chart */}
              <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                  <div className="mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                          <Activity size={18} className="text-semantic-ai" /> Work Style Dimensions
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                          Your balance across 5 key productivity vectors.
                      </p>
                  </div>
                  <div className="flex-1 min-h-[250px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.workStyle}>
                              <PolarGrid stroke="#3f3f46" strokeOpacity={0.3} />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar
                                  name="You"
                                  dataKey="A"
                                  stroke="#8b5cf6" 
                                  strokeWidth={2}
                                  fill="#8b5cf6" 
                                  fillOpacity={0.3}
                              />
                              <Tooltip 
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontSize: '12px', backgroundColor: '#18181b', color: '#fff' }}
                                  itemStyle={{ color: '#a78bfa' }}
                              />
                          </RadarChart>
                      </ResponsiveContainer>
                      <div className="absolute bottom-0 w-full flex justify-between px-8">
                         <div className="text-[10px] text-zinc-500">Quality</div>
                         <div className="text-[10px] text-zinc-500">Collab</div>
                      </div>
                  </div>
              </div>

              {/* Stacked Bar Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                              <Zap size={18} className="text-amber-500" /> Cognitive Load Distribution
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                              Deep Work vs. Shallow Work vs. Meetings cost analysis.
                          </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-semantic-ai"></div> Deep</div>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></div> Shallow</div>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Meeting</div>
                      </div>
                  </div>

                  <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.cognitiveLoadDistribution} barGap={0} barSize={40}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} />
                              <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#18181b', color: '#fff', fontSize: '12px' }}
                              />
                              <ReferenceLine y={4} stroke="#52525b" strokeDasharray="3 3" />
                              <Bar dataKey="deep" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="shallow" stackId="a" fill="#cbd5e1" />
                              <Bar dataKey="meetings" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>

          {/* Anomaly & Actions - REDESIGNED */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Anomaly Detection - Redesigned */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-500">
                             <AlertOctagon size={18} />
                          </div>
                          Anomaly Detection
                      </h3>
                      <span className="text-xs font-medium text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{data.anomalies.length} Issues</span>
                  </div>
                  
                  <div className="space-y-3">
                      {data.anomalies.map((anomaly, idx) => (
                          <div key={idx} className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-zinc-800/50 border-l-4 border-red-500 rounded-r-xl group hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                              <div className="mt-0.5 shrink-0 text-red-500 dark:text-red-400">
                                  <AlertTriangle size={16} />
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 leading-snug group-hover:text-slate-900 dark:group-hover:text-zinc-100 transition-colors">{anomaly}</p>
                              </div>
                          </div>
                      ))}
                      {data.anomalies.length === 0 && (
                          <div className="text-center py-8 text-slate-400 dark:text-zinc-600 italic">No anomalies detected. Great job!</div>
                      )}
                  </div>
              </div>

              {/* Recommended Actions - Redesigned */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                          <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg text-semantic-ai dark:text-violet-400">
                             <Sparkles size={18} />
                          </div>
                          Recommended Actions
                      </h3>
                  </div>

                  <div className="space-y-3">
                      {data.actionItems.map((action, idx) => (
                          <button key={idx} className="w-full flex gap-4 items-center p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-700/50 hover:border-semantic-ai dark:hover:border-violet-500/50 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md transition-all group text-left">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:text-semantic-ai dark:group-hover:text-violet-400 group-hover:scale-110 transition-all shrink-0 border border-slate-200 dark:border-zinc-700">
                                  {idx + 1}
                              </div>
                              <p className="flex-1 text-sm font-medium text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-zinc-100 transition-colors">{action}</p>
                              <ArrowRight size={16} className="text-slate-300 dark:text-zinc-600 group-hover:text-semantic-ai dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SelfReflect;