import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, Priority, ViewMode, ProjectInfo } from '../types.ts';
import { 
    MoreHorizontal, Plus, Sparkles, Calendar as CalendarIcon, 
    MessageSquare, Paperclip, Flag, CheckCircle2, Bot, 
    Filter, ChevronDown, Search, SlidersHorizontal, User as UserIcon,
    Layout, List, FileText, Settings, Share2, Check, X, Download,
    ArrowUpCircle, AlertCircle
} from 'lucide-react';
import { CURRENT_USER, MOCK_USERS } from '../constants.ts';

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onSelectTask?: (task: Task) => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  activeProject?: ProjectInfo;
}

// --- Components ---

const FilterButton = ({ label, activeValue, onClick, icon: Icon, isActive }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm
            ${activeValue || isActive
                ? 'bg-semantic-ai text-white border-transparent' 
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
    >
        {Icon && <Icon size={14} />}
        <span>{label}</span>
        {activeValue && <span className="opacity-90 ml-1 bg-white/20 px-1 rounded">{activeValue}</span>}
        <ChevronDown size={12} className={`opacity-50 transition-transform ${isActive ? 'rotate-180' : ''}`} />
    </button>
);

const TaskCard: React.FC<{ 
    task: Task; 
    onDragStart: (e: React.DragEvent, id: string) => void; 
    onClick?: () => void;
    onUpdate?: (task: Task) => void;
    onDelete?: (taskId: string) => void;
}> = ({ task, onDragStart, onClick, onUpdate, onDelete }) => {
  const isGhost = task.isGhost;
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const progressPercent = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);

  const getPriorityBadge = (p: Priority) => {
    switch(p) {
        case Priority.CRITICAL: 
            return <div className="p-1 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"><AlertCircle size={12} /></div>;
        case Priority.HIGH: 
            return <div className="p-1 rounded bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"><ArrowUpCircle size={12} /></div>;
        default: return null;
    }
  };

  const getTagColor = (tag: string) => {
      // Semantic colors based on tag name
      const lower = tag.toLowerCase();
      if (lower.includes('bug')) return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30';
      if (lower.includes('feature')) return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30';
      if (lower.includes('design')) return 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30';
      
      return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
  };

  if (isGhost) {
      return (
          <div 
            className="group relative p-4 rounded-2xl border border-dashed border-semantic-ai/40 bg-semantic-ai/5 dark:bg-semantic-ai/10 mb-3 cursor-pointer overflow-hidden hover:border-semantic-ai transition-all duration-300"
            onClick={onClick}
          >
              <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded-md border border-semantic-ai/10 backdrop-blur-sm">
                      <Bot size={12} className="text-semantic-ai" />
                      <span className="text-[10px] font-bold text-semantic-ai uppercase tracking-wider">AI Suggestion</span>
                  </div>
                  <span className="text-[10px] font-bold text-semantic-ai/70">{Math.floor((task.aiConfidence || 0) * 100)}% Match</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-2 leading-snug">{task.title}</h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 italic leading-relaxed line-clamp-2 mb-4 opacity-80">{task.description}</p>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-200">
                <button 
                    onClick={(e) => { e.stopPropagation(); if (onUpdate) onUpdate({ ...task, isGhost: false, aiConfidence: undefined }); }}
                    className="flex-1 py-2 bg-semantic-ai text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-semantic-ai/20 flex items-center justify-center gap-1.5"
                >
                    <Plus size={14} /> Add Ticket
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(task.id); }}
                    className="px-3 py-2 bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold transition-colors shadow-sm hover:border-red-200 dark:hover:border-red-900/50"
                    title="Dismiss Suggestion"
                >
                    Dismiss
                </button>
              </div>
          </div>
      );
  }

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onClick}
      className="group relative bg-white dark:bg-[#18181b] rounded-2xl p-4 mb-3 transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 border border-slate-100 dark:border-zinc-800 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-3">
            <div className="flex flex-wrap gap-1.5">
            {task.tags.slice(0, 2).map(tag => (
                <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold ${getTagColor(tag)}`}>{tag}</span>
            ))}
        </div>
            {getPriorityBadge(task.priority)}
      </div>

      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-3 leading-snug">{task.title}</h4>
      
      {totalSubtasks > 0 && (
          <div className="mb-4">
              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500 mb-1.5 font-medium">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-semantic-ai'}`} style={{ width: `${progressPercent}%` }} />
              </div>
          </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-zinc-800/80">
            <div className="flex items-center -space-x-2">
                {task.assignee ? (
                    <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 object-cover" />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-800 flex items-center justify-center"><UserIcon size={12} className="text-slate-400" /></div>
                )}
            </div>

            <div className="flex items-center gap-3">
                {task.dueDate && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE ? 'text-red-500 bg-red-50 dark:bg-red-900/10' : 'text-slate-400 dark:text-zinc-500'}`}>
                        <CalendarIcon size={12} />
                        <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}
                
                <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-600 text-[10px] font-bold">
                    {(task.subtasks?.length || 0) > 0 && <span className="flex items-center gap-0.5"><CheckCircle2 size={12} /> {completedSubtasks}/{totalSubtasks}</span>}
                </div>
            </div>
      </div>
    </div>
  );
};

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskUpdate, onAddTask, onDeleteTask, onSelectTask, currentView, onViewChange, activeProject }) => {
  const [addingToCol, setAddingToCol] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  
  // Filters
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // 'assignee', 'priority', 'date'

  const columns = [
    { id: TaskStatus.TODO, title: 'To Do', countColor: 'bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress', countColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { id: TaskStatus.REVIEW, title: 'Review', countColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { id: TaskStatus.DONE, title: 'Done', countColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  ];

  const filteredTasks = useMemo(() => {
      return tasks.filter(t => {
          if (filterPriority && t.priority !== filterPriority) return false;
          if (filterAssignee && t.assignee?.id !== filterAssignee) return false;
          return true;
      });
  }, [tasks, filterPriority, filterAssignee]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("taskId", id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverCol !== status) setDragOverCol(status);
  };
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== status) {
      onTaskUpdate({ ...task, status });
    }
  };
  const submitNewTask = (status: TaskStatus) => {
    if (!newTaskTitle.trim()) { setAddingToCol(null); return; }
    const newTask: Task = {
        id: `t-${Date.now()}`, title: newTaskTitle, status: status, priority: Priority.MEDIUM,
        assignee: CURRENT_USER, tags: ['General'], dueDate: new Date().toISOString().split('T')[0], weight: 30, subtasks: []
    };
    onAddTask(newTask); setNewTaskTitle(''); setAddingToCol(null);
  };

  const toggleDropdown = (name: string) => {
      if (activeDropdown === name) setActiveDropdown(null);
      else setActiveDropdown(name);
  };

  const TabButton = ({ label, view, icon: Icon }: any) => (
      <button 
        onClick={() => onViewChange(view)}
        className={`relative pb-3 text-sm font-medium flex items-center gap-2 transition-colors
            ${currentView === view 
                ? 'text-semantic-ai dark:text-violet-300 font-bold' 
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
      >
        <Icon size={16} strokeWidth={currentView === view ? 2.5 : 2} /> 
        {label}
        {currentView === view && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-semantic-ai rounded-full"></div>
        )}
      </button>
  );

  return (
    <div className={`flex flex-col bg-slate-50 dark:bg-[#0f1115] ${currentView === ViewMode.PROJECT_BOARD ? 'h-full' : 'flex-none'}`}>
      
      {/* 1. Project Header & Tabs */}
      <div className="px-8 pt-8 pb-0 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] flex-none z-20 shadow-sm relative">
         <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-semantic-ai to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-semantic-ai/20">
                  <Layout size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                     {activeProject?.name || 'Design Project'} 
                     <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Settings size={16} /></button>
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium">Marketing & Design • Q4 Sprint</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3 mr-4">
                  {MOCK_USERS.map(u => (<img key={u.id} src={u.avatar} title={u.name} className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-900 transition-transform hover:scale-110 hover:z-10" />))}
                  <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">+2</button>
               </div>
               
               {/* Export Data Button - Visible only on Overview */}
               {currentView === ViewMode.PROJECT_OVERVIEW && (
                 <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                    <Download size={16} /> 
                    <span className="hidden sm:inline">Export</span>
                 </button>
               )}

               <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"><Share2 size={16} /> Share</button>
            </div>
         </div>

         {/* Project Tabs */}
         <div className="flex items-center gap-8">
            <TabButton label="Overview" view={ViewMode.PROJECT_OVERVIEW} icon={Bot} />
            <TabButton label="List" view={ViewMode.PROJECT_LIST} icon={List} />
            <TabButton label="Board" view={ViewMode.PROJECT_BOARD} icon={Layout} />
            <TabButton label="Calendar" view={ViewMode.PROJECT_CALENDAR} icon={CalendarIcon} />
            <TabButton label="Files" view={ViewMode.PROJECT_FILES} icon={FileText} />
         </div>
      </div>

      {/* Render Filters ONLY if we are in Board View */}
      {currentView === ViewMode.PROJECT_BOARD && (
        <div className="px-8 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-[#0f1115]/80 backdrop-blur-sm flex-none flex items-center justify-between relative z-30 sticky top-0">
            {/* ... Filters content ... */}
            <div className="flex items-center gap-3 overflow-x-visible">
                <div className="relative group">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-semantic-ai transition-colors" />
                    <input placeholder="Search tasks..." className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs w-56 focus:outline-none focus:ring-2 focus:ring-semantic-ai/20 focus:border-semantic-ai transition-all text-slate-700 dark:text-zinc-200 placeholder:text-slate-400 font-medium" />
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-zinc-700 mx-1"></div>
                
                {/* Date Dropdown Placeholder */}
                <div className="relative">
                    <FilterButton 
                        label="Due Date" 
                        icon={CalendarIcon} 
                        isActive={activeDropdown === 'date'}
                        onClick={() => toggleDropdown('date')} 
                    />
                    {activeDropdown === 'date' && (
                        <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
                             <div className="text-xs font-bold text-slate-500 dark:text-zinc-500 mb-2 uppercase tracking-wider px-2">Select Range</div>
                             <div className="space-y-1">
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg flex items-center justify-between text-slate-700 dark:text-zinc-300 font-medium transition-colors">Today</button>
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg flex items-center justify-between text-slate-700 dark:text-zinc-300 font-medium transition-colors">Tomorrow</button>
                                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg flex items-center justify-between text-slate-700 dark:text-zinc-300 font-medium transition-colors">This Week</button>
                             </div>
                             <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                                 <button onClick={() => setActiveDropdown(null)} className="text-xs font-bold px-4 py-2 bg-semantic-ai text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm">Apply</button>
                             </div>
                        </div>
                    )}
                </div>

                {/* Assignee Dropdown */}
                <div className="relative">
                    <FilterButton 
                        label="Assignee" 
                        icon={UserIcon} 
                        activeValue={filterAssignee ? MOCK_USERS.find(u => u.id === filterAssignee)?.name.split(' ')[0] : null} 
                        isActive={activeDropdown === 'assignee'}
                        onClick={() => toggleDropdown('assignee')} 
                    />
                    {activeDropdown === 'assignee' && (
                        <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-2">
                                <button 
                                    onClick={() => { setFilterAssignee(null); setActiveDropdown(null); }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl flex items-center justify-between group font-medium transition-colors"
                                >
                                    <span className="text-slate-600 dark:text-zinc-400">All Members</span>
                                    {!filterAssignee && <Check size={16} className="text-semantic-ai" />}
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2"></div>
                                {MOCK_USERS.map(u => (
                                    <button 
                                        key={u.id}
                                        onClick={() => { setFilterAssignee(u.id); setActiveDropdown(null); }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl flex items-center justify-between group transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={u.avatar} className="w-6 h-6 rounded-full object-cover" />
                                            <span className="text-slate-800 dark:text-zinc-200 font-medium">{u.name}</span>
                                        </div>
                                        {filterAssignee === u.id && <Check size={16} className="text-semantic-ai" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Priority Dropdown */}
                <div className="relative">
                    <FilterButton 
                        label="Priority" 
                        icon={Flag} 
                        activeValue={filterPriority ? filterPriority.toLowerCase() : null} 
                        isActive={activeDropdown === 'priority'}
                        onClick={() => toggleDropdown('priority')} 
                    />
                    {activeDropdown === 'priority' && (
                        <div className="absolute top-full mt-2 left-0 w-52 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                             <div className="p-2 space-y-1">
                                <button 
                                    onClick={() => { setFilterPriority(null); setActiveDropdown(null); }} 
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl text-slate-600 dark:text-zinc-400 flex justify-between items-center font-medium transition-colors"
                                >
                                    <span>All Priorities</span>
                                    {!filterPriority && <Check size={16} className="text-semantic-ai" />}
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-zinc-800 my-1"></div>
                                {Object.values(Priority).map(p => {
                                    const pColor = p === Priority.CRITICAL ? 'text-red-500' : p === Priority.HIGH ? 'text-amber-500' : 'text-blue-500';
                                    return (
                                        <button 
                                            key={p}
                                            onClick={() => { setFilterPriority(p); setActiveDropdown(null); }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl flex items-center justify-between transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Flag size={14} className={pColor} fill="currentColor" />
                                                <span className="capitalize text-slate-800 dark:text-zinc-200 font-medium">{p.toLowerCase()}</span>
                                            </div>
                                            {filterPriority === p && <Check size={16} className="text-semantic-ai" />}
                                        </button>
                                    );
                                })}
                             </div>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={() => setAddingToCol(TaskStatus.TODO)} className="flex items-center gap-2 px-5 py-2 bg-semantic-ai text-white rounded-xl text-sm font-bold shadow-lg shadow-semantic-ai/20 hover:bg-violet-700 transition-transform active:scale-95">
                <Plus size={18} /> New Task
            </button>
        </div>
      )}

      {/* 3. Board Content (With Fixed Scrolling) */}
      {currentView === ViewMode.PROJECT_BOARD && (
        <div 
            className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50 dark:bg-[#0f1115] p-8 no-scrollbar w-full relative z-0"
        >
            <div className="flex h-full gap-8 w-max px-2 pb-8">
                {columns.map(col => {
                    const colTasks = filteredTasks.filter(t => t.status === col.id);
                    const sortedTasks = [...colTasks].sort((a, b) => (Number(b.isGhost) || 0) - (Number(a.isGhost) || 0));
                    const isDragOver = dragOverCol === col.id;
                    return (
                    <div 
                        key={col.id} 
                        className={`flex flex-col h-full rounded-3xl transition-all duration-300 min-w-[340px] w-[340px] flex-shrink-0
                            ${isDragOver 
                                ? 'bg-slate-100/80 dark:bg-zinc-800/80 ring-2 ring-semantic-ai ring-dashed scale-[1.01]' 
                                : 'bg-slate-100/50 dark:bg-[#121417] border border-transparent dark:border-zinc-800/50'
                            }
                        `}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDrop={(e) => handleDrop(e, col.id)}
                        onDragLeave={() => setDragOverCol(null)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between p-4 mb-2">
                            <div className="flex items-center gap-2.5">
                                <h3 className="font-bold text-slate-700 dark:text-zinc-200 text-sm">{col.title}</h3>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${col.countColor.split(' ')[0]} dark:bg-zinc-800 ${col.countColor.split(' ')[1]} dark:text-zinc-400`}>
                                    {colTasks.length}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => setAddingToCol(col.id)} className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors"><Plus size={18} /></button>
                                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors"><MoreHorizontal size={18} /></button>
                            </div>
                        </div>
                        
                        {/* Task List */}
                        <div className="flex-1 overflow-y-auto px-3 pb-20 custom-scrollbar">
                            {addingToCol === col.id && (
                                <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-semantic-ai rounded-2xl mb-4 shadow-xl animate-in zoom-in duration-200">
                                    <input autoFocus className="w-full text-sm font-bold text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 bg-transparent focus:outline-none mb-4" placeholder="What needs to be done?" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitNewTask(col.id)} />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setAddingToCol(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">Cancel</button>
                                        <button onClick={() => submitNewTask(col.id)} className="text-xs font-bold bg-semantic-ai text-white px-4 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">Add Task</button>
                                    </div>
                                </div>
                            )}
                            {sortedTasks.map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onDragStart={handleDragStart} 
                                    onClick={() => onSelectTask && onSelectTask(task)} 
                                    onUpdate={onTaskUpdate} 
                                    onDelete={onDeleteTask}
                                />
                            ))}
                            {colTasks.length === 0 && !addingToCol && (
                                <button onClick={() => setAddingToCol(col.id)} className="w-full py-6 flex items-center justify-center text-slate-400 dark:text-zinc-600 text-sm gap-2 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50 rounded-2xl transition-colors group border-2 border-transparent border-dashed hover:border-slate-300 dark:hover:border-zinc-700/50"><Plus size={18} className="opacity-50 group-hover:scale-110 transition-transform" /><span className="font-bold">Create Task</span></button>
                            )}
                        </div>
                    </div>
                    );
                })}
                
                <div className="w-[340px] min-w-[340px] h-14 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-600 text-sm font-bold hover:border-semantic-ai/50 dark:hover:border-zinc-700 hover:text-semantic-ai hover:bg-slate-50 dark:hover:bg-zinc-800/30 cursor-pointer transition-all flex-shrink-0 group">
                    <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" /> Add Section
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;