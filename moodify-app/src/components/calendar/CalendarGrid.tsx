import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Image, Dimensions, ActivityIndicator, Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MOOD_CONFIG } from '../../utils/utils';
import { UserContext } from '../user-provider';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '../themed-view';

const { width } = Dimensions.get('window');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export const CalendarGrid = () => {
  const { t, i18n } = useTranslation();
  const context = useContext(UserContext);
  const token = context?.userValue?.accessToken;

  const [currentView, setCurrentView] = useState<'calendar' | 'register'>('calendar');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [diaryText, setDiaryText] = useState('');
  const [loading, setLoading] = useState(false);

  const [calendarData, setCalendarData] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
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
      const [resCal, resHis, resSleep] = await Promise.all([
        fetch(`${API_BASE_URL}/get-mood-calendar`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/get-today-timeline`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/fillInHours`, { method: 'POST', headers: getHeaders() })
      ]);

      const dataCal = await resCal.json();
      const dataHis = await resHis.json();
      const dataSleep = resSleep.status === 200 ? await resSleep.json() : null;

      if (dataCal.data) setCalendarData(dataCal.data);
      if (Array.isArray(dataHis)) setHistory(dataHis);

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
    
    // Capturamos la fecha manual YYYY-MM-DD para evitar desfases de día
    const now = new Date();
    const dateString = now.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD local

    try {
      const response = await fetch(`${API_BASE_URL}/save-mood`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          mood: selectedMood,
          daily_text: diaryText,
          date: dateString,
        }),
      });

      if (response.ok) {
        setDiaryText('');
        setSelectedMood(null);
        setCurrentView('calendar');
        fetchData();
      } else {
        Alert.alert("Error", "El servidor rechazó el guardado");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
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
       <ThemedView style={styles.container}>
           <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      />
      <ScrollView style={styles.registerContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => setCurrentView('calendar')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {t('calendarGrid.back') || 'Volver'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('calendarGrid.howFeelNow')}</Text>

        <View style={styles.moodSelectorGrid}>
          {Object.keys(MOOD_CONFIG).map((key) => {
            const MoodConfigIcon = MOOD_CONFIG[key as keyof typeof MOOD_CONFIG].icon;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedMood(key)}
                style={[
                  styles.moodOption,
                  selectedMood === key && {
                    backgroundColor: MOOD_CONFIG[key as keyof typeof MOOD_CONFIG].color,
                    borderColor: '#334155',
                    borderWidth: 1.5
                  }
                ]}
              >
                <MoodConfigIcon style={styles.iconSmall} />
                <Text style={styles.moodLabelSmall} numberOfLines={1}>
                  {t(`moodNames.${key}`)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {selectedMood && (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>
              {t('calendarGrid.youFeel')}{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {t(`moodNames.${selectedMood}`)}
              </Text>
            </Text>
            {(() => {
                const IconComp = MOOD_CONFIG[selectedMood as keyof typeof MOOD_CONFIG].icon;
                return <IconComp width={80} height={80} />;
            })()}
          </View>
        )}

        <TextInput
          placeholder={t('calendarGrid.todaysNote')}
          style={styles.textArea}
          multiline
          value={diaryText}
          onChangeText={setDiaryText}
        />

        <TouchableOpacity style={styles.btnSave} onPress={handleSaveMood} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnTextWhite}>{t('calendarGrid.saveStatus')}</Text>}
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

       </ThemedView>
     
    );
  }

  const lastEntry = history.length > 0 ? history[0] : null;
  const config = lastEntry ? MOOD_CONFIG[lastEntry.mood as keyof typeof MOOD_CONFIG] : null;

  const getSafePhrase = () => {
    if (!config) return "";
    const lang = i18n.language?.split('-')[0] || 'es';
    const phrasesArray = config.phrases[lang] || config.phrases['es'];
    return phrasesArray ? phrasesArray[0] : "Gracias por registrar tu estado";
  };

  const isTooLittleSleep = sleepData.totalMinutes > 0 && sleepData.totalMinutes < 480;

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
                  <View style={[
                    styles.moodCell,
                    { backgroundColor: moodKey ? MOOD_CONFIG[moodKey as keyof typeof MOOD_CONFIG].color : '#F1F5F9' },
                    isToday && styles.todayCell
                  ]}>
                    {moodKey ? (
                      (() => {
                        const SvgIcon = MOOD_CONFIG[moodKey as keyof typeof MOOD_CONFIG].icon;
                        return <SvgIcon width="70%" height="70%" />;
                      })()
                    ) : (
                      <Text style={styles.dayNumberText}>{cell.day}</Text>
                    )}
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
          <View style={{ marginTop: 15 }}>
            <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setIsHistoryExpanded(!isHistoryExpanded)} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="clock" size={18} color="#64748B" style={{ marginRight: 10 }} />
                <Text style={styles.collapsibleTitle}>{t('calendarGrid.todaysactivity')}({history.length})</Text>
              </View>
              <Feather name={isHistoryExpanded ? "chevron-up" : "chevron-down"} size={20} color="#64748B" />
            </TouchableOpacity>

            {isHistoryExpanded && (
              <View style={styles.historyList}>
                {history.map(item => {
                  // TRUCO: Si la fecha viene del servidor sin zona, le añadimos 'Z' 
                  // para que JS sepa que es UTC y la convierta a local (+2h en España)
                  let dateStr = item.time || item.created_at || item.date;
                  if (dateStr && !dateStr.includes('Z') && !dateStr.includes('+')) {
                    dateStr += 'Z';
                  }
                  
                  const dateObj = new Date(dateStr);
                  const isValid = !isNaN(dateObj.getTime());
                  const moodInfo = MOOD_CONFIG[item.mood as keyof typeof MOOD_CONFIG];
                  const IconComp = moodInfo?.icon;

                  return (
                    <View key={item.id} style={styles.historyItem}>
                      <View style={[styles.historyIconContainer, { backgroundColor: moodInfo?.color || '#CBD5E1' }]}>
                        {IconComp && <IconComp width={24} height={24} />}
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={styles.historyMood}>{t(`moodNames.${item.mood}`)}</Text>
                          <Text style={styles.historyTime}>
                            {isValid 
                              ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
                              : '--:--'}
                          </Text>
                        </View>
                        {(item.text || item.daily_text) && (
                          <Text style={styles.historyText} numberOfLines={1}>
                            {item.text || item.daily_text}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {isTooLittleSleep && (
              <View style={styles.recommendCard}>
                <Feather name="moon" size={20} color="#F59E0B" />
                <Text style={styles.recommendText}>
                  Dormiste <Text style={{ fontWeight: '800' }}>{sleepData.hours}h {sleepData.minutes}m</Text>. ¡Prueba el resto de 8h!
                </Text>
              </View>
            )}

            {config && lastEntry && (
              <View style={[styles.card, { backgroundColor: config.color, marginTop: 15 }]}>
                <View style={styles.textColumn}>
                  <Text style={styles.subtitle}>¿Cómo te sientes ahora?</Text>
                  <Text style={styles.titleCard}>{t(`moodNames.${lastEntry.mood}`)}</Text>
                  <Text style={styles.description}>{getSafePhrase()}</Text>
                </View>
                <View style={styles.cardWatermark}>
                  {(() => {
                    const WatermarkIcon = config.icon;
                    return <WatermarkIcon width={80} height={80} opacity={0.3} />;
                  })()}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 20 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dayText: { fontSize: 12, fontWeight: '800', color: '#94A3B8', width: (width - 40) / 7, textAlign: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrapper: { width: '14.28%', aspectRatio: 1, padding: 3 },
  moodCell: { flex: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  todayCell: { borderWidth: 2, borderColor: '#6366F1' },
  dayNumberText: { fontSize: 10, fontWeight: '900', color: 'rgba(0,0,0,0.2)' },
  registerButton: { marginTop: 20, backgroundColor: '#334155', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  registerButtonText: { color: '#FFFFFF', fontWeight: '700' },
  registerContainer: { flex: 1, backgroundColor: 'white', padding: 20 },
  backButton: { marginBottom: 20 },
  backButtonText: { color: '#6366F1', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  moodSelectorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  moodOption: { width: '31%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  iconSmall: { width: 30, height: 30, marginBottom: 4 },
  moodLabelSmall: { fontSize: 10, fontWeight: '600', color: '#475569' },
  feedbackBox: { marginVertical: 20, alignItems: 'center', backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24 },
  feedbackText: { fontSize: 16, marginBottom: 10 },
  textArea: { backgroundColor: '#F1F5F9', borderRadius: 16, padding: 15, height: 100, textAlignVertical: 'top' },
  btnSave: { padding: 16, borderRadius: 16, alignItems: 'center', backgroundColor: '#334155', marginTop: 15 },
  btnTextWhite: { color: 'white', fontWeight: 'bold' },
  collapsibleHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#F8FAFC', borderRadius: 16 },
  collapsibleTitle: { fontSize: 14, fontWeight: '700' },
  historyList: { marginTop: 10 },
  historyItem: { flexDirection: 'row', padding: 12, backgroundColor: 'white', borderRadius: 12, marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  historyIconContainer: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  historyMood: { fontWeight: '700', fontSize: 14, color: '#1E293B' },
  historyTime: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  historyText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  recommendCard: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, alignItems: 'center', gap: 10, marginTop: 10 },
  recommendText: { fontSize: 12, color: '#92400E', flex: 1 },
  card: { borderRadius: 20, padding: 20, flexDirection: 'row', overflow: 'hidden' },
  textColumn: { flex: 1, zIndex: 2 },
  subtitle: { fontSize: 12, fontWeight: '700', opacity: 0.6 },
  titleCard: { fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
  description: { fontSize: 14, lineHeight: 18, opacity: 0.8 },
  cardWatermark: { position: 'absolute', right: 10, bottom: 10, opacity: 0.3 }
});