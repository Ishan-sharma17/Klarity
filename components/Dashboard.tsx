import React, { useState } from 'react';
import { Task, User, TaskStatus } from '../types.ts';
import { MOCK_USERS } from '../constants.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  MoreHorizontal, Filter, ChevronDown, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, Calendar
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  user: User;
}

// Custom Tooltip matching the screenshot design
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e24] border border-zinc-700/50 p-4 rounded-xl shadow-2xl min-w-[180px] z-50">
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">{label} STATISTICS</p>
        <div className="space-y-2">
          {/* Reverse payload to match visual stack order (Top item first in tooltip usually preferred, or match stacking order) */}
          {payload.slice().reverse().map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: entry.fill }} 
                />
                <span className="text-zinc-300 text-xs font-medium">{entry.name}</span>
              </div>
              <span className="text-white font-bold font-mono text-sm">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ tasks, user }) => {
  // State for Chart Functionality
  const [timeRange, setTimeRange] = useState<'Last Month' | 'Last Quarter' | 'Last Year'>('Last Year');
  const [filterType, setFilterType] = useState('All Tasks');

  // --- Derived Data ---
  const completedCount = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const inProgressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const reviewCount = tasks.filter(t => t.status === TaskStatus.REVIEW).length;
  const overdueCount = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.DONE).length;

  const trends = {
    completed: { value: '17%', positive: true },
    inProgress: { value: '5.2%', positive: true },
    review: { value: '8.4%', positive: false },
    overdue: { value: '2.1%', positive: true },
  };

  // Mock Data Sets for Interactivity
  const DATA_SETS = {
      'Last Year': [
        { name: 'Jan', completed: 45, pending: 28 },
        { name: 'Feb', completed: 32, pending: 20 },
        { name: 'Mar', completed: 56, pending: 40 },
        { name: 'Apr', completed: 18, pending: 15 },
        { name: 'May', completed: 78, pending: 30 },
        { name: 'Jun', completed: 45, pending: 25 },
        { name: 'Jul', completed: 48, pending: 35 },
        { name: 'Aug', completed: 20, pending: 15 },
        { name: 'Sep', completed: 80, pending: 45 },
        { name: 'Oct', completed: 52, pending: 28 },
        { name: 'Nov', completed: 35, pending: 20 },
        { name: 'Des', completed: 48, pending: 25 },
      ],
      'Last Quarter': [
        { name: 'Oct', completed: 52, pending: 28 },
        { name: 'Nov', completed: 35, pending: 20 },
        { name: 'Dec', completed: 48, pending: 25 },
      ],
      'Last Month': [
        { name: 'Week 1', completed: 12, pending: 8 },
        { name: 'Week 2', completed: 15, pending: 10 },
        { name: 'Week 3', completed: 8, pending: 12 },
        { name: 'Week 4', completed: 20, pending: 5 },
      ]
  };

  const activityData = DATA_SETS[timeRange];

  // Timeline Data
  const timelineItems = [
    { 
        id: 1, 
        title: 'Weekly Meeting', 
        startTime: 9, 
        duration: 1, 
        color: 'bg-[#064e3b] border-l-4 border-emerald-500', 
        textColor: 'text-emerald-100',
        timeLabel: '9:00 AM'
    },
    { 
        id: 2, 
        title: 'Research & Analysis', 
        startTime: 10.5, 
        duration: 1.5, 
        color: 'bg-[#1e3a8a] border-l-4 border-blue-500', 
        textColor: 'text-blue-100',
        timeLabel: '10:30 AM - 12:00'
    },
    { 
        id: 3, 
        title: 'Design Review', 
        startTime: 11, 
        duration: 1, 
        color: 'bg-[#451a03] border-l-4 border-amber-500', 
        textColor: 'text-amber-100',
        timeLabel: '11:00 AM'
    },
    { 
        id: 4, 
        title: 'Wireframe Development', 
        startTime: 12, 
        duration: 1, 
        color: 'bg-[#3b0764] border-l-4 border-purple-500', 
        textColor: 'text-purple-100',
        timeLabel: '12:00 PM'
    },
  ];

  const getTimelineStyle = (start: number, duration: number) => {
      const startHour = 9;
      const totalHours = 4; // 9am to 1pm
      const left = ((start - startHour) / totalHours) * 100;
      const width = (duration / totalHours) * 100;
      return { left: `${left}%`, width: `${width}%` };
  };

  // --- Components ---

  const StatCard = ({ title, count, trend, icon: Icon, colorClass }: any) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} />
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"><MoreHorizontal size={18} /></button>
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">{title}</h3>
        <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-slate-900 dark:text-zinc-100">{count}</span>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend.value}
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-slate-50 dark:bg-[#0f1115] p-8">
      
      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard 
            title="Tasks Completed" 
            count={completedCount || 72} 
            trend={trends.completed} 
            icon={CheckCircle2}
            colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
         />
         <StatCard 
            title="Tasks In Progress" 
            count={inProgressCount || 145} 
            trend={trends.inProgress} 
            icon={Clock}
            colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
         />
         <StatCard 
            title="Pending Reviews" 
            count={reviewCount || 32} 
            trend={trends.review} 
            icon={Filter}
            colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
         />
         <StatCard 
            title="Overdue Tasks" 
            count={overdueCount || 72} 
            trend={trends.overdue} 
            icon={AlertCircle}
            colorClass="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
         />
      </div>

      {/* 3. Main Chart & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left: Activity Chart (Redesigned) */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Team Activity Summary</h3>
                   <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">Discover team engagement and collaboration frequency.</p>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setFilterType(filterType === 'All Tasks' ? 'My Tasks' : 'All Tasks')}
                     className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                   >
                      <Filter size={14} /> {filterType}
                   </button>
                   <div className="relative group">
                       <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                          {timeRange} <ChevronDown size={14} />
                       </button>
                       <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden hidden group-hover:block z-20">
                           {['Last Month', 'Last Quarter', 'Last Year'].map(range => (
                               <button 
                                key={range} 
                                onClick={() => setTimeRange(range as any)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700"
                               >
                                   {range}
                               </button>
                           ))}
                       </div>
                   </div>
                </div>
             </div>
             
             {/* Legend */}
             <div className="flex gap-6 mb-4">
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-semantic-ai"></div>
                     <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Completed</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#c4b5fd' }}></div>
                     <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Pending</span>
                 </div>
             </div>

             <div className="flex-1 min-h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} barGap={0}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#71717a" opacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#71717a', fontSize: 12, fontWeight: 600}} 
                        dy={10} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#71717a', fontSize: 12, fontWeight: 600}} 
                      />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{fill: '#71717a', opacity: 0.1, radius: 4}}
                      />
                      <Bar 
                        dataKey="completed" 
                        stackId="a"
                        fill="#7c3aed" 
                        radius={[0, 0, 4, 4]} 
                        barSize={40} 
                      />
                      <Bar 
                        dataKey="pending" 
                        stackId="a"
                        fill="#c4b5fd" 
                        radius={[4, 4, 0, 0]} 
                        barSize={40} 
                      />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Right: Timeline (Interactive & Matched) */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col h-full">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Task Timeline</h3>
                   <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">Track your tasks and schedules.</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"><MoreHorizontal size={18} /></button>
             </div>

             {/* Timeline Visual - Gantt Style */}
             <div className="flex-1 relative flex flex-col">
                 {/* Time Grid Header */}
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 mb-4 px-2 border-b border-slate-100 dark:border-zinc-800 pb-2">
                     <span>09.00 AM</span>
                     <span>10.00 AM</span>
                     <span>11.00 AM</span>
                     <span>12.00 AM</span>
                 </div>
                 
                 {/* Grid Body */}
                 <div className="relative flex-1">
                     {/* Vertical Grid Lines */}
                     <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                         {[0, 1, 2, 3].map(i => (
                             <div key={i} className="w-px h-full border-l border-dashed border-slate-200 dark:border-zinc-800/60"></div>
                         ))}
                     </div>

                     {/* Events Stacking */}
                     <div className="relative space-y-4 mt-2 h-full">
                         {timelineItems.map((item, i) => (
                             <div 
                               key={item.id}
                               className={`absolute h-16 rounded-xl shadow-sm cursor-pointer hover:brightness-110 hover:scale-[1.02] hover:z-10 transition-all duration-300 group overflow-hidden ${item.color} border-l-[6px]`}
                               style={{ 
                                   ...getTimelineStyle(item.startTime, item.duration),
                                   top: `${i * 70}px` 
                               }}
                               onClick={() => alert(`Opening details for: ${item.title}`)}
                             >
                                <div className="h-full flex flex-col justify-center px-4">
                                    <div className={`text-xs font-bold leading-tight truncate text-white`}>{item.title}</div>
                                    <div className={`text-[10px] font-semibold mt-1 opacity-80 truncate ${item.textColor}`}>{item.timeLabel}</div>
                                </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
          </div>
      </div>

      {/* 4. Workload Overview Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Workload Overview</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">Monitor team workload and identify imbalances.</p>
             </div>
             <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800">
                   <Filter size={14} /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800">
                   Last Month <ChevronDown size={14} />
                </button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                   <tr className="bg-slate-50/50 dark:bg-zinc-800/30 text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-8 py-4">Name</th>
                      <th className="px-8 py-4">Completed</th>
                      <th className="px-8 py-4">Pending</th>
                      <th className="px-8 py-4">Blocked</th>
                      <th className="px-8 py-4">Department</th>
                      <th className="px-8 py-4">Load Level</th>
                      <th className="px-8 py-4 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                   {MOCK_USERS.map((u, i) => {
                      const completed = [80, 110, 50, 92][i] || 60;
                      const pending = [12, 25, 9, 15][i] || 10;
                      const blocked = [3, 6, 2, 4][i] || 1;
                      const dept = ['Product Team', 'Engineering', 'Frontend', 'Design'][i] || 'General';
                      const loadLevel = u.burnoutScore > 70 ? 'High' : u.burnoutScore < 30 ? 'Low' : 'Medium';
                      const loadColor = loadLevel === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                                        loadLevel === 'Low' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                                        'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';

                      return (
                         <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-8 py-4">
                               <div className="flex items-center gap-3">
                                  <img src={u.avatar} className="w-9 h-9 rounded-full object-cover" />
                                  <span className="font-bold text-slate-700 dark:text-zinc-200">{u.name}</span>
                                </div>
                            </td>
                            <td className="px-8 py-4 text-slate-600 dark:text-zinc-400 font-medium">{completed} Tasks</td>
                            <td className="px-8 py-4 text-slate-600 dark:text-zinc-400 font-medium">{pending} Tasks</td>
                            <td className="px-8 py-4 text-slate-600 dark:text-zinc-400 font-medium">{blocked} Tasks</td>
                            <td className="px-8 py-4 text-slate-600 dark:text-zinc-400 font-medium">{dept}</td>
                            <td className="px-8 py-4">
                               <span className={`px-3 py-1 rounded-lg text-xs font-bold ${loadColor}`}>
                                  {loadLevel}
                               </span>
                            </td>
                            <td className="px-8 py-4 text-right">
                               <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                  <MoreHorizontal size={16} />
                               </button>
                            </td>
                         </tr>
                      );
                   })}
                </tbody>
             </table>
          </div>
      </div>

    </div>
  );
};

export default Dashboard;