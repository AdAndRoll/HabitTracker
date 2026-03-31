import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clientStorage, Habit } from '../core';

interface HabitState {
  habits: Habit[];
  addHabit: (title: string, emoji: string, color: string) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (title, emoji, color) => {
        // Базовая валидация на уровне стора (защита "от дурака")
        if (!title.trim()) return;

        try {
          set((state) => ({
            habits: [
              ...state.habits,
              {
                id: Date.now().toString(),
                title: title.trim(),
                emoji,
                color,
                completedDays: [],
                createdAt: Date.now(),
              },
            ],
          }));
        } catch (error) {
          // Логируем ошибку для дебага
          console.error('Zustand: Failed to add habit', error);
          // Пробрасываем ошибку дальше, чтобы UI мог её поймать
          throw new Error('Storage write error');
        }
      },

      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      toggleHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const isCompleted = h.completedDays.includes(date);
            return {
              ...h,
              completedDays: isCompleted
                ? h.completedDays.filter((d) => d !== date)
                : [...h.completedDays, date],
            };
          }),
        })),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => clientStorage),
    }
  )
);