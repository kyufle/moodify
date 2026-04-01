import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export const CalendarHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Botón Atrás */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Feather name="chevron-left" size={24} color="#334155" />
      </TouchableOpacity>

      {/* Textos centrales */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Calendario de mood</Text>
        <Text style={styles.subtitle}>Abril, 2026</Text>
      </View>

      {/* Espaciador invisible para centrar exactamente el texto */}
      <View style={{ width: 44 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'transparent', // Se apoya en el fondo blanco de la tarjeta de calendario
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  }
});
