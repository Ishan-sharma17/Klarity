import React, { useState } from 'react';
import { X, Send, Smile, Meh, Frown } from 'lucide-react';

interface KlarityReportProps {
  isOpen: boolean;
  onClose: () => void;
}

const KlarityReport: React.FC<KlarityReportProps> = ({ isOpen, onClose }) => {
  const [mood, setMood] = useState<number>(2); // 1: Bad, 2: Neutral, 3: Good
  const [tags, setTags] = useState<string[]>([]);
  const [adHocText, setAdHocText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const availableTags = ["Too many meetings", "Deep Work Achieved", "Unclear Goals", "Technical Debt", "Flow State"];

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // In real app, send to API
    setTimeout(() => {
        onClose();
        setSubmitted(false);
        setMood(2);
        setTags([]);
        setAdHocText('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-center p-4 sm:p-0 pointer-events-none">
       {/* Backdrop */}
       <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>

       {/* Modal */}
       <div className="pointer-events-auto bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-klarity-border dark:border-zinc-800">
          {submitted ? (
             <div className="h-64 flex flex-col items-center justify-center bg-semantic-ai text-white p-6 text-center">
                <Smile size={48} className="mb-4 animate-bounce" />
                <h3 className="text-xl font-bold">Log Saved!</h3>
                <p className="text-white/80 mt-2">Klarity is updating your metrics.</p>
             </div>
          ) : (
             <>
                <div className="p-4 border-b border-klarity-border dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900">
                   <h3 className="font-bold text-slate-800 dark:text-zinc-100">Daily Klarity Check-in</h3>
                   <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-6 bg-white dark:bg-zinc-900">
                   {/* 1. Mood */}
                   <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide mb-3">How was your flow?</label>
                      <div className="flex justify-between px-4">
                         <button onClick={() => setMood(1)} className={`p-3 rounded-full transition-all ${mood === 1 ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 scale-110' : 'text-slate-300 dark:text-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                            <Frown size={32} />
                         </button>
                         <button onClick={() => setMood(2)} className={`p-3 rounded-full transition-all ${mood === 2 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 scale-110' : 'text-slate-300 dark:text-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                            <Meh size={32} />
                         </button>
                         <button onClick={() => setMood(3)} className={`p-3 rounded-full transition-all ${mood === 3 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 scale-110' : 'text-slate-300 dark:text-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                            <Smile size={32} />
                         </button>
                      </div>
                   </div>

                   {/* 2. Tags */}
                   <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide mb-3">What happened?</label>
                      <div className="flex flex-wrap gap-2">
                         {availableTags.map(tag => (
                            <button 
                               key={tag} 
                               onClick={() => toggleTag(tag)}
                               className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${tags.includes(tag) ? 'bg-slate-800 dark:bg-zinc-700 text-white border-slate-800 dark:border-zinc-700' : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'}`}
                            >
                               {tag}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* 3. Ad-hoc */}
                   <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wide mb-2">Any off-record work?</label>
                      <textarea 
                        value={adHocText}
                        onChange={(e) => setAdHocText(e.target.value)}
                        placeholder="Solved the API CORS issue..."
                        className="w-full h-20 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-semantic-ai/20 focus:outline-none text-sm resize-none text-slate-900 dark:text-zinc-200"
                      />
                   </div>
                </div>

                <div className="p-4 border-t border-klarity-border dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                   <button 
                     onClick={handleSubmit}
                     className="w-full bg-semantic-ai text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                   >
                     <span>Log Day</span>
                     <Send size={16} />
                   </button>
                </div>
             </>
          )}
       </div>
    </div>
  );
};

export default KlarityReport;