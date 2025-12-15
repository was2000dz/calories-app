import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  colorClass: string;
  unit: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, max, colorClass, unit }) => {
  const barPercentage = Math.min(100, Math.max(0, (current / max) * 100));
  const textPercentage = Math.round((current / max) * 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-slate-800 dark:text-slate-200">
          {Math.round(current)} / {max}{unit} 
          <span className="ml-1 text-slate-500 dark:text-slate-500 font-normal">({textPercentage}%)</span>
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden transition-colors duration-300">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${barPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};