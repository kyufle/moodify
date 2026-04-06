import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import UserProvider from '@/components/user-provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Slot />
      </ThemeProvider>
    </UserProvider>
  );
}
