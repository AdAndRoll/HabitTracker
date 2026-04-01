import { Habit } from '../../../core/types';

export interface HabitStats {
  total: number;
  streak: number;
  percentage: number;
  startDateStr: string;
}

export const StatsService = {
  // Расчет текущего стрика (непрерывной серии)
  calculateCurrentStreak: (completedDays: string[]): number => {
    if (!completedDays.length) return 0;
    const sorted = [...completedDays].sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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

  // Глубокая статистика для детального экрана
  getDetailedStats: (habit: Habit): HabitStats => {
    const completedDays = [...(habit.completedDays || [])].sort();
    const total = completedDays.length;
    
    // Твоя логика: ищем самую раннюю дату (создание или первая отметка)
    const creationDate = new Date(habit.createdAt);
    creationDate.setHours(0, 0, 0, 0);
    let anchorDate = creationDate;

    if (completedDays.length > 0) {
      const firstCompletedDate = new Date(completedDays[0]);
      firstCompletedDate.setHours(0, 0, 0, 0);
      if (firstCompletedDate < creationDate) {
        anchorDate = firstCompletedDate;
      }
    }

    const startDateStr = anchorDate.toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const streak = StatsService.calculateCurrentStreak(habit.completedDays);
    
    // Процент от anchorDate до сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - anchorDate.getTime();
    const daysInPeriod = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const percentage = Math.round((total / daysInPeriod) * 100);

    return { total, streak, percentage, startDateStr };
  }
};