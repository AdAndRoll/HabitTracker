import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header, HabitCard, FloatingButton } from '../../../shared/components';
import { theme, spacing } from '../../../shared/theme';
import { useHabits } from '../hooks/useHabits';
import { RootStackParamList } from '../../../navigation/RootNavigator';

export const MainScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { 
    habits, 
    selectedDate, 
    setSelectedDate, 
    toggleHabit, 
    removeHabit,
    isToday,
    isFuture
  } = useHabits();

  // Выносим пустой список в отдельный компонент для чистоты рендера
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🌿</Text>
      <Text style={styles.emptyTitle}>Список пуст</Text>
      <Text style={styles.emptySubtitle}>
        Самое время завести новую{"\n"}полезную привычку!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        // Подключаем проработанный Empty State
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          // Проверяем, выполнена ли привычка именно в выбранный день
          const isCompleted = item.completedDays.includes(selectedDate);
          
          return (
            <HabitCard
              habit={item}
              isCompleted={isCompleted}
              isToday={isToday}
              isFuture={isFuture}
              onToggle={() => toggleHabit(item.id)}
              onDelete={() => removeHabit(item.id)} 
            />
          );
        }}
      />
      
      <FloatingButton 
        onPress={() => navigation.navigate('AddHabit')} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: spacing.md,
    // Большой отступ снизу, чтобы FloatingButton не перекрывал последнюю карточку
    paddingBottom: 160, 
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
});