import React, { useMemo } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, SafeAreaView, 
  TouchableOpacity, Alert, Platform, Vibration 
} from 'react-native';
import { useRoute, useNavigation, useTheme } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useHabitActions } from '../hooks/useHabitActions';
import { useHabitStats } from '../hooks/useHabitStats';
import { HabitStats } from '../services/StatsService';
import { spacing, borderRadius, type AppTheme } from '../../../shared/theme';
import { RootStackScreenProps, RootStackParamList } from '../../../navigation/types';

export const HabitDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, dark } = useTheme() as AppTheme;
  const route = useRoute<RootStackScreenProps<'HabitDetails'>['route']>();
  const { habitId } = route.params;
  
  const { habits, toggleHabit } = useHabitActions();
  const habit = habits.find((h) => h.id === habitId);
  const stats = useHabitStats(habitId) as HabitStats;

  const handleDayPress = (day: { dateString: string }) => {
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
        textColor: colors.staticWhite,
      };
    });
    return marked;
  }, [habit, colors.staticWhite]);

  const calendarTheme = useMemo(() => {
    const mainColor = habit ? habit.color : colors.primary;
    return {
      calendarBackground: colors.surface,
      textSectionTitleColor: colors.textSecondary,
      dayTextColor: colors.text,
      todayTextColor: colors.primary,
      textTodayFontWeight: '900' as const,
      selectedDayTextColor: colors.staticWhite,
      textDisabledColor: dark ? '#444' : '#ccc',
      monthTextColor: colors.text,
      textMonthFontWeight: '800' as const, 
      textDayHeaderFontWeight: '600' as const,
      arrowColor: mainColor,
      textSectionTitleDisabledColor: colors.textMuted,
    };
  }, [habit?.color, colors, dark]);

  if (!habit || !stats) return null;

  const mainColor = habit.color;
  const opacity = dark ? '30' : '15';
  const statBgColor = `${mainColor}${opacity}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={[styles.backText, { color: colors.primary }]}>← Назад</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('EditHabit', { habitId })}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={[styles.editBtn, { color: colors.textSecondary }]}>Изменить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{habit.title}</Text>
          {habit.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {habit.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: statBgColor }]}>
            <Text style={[styles.statValue, { color: mainColor }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Всего раз</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: dark ? '#FF950030' : '#FF950015' }]}>
            <Text style={[styles.statValue, { color: '#FF9500' }]}>{stats.streak}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Дней подряд</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: dark ? '#10B98130' : '#10B98115' }]}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.percentage}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Успех</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          История {stats.startDateStr ? `с ${stats.startDateStr}` : ''}
        </Text>
        
        <View style={[styles.calendarWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Calendar
            key={dark ? 'dark' : 'light'}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={calendarTheme}
            style={styles.calendar}
            firstDay={1}
            enableSwipeMonths={true}
            renderArrow={(direction: string) => (
              <View style={styles.arrowContainer}>
                <Text style={[styles.arrowText, { color: mainColor }]}>
                  {direction === 'left' ? '❮' : '❯'}
                </Text>
              </View>
            )}
            showSixWeeks={true}
          />
        </View>
        <Text style={[styles.hintText, { color: colors.textMuted }]}>
          * Нажми на день в календаре, чтобы изменить статус
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: spacing.xl, 
    paddingVertical: spacing.md 
  },
  backText: { fontSize: 16, fontWeight: '600' },
  editBtn: { fontSize: 16, fontWeight: '600' },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 60, marginBottom: spacing.sm },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  description: { fontSize: 15, textAlign: 'center', marginTop: spacing.xs },
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
  statLabel: { fontSize: 10, marginTop: 4, fontWeight: '600', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  calendarWrapper: { 
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  calendar: { borderRadius: borderRadius.lg },
  arrowContainer: { padding: 5 },
  arrowText: { fontSize: 20, fontWeight: 'bold' },
  hintText: {
    fontSize: 12,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic'
  }
});