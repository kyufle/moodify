import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

// Importación de las partes del dashboard
import { DashboardBackground } from './DashboardBackground';
import { DashboardHeader } from './DashboardHeader';
import { StreakCard } from './StreakCard';
import { ActionAlertCard } from './ActionAlertCard';
import { StatsBoard } from './StatsBoard';
import { MoodTrackerCard } from './MoodTrackerCard';
import { QuoteCard } from './QuoteCard';

// Footer Barra de Nav Estática
import { StaticBottomNavBar } from '../StaticBottomNavBar';

export const DashboardView = () => {
  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DashboardHeader />
          
          <MoodTrackerCard />
          
          <View style={styles.sectionDivider}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionLabel}>Tu Actividad</Text>
          </View>
          
          <ActionAlertCard />
          <StreakCard />
          <StatsBoard />
          
          <View style={styles.sectionDivider}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionLabel}>Inspiración</Text>
          </View>
          
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
