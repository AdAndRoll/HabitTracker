import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { spacing, borderRadius, type AppTheme } from '../theme';
import { DAYS_OF_WEEK, MONTHS } from '../constants';
import { getLocalDateString } from '../utils/localDate';

interface Props {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const Header = ({ selectedDate, onDateChange }: Props) => {
  const { colors, dark } = useTheme() as AppTheme;
  const today = new Date();
  
  const getDates = () => {
    const dates = [];
    const now = new Date();
    for (let i = -3; i <= 3; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        dates.push(d);
    }
    return dates;
  };

  const formatDate = (date: Date) => getLocalDateString(date);

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface, 
        borderBottomColor: colors.border 
      }
    ]}>
      <Text style={[styles.monthText, { color: colors.text }]}>
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
          const dayName = DAYS_OF_WEEK[(date.getDay() + 6) % 7];

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => onDateChange(dateStr)}
              style={[
                styles.dateCard,
                { backgroundColor: dark ? colors.border : colors.background },
                isSelected && { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[
                styles.dayName, 
                { color: colors.textSecondary },
                isSelected && { color: colors.staticWhite }
              ]}>
                {dayName}
              </Text>
              <Text style={[
                styles.dayNumber, 
                { color: colors.text },
                isSelected && { color: colors.staticWhite }
              ]}>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '800',
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
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
});