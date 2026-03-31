
import { useState, useMemo } from 'react';
import { useHabitStore } from '../../../store';
import { getLocalDateString } from '../../../shared/utils/localDate';

export const useHabits = () => {
  const todayStr = useMemo(() => getLocalDateString(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const { habits, toggleHabit, removeHabit } = useHabitStore();

  const isFuture = selectedDate > todayStr;
  const isToday = selectedDate === todayStr;

  return {
    habits,
    selectedDate,
    setSelectedDate,
    isToday,
    isFuture,
    // Теперь просто пробрасываем функцию, не блокируя её здесь молча
    toggleHabit: (id: string) => toggleHabit(id, selectedDate),
    removeHabit,
  };
};