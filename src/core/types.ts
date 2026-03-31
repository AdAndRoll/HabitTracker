export interface Habit {
  id: string;          // Unique ID (UUID или timestamp)
  title: string;       // Название привычки
  description?: string; // Опциональное описание
  emoji: string;       // Иконка-эмодзи
  color: string;       // Hex-код цвета для карточки
  completedDays: string[]; // Массив дат в формате 'YYYY-MM-DD'
  createdAt: number;   // Timestamp создания
}

export type ThemeMode = 'light' | 'dark' | 'system';