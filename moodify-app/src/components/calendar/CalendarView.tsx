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
          <CalendarHeader />
          <CalendarGrid />
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
});
