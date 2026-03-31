import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { theme, spacing, borderRadius } from '../theme';
import { DAYS_OF_WEEK, MONTHS } from '../constants'; // Чистый импорт
import { getLocalDateString } from '../utils/localDate';


interface Props {
  selectedDate: string; // Формат "2026-03-31"
  onDateChange: (date: string) => void;
}

export const Header = ({ selectedDate, onDateChange }: Props) => {
    const today = new Date();
  
    const getDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date();
        d.setDate(new Date().getDate() + i);
        dates.push(d);
    }
    return dates;
    };

  const formatDate = (date: Date) => getLocalDateString(date);

  return (
    <View style={styles.container}>
      <Text style={styles.monthText}>
        {MONTHS[today.getMonth()]} {today.getFullYear()}
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {getDates().map((date, index) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const dayName = DAYS_OF_WEEK[(date.getDay() + 6) % 7]; // Подстройка под Пн-Вс

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => onDateChange(dateStr)}
              style={[
                styles.dateCard,
                isSelected && styles.selectedDateCard
              ]}
            >
              <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                {dayName}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  scrollContainer: {
    paddingHorizontal: spacing.md,
  },
  dateCard: {
    width: 50,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  selectedDateCard: {
    backgroundColor: theme.colors.primary,
  },
  dayName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.surface,
  },
});