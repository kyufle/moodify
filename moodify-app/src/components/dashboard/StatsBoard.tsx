import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../user-provider';

interface StatsBoardProps {
  onPressSleep: () => void;
  onPressStress: () => void;
}


export const StatsBoard: React.FC<StatsBoardProps> = ({ onPressSleep, onPressStress }) => {
  const { userValue } = useContext(UserContext);
  const [sleepDisplay, setSleepDisplay] = useState<string>('Cargando...');
  const [stressLevel, setStressLevel] = useState<string>('...');

  useEffect(() => {
  async function fetchStats() {
    if (!userValue?.user || !userValue?.accessToken) return;

    const headers = {
      'Authorization': `Bearer ${userValue.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    try {
      const resSleep = await fetch(`${process.env.EXPO_PUBLIC_API_URL}fillInHours`, {
        method: 'POST',
        headers: headers,
      });

      if (resSleep.status === 200) {
        const data = await resSleep.json();
        if (data?.total_minutes) {
          const h = Math.floor(data.total_minutes / 60);
          const m = data.total_minutes % 60;
          setSleepDisplay(`${h}h y ${m}min`);
        } else {
          setSleepDisplay('No registrado');
        }
      }

      const resStress = await fetch(`${process.env.EXPO_PUBLIC_API_URL}getStatus`, {
        method: 'GET',
        headers: headers,
      });

      if (resStress.ok) {
        const sData = await resStress.json();
        
        if (sData.exists && sData.data) {
          const breakdown = sData.data.breakdown;
          
          const levels = [
            { name: "Relajado", val: Number(breakdown.relajado) || 0 },
            { name: "Leve", val: Number(breakdown.leve) || 0 },
            { name: "Moderado", val: Number(breakdown.moderado) || 0 },
            { name: "Alto", val: Number(breakdown.alto) || 0 },
          ];

          const main = levels.sort((a, b) => b.val - a.val)[0];
          setStressLevel(main.val > 0 ? main.name : 'Hacer test');
          
        } else {
          setStressLevel('Hacer test');
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setSleepDisplay('No registrado');
      setStressLevel('Hacer test');
    }
  }

  fetchStats();
}, [userValue.accessToken, userValue.user]);

  return (
    <View style={styles.container}>
      {/* Tarjeta de Sueño */}
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={onPressSleep} 
        activeOpacity={0.7}
      >
        <View style={[styles.card, styles.sleepCard]}>
          <View style={styles.header}>
            <Feather name="moon" size={16} color="#333" />
            <Text style={styles.cardTitle}>Duración del sueño</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {[40, 60, 30, 80, 50, 40, 70].map((h, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={[styles.barPart, { height: h, backgroundColor: '#D9894A', opacity: 0.8 }]} />
                <View style={{ height: 2 }} />
                <View style={[styles.barPart, { height: 100 - h - 40, backgroundColor: '#D9894A' }]} />
              </View>
            ))}
          </View>

          <Text style={styles.valueText}>{sleepDisplay}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Tarjeta de Estrés */}
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={onPressStress} 
        activeOpacity={0.7}
      >
        <View style={[styles.card, styles.stressCard]}>
          <View style={styles.header}>
            <Feather name="frown" size={16} color="#333" />
            <Text style={styles.cardTitle}>Indicador de estrés</Text>
          </View>

          <View style={styles.chartContainerStress}>
            {[10, 15, 20, 25, 30, 40, 60].map((h, i) => (
              <View key={i} style={[styles.solidBar, { height: h, backgroundColor: '#A88AE6' }]} />
            ))}
          </View>

          <Text style={styles.valueText}>{stressLevel}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 16,
    marginBottom: 30,
  },
  touchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  sleepCard: {
    backgroundColor: '#FFCDA3', 
  },
  stressCard: {
    backgroundColor: '#E0D4FF', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    marginBottom: 8,
  },
  barColumn: {
    width: 6,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  barPart: {
    width: '100%',
    borderRadius: 3,
  },
  chartContainerStress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
    marginBottom: 8,
  },
  solidBar: {
    width: 6,
    borderRadius: 3,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  }
});