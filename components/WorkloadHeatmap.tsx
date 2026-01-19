import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { User, WorkloadCell } from '../types.ts';
import { AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import KlarityOrb from './KlarityOrb.tsx';

interface WorkloadHeatmapProps {
  users: User[];
  data: Record<string, WorkloadCell[]>;
}

const WorkloadHeatmap: React.FC<WorkloadHeatmapProps> = ({ users, data }) => {
  
  // Helper to determine cell color based on ad-hoc tax intensity
  const getIntensityColor = (cell: WorkloadCell, user: User) => {
    // Burnout risk override
    if (user.burnoutScore > 80 && cell.hours > 8) return 'bg-red-500';
    
    // Gradient based on Ad-hoc percentage - using brand violet/purple
    if (cell.adHocPercentage > 50) return 'bg-purple-600';
    if (cell.adHocPercentage > 30) return 'bg-purple-400';
    if (cell.adHocPercentage > 15) return 'bg-purple-300';
    return 'bg-slate-200 dark:bg-zinc-700';
  };

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto no-scrollbar pb-24">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-klarity-border dark:border-zinc-800 shadow-sm flex items-start justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium uppercase tracking-wide">Team Burnout Risk</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mt-1">Medium</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">2 members &gt; 70% capacity</p>
          </div>
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
            <AlertTriangle size={20} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-klarity-border dark:border-zinc-800 shadow-sm flex items-start justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium uppercase tracking-wide">Hidden Workload</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mt-1">24%</h3>
            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> -4% vs last week
            </p>
          </div>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* The Heatmap Grid */}
      <div className="bg-white dark:bg-zinc-900 border border-klarity-border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="p-6 border-b border-klarity-border dark:border-zinc-800 flex justify-between items-center">
          <h2 className="font-semibold text-lg text-slate-800 dark:text-zinc-100">Resource Heatmap</h2>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
              <span className="text-slate-500 dark:text-zinc-400">High Ad-hoc Tax</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
               <span className="text-slate-500 dark:text-zinc-400">Burnout Risk</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-100 dark:border-zinc-800 text-xs font-semibold text-slate-500 dark:text-zinc-500 w-64 sticky left-0 bg-white dark:bg-zinc-900 z-10 transition-colors">Team Member</th>
                {Array.from({length: 7}).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6-i));
                    return (
                        <th key={i} className="p-4 border-b border-slate-100 dark:border-zinc-800 text-xs font-semibold text-slate-500 dark:text-zinc-500 text-center">
                            {d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </th>
                    )
                })}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td className="p-4 border-b border-slate-50 dark:border-zinc-800/50 sticky left-0 bg-white dark:bg-zinc-900 group-hover:bg-slate-50/50 dark:group-hover:bg-zinc-800/30 z-10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700" alt={user.name} />
                        <div className="absolute -bottom-1 -right-1 scale-75">
                           <KlarityOrb user={user} size="sm" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-zinc-200">{user.name}</div>
                        <div className="text-xs text-slate-500 dark:text-zinc-500">{user.role}</div>
                      </div>
                    </div>
                  </td>
                  {(data[user.id] || []).map((cell, idx) => (
                    <td key={idx} className="p-2 border-b border-slate-50 dark:border-zinc-800/50 text-center align-middle">
                      <div className="w-full h-12 rounded-md bg-slate-100 dark:bg-zinc-800/50 relative group/cell cursor-pointer overflow-hidden transition-colors">
                        <div 
                           className={`h-full w-full absolute top-0 left-0 transition-all ${getIntensityColor(cell, user)} opacity-80`}
                           style={{ height: `${Math.min((cell.hours / 8) * 100, 100)}%` }} // Visual fill for hours
                        />
                        {/* Hover Details */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium transition-opacity">
                            {cell.hours.toFixed(1)}h
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkloadHeatmap;