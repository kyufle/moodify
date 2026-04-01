import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MoodType { color: string; emoji?: string; text?: string; }
const MOODS: Record<string, MoodType> = {
  angry: { color: '#FFB39F', emoji: '😡' },
  happy: { color: '#FFF275', emoji: '😊' },
  confused: { color: '#D1E8D5', emoji: '😨' },
  sad: { color: '#D8EDFA', emoji: '😢' },
  sleepy: { color: '#E9E3FF', emoji: '😴' },
  empty: { color: '#E2E8F0', text: '—' },
  none: { color: 'transparent', text: '' } 
};

// Generamos datos simulados (35 bloques, 5 semanas x 7 días) a partir de la imagen
const CALENDAR_DATA = [
  'none', 'none', 'angry', 'angry', 'angry', 'sleepy', 'sleepy',
  'happy', 'happy', 'confused', 'sleepy', 'sleepy', 'sleepy', 'empty',
  'confused', 'angry', 'empty', 'happy', 'happy', 'angry', 'sad',
  'angry', 'empty', 'happy', 'confused', 'sad', 'angry', 'empty',
  'angry', 'sleepy', 'empty', 'confused', 'none', 'none', 'none'
];

export const CalendarGrid = () => {
  const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'];

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
        {CALENDAR_DATA.map((moodKey, idx) => {
          const m = MOODS[moodKey as keyof typeof MOODS];
          return (
            <View 
              key={idx} 
              style={[
                styles.moodCell, 
                { backgroundColor: m.color },
                // Si empty, la fuente o tamaño es diferente.
              ]}
            >
              <Text style={[styles.moodEmoji, moodKey === 'empty' && styles.emptySymbol]}>
                {m.emoji || m.text}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Botón de acción final del calendario */}
      <TouchableOpacity style={styles.registerButton} activeOpacity={0.8}>
        <Text style={styles.registerButtonText}>Volver a registrar</Text>
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
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    width: 36,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    rowGap: 12,
  },
  moodCell: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  emptySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
  },
  registerButton: {
    marginTop: 25,
    backgroundColor: '#8b9696',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  }
});
