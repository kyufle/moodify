import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DashboardBackground } from './DashboardBackground';
import { DashboardHeader } from './DashboardHeader';
import { StreakCard } from './StreakCard';
import { ActionAlertCard } from './ActionAlertCard';
import { StatsBoard } from './StatsBoard'; 
import { QuoteCard } from './QuoteCard';
import { Sleep } from './Sleep';
import Stress from './Stress'; 
import { StaticBottomNavBar } from '../StaticBottomNavBar';

const DashboardView = () => {
  const [showSleep, setShowSleep] = useState(false);
  const [showStress, setShowStress] = useState(false); 

  if (showSleep) {
    return <Sleep onBack={() => setShowSleep(false)} />;
  }

  if (showStress) {
    return <Stress navigation={{ goBack: () => setShowStress(false) }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DashboardHeader />
          <StreakCard />
          <ActionAlertCard />
          
          <StatsBoard 
            onPressSleep={() => setShowSleep(true)} 
            onPressStress={() => setShowStress(true)} 
          />
          
          <QuoteCard />
        </ScrollView>
      </DashboardBackground>

      <StaticBottomNavBar activeTab="home" />
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
});

export default DashboardView;