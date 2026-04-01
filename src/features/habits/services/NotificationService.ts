import notifee, { 
  TimestampTrigger, 
  TriggerType, 
  RepeatFrequency, 
  AndroidImportance 
} from '@notifee/react-native';
import { Platform } from 'react-native';

export const HABIT_CHANNEL_ID = 'habit_reminders';

export const NotificationService = {
  /**
   * Начальная настройка: каналы и права
   */
  initialize: async () => {
    // 1. Создаем канал для Android (обязательно)
    await notifee.createChannel({
      id: HABIT_CHANNEL_ID,
      name: 'Напоминания о привычках',
      importance: AndroidImportance.HIGH,
      description: 'Уведомления для ежедневных задач',
    });

    // 2. Запрашиваем права (iOS и Android 13+)
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  },

  /**
   * Планирование ежедневного уведомления для привычки
   */
  scheduleHabitReminder: async (habitId: string, title: string, hour: number, minute: number) => {
    // Сначала удаляем старое уведомление для этой привычки, если оно было
    await NotificationService.cancelHabitReminder(habitId);

    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(hour, minute, 0, 0);

    // Если время уже прошло сегодня, ставим на завтра
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.DAILY, // Повторять каждый день
      alarmManager: true, // Позволяет уведомлению сработать точнее
    };

    await notifee.createTriggerNotification(
      {
        id: habitId, // Используем ID привычки как ID уведомления для управления
        title: `Пора: ${title} 🌿`,
        body: 'Не забудь отметить выполнение сегодня!',
        android: {
          channelId: HABIT_CHANNEL_ID,
          pressAction: { id: 'default' },
          importance: AndroidImportance.HIGH,
        },
      },
      trigger
    );
    
    console.log(`[NotificationService] Scheduled "${title}" at ${hour}:${minute}`);
  },

  /**
   * Отмена уведомления
   */
  cancelHabitReminder: async (habitId: string) => {
    await notifee.cancelNotification(habitId);
  }
};