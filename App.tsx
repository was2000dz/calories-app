import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { WeekSummary } from './components/WeekSummary';
import { AddFoodForm } from './components/AddFoodForm';
import { FoodList } from './components/FoodList';
import { SettingsModal } from './components/SettingsModal';
import { FoodItem, DailyGoals, SavedFood } from './types';
import { DEFAULT_GOALS, STORAGE_KEYS } from './constants';
import { Settings, UtensilsCrossed, Moon, Sun, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const App: React.FC = () => {
  // Theme Management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('macromind_theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('macromind_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('macromind_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Date Management
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isSelectedDateToday = () => {
    const today = new Date();
    return selectedDate.getDate() === today.getDate() &&
           selectedDate.getMonth() === today.getMonth() &&
           selectedDate.getFullYear() === today.getFullYear();
  };

  const getDisplayDate = () => {
    if (isSelectedDateToday()) return 'Today';
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate.getDate() === yesterday.getDate() && 
        selectedDate.getMonth() === yesterday.getMonth() &&
        selectedDate.getFullYear() === yesterday.getFullYear()) {
      return 'Yesterday';
    }

    return selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Load Entries (History)
  const [entries, setEntries] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse entries", e);
      }
    }
    return [];
  });

  // Load Saved Foods (Favorites)
  const [savedFoods, setSavedFoods] = useState<SavedFood[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_FOODS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved foods", e);
      }
    }
    return [];
  });

  const [goals, setGoals] = useState<DailyGoals>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_FOODS, JSON.stringify(savedFoods));
  }, [savedFoods]);

  // Derived state for filtered entries
  const currentDayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return (
      entryDate.getDate() === selectedDate.getDate() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const addEntry = (item: Omit<FoodItem, 'id' | 'timestamp'>) => {
    const now = new Date();
    let timestamp = Date.now();
    
    // If adding to a past/future date, preserve current time of day for sorting
    if (!isSelectedDateToday()) {
        const d = new Date(selectedDate);
        d.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
        timestamp = d.getTime();
    }

    const newEntry: FoodItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp,
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const clearCurrentDay = () => {
    const label = getDisplayDate() === 'Today' ? "today's" : "this day's";
    if (window.confirm(`Are you sure you want to clear ${label} log?`)) {
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0,0,0,0);
      const dayEnd = new Date(selectedDate);
      dayEnd.setHours(23,59,59,999);
      
      setEntries(prev => prev.filter(e => {
        const t = e.timestamp;
        return t < dayStart.getTime() || t > dayEnd.getTime();
      }));
    }
  };

  const saveToFavorites = (item: FoodItem) => {
    if (savedFoods.some(f => f.name.toLowerCase() === item.name.toLowerCase())) {
      alert(`${item.name} is already in your favorites.`);
      return;
    }

    const newSaved: SavedFood = {
      id: crypto.randomUUID(),
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat
    };
    setSavedFoods(prev => [...prev, newSaved]);
  };

  const removeSavedFood = (id: string) => {
    setSavedFoods(prev => prev.filter(f => f.id !== id));
  };

  const handleSaveGoals = (newGoals: DailyGoals) => {
    setGoals(newGoals);
  };

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <UtensilsCrossed size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MacroMind</h1>
          </div>
          <div className="flex items-center gap-2">
            {currentDayEntries.length > 0 && (
              <button 
                onClick={clearCurrentDay}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Clear Log
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
        {/* Date Navigator */}
        <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => changeDate(-1)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <Calendar size={18} className="text-slate-400 dark:text-slate-500" />
            <span>{getDisplayDate()}</span>
          </div>

          <button 
            onClick={() => changeDate(1)}
            disabled={isSelectedDateToday()}
            className={`p-2 rounded-lg transition-colors ${
              isSelectedDateToday() 
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <Dashboard entries={currentDayEntries} goals={goals} />
        
        <AddFoodForm 
          onAdd={addEntry} 
          savedFoods={savedFoods} 
          onRemoveSaved={removeSavedFood} 
        />
        
        <FoodList 
          entries={currentDayEntries} 
          onDelete={deleteEntry} 
          onSaveToFavorites={saveToFavorites}
          title={isSelectedDateToday() ? "Today's Meals" : `${getDisplayDate()}'s Meals`}
        />

        <div className="mt-8">
          <WeekSummary entries={entries} goals={goals} isDarkMode={isDarkMode} />
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        goals={goals}
        onSave={handleSaveGoals}
      />
    </div>
  );
};

export default App;