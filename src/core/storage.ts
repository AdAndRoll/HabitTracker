import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'habit-tracker-storage',
});

export const clientStorage = {
  setItem: (key: string, value: string) => storage.set(key, value),
  getItem: (key: string) => storage.getString(key) ?? null,
  removeItem: (key: string) => storage.remove(key),
};