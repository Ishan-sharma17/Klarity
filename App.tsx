
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import TaskBoard from './components/TaskBoard.tsx';
import WorkloadHeatmap from './components/WorkloadHeatmap.tsx';
import AISidebar from './components/AISidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import ListView from './components/ListView.tsx';
import Inbox from './components/Inbox.tsx';
import CalendarView from './components/CalendarView.tsx';
import FilesView from './components/FilesView.tsx';
import KlarityReport from './components/KlarityReport.tsx';
import TaskDetailModal from './components/TaskDetailModal.tsx';
import SelfReflect from './components/SelfReflect.tsx';
import SpacesView from './components/SpacesView.tsx';
import { CURRENT_USER, INITIAL_TASKS, HEATMAP_DATA, MOCK_USERS, MOCK_EMAILS } from './constants.ts';
import { ViewMode, Task, Email, ProjectInfo } from './types.ts';
import { ClipboardEdit, Sunrise, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.PROJECT_BOARD);
  const [isAISidebarOpen, setAISidebarOpen] = useState(false);
  const [aiSidebarMode, setAiSidebarMode] = useState<'ASSISTANT' | 'REFLECT'>('ASSISTANT');
  const [shouldExpandBrief, setShouldExpandBrief] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isReportOpen, setReportOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showMorningToast, setShowMorningToast] = useState(false);
  
  // Central State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [user, setUser] = useState(CURRENT_USER);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Active Project State
  const [activeProject, setActiveProject] = useState<ProjectInfo>({
      id: 'p-social-q4',
      name: 'Social Media Q4',
      color: 'bg-pink-500'
  });

  // Active Space State (New)
  const [activeSpaceId, setActiveSpaceId] = useState<string>('ui-kit');

  // Feature 5: Overload State Logic
  const isOverloaded = user.burnoutScore > 80;

  // Auto-trigger Morning Suggestion on mount
  useEffect(() => {
      const timer = setTimeout(() => {
          setShowMorningToast(true);
      }, 1500); // Slight delay for effect
      return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (selectedTask && selectedTask.id === updatedTask.id) {
        setSelectedTask(updatedTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
    }
  };

  const handleUpdateEmail = (updatedEmail: Email) => {
      setEmails(prev => prev.map(e => e.id === updatedEmail.id ? updatedEmail : e));
  };

  const handleAddGhostTasks = (newTasks: Task[]) => {
      setTasks(prev => [...newTasks, ...prev]);
  };

  const handleSelectTask = (task: Task) => {
      setSelectedTask(task);
  };

  const handleOpenMorningBrief = () => {
      setAiSidebarMode('ASSISTANT');
      setShouldExpandBrief(true);
      setAISidebarOpen(true);
      setShowMorningToast(false);
  };

  const toggleAISidebar = () => {
      if (isAISidebarOpen) {
          setAISidebarOpen(false);
          // Reset mode after closing to default assistant
          setTimeout(() => setAiSidebarMode('ASSISTANT'), 300);
      } else {
          setAiSidebarMode('ASSISTANT');
          setAISidebarOpen(true);
      }
  };

  // Logic to determine if we are in the "Project Context"
  const isProjectView = [
      ViewMode.PROJECT_BOARD, 
      ViewMode.PROJECT_LIST, 
      ViewMode.PROJECT_OVERVIEW, 
      ViewMode.PROJECT_CALENDAR, 
      ViewMode.PROJECT_FILES
  ].includes(currentView);

  // Logic to determine if there is a secondary nav (drawer) available
  // Dashboard (HOME) has no secondary items, so it returns false.
  const hasSecondaryNav = currentView !== ViewMode.DASHBOARD;

  return (
    <div className={`${darkMode ? 'dark' : ''} h-full`}>
      <div 
        className={`flex h-screen bg-klarity-bg dark:bg-zinc-950 text-klarity-text dark:text-zinc-100 font-sans overflow-hidden transition-all duration-500
            ${isOverloaded ? 'ring-4 ring-inset ring-red-500/20' : ''}
        `}
      >
        
        {/* Left Navigation */}
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          collapsed={sidebarCollapsed}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          showSecondaryNav={hasSecondaryNav}
          activeProject={activeProject}
          onSelectProject={setActiveProject}
          activeSpaceId={activeSpaceId}
          onSelectSpace={setActiveSpaceId}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-300">
          
          <Header 
            user={user} 
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            toggleAISidebar={toggleAISidebar}
            currentView={currentView}
            showSidebarToggle={hasSecondaryNav}
            isOverloaded={isOverloaded}
            activeProject={activeProject}
            onOpenMorningBrief={handleOpenMorningBrief}
          />

          {/* Canvas */}
          <main className="flex-1 overflow-hidden relative p-0 bg-slate-50/50 dark:bg-zinc-900/50 flex flex-col">
            
            {isProjectView ? (
                 <div className="flex-1 flex flex-col h-full">
                    {/* Render TaskBoard Header Frame */}
                    <TaskBoard 
                        tasks={tasks} 
                        onTaskUpdate={handleUpdateTask} 
                        onAddTask={handleAddTask} 
                        onDeleteTask={handleDeleteTask}
                        onSelectTask={handleSelectTask}
                        currentView={currentView}
                        onViewChange={setCurrentView}
                        activeProject={activeProject}
                    />

                    {/* Inject other views into the body area if NOT Kanban (TaskBoard only renders body for PROJECT_BOARD) */}
                    {currentView !== ViewMode.PROJECT_BOARD && (
                        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-[#0f1115]">
                            {currentView === ViewMode.PROJECT_OVERVIEW && <Dashboard tasks={tasks} user={user} />}
                            {currentView === ViewMode.PROJECT_LIST && (
                                <ListView 
                                    tasks={tasks} 
                                    onUpdateTask={handleUpdateTask} 
                                    onDeleteTask={handleDeleteTask} 
                                    onAddTask={handleAddTask} 
                                    onSelectTask={handleSelectTask}
                                    isProjectContext={true}
                                />
                            )}
                            {currentView === ViewMode.PROJECT_CALENDAR && <CalendarView tasks={tasks} />}
                            {currentView === ViewMode.PROJECT_FILES && <FilesView />}
                        </div>
                    )}
                 </div>
            ) : (
                /* Non-Project Views (Personal / Global) */
                <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-[#0f1115] h-full">
                    {currentView === ViewMode.DASHBOARD && <Dashboard tasks={tasks} user={user} />}
                    {currentView === ViewMode.MY_TASKS && (
                        <ListView 
                            tasks={tasks} 
                            onUpdateTask={handleUpdateTask} 
                            onDeleteTask={handleDeleteTask} 
                            onAddTask={handleAddTask} 
                            onSelectTask={handleSelectTask}
                            isProjectContext={false}
                        />
                    )}
                    {currentView === ViewMode.MY_CALENDAR && <CalendarView tasks={tasks} />}
                    
                    {/* Render SelfReflect for all related sub-views for now */}
                    {(currentView === ViewMode.SELF_REFLECT || currentView === ViewMode.REFLECT_CHECKIN || currentView === ViewMode.REFLECT_HISTORY) && (
                        <SelfReflect 
                            tasks={tasks}
                            user={user}
                            currentView={currentView}
                            onViewChange={setCurrentView}
                        />
                    )}

                    {currentView === ViewMode.HEATMAP && (
                       <WorkloadHeatmap users={MOCK_USERS} data={HEATMAP_DATA} />
                    )}
                    {currentView === ViewMode.INBOX && (
                       <Inbox 
                          emails={emails} 
                          onAddTask={(t) => { handleAddTask(t); setAiSidebarMode('ASSISTANT'); setAISidebarOpen(true); }}
                          onUpdateEmail={handleUpdateEmail}
                       />
                    )}
                    
                    {/* New Spaces View */}
                    {currentView === ViewMode.SPACES && (
                        <SpacesView activeSpaceId={activeSpaceId} />
                    )}
                </div>
            )}

          </main>
        </div>

        {/* Right Intelligence Pane (Feature 4) */}
        <AISidebar 
          isOpen={isAISidebarOpen} 
          onClose={() => setAISidebarOpen(false)} 
          tasks={tasks}
          user={user}
          onAddTasks={handleAddGhostTasks}
          initialMode={aiSidebarMode}
          forceExpandBrief={shouldExpandBrief}
          onBriefExpanded={() => setShouldExpandBrief(false)}
        />

        {/* Morning Suggestion Toast */}
        {showMorningToast && (
            <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-500">
                <div className="bg-white dark:bg-zinc-900 border border-amber-100 dark:border-amber-900/30 rounded-2xl shadow-xl p-4 flex gap-4 max-w-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400 h-fit">
                        <Sunrise size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mb-1">Good morning, {user.name.split(' ')[0]}</h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">Your day has 5 meetings and 3 due tasks.</p>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleOpenMorningBrief}
                                className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                See Brief
                            </button>
                            <button 
                                onClick={() => setShowMorningToast(false)}
                                className="px-3 py-1.5 text-slate-500 dark:text-zinc-500 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowMorningToast(false)}
                        className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 dark:text-zinc-600 dark:hover:text-zinc-400 p-1"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        )}

        {/* EOD Report Trigger (Feature 2) */}
        <div className="fixed bottom-6 right-6 z-40">
          <button 
             onClick={() => setReportOpen(true)}
             className="bg-slate-800 dark:bg-semantic-ai text-white p-4 rounded-full shadow-xl hover:bg-slate-700 dark:hover:bg-violet-600 transition-transform hover:scale-105 flex items-center gap-2 group"
          >
             <ClipboardEdit size={24} />
             <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">End Day</span>
          </button>
        </div>

        {/* Modals */}
        <KlarityReport isOpen={isReportOpen} onClose={() => setReportOpen(false)} />
        {selectedTask && (
            <TaskDetailModal 
                task={selectedTask} 
                isOpen={!!selectedTask} 
                onClose={() => setSelectedTask(null)}
                onUpdate={handleUpdateTask}
                currentUser={user}
            />
        )}

      </div>
    </div>
  );
};

export default App;
