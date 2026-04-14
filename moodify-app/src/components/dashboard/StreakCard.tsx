import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../themed-text';
import { UserContext } from '../user-provider';
import React, { useState } from 'react';

export const StreakCard = () => {
  const [loading, setLoading] = useState(false);
  const { userValue, setUserValue } = React.use(UserContext);

  if (userValue?.user == null) return null;

  const user = userValue.user;

  const handleStreak = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://moodify_backend.test/api/streakRegister', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + userValue.accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      // Validar si hay contenido antes de parsear
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        console.log("Éxito:", data.message);
        setUserValue(data.user)
        // Aquí podrías actualizar tu UserContext con data.user
      } else {
        console.log("Error del servidor:", data.message || "Error desconocido");
      }
    } catch (err) {
      console.error("Error de red:", err);
    } finally {
      setLoading(false);
    }
  };

  const dateInBarcelona = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" }));

  // getDay() devuelve 0(Domingo) - 6(Sábado). Convertimos para que Lunes sea 0 y Domingo 6.
  let todayIndex = dateInBarcelona.getDay() - 1;
  if (todayIndex === -1) todayIndex = 6;

  // Datos de la semana actual
  const weekDays = [
    { label: 'L', recorded: true, isToday: false },
    { label: 'M', recorded: true, isToday: false },
    { label: 'X', recorded: false, isToday: false },
    { label: 'J', recorded: false, isToday: false },
    { label: 'V', recorded: false, isToday: false },
    { label: 'S', recorded: false, isToday: false },
    { label: 'D', recorded: false, isToday: false },
  ];

  weekDays[todayIndex].isToday = true;

  return (
    <View style={styles.card}>
      <View style={styles.pointsBadge}>
        <ThemedText style={styles.pointsText}>{user.points}</ThemedText>
        <Image
          source={require('@/assets/images/diamante-racha.svg')}
          style={styles.diamondIcon}
          contentFit="contain"
        />
      </View>
      <Text style={styles.title}>{user.streak} días en racha!</Text>

      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <View
            key={index}
            style={[
              styles.dayItem,
              day.isToday && styles.dayItemToday
            ]}
          >
            <Image
              source={require('@/assets/images/diamante-racha.svg')}
              style={[
                styles.diamondIcon,
                { opacity: day.recorded ? 1 : 0.2 }
              ]}
              contentFit="contain"
            />
            <Text style={[
              styles.dayLabel,
              day.isToday && styles.dayLabelToday
            ]}>
              {day.label}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        activeOpacity={0.8}
        onPress={handleStreak}
        disabled={loading}
      >
        <Feather name="bar-chart-2" size={18} color="#6B21A8" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>
          {loading ? "Registrando..." : "Registrar progreso"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8EAFD',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 16,
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 56,
    borderRadius: 20,
  },
  dayItemToday: {
    backgroundColor: '#FFF1E6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  diamondIcon: {
    width: 24,
    height: 24,
  },
  dayLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  dayLabelToday: {
    color: '#D97706',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B21A8',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B21A8',
    marginRight: 4,
  },
});