import { lightTheme, darkTheme, type AppTheme } from './colors'; // Добавили импорт типа
import { spacing, borderRadius } from './spacing';

// Экспортируем тип AppTheme, чтобы его можно было импортировать в компонентах
export { lightTheme, darkTheme, spacing, borderRadius, type AppTheme };

export const theme = lightTheme;