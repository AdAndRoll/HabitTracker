import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from '../features/habits/screens/MainScreen';
import { AddHabitScreen } from '../features/habits/screens/AddHabitScreen';

// 1. Типизируем параметры маршрутов (как Intent Extras в Android)
export type RootStackParamList = {
  Main: undefined;
  AddHabit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Main"
      screenOptions={{
        headerShown: false, // Тулбар рисуем сами
        animation: 'slide_from_right', // Нативный переход
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
      
      
      <Stack.Screen 
        name="AddHabit" 
        component={AddHabitScreen} 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom' 
        }} 
      /> 
     
    </Stack.Navigator>
  );
};