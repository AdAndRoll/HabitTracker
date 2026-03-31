import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main: undefined;
  AddHabit: undefined;
  EditHabit: { habitId: string };
  HabitDetails: { habitId: string };
};

// Бонус: создаем хелперы для пропсов экранов (очень удобно в будущем)
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;