import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { spacing, borderRadius, type AppTheme } from '../theme';

interface Props {
  onPress: () => void;
}

export const FloatingButton = ({ onPress }: Props) => {
  const { colors, dark } = useTheme() as AppTheme;

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOpacity: dark ? 0.5 : 0.3,
        }
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: colors.staticWhite }]}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: borderRadius.full, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  text: {
    fontSize: 32,
    fontWeight: '300',
    marginTop: Platform.OS === 'ios' ? -4 : -2,
  },
});