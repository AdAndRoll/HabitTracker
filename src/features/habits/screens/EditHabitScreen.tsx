import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

import { spacing, borderRadius, type AppTheme } from '../../../shared/theme';
import { EMOJIS, COLORS } from '../../../shared/constants';
import { RootStackScreenProps } from '../../../navigation/types';
import { useHabitActions } from '../hooks/useHabitActions';

export const EditHabitScreen = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme() as AppTheme;
  const route = useRoute<RootStackScreenProps<'EditHabit'>['route']>();
  const { habitId } = route.params;

  const { habits, editExistingHabit } = useHabitActions();
  const habit = habits.find(h => h.id === habitId);

  const [title, setTitle] = useState(habit?.title || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [selectedEmoji, setSelectedEmoji] = useState(habit?.emoji || EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(habit?.color || COLORS[0]);

  useEffect(() => {
    if (!habit) {
      Alert.alert('Ошибка', 'Привычка не найдена');
      navigation.goBack();
    }
  }, [habit]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      editExistingHabit(habitId, {
        title: trimmedTitle,
        description: description,
        emoji: selectedEmoji,
        color: selectedColor,
      });
      navigation.goBack();
    } catch (error: any) {
      if (error.message === 'DUPLICATE_TITLE') {
        Alert.alert('Упс!', 'Привычка с таким названием уже существует.');
      } else {
        Alert.alert('Ошибка', 'Не удалось сохранить изменения.');
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.content} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Редактирование</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <Text style={[styles.closeBtn, { color: colors.primary }]}>Отмена</Text>
            </TouchableOpacity>
          </View>

          {/* Preview карточки */}
          <View style={[
            styles.preview, 
            { 
              backgroundColor: dark ? `${selectedColor}30` : `${selectedColor}15`, 
              borderColor: selectedColor 
            }
          ]}>
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            <Text style={[styles.previewText, { color: colors.text }]} numberOfLines={1}>
              {title || 'Название'}
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>НАЗВАНИЕ</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={title}
            onChangeText={setTitle}
            maxLength={25}
            placeholder="Напр: Зарядка"
            placeholderTextColor={colors.textSecondary}
            keyboardAppearance={dark ? 'dark' : 'light'}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>ОПИСАНИЕ</Text>
          <TextInput
            style={[
              styles.input, 
              styles.textArea, 
              { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }
            ]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholder="Необязательно"
            placeholderTextColor={colors.textSecondary}
            textAlignVertical="top"
            keyboardAppearance={dark ? 'dark' : 'light'}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>ИКОНКА</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity 
                key={emoji} 
                style={[
                  styles.emojiBtn, 
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedEmoji === emoji && { borderColor: colors.primary, backgroundColor: `${colors.primary}20` }
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.label, { color: colors.textSecondary }]}>ЦВЕТ</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity 
                key={color} 
                style={[
                  styles.colorCircle, 
                  { backgroundColor: color }, 
                  selectedColor === color && [styles.selectedColor, { borderColor: colors.text }]
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.saveBtn, 
              { backgroundColor: colors.primary, shadowColor: colors.primary },
              !title.trim() && { backgroundColor: colors.border, shadowOpacity: 0, elevation: 0 }
            ]} 
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={[styles.saveBtnText, { color: colors.staticWhite }]}>Сохранить изменения</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: spacing.xl },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: spacing.xl 
  },
  title: { fontSize: 24, fontWeight: '800' },
  closeBtn: { fontWeight: '600', fontSize: 16 },
  preview: { 
    height: 80, 
    borderRadius: borderRadius.lg, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: spacing.xl, 
    flexDirection: 'row',
    paddingHorizontal: spacing.md
  },
  previewEmoji: { fontSize: 32, marginRight: spacing.md },
  previewText: { fontSize: 18, fontWeight: '700', flexShrink: 1 },
  label: { 
    fontSize: 12, 
    fontWeight: '800', 
    marginBottom: spacing.sm, 
    letterSpacing: 1 
  },
  input: { 
    padding: spacing.md, 
    borderRadius: borderRadius.md, 
    fontSize: 16, 
    marginBottom: spacing.xl, 
    borderWidth: 1, 
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { marginBottom: spacing.xl },
  emojiBtn: { 
    width: 50, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: spacing.sm, 
    borderRadius: borderRadius.sm, 
    borderWidth: 1, 
  },
  emojiText: { fontSize: 24 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.xl },
  colorCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    marginRight: spacing.md, 
    marginBottom: spacing.md 
  },
  selectedColor: { 
    borderWidth: 3, 
    transform: [{ scale: 1.1 }]
  },
  saveBtn: { 
    padding: spacing.lg, 
    borderRadius: borderRadius.lg, 
    alignItems: 'center',
    marginTop: spacing.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  saveBtnText: { fontSize: 18, fontWeight: '700' }
});