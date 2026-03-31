import { Habit } from '../../../core/types';

export const StatsService = {
  // Расчет текущего стрейка
  calculateCurrentStreak: (completedDays: string[]): number => {
    if (!completedDays.length) return 0;

    const sorted = [...completedDays].sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Если нет отметки ни сегодня, ни вчера — стрейк прерван
    if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0;

    let streak = 0;
    let checkDate = sorted.includes(today) ? new Date() : new Date(Date.now() - 86400000);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  // Общий процент выполнения
  calculateCompletionRate: (habit: Habit): number => {
    const start = new Date(habit.createdAt);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    return Math.round((habit.completedDays.length / diffDays) * 100);
  }
};