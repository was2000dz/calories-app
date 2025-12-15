import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { FoodItem, DailyGoals } from '../types';

interface WeekSummaryProps {
  entries: FoodItem[];
  goals: DailyGoals;
  isDarkMode?: boolean;
}

export const WeekSummary: React.FC<WeekSummaryProps> = ({ entries, goals, isDarkMode }) => {
  // Calculate last 7 days data
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // Go back from 6 days ago to today
    d.setHours(0, 0, 0, 0);
    return d;
  }).map(date => {
    const dayStart = date.getTime();
    const dayEnd = dayStart + 86400000; // +24 hours
    
    // Filter entries for this specific day
    const dayEntries = entries.filter(e => {
      const entryTime = new Date(e.timestamp).getTime();
      return entryTime >= dayStart && entryTime < dayEnd;
    });

    const calories = dayEntries.reduce((sum, e) => sum + e.calories, 0);

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: Math.round(calories),
      isOver: calories > goals.calories
    };
  });

  const axisColor = isDarkMode ? '#94a3b8' : '#64748b'; // Slate-400 vs Slate-500
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff'; // Slate-800 vs White
  const tooltipText = isDarkMode ? '#f1f5f9' : '#0f172a'; // Slate-100 vs Slate-900

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6 transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Week Summary</h2>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisColor, fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisColor, fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                backgroundColor: tooltipBg,
                color: tooltipText
              }}
              itemStyle={{ color: tooltipText }}
              labelStyle={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}
            />
            <ReferenceLine y={goals.calories} stroke={isDarkMode ? "#475569" : "#94a3b8"} strokeDasharray="3 3" />
            <Bar dataKey="calories" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isOver ? '#ef4444' : '#3b82f6'} 
                  fillOpacity={entry.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500/70"></span>
          Under Goal
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Over Goal
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 border border-dashed border-slate-400 dark:border-slate-500"></span>
          Goal Line
        </div>
      </div>
    </div>
  );
};