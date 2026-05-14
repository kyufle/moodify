import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../user-provider';
import { MOOD_CONFIG } from '../../utils/utils';
import { router, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '../themed-text';

export const ActionAlertCard = () => {
  const { t, i18n } = useTranslation();
  const { userValue } = useContext(UserContext);
  const token = userValue?.accessToken;
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    try {
      const resHis = await fetch(`${API_BASE_URL}/get-today-timeline?t=${Date.now()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const text = await resHis.text();
      
      if (text.startsWith('[') || text.startsWith('{')) {
        const dataHis = JSON.parse(text);
        if (Array.isArray(dataHis)) {
          setHistory(dataHis);
        }
      } else {
        console.warn("La API no devolvió JSON:", text.substring(0, 50));
      }
    } catch (e) {
      console.error("Error en fetchData:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [token])
  );

  const getSafePhrase = (config: any) => {
    if (!config) return "";
    const lang = i18n.language?.split('-')[0] || 'es';
    const phrasesArray = config.phrases[lang] || config.phrases['es'];
    return phrasesArray ? phrasesArray[0] : "";
  };

  if (!userValue?.user || loading) return null;

  const lastEntry = history.length > 0 ? history[0] : null; 
  const config = lastEntry ? MOOD_CONFIG[lastEntry.mood as keyof typeof MOOD_CONFIG] : null;
  
  const isToday = (() => {
    if (!lastEntry?.date) return false;
    const d = new Date(lastEntry.date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  })();

  if (!lastEntry || !isToday || !config) {
    const ConfusedIcon = MOOD_CONFIG.confused.icon;
    return (
      <View style={[styles.card, { backgroundColor: '#D6D6D6', marginHorizontal: 20, marginTop: 20 }]}>
        <View style={styles.textColumn}>
          <Text style={[styles.description, { fontWeight: '700', color: '#333' }]}>
            {t('calendarGrid.howFeelNow')}
          </Text>
          <ThemedText style={{color: 'black'}}>{t('calendarGrid.textRegister')}</ThemedText>
          
          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 15 }]} 
            onPress={() => router.push('/calendar')}
          >
            <Text style={styles.actionButtonText}>{t('calendarGrid.registerNow')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardWatermark}>
           <ConfusedIcon width={100} height={100} opacity={0.2} />
        </View>
      </View>
    );
  }
  
  const WatermarkIcon = config.icon;

  return (
    <View style={[styles.card, { backgroundColor: config.color, marginHorizontal: 20, marginTop: 20 }]}>
      <View style={styles.textColumn}>
        <Text style={styles.subtitleCard}>{t('calendarGrid.howFeelNowCalendar')}</Text>
        <Text style={styles.titleCard}>{t(`moodNames.${lastEntry.mood}`)}</Text>
        <Text style={styles.description}>
          {getSafePhrase(config)}
        </Text>

        <TouchableOpacity 
          style={[styles.actionButton, { marginTop: 15, backgroundColor: 'rgba(0,0,0,0.15)' }]} 
          onPress={() => router.push('/calendar')}
        >
          <Text style={[styles.actionButtonText, { color: '#000' }]}>
            {t('calendarGrid.viewHistory') || 'Ver historial'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardWatermark}>
        <WatermarkIcon width={100} height={100} opacity={0.3} />
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
    minHeight: 150,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textColumn: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center'
  },
  subtitleCard: {
    fontSize: 15,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 2,
    letterSpacing: 0.5
  },
  titleCard: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: 'rgba(0,0,0,0.7)',
    maxWidth: '85%'
  },
  cardWatermark: {
    position: 'absolute',
    right: -15,
    bottom: -15,
    zIndex: 1,
  },
  actionButton: { 
    backgroundColor: '#333', 
    borderRadius: 12, 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    alignSelf: 'flex-start' 
  },
  actionButtonText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 13 
  },
});