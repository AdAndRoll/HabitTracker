import { useState, useMemo } from 'react';
import { useHabitStore } from '../../../store';
import { getLocalDateString } from '../../../shared/utils/localDate';

export type HabitFilter = 'all' | 'completed' | 'pending';

export const useHabits = () => {
  const todayStr = useMemo(() => getLocalDateString(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [filter, setFilter] = useState<HabitFilter>('all');

  const { habits, toggleHabit, removeHabit } = useHabitStore();

  const isFuture = selectedDate > todayStr;
  const isToday = selectedDate === todayStr;

  // Вживляем логику фильтрации
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const isDone = habit.completedDays.includes(selectedDate);
      
      if (filter === 'completed') return isDone;
      if (filter === 'pending') return !isDone;
      return true; // 'all'
    });
  }, [habits, selectedDate, filter]);

  return {
    habits: filteredHabits, // Теперь отдаем отфильтрованные
    allHabitsCount: habits.length,
    selectedDate,
    setSelectedDate,
    filter,
    setFilter,
    isToday,
    isFuture,
    toggleHabit: (id: string) => toggleHabit(id, selectedDate),
    removeHabit,
  };
};