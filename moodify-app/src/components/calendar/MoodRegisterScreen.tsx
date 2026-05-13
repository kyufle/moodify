import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  TextInput, Image, Dimensions, ActivityIndicator, Alert 
} from 'react-native';
import { MOOD_CONFIG } from '../../utils/utils';
import { UserContext } from '../../components/user-provider'; 

const { width } = Dimensions.get('window');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export const MoodCalendar = () => {
  const userContext = useContext(UserContext);
  
  const userValue = userContext?.userValue;
  const token = userValue?.accessToken;

  const [currentView, setCurrentView] = useState<'calendar' | 'register'>('calendar');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [diaryText, setDiaryText] = useState('');
  const [showDiaryInput, setShowDiaryInput] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [calendarData, setCalendarData] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<any[]>([]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (token) {
      fetchData();
    }
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
      // Cargamos calendario e historial en paralelo
      const [resCal, resHis] = await Promise.all([
        fetch(`${API_BASE_URL}/get-mood-calendar`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/get-today-timeline`, { headers: getHeaders() })
      ]);

      const dataCal = await resCal.json();
      const dataHis = await resHis.json();

      if (dataCal.data) setCalendarData(dataCal.data);
      if (Array.isArray(dataHis)) setHistory(dataHis);
    } catch (e) {
      console.error("Error cargando datos del ánimo:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert("Aviso", "Por favor, selecciona cómo te sientes.");
      return;
    }

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

      const result = await response.json();

      if (response.ok && result.ok) {
        setDiaryText('');
        setSelectedMood(null);
        setShowDiaryInput(false);
        setCurrentView('calendar');
        // fetchData() se disparará por el useEffect al cambiar el view
      } else {
        Alert.alert("Error", result.message || "No se pudo guardar");
      }
    } catch (e) {
      Alert.alert("Error", "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE CALENDARIO ---
  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startDay = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7;

  const gridCells = [];
  for (let i = 0; i < startDay; i++) gridCells.push({ day: null });
  for (let i = 1; i <= daysInMonth; i++) gridCells.push({ day: i });

  // --- VISTAS ---
  if (currentView === 'register') {
    return (
      <ScrollView style={styles.registerContainer}>
        <TouchableOpacity onPress={() => setCurrentView('calendar')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>¿Cómo estás?</Text>
        <View style={styles.moodSelector}>
          {Object.keys(MOOD_CONFIG).map((key) => (
            <TouchableOpacity 
              key={key} 
              onPress={() => setSelectedMood(key)}
              style={[styles.moodIcon, selectedMood === key && { backgroundColor: MOOD_CONFIG[key].color, borderWidth: 2, borderColor: '#334155' }]}
            >
              <Image source={MOOD_CONFIG[key].icon} style={styles.iconSmall} />
            </TouchableOpacity>
          ))}
        </View>
        {selectedMood && (
          <View style={styles.mainFeedback}>
            <Image source={MOOD_CONFIG[selectedMood].icon} style={styles.iconLarge} />
            <Text style={styles.feedbackText}>Hoy me siento <Text style={styles.bold}>{selectedMood}</Text></Text>
          </View>
        )}
        <TouchableOpacity style={styles.btnDiary} onPress={() => setShowDiaryInput(!showDiaryInput)}>
          <Text style={styles.btnDiaryText}>{showDiaryInput ? "Cerrar nota" : "Añadir nota al diario"}</Text>
        </TouchableOpacity>
        {showDiaryInput && (
          <TextInput 
            style={styles.textArea} 
            placeholder="Escribe aquí..." 
            multiline 
            value={diaryText}
            onChangeText={setDiaryText}
          />
        )}
        <TouchableOpacity style={styles.btnSave} onPress={handleSaveMood} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnSaveText}>Guardar</Text>}
        </TouchableOpacity>
        <View style={styles.timelineSection}>
          <Text style={styles.subtitle}>Historial de hoy</Text>
          {history.map((item) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={[styles.timelineCard, { borderLeftColor: MOOD_CONFIG[item.mood]?.color }]}>
                <Text style={styles.itemTime}>{item.time}</Text>
                <Text style={styles.itemTitle}>{item.mood}</Text>
                {item.text && <Text style={styles.itemText}>{item.text}</Text>}
              </View>
              <Image source={MOOD_CONFIG[item.mood]?.icon} style={styles.timelineIcon} />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.daysHeader}>
        {daysOfWeek.map(d => <Text key={d} style={styles.dayHeaderText}>{d}</Text>)}
      </View>
      <View style={styles.grid}>
        {gridCells.map((cell, i) => {
          const dateKey = cell.day ? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}` : null;
          const moodKey = dateKey ? calendarData[dateKey] : null;
          const moodInfo = moodKey ? MOOD_CONFIG[moodKey] : null;

          return (
            <View key={i} style={styles.cell}>
              {cell.day && (
                <View style={[styles.dayCircle, cell.day === currentDay && styles.todayCircle, moodInfo && { backgroundColor: moodInfo.color }]}>
                  {moodInfo ? (
                    <Image source={moodInfo.icon} style={styles.iconInCalendar} />
                  ) : (
                    <Text style={styles.dayNumber}>{cell.day}</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.registerFloatingBtn} onPress={() => setCurrentView('register')}>
        <Text style={styles.registerFloatingBtnText}>Registrar ánimo</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{marginTop: 10}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#FFF' },
  daysHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayHeaderText: { color: '#94A3B8', fontWeight: 'bold', width: (width - 40) / 7, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: (width - 40) / 7, aspectRatio: 1, padding: 4 },
  dayCircle: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  todayCircle: { borderWidth: 2, borderColor: '#6366F1' },
  dayNumber: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  iconInCalendar: { width: '75%', height: '75%', resizeMode: 'contain' },
  registerFloatingBtn: { marginTop: 30, backgroundColor: '#1E293B', padding: 18, borderRadius: 20, alignItems: 'center' },
  registerFloatingBtnText: { color: 'white', fontWeight: 'bold' },
  registerContainer: { flex: 1, backgroundColor: 'white', padding: 20 },
  backButton: { marginBottom: 20 },
  backButtonText: { color: '#6366F1', fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 25 },
  moodSelector: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  moodIcon: { width: 60, height: 60, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  iconSmall: { width: 38, height: 38, resizeMode: 'contain' },
  mainFeedback: { alignItems: 'center', marginVertical: 20 },
  iconLarge: { width: 100, height: 100, resizeMode: 'contain' },
  feedbackText: { marginTop: 10, fontSize: 16 },
  bold: { fontWeight: 'bold' },
  btnDiary: { alignSelf: 'center', marginVertical: 10 },
  btnDiaryText: { color: '#6366F1', fontWeight: 'bold' },
  textArea: { backgroundColor: '#F8FAFC', borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  btnSave: { backgroundColor: '#6366F1', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnSaveText: { color: 'white', fontWeight: 'bold' },
  timelineSection: { marginTop: 40, paddingBottom: 60 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15 },
  timelineCard: { flex: 1, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 15, borderLeftWidth: 5 },
  itemTime: { fontSize: 12, color: '#94A3B8', fontWeight: 'bold' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
  itemText: { fontSize: 14, color: '#64748B' },
  timelineIcon: { width: 50, height: 50, resizeMode: 'contain' }
});