import { LocaleConfig } from 'react-native-calendars';
import { 
  MONTHS, 
  MONTHS_SHORT, 
  DAYS_OF_WEEK_FULL, 
  DAYS_OF_WEEK 
} from '../constants/dates';

export const initCalendarLocale = () => {
  LocaleConfig.locales['ru'] = {
    monthNames: [...MONTHS],
    monthNamesShort: [...MONTHS_SHORT],
    dayNames: [...DAYS_OF_WEEK_FULL],
    dayNamesShort: [...DAYS_OF_WEEK],
    today: 'Сегодня'
  };
  LocaleConfig.defaultLocale = 'ru';
};