import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../user-provider';
import { MOOD_CONFIG, getRandomMoodPhrase } from '../../utils/utils';
import { Image } from 'expo-image';
import { router } from 'expo-router';

export const ActionAlertCard = () => {
  const { userValue } = React.use(UserContext);
  const [mood, setMood] = useState(null);
 
  useEffect(() => {
    const registerStreak = async () => {
      if (!userValue?.accessToken) return;
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL +'actionAlert', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + userValue.accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (response.ok && data.last_mood) setMood(data.last_mood);
      } catch (err) {
        console.error("Error de red:", err);
      }
    };
    registerStreak();
  }, [userValue?.accessToken]);

  if (!userValue?.user) return null;
  
  const moodStyle = mood ? MOOD_CONFIG[mood] : null;

  return !mood || !moodStyle ? (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <Text style={styles.messageText}>
          Ups, vaya todavía no has registrado cómo te sientes hoy...
        </Text>
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/calendar')}
        >
          <Text style={styles.actionButtonText}>Regístralo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.graphicContainer}>
        <View style={styles.eye} />
        <View style={[styles.eye, styles.eyeRight]} />
        <View style={styles.mouth} />
      </View>
    </View>
  ) : (
    <View style={[styles.card, { backgroundColor: moodStyle.color }]}>
      <View style={styles.contentContainer}>
        <View style={styles.texts}>
          <Text style={styles.feelTodayText}>¿Cómo te sientes hoy?</Text>
          <Text style={styles.feel}>{mood}</Text>
          <Text style={styles.explication}>{getRandomMoodPhrase(mood)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/calendar')}
        >
          <Text style={styles.actionButtonText}>Ver historial</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.graphicContainer}>
          <Image 
          source={moodStyle.icon}
          style={{ width: 110, height: 80, opacity: 0.8 }} 
          contentFit="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#D6D6D6', borderRadius: 24, padding: 20, marginHorizontal: 20, marginTop: 20, position: 'relative', overflow: 'hidden', minHeight: 140 },
  contentContainer: { width: '70%', zIndex: 2 },
  messageText: { fontSize: 15, fontWeight: '600', color: '#333333', marginBottom: 16, lineHeight: 22 },
  feelTodayText:{ fontSize: 15, color: '#020202', marginBottom: 10, lineHeight: 22 },
  feel:{ textTransform: 'capitalize', fontSize: 17, fontWeight: '600', color: '#333333', marginBottom: 10 },
  explication:{ color: '#818181', marginBottom: 20 },
  texts:{ display:'flex', flexDirection: 'column' },
  actionButton: { backgroundColor: '#333333', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start' },
  actionButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  graphicContainer: { position: 'absolute', bottom: -10, right: -10, width: 120, height: 100, transform: [{ rotate: '-15deg' }] },
  eye: { width: 20, height: 20, backgroundColor: '#000000', borderRadius: 10, position: 'absolute', top: 30, left: 20 },
  eyeRight: { left: 65, top: 25 },
  mouth: { width: 50, height: 4, backgroundColor: '#000000', borderRadius: 2, position: 'absolute', bottom: 35, left: 35, transform: [{ rotate: '-5deg' }] }
});