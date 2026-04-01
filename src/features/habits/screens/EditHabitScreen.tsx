import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { theme, spacing, borderRadius } from '../../../shared/theme';
import { EMOJIS, COLORS } from '../../../shared/constants';
import { RootStackScreenProps } from '../../../navigation/types';
import { useHabitActions } from '../hooks/useHabitActions';

export const EditHabitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'EditHabit'>['route']>();
  const { habitId } = route.params;

  // Используем наш единый хук для действий с привычками
  const { habits, editExistingHabit } = useHabitActions();
  
  // Ищем данные привычки для инициализации формы
  const habit = habits.find(h => h.id === habitId);

  // Состояния формы
  const [title, setTitle] = useState(habit?.title || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [selectedEmoji, setSelectedEmoji] = useState(habit?.emoji || EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(habit?.color || COLORS[0]);

  // Если привычка не найдена (например, была удалена), закрываем экран
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
      // Вся логика валидации дубликатов и обновления теперь внутри хука
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
        console.error('EditHabit error:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.title}>Редактирование</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <Text style={styles.closeBtn}>Отмена</Text>
            </TouchableOpacity>
          </View>

          {/* Preview карточки */}
          <View style={[
            styles.preview, 
            { backgroundColor: `${selectedColor}15`, borderColor: selectedColor }
          ]}>
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            <Text style={styles.previewText} numberOfLines={1}>
              {title || 'Название'}
            </Text>
          </View>

          <Text style={styles.label}>НАЗВАНИЕ</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            maxLength={25}
            placeholder="Напр: Зарядка"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={styles.label}>ОПИСАНИЕ</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholder="Необязательно"
            placeholderTextColor={theme.colors.textSecondary}
            textAlignVertical="top"
          />

          <Text style={styles.label}>ИКОНКА</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity 
                key={emoji} 
                style={[
                  styles.emojiBtn, 
                  selectedEmoji === emoji && styles.selectedEmoji
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>ЦВЕТ</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity 
                key={color} 
                style={[
                  styles.colorCircle, 
                  { backgroundColor: color }, 
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.saveBtn, 
              !title.trim() && styles.saveBtnDisabled
            ]} 
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={styles.saveBtnText}>Сохранить изменения</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.xl },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: spacing.xl 
  },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  closeBtn: { color: theme.colors.primary, fontWeight: '600', fontSize: 16 },
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
  previewText: { fontSize: 18, fontWeight: '700', color: theme.colors.text, flexShrink: 1 },
  label: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: theme.colors.textSecondary, 
    marginBottom: spacing.sm, 
    letterSpacing: 1 
  },
  input: { 
    backgroundColor: theme.colors.surface, 
    padding: spacing.md, 
    borderRadius: borderRadius.md, 
    fontSize: 16, 
    color: theme.colors.text, 
    marginBottom: spacing.xl, 
    borderWidth: 1, 
    borderColor: theme.colors.border 
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
    backgroundColor: theme.colors.surface, 
    borderWidth: 1, 
    borderColor: 'transparent' 
  },
  selectedEmoji: { 
    borderColor: theme.colors.primary, 
    backgroundColor: `${theme.colors.primary}10` 
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
    borderColor: theme.colors.text,
    transform: [{ scale: 1.1 }]
  },
  saveBtn: { 
    backgroundColor: theme.colors.primary, 
    padding: spacing.lg, 
    borderRadius: borderRadius.lg, 
    alignItems: 'center',
    marginTop: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  saveBtnDisabled: { backgroundColor: theme.colors.border, elevation: 0 },
  saveBtnText: { color: '#ffffff', fontSize: 18, fontWeight: '700' }
});