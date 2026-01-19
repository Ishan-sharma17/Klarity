
import React from 'react';
import { User, ViewMode, ProjectInfo } from '../types.ts';
import KlarityOrb from './KlarityOrb.tsx';
import { Bell, Search, PanelRightOpen, PanelLeftClose, PanelLeftOpen, AlertTriangle, Command, Sunrise } from 'lucide-react';

interface HeaderProps {
  user: User;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleAISidebar: () => void;
  currentView?: ViewMode;
  showSidebarToggle: boolean;
  isOverloaded?: boolean;
  activeProject?: ProjectInfo;
  onOpenMorningBrief?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    user, 
    sidebarCollapsed, 
    toggleSidebar, 
    toggleAISidebar, 
    currentView, 
    showSidebarToggle, 
    isOverloaded,
    activeProject,
    onOpenMorningBrief
}) => {

  const getBreadcrumbs = () => {
      if (isOverloaded) return null;

      let parent = 'Space';
      let child = 'Dashboard';

      switch(currentView) {
          case ViewMode.DASHBOARD:
              parent = 'Home';
              child = 'Dashboard';
              break;
          case ViewMode.MY_TASKS:
              parent = 'Workspace';
              child = 'My Tasks';
              break;
          case ViewMode.MY_CALENDAR:
              parent = 'Workspace';
              child = 'Calendar';
              break;
          case ViewMode.INBOX:
              parent = 'Workspace';
              child = 'Inbox';
              break;
          case ViewMode.PROJECT_BOARD:
          case ViewMode.PROJECT_LIST:
          case ViewMode.PROJECT_OVERVIEW:
          case ViewMode.PROJECT_CALENDAR:
          case ViewMode.PROJECT_FILES:
              parent = 'Project';
              child = activeProject?.name || 'Untitled Project';
              break;
          case ViewMode.SPACES:
              parent = 'Spaces';
              child = 'Channel';
              break;
          case ViewMode.SELF_REFLECT:
          case ViewMode.REFLECT_CHECKIN:
          case ViewMode.REFLECT_HISTORY:
              parent = 'Reflect';
              child = 'My Pulse';
              break;
          case ViewMode.HEATMAP:
              parent = 'Team';
              child = 'Workload';
              break;
          default:
              child = currentView ? currentView.charAt(0) + currentView.slice(1).toLowerCase().replace('_', ' ') : 'Dashboard';
      }

      return (
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500 font-medium select-none animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="hover:text-slate-800 dark:hover:text-zinc-300 cursor-pointer transition-colors">{parent}</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-900 dark:text-zinc-100 font-semibold">{child}</span>
        </div>
      );
  };

  return (
    <header className={`h-[72px] bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-300 ${isOverloaded ? 'bg-red-50/50 dark:bg-red-950/10' : ''}`}>
      
      {/* Left: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4 min-w-[200px]">
        {showSidebarToggle && (
          <button 
            onClick={toggleSidebar}
            className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        )}

        {/* Overload Warning or Breadcrumbs */}
        {isOverloaded ? (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 animate-pulse-slow bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                <AlertTriangle size={16} />
                <span className="text-sm font-bold">You're at full capacity today</span>
            </div>
        ) : (
            <div className="hidden md:block">
                {getBreadcrumbs()}
            </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center max-w-xl px-4">
        <div className="relative group w-full hidden sm:block">
           <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-semantic-ai transition-colors" />
           <input 
             type="text" 
             placeholder="Search tasks, projects, or people..." 
             className="w-full pl-10 pr-12 py-2.5 bg-slate-100/50 dark:bg-zinc-800/50 border border-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-sm focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-semantic-ai/20 focus:border-semantic-ai/50 focus:outline-none transition-all text-slate-900 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
           />
           <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
               <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded shadow-sm">
                  <Command size={10} /> K
               </span>
           </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        
        <button className="relative text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
        </button>

        <button 
          onClick={toggleAISidebar}
          className="flex items-center gap-2 text-semantic-ai hover:bg-semantic-aiLight dark:hover:bg-semantic-ai/20 px-3 py-2 rounded-xl transition-all text-sm font-bold active:scale-95 hover:shadow-sm"
          title="Open Klarity AI"
        >
          <PanelRightOpen size={18} />
          <span className="hidden lg:inline">Ask AI</span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-1">
          <div 
              className="flex items-center gap-3 cursor-pointer group relative"
              onClick={toggleAISidebar}
          >
            <div className="relative p-0.5 rounded-full border border-slate-200 dark:border-zinc-700 group-hover:border-semantic-ai transition-colors">
               <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
               <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-zinc-950 rounded-full p-[1px]">
                 <KlarityOrb user={user} size="sm" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
