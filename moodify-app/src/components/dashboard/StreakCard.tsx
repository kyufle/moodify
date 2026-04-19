import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../themed-text';
import { UserContext } from '../user-provider';
import React, { useState, useMemo } from 'react';

export const StreakCard = () => {
  const [loading, setLoading] = useState(false);
  const { userValue, setUserValue } = React.use(UserContext);

  const user = userValue?.user;

  const handleStreak = async (recover = false) => {
    setLoading(true);
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL+'streakRegister', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + userValue.accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          recover,
          client_date: new Date().toISOString()
        })
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        setUserValue({ ...userValue, user: data.user });
      } else {
        Alert.alert("Atención", data.message || "Error al registrar la racha");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const onRegisterPress = () => {
    if (!user) return;

    if (!user.last_streak_day) {
      handleStreak(false);
      return;
    }

    const lastDate = new Date(user.last_streak_day);
    const today = new Date();

    lastDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays > 1) {
      const daysMissed = diffInDays - 1;
      const cost = daysMissed * 6;

      Alert.alert(
        "¡Racha rota!",
        `Has faltado ${daysMissed} día(s). ¿Recuperar racha por ${cost} monedas o reiniciar?`,
        [
          {
            text: "Reiniciar",
            onPress: () => handleStreak(false),
            style: "destructive"
          },
          {
            text: `Pagar ${cost} 💎`,
            onPress: () => handleStreak(true)
          }
        ]
      );
    } else {
      handleStreak(false);
    }
  };

  const weekData = useMemo(() => {
    const todayDate = new Date();
    let tIndex = todayDate.getDay() - 1;
    if (tIndex === -1) tIndex = 6;
    const loginDateObj = user?.last_streak_day ? new Date(user.last_streak_day) : null;

    const isRegToday = !!(loginDateObj &&
      (new Date(loginDateObj).toLocaleDateString("en-CA") === todayDate.toLocaleDateString("en-CA")));

    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label, index) => {
      const isToday = index === tIndex;
      let recorded = false;

      if (user) {
        if (isToday) {
          recorded = isRegToday;
        } else if (index < tIndex) {
          const distance = tIndex - index;
          const effectiveStreak = isRegToday ? user.streak : user.streak + 1;
          if (effectiveStreak > distance) recorded = true;
        }
      }
      return { label, recorded, isToday };
    });
    return { days, isRegToday };
  }, [user]);

  return (
    <View style={styles.card}>
      {!user ? (
        <ActivityIndicator color="#6B21A8" style={{ padding: 20 }} />
      ) : (
        <>
          <View style={styles.pointsBadge}>
            <ThemedText style={styles.pointsText}>{user.points}</ThemedText>
            <Image source={require('@/assets/images/diamante-racha.svg')} style={styles.diamondIcon} contentFit="contain" />
          </View>

          <Text style={styles.title}>{user.streak} {user.streak === 1 ? 'día' : 'días'} en racha!</Text>

          <View style={styles.weekContainer}>
            {weekData.days.map((day, index) => (
              <View key={index} style={[styles.dayItem, day.isToday && styles.dayItemToday]}>
                <Image
                  source={require('@/assets/images/diamante-racha.svg')}
                  style={[
                    styles.diamondIcon,
                    { opacity: day.recorded ? 1 : 0.15, transform: [{ scale: day.recorded ? 1.1 : 0.9 }] }
                  ]}
                  contentFit="contain"
                />
                <Text style={[
                  styles.dayLabel,
                  day.isToday && styles.dayLabelToday,
                  day.recorded && !day.isToday && styles.dayLabelRecorded
                ]}>
                  {day.label}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, (loading || weekData.isRegToday) && { opacity: 0.6 }]}
            onPress={onRegisterPress}
            disabled={loading || weekData.isRegToday}
          >
            <Feather name={weekData.isRegToday ? "check-circle" : "bar-chart-2"} size={18} color="#6B21A8" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>
              {weekData.isRegToday ? "Progreso guardado" : loading ? "Registrando..." : "Registrar progreso"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#E8EAFD', borderRadius: 24, padding: 20, marginHorizontal: 20, marginTop: 20, elevation: 4, minHeight: 180 },
  title: { fontSize: 18, fontWeight: '700', color: '#334155', marginBottom: 16 },
  weekContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  dayItem: { alignItems: 'center', justifyContent: 'center', width: 40, height: 56, borderRadius: 20 },
  dayItemToday: { backgroundColor: '#FFF1E6', borderWidth: 2, borderColor: '#FFFFFF' },
  diamondIcon: { width: 24, height: 24 },
  dayLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  dayLabelToday: { color: '#D97706', fontWeight: '700' },
  dayLabelRecorded: { color: '#6B21A8', fontWeight: '600' },
  button: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  buttonIcon: { marginRight: 8 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#6B21A8' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#E9D5FF', marginBottom: 10 },
  pointsText: { fontSize: 14, fontWeight: '800', color: '#6B21A8', marginRight: 4 },
});