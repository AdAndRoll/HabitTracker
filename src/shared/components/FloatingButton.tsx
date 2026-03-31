import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { theme, spacing, borderRadius } from '../theme';

interface Props {
  onPress: () => void;
}

export const FloatingButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 60,
    height: 60,
    // Используем твой константный радиус для круга
    borderRadius: borderRadius.full, 
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    
    // Тень для Android
    elevation: 6,
    
    // Тень для iOS (используем цвет текста для мягкой тени)
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  text: {
    // Белый цвет из палитры через тему (или напрямую, если в теме нет white)
    color: theme.colors.staticWhite , 
    fontSize: 32,
    fontWeight: '300',
    // Небольшая корректировка для визуальной центровки плюса
    marginTop: Platform.OS === 'ios' ? -4 : -2,
  },
});