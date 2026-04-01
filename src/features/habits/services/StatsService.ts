import { Habit } from '../../../core/types';
import { getLocalDateString } from '../../../shared/utils/localDate';

export interface HabitStats {
  total: number;
  streak: number;
  percentage: number;
  startDateStr: string;
}

export const StatsService = {
  
  /**
   * Расчет текущего стрика
   */
  calculateCurrentStreak: (completedDays: string[]): number => {
    if (!completedDays || completedDays.length === 0) return 0;

    const datesSet = new Set(completedDays);
    const today = getLocalDateString(new Date());
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    if (!datesSet.has(today) && !datesSet.has(yesterday)) return 0;

    let streak = 0;
    const checkDate = datesSet.has(today) ? new Date() : yesterdayDate;

    while (datesSet.has(getLocalDateString(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  },

  /**
   * Глубокая статистика для конкретной привычки
   */
  getDetailedStats: (habit: Habit): HabitStats => {
    const days = habit.completedDays || [];
    const total = days.length;
    
    const creationDate = new Date(habit.createdAt);
    creationDate.setHours(0, 0, 0, 0);

    let anchorDate = creationDate;

    if (total > 0) {
      const sortedDays = [...days].sort();
      const firstCompletedDate = new Date(sortedDays[0]);
      firstCompletedDate.setHours(0, 0, 0, 0);
      
      if (firstCompletedDate < creationDate) {
        anchorDate = firstCompletedDate;
      }
    }

    const startDateStr = anchorDate.toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const streak = StatsService.calculateCurrentStreak(days);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - anchorDate.getTime();
    const daysInPeriod = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const percentage = Math.round((total / daysInPeriod) * 100);

    return { 
      total, 
      streak, 
      percentage: Math.min(100, percentage), 
      startDateStr 
    };
  }
};