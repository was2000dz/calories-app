import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DailyGoals, FoodItem } from '../types';
import { ProgressBar } from './ProgressBar';

interface DashboardProps {
  entries: FoodItem[];
  goals: DailyGoals;
}

export const Dashboard: React.FC<DashboardProps> = ({ entries, goals }) => {
  const totals = entries.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const remainingCalories = Math.max(0, goals.calories - totals.calories);
  
  const data = [
    { name: 'Consumed', value: totals.calories },
    { name: 'Remaining', value: remainingCalories },
  ];

  const COLORS = ['#3b82f6', '#e2e8f0']; // Light mode: Blue-500, Slate-200
  const COLORS_DARK = ['#3b82f6', '#334155']; // Dark mode: Blue-500, Slate-700

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6 transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Daily Summary</h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Calorie Ring */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? COLORS[0] : (document.documentElement.classList.contains('dark') ? COLORS_DARK[1] : COLORS[1])} 
                    className={index === 1 ? "fill-slate-200 dark:fill-slate-700 transition-colors duration-300" : ""}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => Math.round(value)} 
                contentStyle={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                   borderRadius: '8px', 
                   border: 'none', 
                   boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-800 dark:text-white">{Math.round(totals.calories)}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">kcal consumed</span>
          </div>
        </div>

        {/* Macros Bars */}
        <div className="flex-1 w-full">
          <ProgressBar 
            label="Protein" 
            current={totals.protein} 
            max={goals.protein} 
            unit="g" 
            colorClass="bg-emerald-500" 
          />
          <ProgressBar 
            label="Carbs" 
            current={totals.carbs} 
            max={goals.carbs} 
            unit="g" 
            colorClass="bg-amber-500" 
          />
          <ProgressBar 
            label="Fat" 
            current={totals.fat} 
            max={goals.fat} 
            unit="g" 
            colorClass="bg-rose-500" 
          />
        </div>
      </div>
    </div>
  );
};