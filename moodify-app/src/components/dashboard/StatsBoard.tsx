import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Añadimos onPressSleep como prop
export const StatsBoard = ({ onPressSleep }) => {
  return (
    <View style={styles.container}>
      {/* Tarjeta de Sueño */}
      <TouchableOpacity 
        style={{ flex: 1 }} 
        onPress={onPressSleep} // Ahora llama a la función del padre
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

          <Text style={styles.valueText}>
            7h <Text style={styles.valueSub}>20min</Text>
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* Tarjeta de Estrés */}
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

        <Text style={styles.valueText}>Alto</Text>
      </View>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  valueSub: {
    fontSize: 14,
    fontWeight: '500',
  }
});