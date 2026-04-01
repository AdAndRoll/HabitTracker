import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';

import { Habit } from '../../core';
import { spacing, borderRadius, type AppTheme } from '../theme';

interface Props {
  habit: Habit;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
  onToggle: () => void;
  onLongPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
  const { colors, dark } = useTheme() as AppTheme;
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
      onSetReminder(selectedDate.getHours(), selectedDate.getMinutes());
    }
  };

  const colorString = habit.color || colors.primary;
  const iconBgOpacity = dark ? '40' : '15'; 
  const iconBgColor = `${colorString}${iconBgOpacity}`;

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.surface, 
        borderLeftColor: colorString,
        borderWidth: dark ? 1 : 0,
        borderColor: colors.border
      },
      (isCompleted || isFuture) && { opacity: colors.completedOpacity }
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
          <Text 
            numberOfLines={1} 
            style={[
              styles.title, 
              { color: colors.text },
              isCompleted && { color: colors.textSecondary, textDecorationLine: 'line-through' }
            ]}
          >
            {habit.title}
          </Text>
          <View style={styles.statusRow}>
            <Text style={[
              styles.statusText, 
              { color: isCompleted ? colors.textSecondary : colors.textMuted }
            ]}>
              {isFuture ? '⏳ Ожидание' : (isCompleted ? '🔥 Выполнено!' : '🎯 Нажми, чтобы отметить')}
            </Text>
            {habit.isReminderEnabled && (
              <Text style={[styles.reminderBadge, { color: colors.primary }]}>
                {' '}• 🔔 {habit.reminderTime}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.actionBtn}>
          <Text style={[styles.actionIcon, !habit.isReminderEnabled && { opacity: 0.3 }]}>
            {habit.isReminderEnabled ? '🔔' : '🔕'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
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
          textColor={dark ? colors.staticWhite : colors.text}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  },
  statusText: { 
    fontSize: 11, 
  },
  reminderBadge: {
    fontSize: 11,
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