import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme, spacing, borderRadius } from '../../shared/theme';
import { HabitFilter } from '../../features/habits/hooks/useHabits';

interface Props {
  activeFilter: HabitFilter;
  onChange: (filter: HabitFilter) => void;
}

export const FilterTabs = ({ activeFilter, onChange }: Props) => {
  const tabs: { id: HabitFilter; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'pending', label: 'План' },
    { id: 'completed', label: 'Готово' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(tab.id)}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 4,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    // Добавь небольшую тень для Middle+ лоска
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});