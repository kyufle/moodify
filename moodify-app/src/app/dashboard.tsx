import React from 'react';
import DashboardView from '@/components/dashboard/DashboardView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function DashboardScreen() {
  return (
      <DashboardView />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  }
});