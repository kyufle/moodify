import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InfoCards = () => {
  return (
    <View style={styles.container}>
      {/* Tarjeta Confusa (Verde) */}
      <View style={[styles.card, styles.confusedCard]}>
        <View style={styles.textColumn}>
          <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>
          <Text style={styles.title}>Confundid@</Text>
          <Text style={styles.description}>
            Está bien no saber qué sientes. Date permiso para estar en pausa; 
            la claridad llegará a su propio ritmo. No tienes que descifrarlo todo ahora.
          </Text>
        </View>
        <View style={styles.graphicContainer}>
          {/* Gráfico simple usando CSS simulando la captura */}
          <View style={[styles.eye, { width: 30, height: 30, borderRadius: 15, left: 10, top: 40 }]} />
          <View style={[styles.eye, { width: 40, height: 40, borderRadius: 20, left: 55, top: 20 }]} />
          <View style={[styles.mouth, { width: 35, height: 14, borderRadius: 7, bottom: 20, left: 45, transform: [{ rotate: '15deg' }] }]} />
        </View>
      </View>

      {/* Tarjeta Enfadado (Naranja/Salmón) */}
      <View style={[styles.card, styles.angryCard]}>
        <View style={styles.textColumn}>
          <Text style={styles.subtitle}>Emoción dominante este mes</Text>
          <Text style={styles.title}>Enfadad@</Text>
          <Text style={styles.description}>
            Sentir el cuerpo tenso y la mente acelerada es parte del enfado.
            Antes de actuar, date un momento para soltar esa presión. Tu calma
            no se ha ido, solo está esperando a ...
          </Text>
        </View>
        <View style={styles.graphicContainer}>
          {/* Gráfico simple usando CSS simulando la captura */}
           <View style={[styles.eye, { width: 25, height: 25, borderRadius: 12, left: 30, top: 50, transform: [{ rotate: '-15deg' }] }]} />
           <View style={[styles.eye, { width: 25, height: 25, borderRadius: 12, left: 65, top: 50, transform: [{ rotate: '15deg' }] }]} />
           <View style={[styles.mouth, { width: 60, height: 5, borderRadius: 2, bottom: 20, left: 25, transform: [{ rotate: '-10deg' }] }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 120, // Espacio superior al BottomTabBar global (puesto que está absolute)
  },
  card: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 160,
    overflow: 'hidden',
  },
  confusedCard: {
    backgroundColor: '#C8E1CE', 
  },
  angryCard: {
    backgroundColor: '#FFB89E',
  },
  textColumn: {
    flex: 1, // Toma todo el espacio disponible empujando al gráfico a la derecha
    paddingRight: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 10,
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    color: '#333333',
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
    borderWidth: 6,
    borderColor: '#000000',
  },
  mouth: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  }
});
