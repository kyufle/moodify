import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOOD_CONFIG } from '../../utils/utils';

interface MonthlySummaryProps {
  calendarData: Record<string, string>;
}

export const MonthlySummary = ({ calendarData }: MonthlySummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Contar frecuencias
  const moodCounts: Record<string, number> = {};
  Object.values(calendarData).forEach((mood) => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  // 2. Convertir a array y ordenar de mayor a menor
  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const totalDays = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  if (totalDays === 0) return null;

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Feather name="pie-chart" size={18} color="#6366F1" style={{marginRight: 8}} />
          <Text style={styles.titleText}>Resumen del mes</Text>
        </View>
        <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.totalText}>Has registrado {totalDays} días este mes</Text>
          
          {/* DIAGRAMA DE BARRAS / LEYENDA */}
          {sortedMoods.map(([mood, count]) => {
            const config = MOOD_CONFIG[mood] || { color: '#E2E8F0', icon: null };
            const percentage = (count / totalDays) * 100;

            return (
              <View key={mood} style={styles.moodRow}>
                <View style={styles.moodLabel}>
                  <Image source={config.icon} style={styles.miniIcon} />
                  <Text style={styles.moodName}>{mood}</Text>
                </View>
                
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${percentage}%`, backgroundColor: config.color }
                    ]} 
                  />
                  <Text style={styles.countText}>{count}</Text>
                </View>
              </View>
            );
          })}

          <View style={styles.legend}>
            <Text style={styles.legendText}>* Ordenado por frecuencia de ánimo</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  totalText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodLabel: {
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  moodName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'capitalize',
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 12,
  },
  countText: {
    position: 'absolute',
    right: 10,
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  legend: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  legendText: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
  }
});