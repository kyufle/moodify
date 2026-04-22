import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOOD_CONFIG } from '../../utils/utils';
import { UserContext } from '../user-provider';
import { ThemedText } from '../themed-text';

// --- SUB-COMPONENTE: RESUMEN MENSUAL ---
const MonthlySummary = ({ stats }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!stats || stats.length === 0) return null;

  const totalRegisters = stats.reduce((acc, curr) => acc + curr.total, 0);
  const sortedStats = [...stats].sort((a, b) => b.total - a.total);

  return (
    <View style={styles.summaryCard}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="pie-chart" size={18} color="#6366F1" style={{ marginRight: 10 }} />
          <Text style={styles.collapsibleTitle}>Resumen del mes ({totalRegisters})</Text>
        </View>
        <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.summaryContent}>
          {sortedStats.map((item) => {
            const config = MOOD_CONFIG[item.mood] || { color: '#E2E8F0', icon: null };
            const percentage = (item.total / totalRegisters) * 100;

            return (
              <View key={item.mood} style={styles.summaryRow}>
                <View style={styles.summaryLabel}>
                  <Image 
                    source={config.icon} 
                    style={[styles.miniIcon, { backgroundColor: config.color }]} 
                  />
                  <ThemedText style={styles.summaryMoodName}>{item.mood}</ThemedText>
                </View>
                <View style={styles.barWrapper}>
                  <View style={styles.barBackground}>
                    <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: config.color }]} />
                  </View>
                  <Text style={styles.barCount}>{item.total}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export const InfoCards = () => {
  const { userValue } = useContext(UserContext);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [sleepData, setSleepData] = useState({ hours: 0, minutes: 0, totalMinutes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!userValue?.accessToken) return;
    
    try {
      const headers = {
        'Authorization': 'Bearer ' + userValue.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const [resStats, resSleep] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_API_URL}get-monthly-stats`, { method: 'GET', headers }),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}fillInHours`, { method: 'POST', headers })
      ]);

      if (resStats.ok) {
        const jsonStats = await resStats.json();
        if (Array.isArray(jsonStats)) setMonthlyStats(jsonStats);
      }

      if (resSleep.status === 200) {
        const data = await resSleep.json();
        if (data?.total_minutes) {
          const h = Math.floor(data.total_minutes / 60);
          const m = data.total_minutes % 60;
          setSleepData({ hours: h, minutes: m, totalMinutes: data.total_minutes });
        }
      }

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MonthlySummary stats={monthlyStats} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 15,
    paddingBottom: 90,
  },
  loadingContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center'
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  collapsibleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569'
  },
  summaryContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
    borderRadius: 6,
    resizeMode: 'contain',
    padding: 5
  },
  summaryMoodName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'capitalize'
  },
  barWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  barCount: {
    marginLeft: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    width: 25,
  },
  recommendCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  recommendIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 18,
  }
});