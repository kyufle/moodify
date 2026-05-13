import React, { useContext, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOOD_CONFIG } from '../../utils/utils';
import { UserContext } from '../user-provider';
import { useTranslation } from 'react-i18next';

export const ProgressDashboard: React.FC = () => {
  const { userValue } = useContext(UserContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [moodStats, setMoodStats] = useState<any[]>([]);
  const [stressData, setStressData] = useState<any>(null);
  const [sleepData, setSleepData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [userValue?.accessToken]);

  const fetchDashboardData = async () => {
    if (!userValue?.accessToken) return;
    try {
      const headers = { 
        'Authorization': `Bearer ${userValue.accessToken}`, 
        'Accept': 'application/json' 
      };

      // Basado en tus capturas, asumimos que estos endpoints devuelven la info del mes
      const [resMoods, resStress, resSleep] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_API_URL}get-monthly-stats`, { headers }),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}stressSummary`, { headers }),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}averageSleep`, { headers })
      ]);

      const moods = await resMoods.json();
      const stress = await resStress.json();
      const sleep = await resSleep.json();
      

      setMoodStats(Array.isArray(moods) ? moods : []);
      setStressData(stress); 
      setSleepData(sleep);
    } catch (e) {
      console.error("Error fetching dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const sleepInfo = useMemo(() => {
    if (!sleepData?.exists) return { text: '--', color: '#94A3B8' };
    const avgHoursDecimal = sleepData.average_raw_minutes/60;
    const color = (avgHoursDecimal < 7 || avgHoursDecimal > 9) ? '#934b5d' : '#87a98f';
    
    return { text: sleepData.formatted_average, color };
  }, [sleepData]);

  const stressLevel = useMemo(() => {
    if (!stressData?.exists)
      return { name: '--', color: '#94A3B8' };
   
    switch (stressData.dominant_emotion) {
      case 'alto':
        return {
          name: t('dashboard.high'),
          color: '#dfadad',
        }
      case 'moderado':
        return {
          name: t('dashboard.moderate'),
          color: '#ccbea1',
        }
      case 'leve':
        return {
          name: t('dashboard.mild'),
          color: '#e2deb6',
        }
      case 'relajado':
        return {
          name: t('dashboard.relaxed'),
          color: '#a2cea2',
        }
      default:
        return { name: '--', color: '#94A3B8' };
    }
  }, [stressData, t]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#acdaad" />
      </View>
    );
  }

  const totalMoods = moodStats.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{t('dashboard.howAmIGoing')}</Text>

      {/* FILA DE RESUMEN: SUEÑO Y ESTRÉS */}
      <View style={styles.row}>
        <View style={styles.halfCard}>
          <View style={styles.iconCircle}>
            <Feather name="moon" size={20} color="#6e75a4" />
          </View>
          <Text style={styles.cardLabel}>{t('dashboard.avgSleep')}</Text>
          <Text style={[styles.cardValue, { color: sleepInfo.color }]}>
            {sleepInfo.text}
          </Text>
        </View>

        <View style={styles.halfCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#fdf2f2' }]}>
            <Feather name="activity" size={20} color="#daacac" />
          </View>
          <Text style={styles.cardLabel}>{t('dashboard.dominantStress')}</Text>
          <Text style={[styles.cardValue, { color: stressLevel.color }]}>
            {stressLevel.name}
          </Text>
        </View>
      </View>

      {/* BALANCE MENSUAL DE ÁNIMOS */}
      <View style={styles.moodCard}>
        <View style={styles.cardHeaderRow}>
          <Feather name="pie-chart" size={18} color="#acdaad" />
          <Text style={styles.cardTitle}>{t('calendarGrid.summaryMonth')}</Text>
        </View>
        
        {moodStats.length > 0 ? (
          moodStats.map((item, index) => {
            const config = MOOD_CONFIG[item.mood] || { color: '#E2E8F0' };
            const percentage = totalMoods > 0 ? ((item.total / totalMoods) * 100).toFixed(0) : 0;
            
            return (
              <View key={index} style={styles.moodRow}>
                <Text style={styles.moodName} numberOfLines={1}>
                  {t(`moodNames.${item.mood}`)}
                </Text>
                <View style={styles.barBg}>
                  <View 
                    style={[
                      styles.barFill, 
                      { width: `${percentage}%`, backgroundColor: config.color }
                    ]} 
                  />
                </View>
                <Text style={styles.moodPercent}>{percentage}%</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>{t('dashboard.noData')}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 25, paddingHorizontal: 15 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  halfCard: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 16, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  iconCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#f0f2ff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  cardLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' },
  cardValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  moodCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 20, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
  moodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  moodName: { width: 85, fontSize: 12, color: '#64748B', fontWeight: '700' },
  barBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  moodPercent: { width: 35, fontSize: 11, fontWeight: '800', textAlign: 'right', marginLeft: 8 },
  emptyText: { textAlign: 'center', color: '#94A3B8', padding: 20 }
});