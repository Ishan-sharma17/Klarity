import React, { useMemo, useState } from 'react';
import { 
  Home, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Users, 
  Inbox, 
  Plus, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Briefcase, 
  FolderOpen, 
  Folder, 
  Hash, 
  Heart, 
  Activity, 
  History,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Flame,
  Zap,
  GitBranch,
  Megaphone,
  Palette,
  CornerDownRight
} from 'lucide-react';
import { ViewMode, ProjectInfo } from '../types.ts';
import KlarityOrb from './KlarityOrb.tsx';
import { CURRENT_USER } from '../constants.ts';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  collapsed: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showSecondaryNav: boolean;
  activeProject?: ProjectInfo;
  onSelectProject?: (project: ProjectInfo) => void;
  activeSpaceId?: string;
  onSelectSpace?: (id: string) => void;
}

interface ProjectItem {
  id: string;
  name: string;
  isFolder: boolean;
  isOpen?: boolean;
  subProjects?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, 
    onViewChange, 
    collapsed, 
    darkMode, 
    toggleDarkMode, 
    showSecondaryNav,
    activeProject,
    onSelectProject,
    activeSpaceId,
    onSelectSpace
}) => {
  
  const [projects, setProjects] = useState<ProjectItem[]>([
    { 
      id: 'marketing-design', 
      name: 'Marketing & Design', 
      isFolder: true, 
      isOpen: true, 
      subProjects: ['Social Media Q4', 'Website Refresh', 'Email Campaigns'] 
    },
    { 
      id: 'mobile-launch', 
      name: 'Mobile App Launch', 
      isFolder: false 
    },
    { 
      id: 'q4-rebrand', 
      name: 'Q4 Rebrand', 
      isFolder: false 
    }
  ]);

  // Space/Channel State
  const [spacesOpen, setSpacesOpen] = useState(true);

  const toggleProject = (id: string) => {
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, isOpen: !p.isOpen } : p
      ));
  };

  const handleAddProject = (e: React.MouseEvent) => {
      e.stopPropagation();
      const name = prompt("Enter new project name:");
      if (name) {
         setProjects(prev => [...prev, { 
             id: `p-${Date.now()}`, 
             name, 
             isFolder: true, 
             isOpen: true, 
             subProjects: [] 
         }]);
      }
  };

  const handleCreateSpace = (e: React.MouseEvent) => {
      e.stopPropagation();
      const name = prompt("Create new Space/Channel:");
      if (name) {
          // In a real app, this would dispatch an action. For now, alert.
          alert(`Created new space: ${name}`);
      }
  };

  const activeCategory = useMemo(() => {
    if (currentView === ViewMode.DASHBOARD) return 'HOME';
    if ([ViewMode.SELF_REFLECT, ViewMode.REFLECT_CHECKIN, ViewMode.REFLECT_HISTORY].includes(currentView)) return 'REFLECT';
    if (currentView === ViewMode.SPACES) return 'SPACES';
    return 'WORKSPACE';
  }, [currentView]);

  const handleCategoryClick = (category: 'HOME' | 'WORKSPACE' | 'REFLECT' | 'SPACES') => {
      if (category === activeCategory) return;
      
      switch(category) {
          case 'HOME':
              onViewChange(ViewMode.DASHBOARD);
              break;
          case 'WORKSPACE':
              onViewChange(ViewMode.MY_TASKS);
              break;
          case 'REFLECT':
              onViewChange(ViewMode.SELF_REFLECT);
              break;
          case 'SPACES':
              onViewChange(ViewMode.SPACES);
              break;
      }
  };

  const isProjectView = [
      ViewMode.PROJECT_OVERVIEW, 
      ViewMode.PROJECT_LIST, 
      ViewMode.PROJECT_BOARD, 
      ViewMode.PROJECT_CALENDAR, 
      ViewMode.PROJECT_FILES
  ].includes(currentView);
  
  const RailItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
    <button
      onClick={onClick}
      className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 group mb-3
        ${active 
          ? 'bg-semantic-ai text-white shadow-lg shadow-semantic-ai/30 scale-100' 
          : 'text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
        }
      `}
      title={label}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
      {badge && (
         <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950 font-bold shadow-sm z-10">
           {badge}
         </span>
      )}
      <span className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </span>
    </button>
  );

  const MenuItem = ({ icon: Icon, label, active, onClick, count, indent = false, badgeColor }: any) => (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm group font-medium
        ${active 
          ? 'bg-semantic-aiLight dark:bg-semantic-ai/10 text-semantic-ai dark:text-violet-300' 
          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200'
        }
        ${indent ? 'pl-9' : ''}
      `}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-semantic-ai rounded-r-full"></div>}
      
      {Icon && <Icon size={18} className={`${active ? 'text-semantic-ai dark:text-violet-300' : 'text-slate-400 dark:text-zinc-500'} group-hover:scale-105 transition-transform`} strokeWidth={2} />}
      <span className="flex-1 text-left truncate tracking-tight">{label}</span>
      {count && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeColor ? badgeColor : (active ? 'bg-white dark:bg-zinc-900 text-semantic-ai shadow-sm' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500')}`}>
          {count}
        </span>
      )}
    </button>
  );

  const SectionHeader = ({ label, action, onAction }: any) => (
    <div className="flex items-center justify-between px-3 mt-8 mb-3 group cursor-pointer">
       <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors uppercase tracking-widest">
         {label}
       </div>
       {action && (
         <button onClick={onAction} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-semantic-ai dark:hover:text-violet-300 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all">
            <Plus size={14} />
         </button>
       )}
    </div>
  );

  return (
    <div className="h-full flex flex-row">
      <div className="w-[72px] flex flex-col items-center py-6 bg-white dark:bg-[#09090b] border-r border-slate-200 dark:border-zinc-800 shrink-0 z-30">
        <div className="mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Sparkles size={22} fill="currentColor" className="text-white" />
            </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-2 w-full px-2 items-center">
            <RailItem 
            icon={Home} 
            label="Home"
            active={activeCategory === 'HOME'}
            onClick={() => handleCategoryClick('HOME')}
            />

            <RailItem 
            icon={Briefcase} 
            label="Workspace" 
            active={activeCategory === 'WORKSPACE'}
            onClick={() => handleCategoryClick('WORKSPACE')}
            badge="3"
            />

            <RailItem 
            icon={MessageSquare} 
            label="Spaces" 
            active={activeCategory === 'SPACES'}
            onClick={() => handleCategoryClick('SPACES')}
            badge="5"
            />

            <RailItem 
            icon={Heart} 
            label="Reflect" 
            active={activeCategory === 'REFLECT'}
            onClick={() => handleCategoryClick('REFLECT')}
            />
        </div>

        <div className="mt-auto flex flex-col gap-4 items-center mb-4">
             <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <div className="w-8 h-px bg-slate-100 dark:bg-zinc-800"></div>
             <div className="relative cursor-pointer group">
              <img src={CURRENT_USER.avatar} className="w-9 h-9 rounded-full border-2 border-slate-100 dark:border-zinc-800 hover:border-semantic-ai dark:hover:border-semantic-ai transition-colors object-cover shadow-sm" alt="Profile" />
              <div className="absolute -bottom-1 -right-1 scale-75 group-hover:scale-90 transition-transform bg-white dark:bg-zinc-950 rounded-full p-0.5">
                <KlarityOrb user={CURRENT_USER} size="sm" />
              </div>
           </div>
        </div>
      </div>

      <div 
         className={`bg-slate-50/80 dark:bg-[#121214] border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-all duration-300 overflow-hidden backdrop-blur-xl
         ${(collapsed || !showSecondaryNav) ? 'w-0 opacity-0 border-none' : 'w-64 opacity-100'}
         `}
      >
           <div className="h-[72px] flex items-center px-5 border-b border-slate-200/50 dark:border-zinc-800/50 shrink-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm w-full">
                 <span className="w-2 h-2 rounded-full bg-semantic-ai"></span>
                 {activeCategory === 'WORKSPACE' && "My Workspace"}
                 {activeCategory === 'HOME' && "Home"}
                 {activeCategory === 'REFLECT' && "Employee View"}
                 {activeCategory === 'SPACES' && "Channels"}
              </h2>
           </div>

           <div className="flex-1 overflow-y-auto px-3 py-2 no-scrollbar">
              
              {activeCategory === 'SPACES' && (
                  <div className="animate-in slide-in-from-left-4 duration-300">
                      {/* Favorites Section */}
                      <SectionHeader label="Favorites" />
                      <div className="space-y-1 mb-6">
                          <button className="relative w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm group font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200">
                              <img src="https://picsum.photos/id/1011/200/200" className="w-5 h-5 rounded-full" />
                              <span className="flex-1 text-left truncate">Sophia Wilson</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500">2</span>
                          </button>
                          <MenuItem 
                              icon={Hash} 
                              label="Front-end" 
                              active={activeSpaceId === 'front-end'} 
                              onClick={() => onSelectSpace && onSelectSpace('front-end')}
                              count="4"
                          />
                      </div>

                      {/* Spaces List */}
                      <SectionHeader label="Spaces" action onAction={handleCreateSpace} />
                      <div className="space-y-1">
                          <MenuItem 
                            icon={Flame} 
                            label="General" 
                            active={activeSpaceId === 'general'} 
                            onClick={() => onSelectSpace && onSelectSpace('general')}
                            count="1" 
                            badgeColor="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" 
                          />
                          <MenuItem 
                            icon={Hash} 
                            label="Front-end" 
                            active={activeSpaceId === 'front-end'}
                            onClick={() => onSelectSpace && onSelectSpace('front-end')} 
                            count="4" 
                          />
                          <MenuItem 
                            icon={Hash} 
                            label="Website" 
                            active={activeSpaceId === 'website'}
                            onClick={() => onSelectSpace && onSelectSpace('website')}
                          />
                          
                          {/* Nested Space */}
                          <div>
                              <button 
                                  onClick={() => setSpacesOpen(!spacesOpen)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                              >
                                  <span className="text-purple-500"><Sparkles size={16} /></span>
                                  <span className="flex-1 text-left font-semibold">v3.0</span>
                                  {spacesOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                              </button>
                              
                              {spacesOpen && (
                                  <div className="ml-2 pl-2 border-l border-slate-200 dark:border-zinc-800 mt-1 space-y-0.5">
                                      <MenuItem label="Wireframe" indent />
                                      <MenuItem label="Design" indent />
                                      <MenuItem 
                                        label="UI-kit design" 
                                        indent 
                                        active={activeSpaceId === 'ui-kit'} 
                                        onClick={() => onSelectSpace && onSelectSpace('ui-kit')}
                                        icon={CornerDownRight} 
                                      />
                                  </div>
                              )}
                          </div>

                          <MenuItem icon={Hash} label="v2.0 - actual version" active={false} />
                          <MenuItem icon={GitBranch} label="Strategy" active={false} />
                          <MenuItem icon={Zap} label="Events" active={false} />
                          <MenuItem icon={Megaphone} label="Announcements" active={false} />
                          <MenuItem icon={Palette} label="UI/UX" active={false} count="2" />
                      </div>
                  </div>
              )}

              {/* ... Rest of components ... */}
              {activeCategory === 'REFLECT' && (
                  <div className="animate-in slide-in-from-left-4 duration-300">
                    <SectionHeader label="Reflect & Grow" />
                    <div className="space-y-1">
                        <MenuItem 
                        icon={Activity} 
                        label="My Pulse" 
                        active={currentView === ViewMode.SELF_REFLECT}
                        onClick={() => onViewChange(ViewMode.SELF_REFLECT)}
                        count="AI"
                        />
                        <MenuItem 
                        icon={CheckCircle2} 
                        label="Weekly Check-In" 
                        active={currentView === ViewMode.REFLECT_CHECKIN}
                        onClick={() => onViewChange(ViewMode.REFLECT_CHECKIN)}
                        />
                        <MenuItem 
                        icon={History} 
                        label="My History"
                        active={currentView === ViewMode.REFLECT_HISTORY}
                        onClick={() => onViewChange(ViewMode.REFLECT_HISTORY)}
                        />
                    </div>
                  </div>
              )}

              {activeCategory === 'WORKSPACE' && (
                  <div className="animate-in slide-in-from-left-4 duration-300">
                    <SectionHeader label="My Work" />
                    <div className="space-y-1 mb-6">
                        <MenuItem 
                        icon={Inbox} 
                        label="Inbox" 
                        active={currentView === ViewMode.INBOX}
                        onClick={() => onViewChange(ViewMode.INBOX)}
                        count="3"
                        badgeColor="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                        />
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
                    </div>

                    <SectionHeader label="Projects" action onAction={handleAddProject} />
                    <div className="space-y-1">
                        {projects.map(p => (
                            <div key={p.id}>
                                <button 
                                    onClick={() => toggleProject(p.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors ${activeProject?.id === p.id ? 'bg-slate-100 dark:bg-zinc-800 font-semibold' : ''}`}
                                >
                                    <span className="p-0.5 rounded text-slate-400 hover:text-slate-600">
                                        {p.isFolder ? (
                                            p.isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
                                        ) : (
                                            <Hash size={16} />
                                        )}
                                    </span>
                                    <span className="flex-1 text-left truncate">{p.name}</span>
                                </button>
                                
                                {p.isFolder && p.isOpen && p.subProjects && (
                                    <div className="ml-4 pl-3 border-l border-slate-200 dark:border-zinc-800 mt-1 space-y-0.5">
                                        {p.subProjects.map(sub => (
                                            <MenuItem 
                                                key={sub}
                                                label={sub}
                                                active={activeProject?.name === sub && isProjectView}
                                                onClick={() => {
                                                    if(onSelectProject) onSelectProject({id: `sp-${sub}`, name: sub});
                                                    onViewChange(ViewMode.PROJECT_BOARD);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  </div>
              )}
           </div>
           
           <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <button className="w-full flex items-center gap-3 justify-center py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-zinc-800 dark:to-zinc-700 text-white text-xs font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                 <Sparkles size={14} className="text-amber-300 fill-amber-300" />
                 <span>Upgrade to Pro</span>
              </button>
           </div>
      </div>
    </div>
  );
};

export default Sidebar;