import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const InfoCards = () => {
  return (
    <View style={styles.container}>
      {/* Tarjeta de Estadísticas Rápidas */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Resumen del mes</Text>
        <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😊</Text>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Días</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😢</Text>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Días</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😴</Text>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Días</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statEmoji}>😡</Text>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Días</Text>
            </View>
        </View>
      </View>

      {/* Tarjeta Confusa (Verde) */}
      <View style={[styles.card, styles.confusedCard]}>
        <View style={styles.textColumn}>
          <Text style={styles.subtitle}>Mejorando tu bienestar</Text>
          <Text style={styles.title}>Confundid@</Text>
          <Text style={styles.description}>
            Está bien no saber qué sientes. Tu racha de positividad ha subido un 15% esta semana.
          </Text>
        </View>
        <View style={styles.graphicContainer}>
          <View style={[styles.eye, { width: 30, height: 30, borderRadius: 15, left: 10, top: 40 }]} />
          <View style={[styles.eye, { width: 40, height: 40, borderRadius: 20, left: 55, top: 20 }]} />
          <View style={[styles.mouth, { width: 35, height: 12, borderRadius: 6, bottom: 20, left: 45, transform: [{ rotate: '15deg' }] }]} />
        </View>
      </View>

      {/* Tarjeta de Recomendación */}
      <View style={styles.recommendCard}>
        <View style={styles.recommendIcon}>
            <Feather name="lightbulb" size={20} color="#F59E0B" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.recommendText}>Parece que has estado cansado. ¿Por qué no pruebas nuestro reto de **"Dormir 8 horas"**?</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 15,
    marginBottom: 120,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 140,
    overflow: 'hidden',
  },
  confusedCard: {
    backgroundColor: '#D1E8D5', 
  },
  textColumn: {
    flex: 1,
    paddingRight: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '500',
  },
  graphicContainer: {
    width: 100,
    height: '100%',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  eye: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#000000',
  },
  mouth: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
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
