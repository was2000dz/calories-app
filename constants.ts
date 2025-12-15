import { DailyGoals } from './types';

export const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
};

export const STORAGE_KEYS = {
  ENTRIES: 'macromind_entries',
  GOALS: 'macromind_goals',
  SAVED_FOODS: 'macromind_saved_foods',
};