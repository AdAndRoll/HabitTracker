import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { theme, spacing, borderRadius } from '../../shared/theme';
// Импортируем константу и тип из общего слоя core
import { HABIT_FILTERS, HabitFilter } from '../../core/types';

interface Props {
  activeFilter: HabitFilter;
  onChange: (filter: HabitFilter) => void;
}

export const FilterTabs = ({ activeFilter, onChange }: Props) => {
  return (
    <View style={styles.container}>
      {HABIT_FILTERS.map((tab) => {
        const isActive = activeFilter === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(tab.id)}
          >
            <Text 
              style={[
                styles.tabText, 
                isActive && styles.activeTabText
              ]}
            >
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
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