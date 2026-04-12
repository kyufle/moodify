import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DashboardBackground } from '../dashboard/DashboardBackground';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { InfoCards } from './InfoCards';
import { StaticBottomNavBar } from '../StaticBottomNavBar';

export const CalendarView = () => {
  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* El cubo blanco grande principal */}
          <View style={styles.calendarCard}>
            <CalendarHeader />
            <CalendarGrid />
          </View>

          {/* Tarjetas de info colocadas debajo */}
          <InfoCards />
        </ScrollView>
      </DashboardBackground>

      <StaticBottomNavBar activeTab="calendar" />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 35,
    shadowColor: '#8a62a6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 20,
    // SafeArea fix for clipping inside the white card
    overflow: 'hidden',
  }
});
