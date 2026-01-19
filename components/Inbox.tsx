import React, { useState } from 'react';
import { Email, Task, Priority, TaskStatus, EmailCategory } from '../types.ts';
import { CURRENT_USER } from '../constants.ts';
import { 
  Search, Star, Archive, MoreHorizontal, ArrowRight, Loader2, 
  CheckCircle, Mail, MailOpen, Filter, Settings, Inbox as InboxIcon, 
  Clock, Trash2, Reply, Plus, AlertCircle, FileText
} from 'lucide-react';
import { summarizeEmailForTask } from '../services/geminiService.ts';

interface InboxProps {
  emails: Email[];
  onAddTask: (task: Task) => void;
  onUpdateEmail: (email: Email) => void;
}

const Inbox: React.FC<InboxProps> = ({ emails, onAddTask, onUpdateEmail }) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [activeTab, setActiveTab] = useState<'PRIMARY' | 'OTHER' | 'LATER' | 'CLEARED'>('PRIMARY');
  const [isComposeOpen, setComposeOpen] = useState(false);

  // Filter emails based on tab
  const displayEmails = emails.filter(e => {
      if (activeTab === 'CLEARED') return e.archived;
      if (e.archived) return false; // Non-cleared tabs shouldn't show archived
      
      if (activeTab === 'PRIMARY') return e.category === 'PRIMARY';
      if (activeTab === 'OTHER') return e.category === 'OTHER';
      if (activeTab === 'LATER') return e.category === 'LATER';
      return false; 
  });

  const handleConvertToTask = async () => {
    if (!selectedEmail) return;
    setIsConverting(true);

    const summary = await summarizeEmailForTask(selectedEmail.body);
    
    const newTask: Task = {
      id: `t-email-${Date.now()}`,
      title: summary.title,
      status: TaskStatus.TODO,
      priority: summary.priority as Priority || Priority.MEDIUM,
      assignee: CURRENT_USER,
      tags: ['Email', 'Ad-hoc'],
      dueDate: new Date().toISOString().split('T')[0],
      weight: 30,
      description: summary.description
    };

    onAddTask(newTask);
    onUpdateEmail({ ...selectedEmail, archived: true, read: true });
    setSelectedEmail(null);
    setIsConverting(false);
  };

  const handleMoveEmail = (email: Email, category: EmailCategory) => {
    onUpdateEmail({ ...email, category, archived: false });
    if (selectedEmail?.id === email.id) setSelectedEmail(null);
  };

  const handleArchive = (email: Email) => {
    onUpdateEmail({ ...email, archived: true });
    if (selectedEmail?.id === email.id) setSelectedEmail(null);
  };

  const handleRestore = (email: Email) => {
    onUpdateEmail({ ...email, archived: false });
    // Keep selection if visible
  };

  const handleDelete = (id: string) => {
    const email = emails.find(e => e.id === id);
    if (email) handleArchive(email);
  };

  const handleCompose = () => {
    alert("Compose feature would open a modal here. Adding a mock email requires App state update.");
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">
      
      {/* Header Tabs */}
      <div className="h-14 border-b border-klarity-border dark:border-zinc-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex gap-6 h-full">
             {['Primary', 'Other', 'Later', 'Cleared'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => { setActiveTab(tab.toUpperCase() as any); setSelectedEmail(null); }}
                  className={`relative flex items-center h-full text-sm font-medium transition-colors border-b-2 
                    ${activeTab === tab.toUpperCase() 
                      ? 'text-semantic-ai dark:text-violet-300 border-semantic-ai font-bold' 
                      : 'text-slate-500 dark:text-zinc-500 border-transparent hover:text-slate-700 dark:hover:text-zinc-300'
                    }
                  `}
                >
                  <span className="mr-2">
                    {tab === 'Primary' && <InboxIcon size={16} />}
                    {tab === 'Other' && <MoreHorizontal size={16} />}
                    {tab === 'Later' && <Clock size={16} />}
                    {tab === 'Cleared' && <CheckCircle size={16} />}
                  </span>
                  {tab}
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.toUpperCase() ? 'bg-semantic-ai/10 text-semantic-ai' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'}`}>
                     {emails.filter(e => {
                        if (tab === 'Cleared') return e.archived;
                        if (e.archived) return false;
                        return e.category === tab.toUpperCase();
                     }).length}
                  </span>
                </button>
             ))}
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={handleCompose}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-semantic-ai text-white text-xs font-bold hover:bg-violet-700 transition-colors shadow-sm"
             >
                <Plus size={14} /> Compose
             </button>
             <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                <Filter size={14} /> Filter
             </button>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* List (Left Pane) */}
        {displayEmails.length > 0 ? (
            <div className={`w-96 border-r border-klarity-border dark:border-zinc-800 flex flex-col ${selectedEmail ? 'hidden md:flex' : 'w-full md:w-96'}`}>
               <div className="flex-1 overflow-y-auto no-scrollbar">
                   {displayEmails.map(email => (
                     <div 
                       key={email.id} 
                       onClick={() => { setSelectedEmail(email); if(!email.read) onUpdateEmail({...email, read: true}); }}
                       className={`p-4 border-b border-slate-100 dark:border-zinc-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group relative
                         ${selectedEmail?.id === email.id ? 'bg-semantic-aiLight/50 dark:bg-zinc-800 border-l-4 border-l-semantic-ai dark:border-l-semantic-ai' : 'border-l-4 border-l-transparent'}
                       `}
                     >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-medium ${!email.read ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-600 dark:text-zinc-400'}`}>{email.sender}</span>
                          <span className="text-[10px] text-slate-400">{email.date}</span>
                        </div>
                        <div className={`text-xs text-slate-800 dark:text-zinc-300 truncate mb-1 ${!email.read ? 'font-bold' : ''}`}>{email.subject}</div>
                        <div className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-2">{email.preview}</div>
                        
                        {/* Hover Actions */}
                        <div className="absolute right-2 top-2 hidden group-hover:flex gap-1 bg-white dark:bg-zinc-800 shadow-sm p-1 rounded-md">
                           {activeTab !== 'CLEARED' && (
                             <>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleArchive(email); }} 
                                 className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded text-slate-400 hover:text-green-600"
                                 title="Mark Done"
                               >
                                 <CheckCircle size={14} />
                               </button>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleMoveEmail(email, 'LATER'); }} 
                                 className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded text-slate-400 hover:text-amber-500"
                                 title="Snooze"
                               >
                                 <Clock size={14} />
                               </button>
                             </>
                           )}
                           {activeTab === 'CLEARED' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRestore(email); }} 
                                className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded text-slate-400 hover:text-blue-500"
                                title="Restore"
                              >
                                <Reply size={14} />
                              </button>
                           )}
                        </div>
                     </div>
                   ))}
               </div>
            </div>
        ) : (
           /* Empty States per Tab */
           <div className={`flex-1 flex flex-col items-center justify-center bg-slate-50/10 dark:bg-zinc-900 ${selectedEmail ? 'hidden' : 'flex'}`}>
              <div className="w-24 h-24 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl flex items-center justify-center shadow-inner mb-6">
                 {activeTab === 'PRIMARY' && <InboxIcon size={40} className="text-slate-400 dark:text-zinc-600" />}
                 {activeTab === 'OTHER' && <FileText size={40} className="text-slate-400 dark:text-zinc-600" />}
                 {activeTab === 'LATER' && <Clock size={40} className="text-slate-400 dark:text-zinc-600" />}
                 {activeTab === 'CLEARED' && <CheckCircle size={40} className="text-emerald-500/50" />}
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200 mb-2">
                 {activeTab === 'PRIMARY' && "Inbox Zero"}
                 {activeTab === 'OTHER' && "All Caught Up"}
                 {activeTab === 'LATER' && "No Snoozed Items"}
                 {activeTab === 'CLEARED' && "Nothing Archived Yet"}
              </h2>
              
              <p className="text-sm text-slate-500 dark:text-zinc-500 mb-8 max-w-xs text-center">
                 {activeTab === 'PRIMARY' && "Congratulations! You cleared your important notifications 🎉"}
                 {activeTab === 'OTHER' && "Low priority notifications will appear here."}
                 {activeTab === 'LATER' && "Items you snooze or set aside will show up here."}
                 {activeTab === 'CLEARED' && "Completed tasks and archived emails live here."}
              </p>
           </div>
        )}

        {/* Email Detail View */}
        {selectedEmail ? (
          <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-zinc-900/50">
             {/* Toolbar */}
             <div className="h-14 border-b border-klarity-border dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-900">
                <div className="flex gap-4 text-slate-400">
                  <button 
                     onClick={() => handleArchive(selectedEmail)} 
                     title="Archive"
                     className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                  >
                      <Archive size={18} />
                  </button>
                  <button 
                     onClick={() => handleMoveEmail(selectedEmail, 'LATER')}
                     title="Snooze"
                     className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                  >
                      <Clock size={18} />
                  </button>
                  <button 
                     title="Mark Important"
                     className="hover:text-amber-400 transition-colors"
                  >
                      <Star size={18} />
                  </button>
                </div>
                <div className="flex gap-2">
                   {/* Convert to Task Button */}
                   {!selectedEmail.archived && (
                       <button 
                         onClick={handleConvertToTask}
                         disabled={isConverting}
                         className="flex items-center gap-2 bg-semantic-ai text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-violet-700 transition-colors disabled:opacity-70 shadow-sm shadow-semantic-ai/20"
                       >
                         {isConverting ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                         Convert to Task
                       </button>
                   )}
                   
                   {/* Move Dropdown (Simulated) */}
                   <div className="relative group">
                       <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500">
                         <MoreHorizontal size={18} />
                       </button>
                       <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-xl hidden group-hover:block z-10">
                           <div className="p-1">
                               <button onClick={() => handleMoveEmail(selectedEmail, 'PRIMARY')} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-zinc-700 rounded text-slate-700 dark:text-zinc-200">Move to Primary</button>
                               <button onClick={() => handleMoveEmail(selectedEmail, 'OTHER')} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-zinc-700 rounded text-slate-700 dark:text-zinc-200">Move to Other</button>
                               <div className="h-px bg-slate-100 dark:bg-zinc-700 my-1"></div>
                               <button onClick={() => handleDelete(selectedEmail.id)} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600">Delete</button>
                           </div>
                       </div>
                   </div>
                </div>
             </div>

             {/* Body */}
             <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                   <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100 flex-1">{selectedEmail.subject}</h1>
                   <span className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded text-slate-500">
                      {selectedEmail.category}
                   </span>
                </div>
                
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-zinc-800">
                   <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center font-bold text-sm">
                      {selectedEmail.sender.charAt(0)}
                   </div>
                   <div>
                     <div className="text-sm font-medium text-slate-900 dark:text-zinc-200">{selectedEmail.sender}</div>
                     <div className="text-xs text-slate-500 dark:text-zinc-500">to me • {selectedEmail.date}</div>
                   </div>
                </div>
                
                <div className="prose prose-sm max-w-none text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                   {selectedEmail.body}
                </div>
             </div>
          </div>
        ) : (
          /* Empty detail state when list is visible but no item selected (Desktop) */
          displayEmails.length > 0 && (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 bg-slate-50/30 dark:bg-zinc-900/50">
                <MailOpen size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Select an item to view details</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Inbox;