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
import { useNavigation, useTheme } from '@react-navigation/native';

// Импортируем токены через индекс темы
import { spacing, borderRadius, type AppTheme } from '../../../shared/theme';
import { EMOJIS, COLORS } from '../../../shared/constants';
import { useHabitActions } from '../hooks/useHabitActions';

export const AddHabitScreen = () => {
  const navigation = useNavigation();
  const { colors, dark } = useTheme() as AppTheme; // Подключаем тему
  const { createNewHabit } = useHabitActions();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const trimmedTitle = title.trim();

  const handleSave = () => {
    if (trimmedTitle.length === 0) return;
    try {
      createNewHabit(trimmedTitle, selectedEmoji, selectedColor, description);
      navigation.goBack(); 
    } catch (error: any) {
      if (error.message === 'DUPLICATE_TITLE') {
        Alert.alert('Упс!', 'Привычка с таким названием уже существует.', [{ text: 'Окей' }]);
      } else {
        Alert.alert('Ошибка', 'Не удалось сохранить привычку.');
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Новая привычка</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <Text style={[styles.closeBtn, { color: colors.primary }]}>Отмена</Text>
            </TouchableOpacity>
          </View>

          {/* Preview Card */}
          <View style={[
            styles.preview, 
            { 
              backgroundColor: dark ? `${selectedColor}30` : `${selectedColor}15`, 
              borderColor: selectedColor 
            }
          ]}>
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            <Text style={[styles.previewText, { color: colors.text }]} numberOfLines={1}>
              {trimmedTitle || 'Название привычки'}
            </Text>
          </View>

          {/* Name Input */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>ВВЕДИТЕ НАЗВАНИЕ</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Прим: Утренняя йога"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={25}
            autoFocus={true}
            returnKeyType="next"
            keyboardAppearance={dark ? 'dark' : 'light'} // Темная клавиатура
          />

          {/* Description Input */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>ОПИСАНИЕ (НЕОБЯЗАТЕЛЬНО)</Text>
          <TextInput
            style={[
              styles.input, 
              styles.textArea, 
              { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }
            ]}
            placeholder="Зачем вам эта привычка?"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            maxLength={100}
            multiline={true}
            numberOfLines={3}
            blurOnSubmit={true}
            keyboardAppearance={dark ? 'dark' : 'light'}
          />

          {/* Emoji Selector */}
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

          {/* Color Selector */}
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

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveBtn, 
              { backgroundColor: colors.primary, shadowColor: colors.primary },
              !trimmedTitle && { backgroundColor: colors.border, shadowOpacity: 0, elevation: 0 }
            ]} 
            onPress={handleSave}
            disabled={!trimmedTitle}
          >
            <Text style={[styles.saveBtnText, { color: colors.staticWhite }]}>Создать привычку</Text>
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
    borderWidth: 1,
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