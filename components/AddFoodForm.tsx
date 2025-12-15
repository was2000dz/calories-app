import React, { useState } from 'react';
import { FoodItem, SavedFood } from '../types';
import { analyzeFoodWithAI } from '../services/geminiService';
import { Loader2, Plus, Sparkles, AlertCircle, Bookmark, Trash2 } from 'lucide-react';

interface AddFoodFormProps {
  onAdd: (item: Omit<FoodItem, 'id' | 'timestamp'>) => void;
  savedFoods: SavedFood[];
  onRemoveSaved: (id: string) => void;
}

export const AddFoodForm: React.FC<AddFoodFormProps> = ({ onAdd, savedFoods, onRemoveSaved }) => {
  const [mode, setMode] = useState<'ai' | 'manual' | 'favorites'>('ai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Input State
  const [aiPrompt, setAiPrompt] = useState('');

  // Manual Input State
  const [manualData, setManualData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeFoodWithAI(aiPrompt);
      onAdd(result);
      setAiPrompt('');
    } catch (err) {
      setError("Could not analyze food. Please try again or use manual mode.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualData.name || !manualData.calories) return;

    onAdd({
      name: manualData.name,
      calories: Number(manualData.calories),
      protein: Number(manualData.protein) || 0,
      carbs: Number(manualData.carbs) || 0,
      fat: Number(manualData.fat) || 0,
    });

    setManualData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Log Food</h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
          <button
            onClick={() => setMode('ai')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'ai' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5"><Sparkles size={14} /> AI Auto</span>
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'manual' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setMode('favorites')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'favorites' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
             <span className="flex items-center gap-1.5"><Bookmark size={14} /> Favorites</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {mode === 'ai' && (
        <form onSubmit={handleAiSubmit}>
          <div className="relative">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 2 slices of avocado toast with a poached egg..."
              className="w-full p-4 pr-12 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !aiPrompt.trim()}
              className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Powered by Gemini. Describe your meal naturally.
          </p>
        </form>
      )}

      {mode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Food Name</label>
            <input
              type="text"
              required
              value={manualData.name}
              onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
              placeholder="e.g., Banana"
              className="w-full p-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Calories</label>
              <input
                type="number"
                required
                min="0"
                value={manualData.calories}
                onChange={(e) => setManualData({ ...manualData, calories: e.target.value })}
                className="w-full p-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Protein (g)</label>
              <input
                type="number"
                min="0"
                value={manualData.protein}
                onChange={(e) => setManualData({ ...manualData, protein: e.target.value })}
                className="w-full p-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Carbs (g)</label>
              <input
                type="number"
                min="0"
                value={manualData.carbs}
                onChange={(e) => setManualData({ ...manualData, carbs: e.target.value })}
                className="w-full p-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Fat (g)</label>
              <input
                type="number"
                min="0"
                value={manualData.fat}
                onChange={(e) => setManualData({ ...manualData, fat: e.target.value })}
                className="w-full p-2 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 dark:bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Entry
          </button>
        </form>
      )}

      {mode === 'favorites' && (
        <div className="space-y-3">
          {savedFoods.length === 0 ? (
             <div className="text-center py-8 text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
               <Bookmark size={24} className="mx-auto mb-2 opacity-50" />
               <p className="text-sm">No favorite foods yet.</p>
               <p className="text-xs mt-1">Star items in your daily list to save them here.</p>
             </div>
          ) : (
            savedFoods.map((food) => (
              <div key={food.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all bg-slate-50/50 dark:bg-slate-800/50">
                <div className="min-w-0">
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{food.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                    <span>{Math.round(food.calories)} kcal</span>
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>F: {food.fat}g</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onRemoveSaved(food.id)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => onAdd({
                      name: food.name,
                      calories: food.calories,
                      protein: food.protein,
                      carbs: food.carbs,
                      fat: food.fat
                    })}
                    className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};