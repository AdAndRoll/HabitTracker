import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Добавляем /src/ к путям
import { RootNavigator } from './src/navigation/RootNavigator';
import { lightTheme, darkTheme } from './src/shared/theme';

const App = () => {
  // Определяем системную тему
  const isDarkMode = useColorScheme() === 'dark';
  const activeTheme = isDarkMode ? darkTheme : lightTheme;

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