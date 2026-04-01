import React from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CalendarView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  }
});
