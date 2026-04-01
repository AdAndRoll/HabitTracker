/**
 * Превращает объект Date в строку 'YYYY-MM-DD' с учетом локального часового пояса.
 */
export const getLocalDateString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split('T')[0];
};

/**
 * Форматирует часы и минуты в строку 'HH:mm' для отображения и стора.
 */
export const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Парсит строку времени 'HH:mm' обратно в числа.
 */
export const parseTimeString = (timeString: string) => {
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour, minute };
};

/**
 * Вычисляет дату следующего срабатывания для заданного часа и минуты.
 * Если время уже прошло сегодня, возвращает завтрашний день.
 */
export const getNextTriggerDate = (hour: number, minute: number): Date => {
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hour, minute, 0, 0);

  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }
  
  return triggerDate;
};


