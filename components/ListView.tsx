import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../types.ts';
import { 
  Calendar as CalendarIcon, 
  Flag, 
  CheckSquare, 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal,
  AlertCircle,
  ArrowUpCircle
} from 'lucide-react';
import { MOCK_USERS } from '../constants.ts';

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  onSelectTask: (task: Task) => void;
  isProjectContext?: boolean;
}

const TableHeader: React.FC<{ isProjectContext?: boolean }> = ({ isProjectContext }) => {
    // If global context, show Project column after Description.
    // Removed Priority Column to match design
    const gridClass = isProjectContext 
        ? "grid-cols-[40px_minmax(250px,1.5fr)_minmax(200px,2fr)_100px_120px_120px_40px]"
        : "grid-cols-[40px_minmax(200px,1.5fr)_minmax(200px,1.5fr)_180px_100px_120px_100px_40px]";

    return (
        <div className={`grid ${gridClass} gap-4 py-4 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider sticky top-0 z-10 items-center`}>
            <div className="flex justify-center"><div className="w-4 h-4 rounded border border-zinc-300 dark:border-zinc-600"></div></div>
            <div className="flex items-center gap-2">Task Name</div>
            <div className="flex items-center gap-2">Description</div>
            {!isProjectContext && <div className="flex items-center gap-2">Project</div>}
            <div className="flex items-center gap-2">People</div>
            <div className="flex items-center gap-2">Tags</div>
            <div className="flex items-center gap-2">Due Date</div>
            {/* Priority Column Removed */}
            <div></div>
        </div>
    );
};

const TaskRow: React.FC<{ task: Task; onSelect: (t: Task) => void; isProjectContext?: boolean; }> = ({ task, onSelect, isProjectContext }) => {
    
    // Type Badge Helper
    const getTypeBadge = (tag: string) => {
        const type = tag.toLowerCase();
        let colors = "bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
        
        if (type.includes('feature')) colors = "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30";
        else if (type.includes('bug')) colors = "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30";
        else if (type.includes('review')) colors = "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-900/30";

        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold w-fit ${colors}`}>
                <span>{tag}</span>
            </div>
        );
    };

    const formatDateRange = (start?: string, end?: string) => {
         const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
         const e = end ? new Date(end) : new Date();
         return <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">{e.toLocaleDateString('en-GB', options)}</span>;
    };

    const gridClass = isProjectContext 
        ? "grid-cols-[40px_minmax(250px,1.5fr)_minmax(200px,2fr)_100px_120px_120px_40px]"
        : "grid-cols-[40px_minmax(200px,1.5fr)_minmax(200px,1.5fr)_180px_100px_120px_100px_40px]";

    return (
        <div 
            onClick={() => onSelect(task)}
            className={`grid ${gridClass} gap-4 py-3 px-6 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-all duration-200 group items-center bg-white dark:bg-[#09090b] cursor-pointer hover:shadow-sm hover:z-10 relative hover:scale-[1.002]`}
        >
            {/* Checkbox */}
            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${task.status === TaskStatus.DONE ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:border-emerald-500'}`}>
                     {task.status === TaskStatus.DONE && <CheckSquare size={12} className="text-white" />}
                </div>
            </div>

            {/* Task Name */}
            <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${task.status === TaskStatus.DONE ? 'text-zinc-400 line-through decoration-zinc-400/50' : 'text-zinc-800 dark:text-zinc-200'} truncate`}>{task.title}</span>
            </div>

            {/* Description */}
            <div className="text-sm text-zinc-500 dark:text-zinc-500 truncate pr-4 font-medium">
                {task.description || "-"}
            </div>

            {/* Project Column (Global View Only) */}
            {!isProjectContext && (
                <div className="flex items-center">
                    {task.project ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800 max-w-full">
                           <div className={`w-2 h-2 rounded-full ${task.project.color || 'bg-slate-400'}`}></div>
                           <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate">{task.project.name}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">No Project</span>
                    )}
                </div>
            )}

            {/* People */}
            <div className="flex -space-x-2">
                {[task.assignee, ...MOCK_USERS].slice(0, 3).map((u, i) => (
                    u && <img key={`${task.id}-u-${i}`} src={u.avatar} className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 transition-transform hover:scale-110 hover:z-10 object-cover" title={u.name} />
                ))}
            </div>

            {/* Tags */}
            <div>
                {getTypeBadge(task.tags[0] || 'Feature')}
            </div>

            {/* Timeline */}
            <div>
                {formatDateRange(task.startDate, task.dueDate)}
            </div>

            {/* Priority - Removed */}

            {/* Action */}
            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>
    );
};

const SectionHeader: React.FC<{ 
    title: string; 
    count: number; 
    theme: 'red' | 'yellow' | 'green' | 'blue';
    isExpanded: boolean;
    onToggle: () => void;
    icon?: React.ReactNode;
}> = ({ title, count, theme, isExpanded, onToggle, icon }) => {
    
    // Refined badges
    let badgeClass = "";
    if (theme === 'red') badgeClass = "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    if (theme === 'yellow') badgeClass = "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
    if (theme === 'green') badgeClass = "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
    if (theme === 'blue') badgeClass = "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";

    return (
        <div className="flex items-center justify-between py-2 px-6 bg-slate-50/50 dark:bg-[#0f1115] group cursor-pointer border-y border-zinc-100 dark:border-zinc-800/50 mt-4 first:mt-0" onClick={onToggle}>
            <div className="flex items-center gap-3">
                 <div className="text-zinc-400 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                 </div>
                 <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold ${badgeClass}`}>
                     {title}
                     <span className="opacity-60 text-[10px] ml-1">({count})</span>
                 </div>
            </div>
            {icon && <div className="opacity-50">{icon}</div>}
        </div>
    );
};


const ListView: React.FC<ListViewProps> = ({ tasks, onSelectTask, isProjectContext }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      [TaskStatus.TODO]: true,
      [TaskStatus.IN_PROGRESS]: true,
      [TaskStatus.DONE]: true,
  });

  const toggleSection = (status: string) => {
      setExpandedSections(prev => ({...prev, [status]: !prev[status]}));
  };

  const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const doneTasks = tasks.filter(t => t.status === TaskStatus.DONE);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0f1115]">
       
       {/* Table Content */}
       <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f1115] p-8 no-scrollbar">
           <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden pb-4 min-h-[500px]">
                <TableHeader isProjectContext={isProjectContext} />
                
                {/* Not Started */}
                <div>
                    <SectionHeader 
                        title="To Do" 
                        count={todoTasks.length} 
                        theme="red"
                        isExpanded={expandedSections[TaskStatus.TODO]}
                        onToggle={() => toggleSection(TaskStatus.TODO)}
                    />
                    {expandedSections[TaskStatus.TODO] && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            {todoTasks.map(task => (
                                <TaskRow key={task.id} task={task} onSelect={onSelectTask} isProjectContext={isProjectContext} />
                            ))}
                            {todoTasks.length === 0 && <div className="p-8 text-center text-sm text-zinc-400 italic">No tasks in To Do</div>}
                        </div>
                    )}
                </div>

                {/* In Progress */}
                <div>
                    <SectionHeader 
                        title="In Progress" 
                        count={inProgressTasks.length} 
                        theme="blue"
                        isExpanded={expandedSections[TaskStatus.IN_PROGRESS]}
                        onToggle={() => toggleSection(TaskStatus.IN_PROGRESS)}
                    />
                    {expandedSections[TaskStatus.IN_PROGRESS] && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            {inProgressTasks.map(task => (
                                <TaskRow key={task.id} task={task} onSelect={onSelectTask} isProjectContext={isProjectContext} />
                            ))}
                            {inProgressTasks.length === 0 && <div className="p-8 text-center text-sm text-zinc-400 italic">No tasks in Progress</div>}
                        </div>
                    )}
                </div>

                {/* Done */}
                <div>
                    <SectionHeader 
                        title="Done" 
                        count={doneTasks.length} 
                        theme="green"
                        isExpanded={expandedSections[TaskStatus.DONE]}
                        onToggle={() => toggleSection(TaskStatus.DONE)}
                    />
                    {expandedSections[TaskStatus.DONE] && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            {doneTasks.map(task => (
                                <TaskRow key={task.id} task={task} onSelect={onSelectTask} isProjectContext={isProjectContext} />
                            ))}
                        </div>
                    )}
                </div>
           </div>
       </div>

    </div>
  );
};

export default ListView;