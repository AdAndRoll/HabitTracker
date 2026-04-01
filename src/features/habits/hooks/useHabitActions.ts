import { useHabitStore } from '../../../store';
import { NotificationService } from '../services/NotificationService';
import { formatTime } from '../../../shared/utils/localDate';

export const useHabitActions = () => {
  const habits = useHabitStore((state) => state.habits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const updateReminder = useHabitStore((state) => state.updateReminder);
  const removeHabitStore = useHabitStore((state) => state.removeHabit);
  const toggleHabitStore = useHabitStore((state) => state.toggleHabit);

  /**
   * Валидация названия на дубликаты
   */
  const checkDuplicate = (title: string, excludeId?: string) => {
    return habits.some(
      (h) => h.title.toLowerCase() === title.trim().toLowerCase() && h.id !== excludeId
    );
  };

  /**
   * Создание новой привычки
   */
  const createNewHabit = (title: string, emoji: string, color: string, description?: string) => {
    if (checkDuplicate(title)) {
      throw new Error('DUPLICATE_TITLE');
    }
    return addHabit(title.trim(), emoji, color, description?.trim());
  };

  /**
   * Редактирование существующей привычки
   */
  const editExistingHabit = (
    id: string, 
    data: { title: string; emoji: string; color: string; description?: string }
  ) => {
    if (checkDuplicate(data.title, id)) {
      throw new Error('DUPLICATE_TITLE');
    }
    updateHabit(id, {
      ...data,
      title: data.title.trim(),
      description: data.description?.trim(),
    });
  };

  /**
   * Переключение статуса выполнения (выполнено/не выполнено) на конкретную дату
   */
  const toggleHabit = (id: string, date: string) => {
    toggleHabitStore(id, date);
  };

  /**
   * Установка напоминания
   */
  const setHabitReminder = async (habitId: string, title: string, hour: number, minute: number) => {
    const timeString = formatTime(hour, minute);
    updateReminder(habitId, timeString);
    await NotificationService.scheduleHabitReminder(habitId, title, hour, minute);
  };

  /**
   * Удаление привычки
   */
  const deleteHabit = (id: string) => {
    removeHabitStore(id);
  };

  return {
    habits, 
    createNewHabit,
    editExistingHabit,
    toggleHabit, // Экспортируем новый метод
    setHabitReminder,
    deleteHabit,
  };
};