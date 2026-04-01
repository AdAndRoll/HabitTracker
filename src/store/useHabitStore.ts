import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clientStorage, Habit } from '../core';
import { NotificationService } from '../features/habits/services/NotificationService';

// Обновляем тип HabitUpdate, чтобы он включал настройки уведомлений
type HabitUpdate = Partial<Omit<Habit, 'id' | 'createdAt' | 'completedDays'>>;

interface HabitState {
  habits: Habit[];
  addHabit: (title: string, emoji: string, color: string, description?: string) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  updateHabit: (id: string, updates: HabitUpdate) => void;
  // Новый метод для быстрой настройки уведомлений
  updateReminder: (id: string, time: string | null) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],

      addHabit: (title, emoji, color, description) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: Date.now().toString(),
              title: trimmedTitle,
              description: description ? description.trim() : undefined,
              emoji: emoji,
              color: color,
              completedDays: [],
              createdAt: Date.now(),
              isReminderEnabled: false, // по умолчанию выключено
            },
          ],
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => 
            h.id === id ? { ...h, ...updates } : h
          ),
        }));
      },

      updateReminder: (id, time) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id 
              ? { 
                  ...h, 
                  reminderTime: time || undefined, 
                  isReminderEnabled: !!time 
                } 
              : h
          ),
        }));
      },

      removeHabit: (id) => {
        // При удалении привычки — отменяем её уведомление в системе
        NotificationService.cancelHabitReminder(id);
        
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },

      toggleHabit: (id, date) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            
            const currentDays = h.completedDays || [];
            const isCompleted = currentDays.includes(date);
            const newDays = isCompleted
              ? currentDays.filter((d) => d !== date)
              : [...currentDays, date];
              
            return {
              ...h,
              completedDays: newDays,
            };
          }),
        }));
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => clientStorage),
    }
  )
);