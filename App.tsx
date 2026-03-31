import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { RootNavigator } from './src/navigation/RootNavigator';
import { lightTheme, darkTheme } from './src/shared/theme';
import { initCalendarLocale } from './src/shared/lib/calendarConfig';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const activeTheme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Инициализация происходит строго после загрузки основного контекста React
    initCalendarLocale();
  }, []);

  return (
    <NavigationContainer theme={activeTheme}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={activeTheme.colors.background}
      /> 
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;