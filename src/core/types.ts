export interface Habit {
  id: string;
  title: string;
  description?: string;
  emoji: string;
  color: string;
  completedDays: string[];
  reminderTime?: string;
  isReminderEnabled: boolean;
  createdAt: number;
}

export const HABIT_FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'pending', label: 'План' },
  { id: 'completed', label: 'Готово' },
] as const;

export type HabitFilter = typeof HABIT_FILTERS[number]['id'];

export type ThemeMode = 'light' | 'dark' | 'system';