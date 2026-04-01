export interface Habit {
  id: string;           // Unique ID (UUID или timestamp)
  title: string;        // Название привычки
  description?: string; // Опциональное описание
  emoji: string;        // Иконка-эмодзи
  color: string;        // Hex-код цвета для карточки
  completedDays: string[]; // Массив дат в формате 'YYYY-MM-DD'
  reminderTime?: string;   // Время в формате 'HH:mm'
  isReminderEnabled: boolean; // Включены ли уведомления <--- ДОБАВЬ ЭТО
  createdAt: number;    // Timestamp создания
}

export const HABIT_FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'pending', label: 'План' },
  { id: 'completed', label: 'Готово' },
] as const;

export type HabitFilter = typeof HABIT_FILTERS[number]['id'];

export type ThemeMode = 'light' | 'dark' | 'system';