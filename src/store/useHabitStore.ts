import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clientStorage, Habit } from '../core';
import { NotificationService } from '../features/habits/services/NotificationService';
import { parseTimeString } from '../shared/utils/localDate';

type HabitUpdate = Partial<Omit<Habit, 'id' | 'createdAt' | 'completedDays'>>;

interface HabitState {
  habits: Habit[];
  addHabit: (title: string, emoji: string, color: string, description?: string) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  updateHabit: (id: string, updates: HabitUpdate) => void;
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
              description: description?.trim(),
              emoji,
              color,
              completedDays: [],
              createdAt: Date.now(),
              isReminderEnabled: false,
            },
          ],
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const updatedHabit = { ...h, ...updates };

            if (updates.title && updatedHabit.isReminderEnabled && updatedHabit.reminderTime) {
              const { hour, minute } = parseTimeString(updatedHabit.reminderTime);
              NotificationService.scheduleHabitReminder(id, updatedHabit.title, hour, minute);
            }

            return updatedHabit;
          }),
        }));
      },

      updateReminder: async (id, time) => {
        const habit = get().habits.find(h => h.id === id);
        if (!habit) return;

        if (time) {
          const { hour, minute } = parseTimeString(time);
          await NotificationService.scheduleHabitReminder(id, habit.title, hour, minute);
          get().updateHabit(id, { reminderTime: time, isReminderEnabled: true });
        } else {
          await NotificationService.cancelHabitReminder(id);
          get().updateHabit(id, { reminderTime: undefined, isReminderEnabled: false });
        }
      },

      removeHabit: async (id) => {
        await NotificationService.cancelHabitReminder(id);
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
            
            return {
              ...h,
              completedDays: isCompleted
                ? currentDays.filter((d) => d !== date)
                : [...currentDays, date],
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