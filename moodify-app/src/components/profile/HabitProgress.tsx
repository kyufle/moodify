import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Modal, 
  TextInput, 
  ScrollView,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es, enUS, ca } from 'date-fns/locale'; // Importamos los idiomas necesarios
import { UserContext } from '../../components/user-provider';
import { useTranslation } from 'react-i18next';

const AVAILABLE_ICONS = [
  'coffee', 'trending-up', 'moon', 'target', 'heart', 'star', 'activity', 'book',
  'zap', 'wind', 'sun', 'umbrella', 'anchor', 'award', 'bicycle', 'camera',
  'check-circle', 'cloud', 'codepen', 'command', 'compass', 'cpu', 'droplet',
  'eye', 'feather', 'flag', 'gift', 'headphones', 'layers', 'map', 'package',
  'printer', 'rss', 'scissors', 'shopping-cart', 'smile', 'tv', 'watch'
];
const AVAILABLE_COLORS = ['#8a5cf69c', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'];

interface Habit {
  id: number;
  name: string;
  icon: string;
  color: string;
  done: number | boolean; 
}

interface DayStatus {
  day_label: string;
  date: string;
  full_completed: boolean;
  is_today: boolean;
}

export const HabitProgress = () => {
  const { userValue } = useContext(UserContext);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weeklyStatus, setWeeklyStatus] = useState<DayStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(); // Extraemos i18n para saber el idioma actual
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [selectedColor, setSelectedColor] = useState('#8a5cf69c');

  // Mapeo de locales para date-fns
  const locales: { [key: string]: Locale } = { 
    es: es, 
    en: enUS, 
    ca: ca 
  };
  const currentLocale = locales[i18n.language] || es;

  // Fecha de hoy formateada según idioma
  const todayName = format(new Date(), "EEEE, dd 'de' MMMM", { locale: currentLocale });

  const loadAllData = async () => {
    if (!userValue?.accessToken) return;
    try {
      const [resHabits, resWeekly] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_API_URL}habits/today`, {
          headers: { 'Authorization': `Bearer ${userValue.accessToken}`, 'Accept': 'application/json' }
        }),
        fetch(`${process.env.EXPO_PUBLIC_API_URL}habits/weekly-status`, {
          headers: { 'Authorization': `Bearer ${userValue.accessToken}`, 'Accept': 'application/json' }
        })
      ]);

      const dataHabits = await resHabits.json();
      const dataWeekly = await resWeekly.json();

      if (resHabits.ok) setHabits(Array.isArray(dataHabits) ? dataHabits : []);
      if (resWeekly.ok) setWeeklyStatus(Array.isArray(dataWeekly) ? dataWeekly : []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [userValue?.accessToken]);

  const handleCreateHabit = async () => {
    if (!newName.trim()) return Alert.alert("Error", "Nombre obligatorio");
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}habits`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${userValue.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: newName, icon: selectedIcon, color: selectedColor })
      });

      if (response.ok) {
        setModalVisible(false);
        setNewName('');
        await loadAllData();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar");
    }
  };

  const toggleHabit = async (habitId: number) => {
    setHabits(prev => prev.map(h => 
      h.id === habitId ? { ...h, done: h.done == 1 ? 0 : 1 } : h
    ));

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}habits/toggle/${habitId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userValue.accessToken}`, 'Accept': 'application/json' }
      });

      if (response.ok) {
        await loadAllData(); 
      }
    } catch (error) {
      await loadAllData();
    }
  };

  const deleteHabit = (habitId: number) => {
    Alert.alert("Eliminar", "¿Borrar este hábito para siempre?", [
      { text: "No" },
      { text: "Borrar", style: "destructive", onPress: async () => {
          try {
            await fetch(`${process.env.EXPO_PUBLIC_API_URL}habits/${habitId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${userValue.accessToken}` }
            });
            await loadAllData();
          } catch (e) { console.error(e); }
        }
      }
    ]);
  };

  const completedCount = habits.filter(h => h.done == 1).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  if (loading) return <ActivityIndicator color="#8a5cf69c" style={{ marginVertical: 40 }} />;

  return (
    <View style={styles.container}>
      {/* 1. CABECERA */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('profile.myRoutine')}</Text>
          <Text style={styles.dateText}>{todayName}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* 2. WEEKLY STRIP - TRADUCIDO DINÁMICAMENTE */}
      <View style={styles.weeklyStrip}>
        {weeklyStatus.map((item, index) => {
          // Parseamos la fecha que viene de la API para obtener el nombre del día en el idioma actual
          const dayNameLocal = format(parseISO(item.date), 'EEEEEE', { locale: currentLocale });
          
          const dayNumber = parseISO(item.date)?.getDate();

          return (
            <View key={index} style={styles.dayCol}>
              <Text style={styles.dayLabel}>{dayNameLocal}</Text>
              <View style={[
                styles.dayCircle, 
                item.full_completed && styles.dayCircleCompleted,
                item.is_today && styles.dayCircleToday
              ] as ViewStyle[]}>
                {item.full_completed ? (
                  <Feather name="check" size={14} color="#FFF" />
                ) : (
                  <Text style={[styles.dayDate, item.is_today && { color: '#8a5cf69c' }] as TextStyle[]}>
                    {dayNumber}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* 3. CARD DE ESTADÍSTICAS */}
      <View style={styles.statsCard}>
        <View>
          <Text style={styles.statsCount}>{completedCount} de {habits.length}</Text>
          <Text style={styles.statsSub}>{t('profile.habitsToday')}</Text>
        </View>
        <Text style={styles.statsPercent}>{progressPercent}%</Text>
      </View>

      {/* 4. LISTA DE HÁBITOS */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {habits.map((habit) => (
          <TouchableOpacity 
            key={habit.id} 
            style={[styles.item, habit.done == 1 && styles.itemDone] as ViewStyle[]}
            onPress={() => toggleHabit(habit.id)}
            onLongPress={() => deleteHabit(habit.id)}
          >
            <View style={[styles.iconBox, { backgroundColor: habit.color + '20' }] as ViewStyle[]}>
              <Feather name={habit.icon as any} size={20} color={habit.color} />
            </View>
            <Text style={[styles.name, habit.done == 1 && styles.nameDone] as TextStyle[]}>{habit.name}</Text>
            <View style={[styles.check, habit.done == 1 && { backgroundColor: habit.color, borderColor: habit.color }] as ViewStyle[]}>
              {habit.done == 1 && <Feather name="check" size={14} color="white" />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL CREACIÓN */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nuevo Hábito</Text>
            <TextInput 
              style={styles.input} 
              placeholder="¿Qué vas a hacer hoy?" 
              value={newName} 
              onChangeText={setNewName}
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.label}>Icono</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {AVAILABLE_ICONS.map(icon => (
                <TouchableOpacity 
                  key={icon} 
                  style={[styles.iconOption, selectedIcon === icon && styles.iconOptionActive] as ViewStyle[]} 
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Feather name={icon as any} size={20} color={selectedIcon === icon ? '#8a5cf69c' : '#94A3B8'} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {AVAILABLE_COLORS.map(c => (
                <TouchableOpacity 
                  key={c} 
                  style={[styles.dot, { backgroundColor: c }, selectedColor === c && styles.activeDot] as ViewStyle[]} 
                  onPress={() => setSelectedColor(c)} 
                />
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#64748B', fontWeight: '700' }}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnSave, { backgroundColor: selectedColor }] as ViewStyle[]} onPress={handleCreateHabit}>
                <Text style={{ color: 'white', fontWeight: '800' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B' } as TextStyle,
  dateText: { color: '#64748B', textTransform: 'capitalize', fontSize: 13 } as TextStyle,
  addBtn: { backgroundColor: '#8a5cf69c', width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  
  weeklyStrip: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' } as ViewStyle,
  dayCol: { alignItems: 'center', gap: 6 } as ViewStyle,
  dayLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' } as TextStyle,
  dayCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' } as ViewStyle,
  dayCircleToday: { borderColor: '#8a5cf69c', borderWidth: 2 } as ViewStyle,
  dayCircleCompleted: { backgroundColor: '#10B981', borderColor: '#10B981' } as ViewStyle,
  dayDate: { fontSize: 12, fontWeight: '700', color: '#64748B' } as TextStyle,

  statsCard: { backgroundColor: '#8a5cf69c', padding: 20, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 } as ViewStyle,
  statsCount: { fontSize: 20, fontWeight: '900', color: '#FFF' } as TextStyle,
  statsSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' } as TextStyle,
  statsPercent: { fontSize: 28, fontWeight: '950', color: '#FFF' } as TextStyle,

  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' } as ViewStyle,
  itemDone: { opacity: 0.6, backgroundColor: '#F8FAFC' } as ViewStyle,
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 } as ViewStyle,
  name: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1E293B' } as TextStyle,
  nameDone: { textDecorationLine: 'line-through', color: '#94A3B8' } as TextStyle,
  check: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' } as ViewStyle,

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 } as ViewStyle,
  modal: { backgroundColor: 'white', padding: 25, borderRadius: 30 } as ViewStyle,
  modalTitle: { fontSize: 20, fontWeight: '900', marginBottom: 20, color: '#1E293B' } as TextStyle,
  input: { backgroundColor: '#F1F5F9', padding: 16, borderRadius: 15, marginBottom: 20, fontSize: 16 } as TextStyle,
  label: { fontWeight: '800', marginBottom: 10, color: '#94A3B8', fontSize: 11, textTransform: 'uppercase' } as TextStyle,
  iconOption: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginRight: 10 } as ViewStyle,
  iconOptionActive: { backgroundColor: '#EEF2FF', borderColor: '#8a5cf69c' } as ViewStyle,
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 } as ViewStyle,
  dot: { width: 34, height: 34, borderRadius: 17 } as ViewStyle,
  activeDot: { borderWidth: 3, borderColor: '#CBD5E1' } as ViewStyle,
  modalActions: { flexDirection: 'row', gap: 15 } as ViewStyle,
  btnCancel: { flex: 1, padding: 16, alignItems: 'center' } as ViewStyle,
  btnSave: { flex: 2, padding: 16, borderRadius: 15, alignItems: 'center' } as ViewStyle
});