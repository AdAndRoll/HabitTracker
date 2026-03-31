import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Platform } from 'react-native';
import { Habit } from '../../core';
import { theme, spacing, borderRadius } from '../theme';

interface Props {
  habit: Habit;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
  onToggle: () => void;
  onLongPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const HabitCard = ({ 
  habit, isCompleted, isToday, isFuture, onToggle, onLongPress, onEdit, onDelete 
}: Props) => {

  const handleToggle = () => {
    if (isFuture) return;

    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(10); 
      } catch (err) {
        console.warn('Vibration skipped:', err);
      }
    }
    
    onToggle();
  };

  // Вычисляем цвет заранее, чтобы не ломать парсер Hermes интерполяцией в стилях
  const colorString = habit.color || '#000000';
  const iconBgColor = colorString.startsWith('#') ? colorString + '15' : 'rgba(0,0,0,0.1)';

  return (
    <View style={[
      styles.card, 
      { borderLeftColor: colorString },
      (isCompleted || isFuture) ? styles.completedCard : null
    ]}>
      
      <TouchableOpacity 
        style={styles.mainTouchable}
        onPress={handleToggle}
        onLongPress={onLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Text style={[styles.emoji, isCompleted ? styles.completedEmoji : null]}>
            {isCompleted ? '✅' : habit.emoji}
          </Text>
        </View>

        <View style={styles.info}>
          <Text numberOfLines={1} style={[styles.title, isCompleted ? styles.completedTitle : null]}>
            {habit.title}
          </Text>
          <Text style={styles.statusText}>
            {isFuture ? '⏳ Ожидание' : (isCompleted ? '🔥 Выполнено!' : '🎯 Нажми, чтобы отметить')}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={onEdit} 
          style={styles.actionBtn} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onDelete} 
          style={styles.actionBtn} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.actionIcon, { opacity: 0.4 }]}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderLeftWidth: 5,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.85,
  },
  mainTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
    height: '100%',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  completedEmoji: { fontSize: 20 },
  title: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: theme.colors.text 
  },
  completedTitle: { 
    textDecorationLine: 'line-through', 
    color: theme.colors.textSecondary 
  },
  statusText: { 
    fontSize: 11, 
    color: theme.colors.textSecondary, 
    marginTop: 2 
  },
  actions: {
    flexDirection: 'row',
    paddingRight: spacing.sm,
    height: '100%',
    alignItems: 'center',
  },
  actionBtn: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  }
});