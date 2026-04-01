import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

const palette = {
  white: '#ffffff',
  black: '#000000',
  indigo: '#6366f1',
  
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate400: '#94a3b8',  // Добавили: более светлый серый для темной темы
  slate500: '#64748b',
  slate800: '#1e293b',
  
  slate900: '#0f172a',
  slate850: '#1e293b',
  slate700: '#334155',
  
  red: '#ef4444',
};

export interface AppTheme extends Theme {
  colors: Theme['colors'] & {
    surface: string;
    textSecondary: string;
    textMuted: string;      // Для подсказок типа "нажми чтобы..."
    error: string;
    staticWhite: string;
    completedOpacity: number; // Семантический токен для выполненных задач
  };
}

export const lightTheme: AppTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.indigo,
    background: palette.slate50,
    surface: palette.white,
    text: palette.slate800,
    textSecondary: palette.slate500,
    textMuted: palette.slate500,
    border: palette.slate100,
    error: palette.red,
    staticWhite: palette.white, 
    notification: palette.red,
    completedOpacity: 0.6, // В светлой теме можно сильнее приглушать
  },
};

export const darkTheme: AppTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: palette.indigo,
    background: palette.black, 
    surface: palette.slate850, 
    text: palette.slate50,
    // Используем slate400, чтобы вторичный текст был читаемым
    textSecondary: palette.slate400, 
    // Текст подсказок в темноте должен быть еще светлее для контраста
    textMuted: palette.slate50, 
    border: palette.slate700,
    error: palette.red,
    staticWhite: palette.white, 
    notification: palette.red,
    completedOpacity: 0.85, // В темной теме оставляем высокую непрозрачность
  },
};

