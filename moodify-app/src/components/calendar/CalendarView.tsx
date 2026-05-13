import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DashboardBackground } from '../dashboard/DashboardBackground';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { StaticBottomNavBar } from '../StaticBottomNavBar';
import { UserContext } from '../user-provider';

export const CalendarView = () => {
  const { unreadCount } = useContext(UserContext);
  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <CalendarHeader />
          <CalendarGrid />
        </ScrollView>
      </DashboardBackground>

      <StaticBottomNavBar 
              activeTab="calendar" 
              hasNotifications={unreadCount > 0} 
            />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
});