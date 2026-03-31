import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const palette = {
  white: '#ffffff',
  black: '#000000',
  indigo: '#6366f1',
  
  // Светлые оттенки (Slate/Gray)
  slate50: '#f8fafc',   // Фон светлой темы
  slate100: '#f1f5f9',  // Бордеры светлой темы
  slate500: '#64748b',  // Вторичный текст
  slate800: '#1e293b',  // Основной текст
  
  // Темные оттенки
  slate900: '#0f172a',  // Фон темной темы
  slate850: '#1e293b',  // Поверхности в темной теме
  slate700: '#334155',  // Бордеры в темной теме
  
  red: '#ef4444',
};

// 2. Светлая тема
export const lightTheme = {
  dark: false,
  fonts: DefaultTheme.fonts,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.indigo,
    background: palette.slate50,
    surface: palette.white,
    text: palette.slate800,
    textSecondary: palette.slate500,
    border: palette.slate100,
    error: palette.red,
    staticWhite: palette.white, 
  },
};

// 3. Темная тема
export const darkTheme = {
  dark: true,
  fonts: DarkTheme.fonts,
  colors: {
    ...DarkTheme.colors,
    primary: palette.indigo,
    background: palette.black,      // Или palette.slate900
    surface: palette.slate850,      // Вот наш "чистый" цвет без хардкода
    border: palette.slate700,       // И здесь тоже
    text: palette.slate50,
    textSecondary: palette.slate500,
    error: palette.red,
    staticWhite: palette.white, 
  },
};