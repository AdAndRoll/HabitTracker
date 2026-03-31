import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clientStorage, Habit } from '../core';

type HabitUpdate = Partial<Omit<Habit, 'id' | 'createdAt' | 'completedDays'>>;

interface HabitState {
  habits: Habit[];
  addHabit: (title: string, emoji: string, color: string, description?: string) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  updateHabit: (id: string, updates: HabitUpdate) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
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
              description: description?.trim(),
              emoji: emoji,
              color: color,
              completedDays: [],
              createdAt: Date.now(),
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

      removeHabit: (id) => {
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