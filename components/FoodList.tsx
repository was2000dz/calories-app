import React from 'react';
import { FoodItem } from '../types';
import { Trash2, Star } from 'lucide-react';

interface FoodListProps {
  entries: FoodItem[];
  onDelete: (id: string) => void;
  onSaveToFavorites: (item: FoodItem) => void;
  title?: string;
}

export const FoodList: React.FC<FoodListProps> = ({ entries, onDelete, onSaveToFavorites, title = "Today's Entries" }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-500">
        <p>No food logged.</p>
        <p className="text-sm mt-1">Add your first meal above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
      {entries.slice().reverse().map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center group transition-all hover:border-slate-300 dark:hover:border-slate-600"
        >
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{Math.round(item.calories)} kcal</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {item.protein}p
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {item.carbs}c
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                {item.fat}f
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => onSaveToFavorites(item)}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-amber-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors ml-2"
              title="Save to Favorites"
            >
              <Star size={18} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-1"
              aria-label="Delete entry"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};