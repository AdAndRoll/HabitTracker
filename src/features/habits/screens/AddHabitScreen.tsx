import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { theme, spacing, borderRadius } from '../../../shared/theme';
import { EMOJIS, COLORS } from '../../../shared/constants';
import { useHabitActions } from '../hooks/useHabitActions';

export const AddHabitScreen = () => {
  const navigation = useNavigation();
  const { createNewHabit } = useHabitActions();

  // Состояние формы остается локальным
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const trimmedTitle = title.trim();

  /**
   * Обработка сохранения через Action-хук
   */
  const handleSave = () => {
    if (trimmedTitle.length === 0) return;

    try {
      // Делегируем логику сохранения и валидацию дубликатов хуку
      createNewHabit(trimmedTitle, selectedEmoji, selectedColor, description);
      navigation.goBack(); 
    } catch (error: any) {
      // Обрабатываем специфичную ошибку дубликата
      if (error.message === 'DUPLICATE_TITLE') {
        Alert.alert(
          'Упс!',
          'Привычка с таким названием уже существует. Придумайте что-нибудь новенькое.',
          [{ text: 'Окей' }]
        );
      } else {
        Alert.alert(
          'Ошибка', 
          'Не удалось сохранить привычку. Попробуйте еще раз.'
        );
        console.error('AddHabit error:', error);
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Новая привычка</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <Text style={styles.closeBtn}>Отмена</Text>
            </TouchableOpacity>
          </View>

          {/* Preview Card - Визуальное подтверждение выбора */}
          <View style={[
            styles.preview, 
            { backgroundColor: `${selectedColor}15`, borderColor: selectedColor }
          ]}>
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            <Text style={styles.previewText} numberOfLines={1}>
              {trimmedTitle || 'Название привычки'}
            </Text>
          </View>

          {/* Name Input */}
          <Text style={styles.label}>ВВЕДИТЕ НАЗВАНИЕ</Text>
          <TextInput
            style={styles.input}
            placeholder="Прим: Утренняя йога"
            placeholderTextColor={theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={25}
            autoFocus={true}
            returnKeyType="next"
          />

          {/* Description Input */}
          <Text style={styles.label}>ОПИСАНИЕ (НЕОБЯЗАТЕЛЬНО)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Зачем вам эта привычка?"
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            maxLength={100}
            multiline={true}
            numberOfLines={3}
            blurOnSubmit={true}
          />

          {/* Emoji Selector */}
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

          {/* Color Selector */}
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

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveBtn, 
              !trimmedTitle && styles.saveBtnDisabled
            ]} 
            onPress={handleSave}
            disabled={!trimmedTitle}
          >
            <Text style={styles.saveBtnText}>Создать привычку</Text>
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
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    flexDirection: 'row',
    padding: spacing.md
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
  textArea: {
    height: 100,
    textAlignVertical: 'top', 
    paddingTop: spacing.md
  },
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
    marginBottom: spacing.md,
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
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  saveBtnDisabled: { 
    backgroundColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0
  },
  saveBtnText: { color: '#ffffff', fontSize: 18, fontWeight: '700' }
});