import React, { useState, useMemo } from 'react';
import { Task } from '../types.ts';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, 
  Search, Filter, MoreHorizontal, Clock, MapPin, Users, Video, 
  AlignLeft, Bell, Share2, Settings, CheckCircle2, ListTodo
} from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
}

type CalendarViewMode = 'day' | 'week' | 'month';
type EventType = 'EVENT' | 'MEETING' | 'TASK';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  description: string;
  attendees?: string[];
  location?: string;
  colorClass: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [activeFilter, setActiveFilter] = useState<'All Scheduled' | 'Events' | 'Meetings' | 'Task Reminders'>('All Scheduled');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // --- Date Helpers ---

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const getDateRangeString = () => {
      const start = getWeekStart(currentDate);
      const end = addDays(start, 6);
      return `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })} - ${end.getDate()} ${end.toLocaleString('default', { month: 'short' })} ${end.getFullYear()}`;
  };

  // --- Dynamic Mock Data Generator ---
  // Generates events relative to the current week view so it always looks populated
  const events = useMemo(() => {
    const weekStart = getWeekStart(currentDate);
    
    const createEvent = (dayOffset: number, startHour: number, duration: number, title: string, type: EventType, description: string): CalendarEvent => {
        const start = addDays(weekStart, dayOffset);
        start.setHours(startHour, (startHour % 1) * 60, 0, 0);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
        
        let colorClass = '';
        if (type === 'MEETING') {
            colorClass = 'bg-blue-100 text-blue-700 border-l-4 border-blue-500 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-500';
        } else if (type === 'EVENT') {
            colorClass = 'bg-purple-100 text-purple-700 border-l-4 border-purple-500 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-500';
        } else { // TASK
            colorClass = 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-500';
        }

        return {
            id: `evt-${dayOffset}-${startHour}`,
            title,
            start,
            end,
            type,
            description,
            attendees: ['Alex Chen', 'Sarah Jones', 'Mike Ross'],
            location: type === 'MEETING' ? 'Google Meet' : undefined,
            colorClass
        };
    };

    const mockEvents: CalendarEvent[] = [
        // Monday
        createEvent(0, 9, 1.5, 'Client Meeting Planning', 'MEETING', 'Discuss strategy with the account manager.'),
        createEvent(0, 13, 1, 'Review Q3 Goals', 'TASK', 'Self-reflection on quarterly targets.'),
        
        // Tuesday
        createEvent(1, 10, 1, 'Design Revisions', 'EVENT', 'Implement feedback from the design crit.'),
        createEvent(1, 14, 2, 'Deep Work: Coding', 'TASK', 'Focus block for the new API integration.'),

        // Wednesday
        createEvent(2, 9, 1, 'New Project Kickoff', 'MEETING', 'Initial requirements gathering for Project Alpha.'),
        createEvent(2, 11, 1.5, 'Team Lunch', 'EVENT', 'Team building session at the cafe.'),
        
        // Thursday
        createEvent(3, 10, 1, 'Design Refinement', 'EVENT', 'Polish the high-fidelity mockups.'),
        createEvent(3, 15, 1, '1:1 with Manager', 'MEETING', 'Weekly sync.'),

        // Friday
        createEvent(4, 9, 1, 'Final Touches', 'EVENT', 'Pre-release checks and polish.'),
        createEvent(4, 11, 1, 'Industry Webinar', 'TASK', 'Learning session: "Future of AI in UX".'),
    ];

    return mockEvents;
  }, [currentDate]);

  const filteredEvents = useMemo(() => {
      if (activeFilter === 'All Scheduled') return events;
      if (activeFilter === 'Events') return events.filter(e => e.type === 'EVENT');
      if (activeFilter === 'Meetings') return events.filter(e => e.type === 'MEETING');
      if (activeFilter === 'Task Reminders') return events.filter(e => e.type === 'TASK');
      return events;
  }, [events, activeFilter]);

  // --- Renderers ---

  const renderWeekView = () => {
      const weekStart = getWeekStart(currentDate);
      const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

      return (
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
              {/* Header Row */}
              <div className="flex border-b border-slate-200 dark:border-zinc-800">
                  <div className="w-16 shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50"></div>
                  {weekDays.map((day, i) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                          <div key={i} className={`flex-1 py-4 text-center border-r border-slate-200 dark:border-zinc-800 last:border-r-0 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-zinc-900'}`}>
                              <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase mb-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              <div className={`text-lg font-bold inline-flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg' : 'text-slate-700 dark:text-zinc-200'}`}>
                                  {day.getDate()}
                              </div>
                          </div>
                      );
                  })}
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto no-scrollbar relative">
                  <div className="flex min-h-[880px]"> {/* 11 hours * 80px */}
                      {/* Time Column */}
                      <div className="w-16 shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 text-right pr-3 py-4 select-none">
                          {hours.map(h => (
                              <div key={h} className="h-20 text-xs font-bold text-slate-400 dark:text-zinc-500 relative -top-2">
                                  {h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}
                              </div>
                          ))}
                      </div>

                      {/* Columns */}
                      {weekDays.map((day, colIndex) => {
                          const isToday = day.toDateString() === new Date().toDateString();
                          const dayEvents = filteredEvents.filter(e => e.start.toDateString() === day.toDateString());

                          return (
                              <div key={colIndex} className={`flex-1 border-r border-slate-200 dark:border-zinc-800 last:border-r-0 relative group ${isToday ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''}`}>
                                  {/* Horizontal Lines */}
                                  {hours.map(h => (
                                      <div key={h} className="h-20 border-b border-slate-100 dark:border-zinc-800/50"></div>
                                  ))}

                                  {/* Current Time Indicator (Visual Mock) */}
                                  {isToday && (
                                      <div className="absolute w-full flex items-center z-20 pointer-events-none" style={{ top: '34%' }}>
                                          <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-sm"></div>
                                          <div className="flex-1 h-px bg-red-500"></div>
                                      </div>
                                  )}

                                  {/* Events */}
                                  {dayEvents.map(event => {
                                      const startHour = event.start.getHours() + event.start.getMinutes() / 60;
                                      const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
                                      const top = (startHour - 8) * 80; // 80px per hour, starting at 8 AM
                                      const height = duration * 80;

                                      return (
                                          <button 
                                              key={event.id}
                                              onClick={() => setSelectedEvent(event)}
                                              className={`absolute left-1 right-2 p-2.5 rounded-lg text-left text-xs font-medium cursor-pointer hover:brightness-95 hover:scale-[1.02] transition-all shadow-sm hover:shadow-md overflow-hidden z-10 ${event.colorClass}`}
                                              style={{ top: `${top}px`, height: `${height}px` }}
                                          >
                                              <div className="font-bold truncate leading-tight mb-0.5 text-sm">{event.title}</div>
                                              <div className="opacity-80 text-[10px] font-semibold flex items-center gap-1">
                                                  <Clock size={10} />
                                                  {event.start.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})} - {event.end.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
                                              </div>
                                          </button>
                                      );
                                  })}
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0f1115]">
      
      {/* HEADER SECTION - Redesigned based on Reference */}
      {/* Container with separation */}
      <div className="flex flex-col bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 shrink-0">
          
          {/* Main Title Bar (App Header Context) */}
          <div className="px-8 pt-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-3">
                    Calendar
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md uppercase tracking-wide">Beta</span>
                  </h1>
              </div>
              <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 mr-2">
                        <img src="https://picsum.photos/id/1012/200/200" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm" />
                        <img src="https://picsum.photos/id/1011/200/200" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm" />
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">+3</div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                      <Share2 size={14} /> Invite
                  </button>
                  <button className="p-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors">
                      <Settings size={16} />
                  </button>
              </div>
          </div>

          {/* CONTROLS SECTION */}
          <div className="px-8 pb-6 flex flex-col gap-6 mt-4">
              
              {/* Row 1: Filter Tabs & Actions */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  
                  {/* Left: Tabs */}
                  <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                      {[
                          { label: 'All Scheduled', icon: CalendarIcon },
                          { label: 'Events', icon: Video },
                          { label: 'Meetings', icon: Users },
                          { label: 'Task Reminders', icon: ListTodo }
                      ].map((item) => (
                          <button
                              key={item.label}
                              onClick={() => setActiveFilter(item.label as any)}
                              className={`flex items-center gap-2 px-1 py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2
                                  ${activeFilter === item.label 
                                      ? 'text-slate-900 dark:text-zinc-100 border-slate-900 dark:border-zinc-100' 
                                      : 'text-slate-500 dark:text-zinc-500 border-transparent hover:text-slate-700 dark:hover:text-zinc-300'}
                              `}
                          >
                              <item.icon size={14} />
                              {item.label}
                          </button>
                      ))}
                  </div>

                  {/* Right: Search & Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                      <div className="relative group flex-1 lg:w-56">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-semantic-ai transition-colors" />
                          <input 
                            placeholder="Search..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-semantic-ai/20 focus:border-semantic-ai transition-all"
                          />
                      </div>
                      <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                          <Filter size={14} /> Filter
                      </button>
                      <button className="p-2 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-500 hover:text-slate-800">
                          <MoreHorizontal size={16} />
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-sm">
                          <Plus size={14} /> New
                      </button>
                  </div>
              </div>

              {/* Row 2: Date & View Toggle */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2">
                  
                  {/* Left: Date Title & Nav */}
                  <div className="flex items-center gap-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                      </h2>
                      <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                          Today
                      </button>
                  </div>

                  {/* Right: View Toggle */}
                  <div className="flex items-center gap-3">
                      {/* Segmented Control */}
                      <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg border border-slate-200 dark:border-zinc-700">
                          {(['day', 'week', 'month'] as const).map(m => (
                              <button
                                  key={m}
                                  onClick={() => setViewMode(m)}
                                  className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${viewMode === m ? 'bg-white dark:bg-zinc-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                              >
                                  {m}
                              </button>
                          ))}
                      </div>
                      
                      {/* Date Range Badge */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 shadow-sm">
                          <CalendarIcon size={14} className="text-slate-400" />
                          {getDateRangeString()}
                      </div>
                  </div>
              </div>

          </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="flex-1 px-8 pb-8 pt-6 flex flex-col overflow-hidden">
          {viewMode === 'week' ? renderWeekView() : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                    <CalendarIcon size={32} className="text-slate-400 dark:text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Work in Progress</h3>
                  <p className="text-slate-500 dark:text-zinc-500 mt-2 text-center max-w-xs">
                      The {viewMode} view is currently under development. Please switch to <span className="font-bold text-slate-700 dark:text-zinc-300">Week View</span> for the full demo.
                  </p>
                  <button onClick={() => setViewMode('week')} className="mt-6 px-6 py-2 bg-semantic-ai text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors">
                      Switch to Week View
                  </button>
              </div>
          )}
      </div>

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedEvent(null)}></div>
           <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-700 p-8 animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3 ${selectedEvent.colorClass.split(' ')[0]} ${selectedEvent.colorClass.split(' ')[1]}`}>
                          {selectedEvent.type === 'MEETING' && <Video size={12} />}
                          {selectedEvent.type === 'TASK' && <CheckCircle2 size={12} />}
                          {selectedEvent.type === 'EVENT' && <CalendarIcon size={12} />}
                          {selectedEvent.type}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 leading-tight">{selectedEvent.title}</h3>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                     <X size={20} />
                  </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                  {/* Time & Location */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">
                              <Clock size={12} /> Time
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                              {selectedEvent.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {selectedEvent.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                              {selectedEvent.start.toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'})}
                          </p>
                      </div>
                      {selectedEvent.location && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                              <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-wide mb-1">
                                  <Video size={12} /> Location
                              </div>
                              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Google Meet</p>
                              <a href="#" className="text-xs text-blue-600 dark:text-blue-400 underline mt-0.5 hover:text-blue-800 transition-colors">Join Call</a>
                          </div>
                      )}
                  </div>

                  {/* Description */}
                  <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-200 mb-2 flex items-center gap-2">
                          <AlignLeft size={16} className="text-slate-400" /> Description
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed bg-slate-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                          {selectedEvent.description}
                      </p>
                  </div>

                  {/* Attendees */}
                  <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-200 mb-3 flex items-center gap-2">
                          <Users size={16} className="text-slate-400" /> Attendees
                      </h4>
                      <div className="flex items-center gap-3">
                          <div className="flex -space-x-3">
                              <img src="https://picsum.photos/id/1005/200/200" className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900" title="Alex" />
                              <img src="https://picsum.photos/id/1011/200/200" className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900" title="Sarah" />
                              <img src="https://picsum.photos/id/1012/200/200" className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900" title="Mike" />
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">+2 others invited</span>
                      </div>
                  </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
                  <button className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
                      {selectedEvent.type === 'MEETING' ? 'Join Meeting' : 'Edit Event'}
                  </button>
                  <button className="px-6 py-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                      Reschedule
                  </button>
              </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;