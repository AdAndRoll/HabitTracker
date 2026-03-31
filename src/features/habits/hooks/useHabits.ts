
import { useState, useMemo } from 'react';
import { useHabitStore } from '../../../store';
import { getLocalDateString } from '../../../shared/utils/localDate';

export const useHabits = () => {
  // Текущая реальная дата в формате YYYY-MM-DD
  const todayStr = useMemo(() => getLocalDateString(new Date()), []);

  // Дата, выбранная пользователем в календаре (тоже YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const { habits, toggleHabit, removeHabit } = useHabitStore();

  // 1. Проверка на будущее: 
  // Сравнение строк YYYY-MM-DD работает корректно, 
  // так как год и месяц идут в начале.
  const isFuture = selectedDate > todayStr;

  // 2. Проверка на "сегодня":
  const isToday = selectedDate === todayStr;

  return {
    habits,
    selectedDate,
    setSelectedDate,
    isToday,
    isFuture,
    toggleHabit: (id: string) => {
      if (isFuture) {
        console.warn('Попытка отметить привычку в будущем');
        return;
      }
      toggleHabit(id, selectedDate);
    },
    removeHabit,
  };
};