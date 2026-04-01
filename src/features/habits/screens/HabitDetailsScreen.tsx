import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, Platform, Vibration } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

import { useHabitStore } from '../../../store/useHabitStore';
import { useHabitStats } from '../hooks/useHabitStats'; // Импортируем наш новый хук
import { HabitStats } from '../services/StatsService'; // И интерфейс для типизации
import { theme, spacing, borderRadius } from '../../../shared/theme';
import { RootStackScreenProps } from '../../../navigation/types';

export const HabitDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'HabitDetails'>['route']>();
  const { habitId } = route.params;
  
  const { habits, toggleHabit } = useHabitStore();
  const habit = habits.find((h) => h.id === habitId);

  // Используем централизованную статистику
  const stats = useHabitStats(habitId) as HabitStats;

  const handleDayPress = (day: any) => {
    const dateString = day.dateString;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      Alert.alert('Рановато!', 'Нельзя отмечать привычки на будущие даты ⏳');
      return;
    }

    if (Platform.OS !== 'web') {
      try { Vibration.vibrate(10); } catch (e) {}
    }
    toggleHabit(habitId, dateString);
  };

  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};
    if (!habit || !habit.completedDays) return marked;

    habit.completedDays.forEach((date) => {
      marked[date] = {
        selected: true,
        selectedColor: habit.color,
        textColor: '#ffffff',
      };
    });
    return marked;
  }, [habit]);

  const calendarTheme = useMemo(() => {
    const color = habit ? habit.color : theme.colors.primary;
    return {
      calendarBackground: theme.colors.surface,
      textSectionTitleColor: theme.colors.textSecondary,
      dayTextColor: theme.colors.text,
      todayTextColor: theme.colors.primary,
      textTodayFontWeight: '900' as const,
      selectedDayTextColor: '#ffffff',
      textDisabledColor: theme.colors.textSecondary,
      monthTextColor: theme.colors.text,
      textMonthFontWeight: '800' as const, 
      textDayHeaderFontWeight: '600' as const,
      arrowColor: color,
    };
  }, [habit?.color]);

  // Проверка на случай удаления привычки или отсутствия данных
  if (!habit || !stats) return null;

  const mainColor = habit.color;
  const statBgColor = mainColor.indexOf('#') === 0 ? mainColor + '15' : 'rgba(0,0,0,0.05)';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
          <Text style={styles.title}>{habit.title}</Text>
          {habit.description ? (
            <Text style={styles.description}>{habit.description}</Text>
          ) : null}
        </View>

        {/* Обновленная строка статистики с тремя карточками */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: statBgColor }]}>
            <Text style={[styles.statValue, { color: mainColor }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Всего раз</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#FF950015' }]}>
            <Text style={[styles.statValue, { color: '#FF9500' }]}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Дней подряд</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#10B98115' }]}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Успех</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          История {stats.startDateStr ? `с ${stats.startDateStr}` : ''}
        </Text>
        
        <View style={styles.calendarWrapper}>
          <Calendar
            key={theme.dark ? 'dark' : 'light'}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={calendarTheme}
            style={styles.calendar}
            firstDay={1}
            enableSwipeMonths={true}
            renderArrow={(direction: string) => (
              <Text style={{ fontSize: 20, color: mainColor, fontWeight: 'bold', padding: 5 }}>
                {direction === 'left' ? '❮' : '❯'}
              </Text>
            )}
            showSixWeeks={true}
          />
        </View>
        <Text style={styles.hintText}>* Нажми на день в календаре, чтобы изменить статус</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  navBar: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backText: { color: theme.colors.primary, fontSize: 16, fontWeight: '600' },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 60, marginBottom: spacing.sm },
  title: { fontSize: 26, fontWeight: '800', color: theme.colors.text, textAlign: 'center' },
  description: { fontSize: 15, color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: spacing.xl,
    gap: spacing.sm 
  },
  statCard: { 
    flex: 1, 
    paddingVertical: spacing.md, 
    borderRadius: borderRadius.lg, 
    alignItems: 'center',
    height: 85,
    justifyContent: 'center'
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: theme.colors.textSecondary, marginTop: 4, fontWeight: '600', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: spacing.md },
  calendarWrapper: { 
    backgroundColor: theme.colors.surface, 
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  calendar: { borderRadius: borderRadius.lg },
  hintText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic'
  }
});