// src/shared/components/HabitCard.tsx

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Habit } from '../../core';
import { theme, spacing, borderRadius } from '../theme';

interface Props {
  habit: Habit;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  isToday, 
  isFuture, 
  onToggle, 
  onDelete 
}: Props) => {

  // Динамический текст статуса в зависимости от контекста времени
  const getStatusText = () => {
    if (isFuture) return '⏳ Нельзя отметить будущее';
    if (isCompleted) {
      return isToday ? '🔥 Выполнено сегодня' : '✅ Было выполнено';
    }
    return isToday ? '⚪️ Нажми, чтобы отметить' : '❌ Не выполнено';
  };

  return (
    <View style={[
      styles.card, 
      { borderLeftColor: habit.color },
      (isCompleted || isFuture) && styles.completedCard // Визуально приглушаем неактивные/выполненные
    ]}>
      <TouchableOpacity 
        style={styles.mainArea} 
        onPress={onToggle}
        activeOpacity={0.7} 
        disabled={isFuture} // Блокируем клик, если дата в будущем
      >
        {/* Иконка с подложкой цвета привычки (прозрачность 20% - 33 в hex) */}
        <View style={[styles.iconContainer, { backgroundColor: `${habit.color}33` }]}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
        </View>
        
        <View style={styles.info}>
          <Text 
            numberOfLines={1}
            style={[
              styles.title, 
              isCompleted && styles.completedTitle
            ]}
          >
            {habit.title}
          </Text>
          <Text style={[
            styles.statusText,
            isFuture && { color: theme.colors.textSecondary }
          ]}>
            {getStatusText()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Кнопка удаления */}
      <TouchableOpacity 
        onPress={onDelete} 
        style={styles.deleteBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Увеличиваем область нажатия
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderLeftWidth: 5,
    // Тени для объема
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.7, // Приглушаем карточку
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  emoji: { 
    fontSize: 24 
  },
  info: { 
    flex: 1 
  },
  title: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: theme.colors.text 
  },
  completedTitle: { 
    textDecorationLine: 'line-through', 
    color: theme.colors.textSecondary,
  },
  statusText: { 
    fontSize: 13, 
    color: theme.colors.textSecondary, 
    marginTop: spacing.xs,
    fontWeight: '500'
  },
  deleteBtn: { 
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  deleteIcon: {
    fontSize: 18,
    opacity: 0.3
  }
});