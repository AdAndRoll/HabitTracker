import { useMemo } from 'react';
import { useHabitStore } from '../../../store';
import { StatsService } from '../services/StatsService';

export const useHabitStats = (habitId?: string) => {
  const habits = useHabitStore((state) => state.habits);

  const stats = useMemo(() => {
    if (habitId) {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return null;
      return {
        streak: StatsService.calculateCurrentStreak(habit.completedDays),
        rate: StatsService.calculateCompletionRate(habit),
        total: habit.completedDays.length
      };
    }

    // Общая статистика по всем привычкам
    return {
      totalCompletions: habits.reduce((acc, h) => acc + h.completedDays.length, 0),
      activeHabits: habits.length,
      bestStreak: Math.max(...habits.map(h => StatsService.calculateCurrentStreak(h.completedDays)), 0)
    };
  }, [habits, habitId]);

  return stats;
};