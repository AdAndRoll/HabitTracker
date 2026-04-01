import React, { useEffect } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header, HabitCard, FloatingButton, FilterTabs } from '../../../shared/components';
import { theme, spacing } from '../../../shared/theme';
import { RootStackParamList } from '../../../navigation/types';

// Hooks
import { useHabits } from '../hooks/useHabits';
import { useHabitActions } from '../hooks/useHabitActions';

// Services
import { NotificationService } from '../services/NotificationService';

export const MainScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Данные и состояние фильтрации
  const { 
    habits, 
    selectedDate, 
    setSelectedDate, 
    toggleHabit, 
    isToday,
    isFuture,
    filter,
    setFilter 
  } = useHabits();

  // Бизнес-логика (действия)
  const { setHabitReminder, deleteHabit } = useHabitActions();

  // Инициализация сервисов при монтировании
  useEffect(() => {
    const initNotifications = async () => {
      try {
        await NotificationService.initialize();
      } catch (error) {
        console.error('Ошибка инициализации уведомлений:', error);
      }
    };
    initNotifications();
  }, []);

  /**
   * Обработка установки напоминания
   */
  const handleSetReminder = async (id: string, title: string, hour: number, minute: number) => {
    try {
      await setHabitReminder(id, title, hour, minute);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось установить напоминание');
    }
  };

  /**
   * Подтверждение удаления
   */
  const confirmDelete = (id: string, title: string) => {
    Alert.alert(
      'Удаление',
      `Вы уверены, что хотите удалить привычку "${title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          onPress: () => deleteHabit(id), 
          style: 'destructive' 
        },
      ]
    );
  };

  /**
   * Переключение статуса привычки
   */
  const handleToggle = (id: string) => {
    if (isFuture) {
      Alert.alert('Рановато!', 'Нельзя отмечать привычки на будущие даты ⏳');
      return;
    }
    toggleHabit(id);
  };

  const ListEmptyComponent = () => {
    const getMessage = () => {
      switch (filter) {
        case 'completed': return 'Вы еще не выполнили ни одной привычки. Пора начинать! 💪';
        case 'pending': return 'Все задачи выполнены! Вы молодец! 🎉';
        default: return 'Самое время завести новую\nполезную привычку!';
      }
    };

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{filter === 'completed' ? '⏳' : '🌿'}</Text>
        <Text style={styles.emptyTitle}>Список пуст</Text>
        <Text style={styles.emptySubtitle}>{getMessage()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      <View style={styles.filterWrapper}>
        <FilterTabs activeFilter={filter} onChange={setFilter} />
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isCompleted = item.completedDays.includes(selectedDate);
          
          return (
            <HabitCard
              habit={item}
              isCompleted={isCompleted}
              isToday={isToday}
              isFuture={isFuture}
              onToggle={() => handleToggle(item.id)}
              onLongPress={() => navigation.navigate('HabitDetails', { habitId: item.id })}
              onEdit={() => navigation.navigate('EditHabit', { habitId: item.id })}
              onDelete={() => confirmDelete(item.id, item.title)}
              onSetReminder={(h, m) => handleSetReminder(item.id, item.title, h, m)}
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
  filterWrapper: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 160, 
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 80,
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