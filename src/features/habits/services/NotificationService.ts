import notifee, { 
  TimestampTrigger, 
  TriggerType, 
  RepeatFrequency, 
  AndroidImportance,
  AndroidNotificationSetting 
} from '@notifee/react-native';
import { Platform, Linking } from 'react-native';

export const HABIT_CHANNEL_ID = 'habit_reminders';

export const NotificationService = {
  /**
   * Начальная настройка: каналы и права
   */
  initialize: async () => {
    await notifee.createChannel({
      id: HABIT_CHANNEL_ID,
      name: 'Напоминания о привычках',
      importance: AndroidImportance.HIGH,
      description: 'Уведомления для ежедневных задач',
    });

    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  },

  /**
   * Планирование ежедневного уведомления для привычки
   */
  scheduleHabitReminder: async (habitId: string, title: string, hour: number, minute: number) => {
    await NotificationService.cancelHabitReminder(habitId);

    // --- ПРОВЕРКА ПРАВ ЧЕРЕЗ LINKING ---
    if (Platform.OS === 'android') {
      const settings = await notifee.getNotificationSettings();
      if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
        console.warn('[NotificationService] No Exact Alarm permission. Launching Intent...');
        
        try {
          // Прямой переход в настройки "Будильники и напоминания" для этого приложения
          await Linking.sendIntent('android.settings.REQUEST_SCHEDULE_EXACT_ALARM', [
            { key: 'package', value: 'com.habittracker' } // замени на свой package name, если он другой
          ]);
        } catch (e) {
          // Если специфичный Intent не сработал, открываем общие настройки приложения
          await Linking.openSettings();
        }
        return; 
      }
    }

    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(hour, minute, 0, 0);

    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
      alarmManager: true, 
    };

    try {
      await notifee.createTriggerNotification(
        {
          id: habitId,
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
    } catch (error) {
      console.error('[NotificationService] Error scheduling notification:', error);
    }
  },

  /**
   * Отмена уведомления и ТРИГГЕРА
   */
  cancelHabitReminder: async (habitId: string) => {
    await notifee.cancelNotification(habitId);
    await notifee.cancelTriggerNotification(habitId);
  }
};