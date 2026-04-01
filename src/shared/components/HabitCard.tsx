import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

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
  // Новый колбэк для передачи выбранного времени родителю
  onSetReminder: (hour: number, minute: number) => void;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  isToday, 
  isFuture, 
  onToggle, 
  onLongPress, 
  onEdit, 
  onDelete,
  onSetReminder 
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      try { Vibration.vibrate(10); } catch (err) {}
    }
    onToggle();
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    
    if (event.type === 'set' && selectedDate) {
      const hour = selectedDate.getHours();
      const minute = selectedDate.getMinutes();
      
      // Просто пробрасываем данные вверх, не заботясь о логике сохранения
      onSetReminder(hour, minute);
    }
  };

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
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>
              {isFuture ? '⏳ Ожидание' : (isCompleted ? '🔥 Выполнено!' : '🎯 Нажми, чтобы отметить')}
            </Text>
            {habit.isReminderEnabled && (
              <Text style={styles.reminderBadge}> • 🔔 {habit.reminderTime}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => setShowPicker(true)} 
          style={styles.actionBtn}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Text style={[styles.actionIcon, !habit.isReminderEnabled && { opacity: 0.3 }]}>
            {habit.isReminderEnabled ? '🔔' : '🔕'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onEdit} 
          style={styles.actionBtn} 
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        >
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onDelete} 
          style={styles.actionBtn} 
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
        >
          <Text style={[styles.actionIcon, { opacity: 0.4 }]}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  reminderBadge: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingRight: 4,
    height: '100%',
    alignItems: 'center',
  },
  actionBtn: {
    paddingHorizontal: 6,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  }
});