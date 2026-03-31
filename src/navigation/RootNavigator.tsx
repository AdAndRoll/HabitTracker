import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Импортируем типы
import { RootStackParamList } from './types';

// Импортируем экраны
import { MainScreen } from '../features/habits/screens/MainScreen';
import { AddHabitScreen } from '../features/habits/screens/AddHabitScreen';
import { EditHabitScreen } from '../features/habits/screens/EditHabitScreen';
import { HabitDetailsScreen } from '../features/habits/screens/HabitDetailsScreen'; // Подключаем новый экран

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Main"
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', 
      }}
    >
      {/* Главный экран */}
      <Stack.Screen name="Main" component={MainScreen} />
      
      {/* Добавление — Модалка */}
      <Stack.Screen 
        name="AddHabit" 
        component={AddHabitScreen} 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom' 
        }} 
      />

      {/* ЭКРАН ДЕТАЛЕЙ — теперь реальный компонент */}
      <Stack.Screen 
        name="HabitDetails" 
        component={HabitDetailsScreen} 
        options={{
            animation: 'slide_from_right' // Детали обычно открываются сбоку
        }}
      />

      {/* Редактирование — Модалка */}
      <Stack.Screen 
        name="EditHabit" 
        component={EditHabitScreen} 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom' 
        }}
      />
     
    </Stack.Navigator>
  );
};