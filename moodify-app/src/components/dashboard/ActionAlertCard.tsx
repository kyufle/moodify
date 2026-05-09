import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../user-provider';
import { MOOD_CONFIG } from '../../utils/utils';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const ActionAlertCard = () => {
  const { t, i18n } = useTranslation();
  const { userValue } = useContext(UserContext);
  const token = userValue?.accessToken;
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
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

  const getSafePhrase = (config: any) => {
    if (!config) return "";
    const lang = i18n.language?.split('-')[0] || 'es';
    const phrasesArray = config.phrases[lang] || config.phrases['es'];
    return phrasesArray ? phrasesArray[0] : "";
  };

  if (!userValue?.user || loading) return null;

  const lastEntry = history.length > 0 ? history[0] : null; 
  const config = lastEntry ? MOOD_CONFIG[lastEntry.mood as keyof typeof MOOD_CONFIG] : null;

  const ConfusedIcon = MOOD_CONFIG.confused.icon;
  if (!lastEntry || !config) {
    return (
      <View style={[styles.card, { backgroundColor: '#D6D6D6', marginHorizontal: 20, marginTop: 20 }]}>
        <View style={styles.textColumn}>
          <Text style={[styles.description, { fontWeight: '700', color: '#333' }]}>
            {t('calendarGrid.noRegistryToday') || 'Ups, todavía no has registrado cómo te sientes hoy...'}
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 15 }]} 
            onPress={() => router.push('/calendar')}
          >
            <Text style={styles.actionButtonText}>{t('calendarGrid.registerNow') || 'Regístralo'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.graphicContainer}>
          <ConfusedIcon style={styles.moodIconGris} />
        </View>
      </View>
    );
  }
   const ConfigIcon = config.icon;

  return (
    <View style={[styles.card, { backgroundColor: config.color, marginHorizontal: 20, marginTop: 20 }]}>
      <View style={styles.textColumn}>
        <Text style={styles.subtitle}>{t('calendarGrid.howFeelNow') || '¿Cómo te sientes ahora?'}</Text>
        <Text style={styles.title}>
          {t(`moodNames.${lastEntry.mood}`)}
        </Text>
        <Text style={styles.description}>
          {getSafePhrase(config)}
        </Text>
        <TouchableOpacity 
          style={[styles.actionButton, { marginTop: 15, backgroundColor: 'rgba(0,0,0,0.1)' }]} 
          onPress={() => router.push('/calendar')}
        >
          <Text style={[styles.actionButtonText, { color: '#000' }]}>{t('calendarGrid.viewHistory') || 'Ver historial'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.graphicContainer}>
        <ConfigIcon style={styles.moodIconColor}
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
    paddingRight: 60,
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
    right: -15,
    bottom: 10,
    opacity: 0.4 
  },
  moodIconGris: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    right: -15,
    bottom: 10,
    opacity: 0.15,
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