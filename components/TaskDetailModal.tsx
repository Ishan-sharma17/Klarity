
import React, { useState } from 'react';
import { Task, TaskStatus, Priority, User } from '../types.ts';
import { 
  X, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Flag, 
  Clock, 
  Play, 
  Tag, 
  ChevronRight, 
  MoreHorizontal, 
  Share2, 
  Star, 
  Maximize2,
  CheckCircle2,
  Paperclip,
  Smile,
  Send,
  Bell,
  History,
  CheckSquare,
  Plus,
  Search,
  User as UserIcon,
  Minimize2,
  LayoutTemplate,
  FileText,
  Link,
  Image as ImageIcon,
  File
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  currentUser: User;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose, onUpdate, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  
  if (!isOpen) return null;

  const handleStatusChange = () => {
      const next = task.status === TaskStatus.TODO ? TaskStatus.IN_PROGRESS : 
                   task.status === TaskStatus.IN_PROGRESS ? TaskStatus.REVIEW :
                   task.status === TaskStatus.REVIEW ? TaskStatus.DONE : TaskStatus.TODO;
      onUpdate({...task, status: next});
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
        case Priority.CRITICAL: return 'text-red-500 fill-red-500';
        case Priority.HIGH: return 'text-amber-500 fill-amber-500';
        case Priority.MEDIUM: return 'text-blue-500 fill-blue-500';
        default: return 'text-zinc-500';
    }
  };

  const getStatusColor = (s: TaskStatus) => {
      switch(s) {
          case TaskStatus.DONE: return 'bg-emerald-500';
          case TaskStatus.IN_PROGRESS: return 'bg-blue-500';
          case TaskStatus.REVIEW: return 'bg-purple-500';
          default: return 'bg-zinc-400';
      }
  };

  const formatActivityTime = (date: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (days === 1) {
        return `Yesterday at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
        return `${date.toLocaleDateString([], {month: 'short', day: 'numeric'})} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
  };

  const getAttachmentIcon = (type: string, icon?: string) => {
      if (icon === 'figma') return <File className="text-purple-400" size={14} />;
      if (type === 'LINK') return <Link className="text-blue-400" size={14} />;
      if (type === 'IMAGE') return <ImageIcon className="text-emerald-400" size={14} />;
      return <FileText className="text-red-400" size={14} />;
  }

  // Helper to render property rows consistently
  const PropertyRow = ({ icon: Icon, label, children }: any) => (
      <div className="grid grid-cols-[140px_1fr] items-center min-h-[34px] group">
          <div className="flex items-center gap-2 text-zinc-500 text-xs group-hover:text-zinc-400 transition-colors">
              <Icon size={16} className="shrink-0 opacity-70" />
              <span>{label}</span>
          </div>
          <div className="flex items-center">
              {children}
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200">
       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
       
       <div className="relative w-full max-w-[1400px] h-[85vh] bg-[#1c1c1e] text-zinc-200 rounded-2xl shadow-2xl flex overflow-hidden border border-zinc-800 flex-col md:flex-row ring-1 ring-white/10">
          
          {/* LEFT PANEL: Task Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1c1c1e] overflow-hidden">
             
             {/* Header */}
             <div className="h-14 flex items-center justify-between px-6 border-b border-zinc-800 shrink-0 bg-[#1c1c1e]">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                   <span className="hover:text-zinc-300 cursor-pointer transition-colors">Team Space</span>
                   <ChevronRight size={12} className="opacity-50" />
                   <span className="hover:text-zinc-300 cursor-pointer transition-colors">Get Started with Klarity</span>
                   <ChevronRight size={12} className="opacity-50" />
                   <div className="flex items-center gap-2 text-zinc-300 px-1.5 py-0.5 rounded hover:bg-zinc-800 cursor-pointer transition-colors">
                      <LayoutTemplate size={12} />
                      <span className="truncate max-w-[150px]">{task.id}</span>
                   </div>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                   <button className="p-2 hover:bg-zinc-800 rounded-md hover:text-zinc-200 transition-colors"><Share2 size={16} /></button>
                   <button className="p-2 hover:bg-zinc-800 rounded-md hover:text-zinc-200 transition-colors"><Star size={16} /></button>
                   <button className="p-2 hover:bg-zinc-800 rounded-md hover:text-zinc-200 transition-colors"><MoreHorizontal size={16} /></button>
                   <div className="w-px h-4 bg-zinc-700 mx-2"></div>
                   <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-md hover:text-zinc-200 transition-colors"><Minimize2 size={16} /></button>
                   <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-md hover:text-zinc-200 transition-colors"><X size={20} /></button>
                </div>
             </div>

             {/* Scrollable Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto p-8">
                   
                   {/* Badge & Title */}
                   <div className="mb-6 group">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="px-1.5 py-0.5 rounded border border-zinc-700/50 bg-zinc-800/30 text-zinc-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                            Task
                         </div>
                      </div>
                      <h1 className="text-3xl font-bold text-zinc-100 leading-tight outline-none focus:ring-2 focus:ring-zinc-700 rounded -ml-2 pl-2 py-1">
                         {task.title}
                      </h1>
                   </div>

                   {/* AI Bar */}
                   <div className="mb-8 flex items-center gap-3 bg-[#2a2a2c] border border-zinc-700/30 rounded-lg p-2 pl-3 group cursor-text transition-all hover:border-zinc-600 ring-1 ring-transparent hover:ring-zinc-700">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-zinc-700 shadow-sm">
                        <Sparkles size={12} className="text-zinc-300" fill="currentColor" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Ask Brain to create a summary, generate subtasks, or find similar tasks..." 
                        className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-500 flex-1 h-full"
                      />
                   </div>

                   {/* Properties Grid */}
                   <div className="flex flex-col gap-1 mb-4">
                      
                      {/* Status */}
                      <PropertyRow icon={CheckCircle2} label="Status">
                         <div className="flex items-center gap-1">
                             <button 
                                onClick={handleStatusChange}
                                className="flex items-center h-7 pl-2 pr-1.5 bg-[#2c2c2e] hover:bg-[#3a3a3c] border border-zinc-700/50 rounded-[4px] transition-colors gap-2 group/status"
                             >
                                <div className={`w-2 h-2 rounded-[2px] ${getStatusColor(task.status)}`}></div>
                                <span className="text-[11px] font-bold uppercase text-white tracking-wider">{task.status.replace('_', ' ')}</span>
                                <ChevronRight size={12} className="text-zinc-500 ml-1" />
                             </button>
                             <button className="h-7 w-7 flex items-center justify-center bg-transparent hover:bg-[#2c2c2e] rounded-[4px] text-zinc-500 hover:text-emerald-500 transition-colors">
                                 <CheckCircle2 size={18} />
                             </button>
                         </div>
                      </PropertyRow>

                      {/* Assignees */}
                      <PropertyRow icon={UserIcon} label="Assignees">
                         <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2c2c2e] rounded-[4px] cursor-pointer -ml-2 transition-colors">
                            {task.assignee ? (
                               <>
                                <img src={task.assignee.avatar} className="w-5 h-5 rounded-full ring-1 ring-zinc-700" />
                                <span className="text-zinc-300 text-sm">{task.assignee.name}</span>
                               </>
                            ) : (
                                <span className="text-zinc-500 italic text-sm">Unassigned</span>
                            )}
                         </div>
                      </PropertyRow>

                      {/* Dates */}
                      <PropertyRow icon={CalendarIcon} label="Dates">
                         <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2c2c2e] rounded-[4px] cursor-pointer -ml-2 transition-colors text-sm">
                             <div className="flex items-center gap-1.5 text-zinc-500">
                                <CalendarIcon size={14} />
                                <span>Start</span>
                             </div>
                             <ArrowIcon />
                             <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                                <CalendarIcon size={14} />
                                <span>{task.dueDate}</span>
                             </div>
                         </div>
                      </PropertyRow>

                      {/* Priority */}
                      <PropertyRow icon={Flag} label="Priority">
                         <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2c2c2e] rounded-[4px] cursor-pointer -ml-2 transition-colors text-sm">
                             <Flag size={14} className={getPriorityColor(task.priority)} fill="currentColor" />
                             <span className={`${getPriorityColor(task.priority)} capitalize`}>{task.priority.toLowerCase()}</span>
                         </div>
                      </PropertyRow>

                      {/* Time Estimate */}
                      <PropertyRow icon={Clock} label="Time estimate">
                         <div className="px-2 py-1 hover:bg-[#2c2c2e] rounded-[4px] cursor-pointer text-zinc-500 -ml-2 text-sm transition-colors">
                            {task.timeEstimate || 'Empty'}
                         </div>
                      </PropertyRow>

                      {/* Track Time */}
                      <PropertyRow icon={Clock} label="Track time">
                         <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2c2c2e] rounded-[4px] cursor-pointer text-zinc-400 group/track -ml-2 transition-colors text-sm">
                            <Play size={14} className="fill-zinc-400 group-hover/track:fill-emerald-500 group-hover/track:text-emerald-500 transition-colors" />
                            <span>Start timer</span>
                         </div>
                      </PropertyRow>
                      
                      {/* Tags */}
                      <PropertyRow icon={Tag} label="Tags">
                         <div className="px-2 py-1 hover:bg-[#2c2c2e] rounded-[4px] cursor-pointer flex gap-2 flex-wrap -ml-2">
                            {task.tags.length > 0 ? (
                                task.tags.map(tag => (
                                    <span key={tag} className="bg-[#2c2c2e] text-zinc-300 px-2 py-0.5 rounded-[4px] text-xs border border-zinc-700/50">{tag}</span>
                                ))
                            ) : (
                                <span className="text-zinc-500 text-sm">Empty</span>
                            )}
                         </div>
                      </PropertyRow>

                   </div>

                   {/* Collapse Fields */}
                   <button className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs mb-8 group transition-colors pl-1">
                        <X size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        Collapse empty fields
                   </button>

                   {/* Description Area */}
                   <div className="mb-10 text-zinc-300 leading-relaxed min-h-[100px] outline-none group relative border-t border-transparent hover:border-zinc-800 transition-colors pt-4">
                      {task.description ? (
                          <p>{task.description}</p>
                      ) : (
                          <p className="text-zinc-500 italic cursor-text">Click to add description...</p>
                      )}
                   </div>

                   {/* Custom Fields Placeholder */}
                   <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                       <div className="flex items-center gap-2 text-zinc-400 text-sm hover:text-zinc-200 cursor-pointer w-fit transition-colors">
                           <div className="w-5 h-5 border border-zinc-700 rounded flex items-center justify-center hover:bg-zinc-800"><Plus size={12} /></div>
                           Custom Fields
                       </div>
                       
                       <div className="flex items-center gap-2 text-zinc-400 text-sm hover:text-zinc-200 cursor-pointer w-fit transition-colors pt-2">
                           <div className="w-5 h-5 border border-zinc-700 rounded flex items-center justify-center hover:bg-zinc-800"><Plus size={12} /></div>
                           Add subtask
                       </div>

                       <div className="flex items-center gap-2 text-zinc-400 text-sm hover:text-zinc-200 cursor-pointer w-fit transition-colors pt-2">
                           <div className="w-5 h-5 border border-zinc-700 rounded flex items-center justify-center hover:bg-zinc-800"><Plus size={12} /></div>
                           Relate items or add dependencies
                       </div>
                   </div>

                </div>
             </div>
          </div>

          {/* RIGHT PANEL: Activity Log */}
          <div className="w-full md:w-[350px] lg:w-[400px] border-l border-zinc-800 flex flex-col bg-[#161618] shrink-0">
             
             {/* Header */}
             <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 bg-[#1c1c1e]">
                <h3 className="text-sm font-semibold text-zinc-200">Activity</h3>
                <div className="flex items-center gap-3 text-zinc-400">
                    <Search size={16} className="cursor-pointer hover:text-zinc-200 transition-colors" />
                    <Bell size={16} className="cursor-pointer hover:text-zinc-200 transition-colors" />
                    <button className="hover:bg-zinc-800 p-1 rounded transition-colors"><MoreHorizontal size={16} /></button>
                </div>
             </div>

             {/* Activity List */}
             <div className="flex-1 flex flex-col overflow-y-auto p-4 custom-scrollbar bg-[#161618]">
                 {(task.activities && task.activities.length > 0) ? (
                     <div className="space-y-6">
                         {task.activities.map(act => (
                            <div key={act.id} className="flex gap-3 text-sm group">
                                <div className="mt-0.5 shrink-0">
                                    <img src={act.user.avatar} className="w-6 h-6 rounded-full ring-1 ring-zinc-800" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-zinc-300">
                                        <span className="font-medium text-zinc-200">{act.user.name.split(' ')[0]}</span> {act.text}
                                    </div>
                                    {/* Attachments Section */}
                                    {act.attachments && act.attachments.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {act.attachments.map(att => (
                                                <div key={att.id} className="flex items-center gap-3 p-2 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors cursor-pointer group/att">
                                                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50">
                                                        {getAttachmentIcon(att.type, att.icon)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-medium text-zinc-300 truncate group-hover/att:text-zinc-100">{att.name}</div>
                                                        <div className="text-[10px] text-zinc-500">{att.type === 'LINK' ? 'External Link' : att.size}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                        {formatActivityTime(act.timestamp)}
                                        {act.type === 'COMMENT' && <span className="text-zinc-600">• Reply</span>}
                                    </div>
                                </div>
                            </div>
                         ))}
                     </div>
                 ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
                         <p>No activity yet.</p>
                     </div>
                 )}
             </div>

             {/* Comment Input */}
             <div className="p-4 border-t border-zinc-800 bg-[#161618]">
                <div className="bg-[#202024] border border-zinc-700 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-zinc-600 transition-all shadow-sm group">
                    <textarea 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-transparent p-3 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none resize-none min-h-[40px] max-h-[150px]"
                        rows={1}
                    />
                    <div className="flex items-center justify-between px-2 pb-2">
                        <div className="flex items-center gap-1 text-zinc-500">
                            <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors"><Paperclip size={14} /></button>
                            <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors"><Smile size={14} /></button>
                            <button className="p-1.5 hover:bg-zinc-700 rounded text-semantic-ai font-bold transition-colors">@</button>
                        </div>
                        <div className="flex items-center gap-2">
                             <button className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 transition-colors"><History size={14} /></button>
                             <button 
                                disabled={!commentText.trim()}
                                className="bg-zinc-700 text-white p-1.5 rounded-lg disabled:opacity-50 hover:bg-zinc-600 transition-colors"
                             >
                                <Send size={14} />
                             </button>
                        </div>
                    </div>
                </div>
             </div>

          </div>

       </div>
    </div>
  );
};

const ArrowIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
)

export default TaskDetailModal;
