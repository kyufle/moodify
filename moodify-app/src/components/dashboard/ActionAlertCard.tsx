import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const ActionAlertCard = () => {
  return (
    <View style={styles.card}>
      {/* Botón para cerrar */}
      <TouchableOpacity style={styles.closeButton}>
        <Feather name="x" size={16} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        {/* Texto de alerta */}
        <Text style={styles.messageText}>
          Ups, vaya todavía no has registrado como te sientes hoy...
        </Text>

        {/* Botón de acción */}
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Regístralo</Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico decorativo de carita */}
      <View style={styles.graphicContainer}>
        <View style={styles.eye} />
        <View style={[styles.eye, styles.eyeRight]} />
        <View style={styles.mouth} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D6D6D6', // Gris oscuro/medio para contrastar
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#333333',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  contentContainer: {
    width: '60%', // Dejamos espacio para el gráfico a la derecha
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 20,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#333333', // Botón oscuro
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  graphicContainer: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // Rotar para darle ese look abstracto
    transform: [{ rotate: '-15deg' }],
  },
  eye: {
    width: 24,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 12,
    position: 'absolute',
    top: 30,
    left: 20,
  },
  eyeRight: {
    left: 70,
    top: 20,
  },
  mouth: {
    width: 60,
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
    position: 'absolute',
    bottom: 30,
    left: 30,
    transform: [{ rotate: '-5deg' }],
  }
});
