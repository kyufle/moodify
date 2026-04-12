import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MoodType { color: string; emoji?: string; text?: string; }
const MOODS: Record<string, MoodType> = {
  angry: { color: '#FFB39F', emoji: '😡' },
  happy: { color: '#FFF275', emoji: '😊' },
  confused: { color: '#D1E8D5', emoji: '😨' },
  sad: { color: '#D8EDFA', emoji: '😢' },
  sleepy: { color: '#E9E3FF', emoji: '😴' },
  empty: { color: '#F1F5F9', text: '' },
  none: { color: 'transparent', text: '' } 
};

export const CalendarGrid = () => {
  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  
  // Lógica para obtener los días del mes actual (Barcelona)
  const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  // Ajustar para que Lunes sea 0 y Domingo 6
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay === -1) startDay = 6;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Generar el array de celdas (incluyendo espacios vacíos al principio)
  const gridCells = [];
  for (let i = 0; i < startDay; i++) {
    gridCells.push({ day: null, mood: 'none' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    // Mockup de moods para algunos días pasados
    let mood = 'empty';
    if (i < currentDay) {
        const moods = ['happy', 'sad', 'sleepy', 'confused', 'angry', 'empty'];
        mood = moods[Math.floor(Math.random() * moods.length)];
    }
    gridCells.push({ day: i, mood });
  }

  return (
    <View style={styles.container}>
      {/* Cabecera de días de la semana */}
      <View style={styles.daysRow}>
        {daysOfWeek.map((day, idx) => (
          <Text key={idx} style={styles.dayText}>{day}</Text>
        ))}
      </View>

      {/* Grid del calendario */}
      <View style={styles.gridContainer}>
        {gridCells.map((cell, idx) => {
          const m = MOODS[cell.mood as keyof typeof MOODS];
          const isToday = cell.day === currentDay;

          return (
            <View key={idx} style={styles.cellWrapper}>
              {cell.day && (
                <View 
                  style={[
                    styles.moodCell, 
                    { backgroundColor: m.color },
                    isToday && styles.todayCell
                  ]}
                >
                  <Text style={styles.dayNumber}>{cell.day}</Text>
                  <Text style={styles.moodEmoji}>
                    {m.emoji || m.text}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Leyenda rápida */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: MOODS.happy.color }]} />
            <Text style={styles.legendText}>Bien</Text>
        </View>
        <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: MOODS.angry.color }]} />
            <Text style={styles.legendText}>Mal</Text>
        </View>
        <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: MOODS.empty.color }]} />
            <Text style={styles.legendText}>Sin registro</Text>
        </View>
      </View>

      {/* Botón de acción */}
      <TouchableOpacity style={styles.registerButton} activeOpacity={0.8}>
        <Text style={styles.registerButtonText}>Registrar ánimo de hoy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    width: 38,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  cellWrapper: {
    width: '14.28%',
    aspectRatio: 0.85,
    padding: 3,
  },
  moodCell: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  dayNumber: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 2,
    left: 4,
  },
  moodEmoji: {
    fontSize: 18,
    marginTop: 6,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  registerButton: {
    marginTop: 25,
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  }
});
