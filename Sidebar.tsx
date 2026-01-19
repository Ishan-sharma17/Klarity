
import React from 'react';
import { 
  Home, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Users, 
  FileText, 
  LayoutDashboard, 
  Tv, 
  MoreHorizontal, 
  Inbox, 
  MessageSquare, 
  UserCircle, 
  Hash, 
  Plus, 
  ChevronDown, 
  Sun, 
  Moon,
  Search,
  Zap,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Briefcase
} from 'lucide-react';
import { ViewMode } from '../types.ts';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  collapsed: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, collapsed, darkMode, toggleDarkMode }) => {
  
  // -- Components --
  
  const RailItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group mb-3
        ${active 
          ? 'bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md' 
          : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200'
        }
      `}
      title={label}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      {badge && (
         <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 font-bold">
           {badge}
         </span>
      )}
    </button>
  );

  const MenuItem = ({ icon: Icon, label, active, onClick, count, indent = false, badgeColor }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 text-sm group
        ${active 
          ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium' 
          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200'
        }
        ${indent ? 'pl-9' : ''}
      `}
    >
      {Icon && <Icon size={16} className={`${active ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500'} group-hover:scale-105 transition-transform`} />}
      <span className="flex-1 text-left truncate">{label}</span>
      {count && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badgeColor ? badgeColor : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'}`}>
          {count}
        </span>
      )}
    </button>
  );

  const SectionHeader = ({ label, action }: any) => (
    <div className="flex items-center justify-between px-3 mt-6 mb-2 group cursor-pointer">
       <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors uppercase tracking-wider">
         {label}
       </div>
       {action && (
         <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <Plus size={12} />
         </button>
       )}
    </div>
  );

  return (
    <div className="h-full flex flex-row">
      
      {/* 1. Icon Rail (Leftmost) - Prioritized Order */}
      <div className="w-16 flex flex-col items-center py-4 bg-slate-50 dark:bg-[#0f1115] border-r border-klarity-border dark:border-zinc-800 shrink-0 z-20">
        <div className="mb-6">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-semantic-ai to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
             <Home size={20} />
           </div>
        </div>

        <div className="flex-1 flex flex-col w-full px-2 items-center">
           {/* Primary Views */}
           <RailItem 
              icon={Inbox} 
              label="Inbox" 
              active={currentView === ViewMode.INBOX}
              onClick={() => onViewChange(ViewMode.INBOX)} 
              badge="3"
           />
           <RailItem 
              icon={CheckCircle2} 
              label="My Tasks" 
              active={currentView === ViewMode.MY_TASKS}
              onClick={() => onViewChange(ViewMode.MY_TASKS)} 
           />
           <RailItem 
              icon={LayoutDashboard} 
              label="Overview" 
              active={currentView === ViewMode.DASHBOARD}
              onClick={() => onViewChange(ViewMode.DASHBOARD)} 
           />
           
           <div className="w-8 h-px bg-slate-200 dark:bg-zinc-800 my-2"></div>

           {/* Secondary Views */}
           <RailItem 
              icon={CalendarIcon} 
              label="Planner" 
              active={currentView === ViewMode.MY_CALENDAR}
              onClick={() => onViewChange(ViewMode.MY_CALENDAR)} 
           />
           <RailItem 
              icon={Briefcase} 
              label="Projects" 
              active={currentView === ViewMode.PROJECT_BOARD}
              onClick={() => onViewChange(ViewMode.PROJECT_BOARD)} 
           />
           <RailItem 
              icon={Users} 
              label="Teams" 
              active={currentView === ViewMode.HEATMAP}
              onClick={() => onViewChange(ViewMode.HEATMAP)} 
           />

           <div className="mt-auto flex flex-col gap-2">
             <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
           </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 w-full flex justify-center">
           <img src="https://picsum.photos/id/1005/200/200" className="w-8 h-8 rounded-full border border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 transition-colors cursor-pointer" alt="Profile" />
        </div>
      </div>

      {/* 2. Context Panel (Drawer) */}
      <div 
         className={`bg-slate-50/50 dark:bg-[#15171b] border-r border-klarity-border dark:border-zinc-800 flex flex-col transition-all duration-300 overflow-hidden
         ${collapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}
         `}
      >
           
           {/* Panel Header */}
           <div className="h-16 flex items-center px-4 border-b border-klarity-border dark:border-zinc-800 shrink-0">
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 px-2 py-1 rounded-md transition-colors w-full">
                 Team Space
                 <ChevronDown size={14} className="text-slate-400 ml-auto" />
              </h2>
           </div>

           {/* Scrollable List */}
           <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
              
              {/* Essentials */}
              <SectionHeader label="Essentials" />
              <div className="space-y-0.5 mb-4">
                 <MenuItem 
                   icon={Inbox} 
                   label="Inbox" 
                   active={currentView === ViewMode.INBOX}
                   onClick={() => onViewChange(ViewMode.INBOX)}
                   count="3"
                   badgeColor="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                 />
                 <MenuItem 
                   icon={LayoutDashboard} 
                   label="Dashboard" 
                   active={currentView === ViewMode.DASHBOARD}
                   onClick={() => onViewChange(ViewMode.DASHBOARD)}
                 />
              </div>

              {/* My Work Area - Prioritized */}
              <SectionHeader label="My Work" />
              <div className="space-y-0.5 mb-4">
                 <MenuItem 
                   icon={CheckCircle2} 
                   label="My Tasks" 
                   active={currentView === ViewMode.MY_TASKS}
                   onClick={() => onViewChange(ViewMode.MY_TASKS)}
                   count="12"
                 />
                 <MenuItem 
                   icon={CalendarIcon} 
                   label="Calendar" 
                   active={currentView === ViewMode.MY_CALENDAR}
                   onClick={() => onViewChange(ViewMode.MY_CALENDAR)}
                 />
                 <MenuItem 
                   icon={FileText} 
                   label="Documents" 
                   active={false}
                   onClick={() => {}}
                 />
              </div>

              {/* Projects & Spaces */}
              <SectionHeader label="Projects" action />
              <div className="space-y-0.5 mb-4">
                  <MenuItem 
                     icon={Zap} 
                     label="Sprint Board" 
                     active={[ViewMode.PROJECT_BOARD, ViewMode.PROJECT_LIST, ViewMode.PROJECT_OVERVIEW, ViewMode.PROJECT_CALENDAR, ViewMode.PROJECT_FILES].includes(currentView)}
                     onClick={() => onViewChange(ViewMode.PROJECT_BOARD)}
                  />
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-800 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800/50 rounded-lg mt-2">
                     <Layers size={16} className="text-purple-500" />
                     Marketing & Design
                  </div>
                  <div className="ml-2 pl-2 border-l border-slate-200 dark:border-zinc-800 space-y-0.5 mt-1">
                      <MenuItem label="Campaigns" indent />
                      <MenuItem label="Creative Assets" indent />
                  </div>
              </div>

              {/* Team */}
              <SectionHeader label="Team" action />
              <div className="space-y-0.5">
                 <MenuItem 
                   icon={Users} 
                   label="Workload" 
                   active={currentView === ViewMode.HEATMAP}
                   onClick={() => onViewChange(ViewMode.HEATMAP)}
                 />
                 <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/30 cursor-pointer group mt-1">
                    <div className="relative">
                       <img src="https://picsum.photos/id/1011/200/200" className="w-5 h-5 rounded-full grayscale opacity-70" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200">Sarah Jones</span>
                 </div>
              </div>

           </div>
           
           {/* Upgrade Prompt */}
           <div className="p-3 border-t border-klarity-border dark:border-zinc-800">
              <button className="w-full flex items-center gap-2 justify-center py-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 dark:from-zinc-800 dark:to-zinc-700 text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity">
                 <Sparkles size={14} className="text-amber-300" />
                 Upgrade to Pro
              </button>
           </div>
        </div>
    </div>
  );
};

export default Sidebar;
