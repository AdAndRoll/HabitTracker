import { useMemo } from 'react';
import { useHabitStore } from '../../../store/useHabitStore';
import { StatsService, HabitStats } from '../services/StatsService';

interface GlobalStats {
  totalCompletions: number;
  activeHabits: number;
  bestStreak: number;
}

export const useHabitStats = (habitId?: string) => {
  const habits = useHabitStore((state) => state.habits);

  return useMemo(() => {
    if (habitId) {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return null;
      return StatsService.getDetailedStats(habit) as HabitStats;
    }

    const global: GlobalStats = {
      totalCompletions: habits.reduce((acc, h) => acc + (h.completedDays?.length || 0), 0),
      activeHabits: habits.length,
      bestStreak: Math.max(...habits.map(h => StatsService.calculateCurrentStreak(h.completedDays || [])), 0)
    };
    return global;
  }, [habits, habitId]);
};