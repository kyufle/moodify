import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import '../i18n/i18n';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import UserProvider from '@/components/user-provider';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, error] = useFonts({
    Nunito: Nunito_400Regular,
  });

  if (!fontsLoaded)
    return

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="dark" /> 
        <SafeAreaView style={styles.safeAreaFull}>
          <AnimatedSplashOverlay />
          <Slot />
        </SafeAreaView>
      </ThemeProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaFull: { flex: 1, width: '100%' },
});