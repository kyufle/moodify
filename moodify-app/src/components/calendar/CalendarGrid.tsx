import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Image, Dimensions, ActivityIndicator, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOOD_CONFIG } from '../../utils/utils';
import { UserContext } from '../user-provider';
import { ThemedText } from '../themed-text';

const { width } = Dimensions.get('window');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export const CalendarGrid = () => {
  const context = useContext(UserContext);
  const token = context?.userValue?.accessToken;

  const [currentView, setCurrentView] = useState<'calendar' | 'register'>('calendar');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [diaryText, setDiaryText] = useState('');
  const [loading, setLoading] = useState(false);

  const [calendarData, setCalendarData] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  
  // Estado para los datos de sueño
  const [sleepData, setSleepData] = useState({ hours: 0, minutes: 0, totalMinutes: 0 });

  useEffect(() => {
    if (token) fetchData();
  }, [token, currentView]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [resCal, resHis, resStats, resSleep] = await Promise.all([
        fetch(`${API_BASE_URL}/get-mood-calendar`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/get-today-timeline`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/get-monthly-stats`, { headers: getHeaders() }),
        // Añadimos la petición de sueño
        fetch(`${API_BASE_URL}/fillInHours`, { method: 'POST', headers: getHeaders() })
      ]);

      const dataCal = await resCal.json();
      const dataHis = await resHis.json();
      const dataStats = await resStats.json();
      const dataSleep = resSleep.status === 200 ? await resSleep.json() : null;

      if (dataCal.data) setCalendarData(dataCal.data);
      if (Array.isArray(dataHis)) setHistory(dataHis);
      if (Array.isArray(dataStats)) setMonthlyStats(dataStats);
      
      if (dataSleep?.total_minutes) {
        setSleepData({
          hours: Math.floor(dataSleep.total_minutes / 60),
          minutes: dataSleep.total_minutes % 60,
          totalMinutes: dataSleep.total_minutes
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return Alert.alert("Aviso", "Selecciona una emoción");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/save-mood`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          mood: selectedMood,
          daily_text: diaryText,
          date: new Date().toISOString().split('T')[0]
        }),
      });
      if (response.ok) {
        setDiaryText('');
        setSelectedMood(null);
        setCurrentView('calendar');
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  let startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const gridCells = [];
  for (let i = 0; i < startDay; i++) gridCells.push({ day: null });
  for (let i = 1; i <= daysInMonth; i++) gridCells.push({ day: i });

  if (currentView === 'register') {
    return (
      <ScrollView style={styles.registerContainer}>
        <TouchableOpacity onPress={() => setCurrentView('calendar')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>¿Cómo estás?</Text>
        <View style={styles.moodSelectorGrid}>
          {Object.keys(MOOD_CONFIG).map((key) => (
            <TouchableOpacity key={key} onPress={() => setSelectedMood(key)} style={[styles.moodOption, selectedMood === key && { backgroundColor: MOOD_CONFIG[key as keyof typeof MOOD_CONFIG].color, borderWidth: 1.5 }]}>
              <Image source={MOOD_CONFIG[key as keyof typeof MOOD_CONFIG].icon} style={styles.iconSmall} />
            </TouchableOpacity>
          ))}
        </View>
        {selectedMood && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>Te sientes <Text style={{ fontWeight: 'bold' }}>{selectedMood}</Text></Text>
            <Image source={MOOD_CONFIG[selectedMood as keyof typeof MOOD_CONFIG].icon} style={styles.iconLarge} />
          </View>
        )}
        <TextInput placeholder="Nota de hoy..." style={styles.textArea} multiline value={diaryText} onChangeText={setDiaryText} />
        <TouchableOpacity style={styles.btnSave} onPress={handleSaveMood} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnTextWhite}>Guardar estado</Text>}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const lastEntry = history.length > 0 ? history[0] : null;
  const config = lastEntry ? MOOD_CONFIG[lastEntry.mood as keyof typeof MOOD_CONFIG] : null;

  // Lógica de alertas de sueño
  const isTooLittleSleep = sleepData.totalMinutes > 0 && sleepData.totalMinutes < 480;
  const isTooMuchSleep = sleepData.totalMinutes >= 660;

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.daysRow}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => <Text key={idx} style={styles.dayText}>{day}</Text>)}
        </View>
        <View style={styles.gridContainer}>
          {gridCells.map((cell, idx) => {
            const dateKey = cell.day ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}` : null;
            const moodKey = dateKey ? calendarData[dateKey] : null;
            const isToday = cell.day === currentDay;
            return (
              <View key={idx} style={styles.cellWrapper}>
                {cell.day && (
                  <View style={[styles.moodCell, { backgroundColor: moodKey ? MOOD_CONFIG[moodKey as keyof typeof MOOD_CONFIG].color : '#F1F5F9' }, isToday && styles.todayCell]}>
                    {moodKey ? <Image source={MOOD_CONFIG[moodKey as keyof typeof MOOD_CONFIG].icon} style={styles.iconInCalendar} /> : <Text style={styles.dayNumberText}>{cell.day}</Text>}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={() => setCurrentView('register')}>
          <Text style={styles.registerButtonText}>Registrar ánimo de hoy</Text>
        </TouchableOpacity>

        {history.length > 0 && (
          <>
            <View style={styles.collapsibleContainer}>
              <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setIsHistoryExpanded(!isHistoryExpanded)} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="clock" size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <Text style={styles.collapsibleTitle}>Actividad de hoy ({history.length})</Text>
                </View>
                <Feather name={isHistoryExpanded ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
              </TouchableOpacity>
              {isHistoryExpanded && (
                <View style={styles.historyList}>
                  {history.map(item => (
                    <View key={item.id} style={styles.historyItem}>
                      <View style={styles.historyContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                              source={MOOD_CONFIG[item.mood as keyof typeof MOOD_CONFIG]?.icon}
                              style={[styles.historyIcon, { backgroundColor: MOOD_CONFIG[item.mood as keyof typeof MOOD_CONFIG]?.color }]}
                            />
                            <Text style={[styles.historyMood, { color: '#9aa1af', marginLeft: 8 }]}>
                              {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                            </Text>
                          </View>
                          <Text style={styles.historyTime}>{(new Date(item.time)).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}</Text>
                        </View>
                        {item.text && (
                          <Text style={[styles.historyText, { marginTop: 4 }]} numberOfLines={2}>
                            {item.text}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* ALERTAS DE SUEÑO INSERTADAS DEBAJO DE ACTIVIDAD DE HOY */}
            {isTooLittleSleep && (
              <View style={[styles.recommendCard, { marginTop: 15 }]}>
                <View style={styles.recommendIcon}>
                  <Feather name="moon" size={20} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recommendText}>
                    Parece que hoy has dormido <Text style={{fontWeight: '800'}}>{sleepData.hours}h y {sleepData.minutes}min</Text>. ¿Por qué no pruebas nuestro reto de <Text style={{fontWeight: '800'}}>"Dormir 8 horas"</Text>?
                  </Text>
                </View>
              </View>
            )}

            {isTooMuchSleep && (
              <View style={[styles.recommendCard, { backgroundColor: '#FEE2E2', borderColor: '#FECACA', marginTop: 15 }]}>
                <View style={styles.recommendIcon}>
                  <Feather name="alert-circle" size={20} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.recommendText, { color: '#991B1B' }]}>
                    Has dormido <Text style={{fontWeight: '800'}}>{sleepData.hours}h y {sleepData.minutes}min</Text>. Dormir más de 11 horas puede dejarte con menos energía. ¡Intenta ajustar tu horario mañana!
                  </Text>
                </View>
              </View>
            )}

            {config && lastEntry && (
              <View style={[styles.card, { backgroundColor: config.color, marginTop: 15 }]}>
                <View style={styles.textColumn}>
                  <Text style={styles.subtitle}>¿Cómo te sientes ahora?</Text>
                  <Text style={styles.title}>
                    {lastEntry.mood.charAt(0).toUpperCase() + lastEntry.mood.slice(1)}
                  </Text>
                  <Text style={styles.description}>
                    {config.phrases.es[0]}
                  </Text>
                </View>

                <View style={styles.graphicContainer}>
                  <Image
                    source={MOOD_CONFIG[lastEntry.mood as keyof typeof MOOD_CONFIG]?.icon}
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: 'contain',
                      position: 'absolute',
                      right: -10,
                      bottom: 10,
                      opacity: 0.5 
                    }}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 20 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dayText: { fontSize: 12, fontWeight: '800', color: '#94A3B8', width: (width - 40) / 7, textAlign: 'left' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrapper: { width: '14.28%', aspectRatio: 0.85, padding: 3 },
  moodCell: { flex: 1, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  todayCell: { borderWidth: 2, borderColor: '#6366F1' },
  dayNumberText: { fontSize: 10, fontWeight: '900', color: 'rgba(0,0,0,0.3)' },
  iconInCalendar: { width: '70%', height: '70%', resizeMode: 'contain' },
  registerButton: { marginTop: 25, backgroundColor: '#334155', borderRadius: 20, paddingVertical: 14, alignItems: 'center' },
  registerButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  collapsibleContainer: { marginTop: 15, backgroundColor: '#F8FAFC', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  summaryCard: { marginTop: 15, backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', elevation: 2 },
  collapsibleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  collapsibleTitle: { fontSize: 14, fontWeight: '800', color: '#475569' },
  summaryContent: { paddingHorizontal: 18, paddingBottom: 18 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { width: 120, flexDirection: 'row', alignItems: 'center' },
  miniIcon: { width: 18, height: 18, marginRight: 8 },
  summaryMoodName: { fontSize: 14, fontWeight: '700', color: '#64748B', textTransform: 'capitalize' },
  barWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  barBackground: { flex: 1, height: 18, backgroundColor: '#F1F5F9', borderRadius: 9, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 9 },
  barCount: { marginLeft: 10, fontSize: 11, color: '#64748B', width: 20 },
  historyList: { paddingHorizontal: 15, paddingBottom: 10 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 8, elevation: 1 },
  historyContent: { flex: 1, flexDirection: 'column' },
  historyMood: { fontWeight: '800', fontSize: 14, textTransform: 'capitalize' },
  historyTime: { fontSize: 11, color: '#94A3B8' },
  historyText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  historyIcon: { width: 28, height: 28, resizeMode: 'contain', borderRadius: 5 },
  registerContainer: { flex: 1, backgroundColor: 'white', padding: 20 },
  backButton: { marginBottom: 20 },
  backButtonText: { color: '#6366F1', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'left', marginBottom: 20 },
  moodSelectorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  moodOption: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  iconSmall: { width: 28, height: 28, resizeMode: 'contain' },
  feedbackBox: { marginVertical: 20, alignItems: 'center', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 20 },
  feedbackText: { fontSize: 16, marginBottom: 10 },
  iconLarge: { width: 80, height: 80, resizeMode: 'contain' },
  textArea: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 15, height: 100, textAlignVertical: 'top', marginTop: 10 },
  btnSave: { padding: 16, borderRadius: 15, alignItems: 'center', backgroundColor: '#334155', marginTop: 20 },
  btnTextWhite: { color: 'white', fontWeight: 'bold' },
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
  description: {
    fontSize: 15,
    lineHeight: 18,
    color: 'rgba(0,0,0,0.7)',
  },
  graphicContainer: {
    width: 120,
    height: '100%',
    position: 'absolute',
    right: 24,
    bottom: 0,
    opacity: 0.8,
  },
  // NUEVOS ESTILOS PARA LAS TARJETAS DE SUEÑO
  recommendCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  recommendIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 18,
  },
});