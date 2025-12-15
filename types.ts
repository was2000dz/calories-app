export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem extends Macros {
  id: string;
  name: string;
  calories: number;
  timestamp: number;
}

export interface SavedFood extends Macros {
  id: string;
  name: string;
  calories: number;
}

export interface DailyGoals extends Macros {
  calories: number;
}

export interface AIAnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}