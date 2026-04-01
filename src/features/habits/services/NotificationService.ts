import notifee, { 
  TimestampTrigger, 
  TriggerType, 
  RepeatFrequency, 
  AndroidImportance,
  AndroidNotificationSetting 
} from '@notifee/react-native';
import { Platform, Linking } from 'react-native';
import { getNextTriggerDate } from '../../../shared/utils/localDate';

export const HABIT_CHANNEL_ID = 'habit_reminders';

export const NotificationService = {
  /**
   * Внутренний метод для проверки прав на алармы (Android)
   */
  async _checkAndroidAlarmPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
      console.warn('[NotificationService] No Exact Alarm permission');
      try {
        // Оставляем твой хардкод, раз пакет менять не хотим
        await Linking.sendIntent('android.settings.REQUEST_SCHEDULE_EXACT_ALARM', [
          { key: 'package', value: 'com.habittracker' } 
        ]);
      } catch (e) {
        await Linking.openSettings();
      }
      return false;
    }
    return true;
  },

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

  scheduleHabitReminder: async (habitId: string, title: string, hour: number, minute: number) => {
    // 1. Очистка старых триггеров (инкапсулируем логику отмены)
    await NotificationService.cancelHabitReminder(habitId);

    // 2. Проверка разрешений
    if (!(await NotificationService._checkAndroidAlarmPermission())) return;

    // 3. Расчет времени через утилиту
    const triggerDate = getNextTriggerDate(hour, minute);

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
    } catch (error) {
      console.error('[NotificationService] Error:', error);
    }
  },

  cancelHabitReminder: async (habitId: string) => {
    // Объединяем в Promise.all для параллельного выполнения
    await Promise.all([
      notifee.cancelNotification(habitId),
      notifee.cancelTriggerNotification(habitId)
    ]);
  }
};