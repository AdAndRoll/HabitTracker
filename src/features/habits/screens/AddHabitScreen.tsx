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
import { useHabitStore } from '../../../store';
import { theme, spacing, borderRadius } from '../../../shared/theme';
import { EMOJIS, COLORS } from '../../../shared/constants';

export const AddHabitScreen = () => {
  const navigation = useNavigation();
  
  const { addHabit, habits } = useHabitStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Новое состояние
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const trimmedTitle = title.trim();

  const handleSave = () => {
    // 1. Валидация на пустоту
    if (trimmedTitle.length === 0) {
      return;
    }

    // 2. Проверка на дубликаты (Case-insensitive)
    const isDuplicate = habits.some(
      (habit) => habit.title.toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert(
        'Упс!',
        'Привычка с таким названием уже существует. Придумайте что-нибудь новенькое.',
        [{ text: 'Окей' }]
      );
      return;
    }

    // 3. Обработка сохранения
    try {
      // Теперь передаем и описание (оно может быть пустым)
      addHabit(trimmedTitle, selectedEmoji, selectedColor, description.trim());
      navigation.goBack(); 
    } catch (error) {
      Alert.alert(
        'Ошибка сохранения', 
        'Не удалось сохранить данные. Убедитесь, что на устройстве достаточно свободного места.'
      );
      console.error('Failed to add habit:', error);
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

          {/* Preview Card */}
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
            returnKeyType="next" // Меняем на "далее", так как есть следующее поле
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
              !title.trim() && styles.saveBtnDisabled
            ]} 
            onPress={handleSave}
            disabled={!title.trim()}
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
    textAlignVertical: 'top', // Важно для Android, чтобы текст начинался сверху
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