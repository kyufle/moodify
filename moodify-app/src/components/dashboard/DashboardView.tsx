import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// Importación de las partes del dashboard
import { DashboardBackground } from './DashboardBackground';
import { DashboardHeader } from './DashboardHeader';
import { StreakCard } from './StreakCard';
import { ActionAlertCard } from './ActionAlertCard';
import { StatsBoard } from './StatsBoard';

// Footer Barra de Nav Estática exportada
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
          <StreakCard />
          <ActionAlertCard />
          <StatsBoard />
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
    paddingBottom: 100, 
  }
});

// Exportación por defecto opcional para facilitar el uso en vistas de tipo Screen
export default DashboardView;
