import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DashboardBackground } from './DashboardBackground';
import { DashboardHeader } from './DashboardHeader';
import { StreakCard } from './StreakCard';
import { ActionAlertCard } from './ActionAlertCard';
import { StatsBoard } from './StatsBoard'; 
import { QuoteCard } from './QuoteCard';
import { Sleep } from './Sleep';
import { StaticBottomNavBar } from '../StaticBottomNavBar';

const DashboardView = () => {
  const [showSleep, setShowSleep] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {showSleep ? (
        <Sleep onBack={() => setShowSleep(false)} />
      ) : (
        <>
          <DashboardBackground>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <DashboardHeader />
              <StreakCard />
              <ActionAlertCard />
              <StatsBoard onPressSleep={() => setShowSleep(true)} />
              <QuoteCard />
            </ScrollView>
          </DashboardBackground>

          <StaticBottomNavBar activeTab="home" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, 
  },
  sectionDivider: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
  }
});

export default DashboardView;