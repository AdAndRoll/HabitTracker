import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
// Импортируем всё из единого входа shared/theme
import { spacing, borderRadius, type AppTheme } from '../theme';

interface Props {
  onPress: () => void;
}

export const FloatingButton = ({ onPress }: Props) => {
  // Благодаря расширенному AppTheme, TS видит colors.staticWhite и colors.primary
  const { colors, dark } = useTheme() as AppTheme;

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: colors.primary,
          // В темной теме уменьшаем свечение тени, чтобы оно не выглядело "грязным"
          shadowColor: colors.primary,
          shadowOpacity: dark ? 0.5 : 0.3,
        }
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: colors.staticWhite }]}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    // Используем значения из твоего spacing.ts
    bottom: spacing.xl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: borderRadius.full, 
    justifyContent: 'center',
    alignItems: 'center',
    
    // Слой над контентом
    zIndex: 99,

    // Тень для Android
    elevation: 6,
    
    // Тень для iOS
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  text: {
    fontSize: 32,
    fontWeight: '300',
    // Центровка "+" (на iOS символы часто смещены вверх)
    marginTop: Platform.OS === 'ios' ? -4 : -2,
  },
});