import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { spacing, borderRadius, type AppTheme } from '../../shared/theme';
import { HABIT_FILTERS, HabitFilter } from '../../core/types';

interface Props {
  activeFilter: HabitFilter;
  onChange: (filter: HabitFilter) => void;
}

export const FilterTabs = ({ activeFilter, onChange }: Props) => {
  const { colors, dark } = useTheme() as AppTheme;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface, 
        borderColor: colors.border 
      }
    ]}>
      {HABIT_FILTERS.map((tab) => {
        const isActive = activeFilter === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            style={[
              styles.tab, 
              isActive && { 
                backgroundColor: colors.primary,
                // Добавляем тень только для активного таба и только в темной теме
                // В светлой теме основной цвет и так дает достаточный акцент
                ...(dark && styles.activeShadow) 
              }
            ]}
            onPress={() => onChange(tab.id)}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: colors.textSecondary },
                isActive && { color: colors.staticWhite }
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
    padding: 4,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    // Убрали общие тени отсюда
  },
  activeShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});