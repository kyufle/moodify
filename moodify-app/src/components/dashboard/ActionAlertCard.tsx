import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { UserContext } from '../user-provider';
import { MOOD_CONFIG } from '../../utils/utils';
import { router } from 'expo-router';

export const ActionAlertCard = () => {
  const { userValue } = useContext(UserContext);
  const token = userValue?.accessToken;
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- LOS FETCH PARA MIRAR LA BASE DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        // Miramos el timeline de hoy para ver si hay registros
        const resHis = await fetch(`${API_BASE_URL}/get-today-timeline`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const dataHis = await resHis.json();
        if (Array.isArray(dataHis)) setHistory(dataHis);
      } catch (e) {
        console.error("Error al mirar la base de datos:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (!userValue?.user || loading) return null;

  // Lógica de detección igual a la del CalendarGrid
  const lastEntry = history.length > 0 ? history[0] : null; 
  const config = lastEntry ? MOOD_CONFIG[lastEntry.mood as keyof typeof MOOD_CONFIG] : null;

  // CASO 1: NO HAY REGISTRO HOY (Gris)
  if (!lastEntry || !config) {
    return (
      <View style={[styles.card, { backgroundColor: '#D6D6D6', marginHorizontal: 20, marginTop: 20 }]}>
        <View style={styles.textColumn}>
          <Text style={[styles.description, { fontWeight: '700', color: '#333' }]}>
            Ups, vaya todavía no has registrado cómo te sientes hoy...
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 15 }]} 
            onPress={() => router.push('/calendar')}
          >
            <Text style={styles.actionButtonText}>Regístralo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.graphicContainer}>
          <Image
            source={MOOD_CONFIG.confused.icon}
            style={styles.moodIconGris}
          />
        </View>
      </View>
    );
  }

  // CASO 2: HAY REGISTRO (Color y Frase de Utils)
  return (
    <View style={[styles.card, { backgroundColor: config.color, marginHorizontal: 20, marginTop: 20 }]}>
      <View style={styles.textColumn}>
        <Text style={styles.subtitle}>¿Cómo te sientes ahora?</Text>
        <Text style={styles.title}>
          {lastEntry.mood.charAt(0).toUpperCase() + lastEntry.mood.slice(1)}
        </Text>
        <Text style={styles.description}>
          {config.phrases.es[0]}
        </Text>
        <TouchableOpacity 
          style={[styles.actionButton, { marginTop: 15, backgroundColor: 'rgba(0,0,0,0.1)' }]} 
          onPress={() => router.push('/calendar')}
        >
          <Text style={[styles.actionButtonText, { color: '#000' }]}>Ver historial</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.graphicContainer}>
        <Image
          source={config.icon}
          style={styles.moodIconColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 140,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textColumn: {
    flex: 1,
    paddingRight: 80,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: 'rgba(0,0,0,0.7)',
  },
  graphicContainer: {
    width: 120,
    height: '100%',
    position: 'absolute',
    right: 24,
    bottom: 0,
  },
  moodIconColor: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    right: -10,
    bottom: 10,
    opacity: 0.5 
  },
  moodIconGris: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    right: -10,
    bottom: 10,
    opacity: 0.2,
    tintColor: '#000'
  },
  actionButton: { 
    backgroundColor: '#333', 
    borderRadius: 12, 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    alignSelf: 'flex-start' 
  },
  actionButtonText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 13 
  },
});