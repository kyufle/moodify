import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Alert, ActivityIndicator, Modal, TextInput, ViewStyle, Dimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../../components/user-provider';

const COLORS = ['#F472B6', '#60A5FA', '#818CF8', '#10B981', '#F59E0B', '#6366F1'];
const ICONS = ['coffee', 'trending-up', 'moon', 'target', 'heart', 'star', 'activity', 'book'];

interface Challenge {
  id: string;
  name: string;
  current_days: number;
  total_days: number;
  color: string;
  icon: string;
}

export const ChallengesSection = ({ onDataLoaded }: { onDataLoaded?: (data: Challenge[]) => void }) => {
  const { userValue } = useContext(UserContext);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const [newName, setNewName] = useState('');
  const [newDays, setNewDays] = useState('30');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const fetchChallenges = async () => {
    if (!userValue?.accessToken) return;
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}challenges`, {
        headers: { 'Authorization': `Bearer ${userValue.accessToken}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        setChallenges(data);
        if (onDataLoaded) onDataLoaded(data);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchChallenges(); }, [userValue?.accessToken]);

  const handleCreate = async () => {
    if (!newName.trim()) return Alert.alert("Error", "El nombre es obligatorio");
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}challenges`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${userValue.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          name: newName,
          total_days: parseInt(newDays),
          icon: selectedIcon,
          color: selectedColor
        })
      });
      if (res.ok) {
        setCreateModalVisible(false);
        setNewName('');
        fetchChallenges();
      }
    } catch (e) { Alert.alert("Error de conexión"); }
  };

  const markDay = async (challengeId: string) => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}challenges/${challengeId}/mark-day`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userValue.accessToken}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        fetchChallenges();
        setSelectedChallenge(data);
        Alert.alert("¡Bravo!", "Día completado");
      } else {
        Alert.alert("Aviso", data.error || "Ya registrado hoy");
      }
    } catch (e) { Alert.alert("Error"); }
  };

  const deleteChallenge = (id: string) => {
    Alert.alert("Borrar Reto", "¿Eliminar permanentemente?", [
      { text: "No" },
      { text: "Borrar", style: 'destructive', onPress: async () => {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}challenges/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${userValue.accessToken}` }
          });
          fetchChallenges();
          setDetailVisible(false);
      }}
    ]);
  };

  if (loading) return <ActivityIndicator color="#6366F1" style={{ margin: 20 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Mis Retos</Text>
        <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
           <Feather name="plus-circle" size={22} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {challenges.length === 0 && <Text style={styles.emptyText}>No tienes retos activos</Text>}
        {challenges.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.challengeCard}
            onPress={() => { setSelectedChallenge(item); setDetailVisible(true); }}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }] as ViewStyle[]}>
              <Feather name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={styles.challengeName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{item.current_days}/{item.total_days} Días</Text>
              <Feather name="maximize-2" size={12} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={detailVisible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.fullView}>
          {selectedChallenge && (
            <>
              <View style={styles.fullHeader}>
                <TouchableOpacity onPress={() => setDetailVisible(false)}>
                  <Feather name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteChallenge(selectedChallenge.id)}>
                  <Feather name="trash-2" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ padding: 25 }}>
                <View style={[styles.bigIconBox, { backgroundColor: selectedChallenge.color + '15' }]}>
                  <Feather name={selectedChallenge.icon as any} size={40} color={selectedChallenge.color} />
                </View>
                <Text style={styles.fullTitle}>{selectedChallenge.name}</Text>
                <Text style={styles.fullSub}>Progreso: {selectedChallenge.current_days}/{selectedChallenge.total_days} días</Text>
                <View style={styles.calendarContainer}>
                  {Array.from({ length: selectedChallenge.total_days }).map((_, i) => (
                    <View key={i} style={[styles.calendarDay, i < selectedChallenge.current_days && { backgroundColor: selectedChallenge.color, borderColor: selectedChallenge.color }]}>
                      {i < selectedChallenge.current_days ? <Feather name="check" size={14} color="white" /> : <Text style={styles.dayNumber}>{i + 1}</Text>}
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={[styles.mainBtn, { backgroundColor: selectedChallenge.color }]} onPress={() => markDay(selectedChallenge.id)}>
                  <Text style={styles.mainBtnText}>Marcar día de hoy</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
        </View>
      </Modal>

      <Modal visible={createModalVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitleText}>Nuevo Reto</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={newName} onChangeText={setNewName} />
            <TextInput style={styles.input} placeholder="Días (ej. 30)" keyboardType="numeric" value={newDays} onChangeText={setNewDays} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setCreateModalVisible(false)}><Text>Cerrar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btnSave, {backgroundColor: selectedColor}]} onPress={handleCreate}><Text style={{color:'white'}}>Crear</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 25 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  scrollContent: { paddingHorizontal: 15 },
  emptyText: { color: '#94A3B8', marginLeft: 20 },
  challengeCard: { width: 150, backgroundColor: '#FFF', borderRadius: 24, padding: 16, marginHorizontal: 6, borderWidth: 1, borderColor: '#F1F5F9', elevation: 3 },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  challengeName: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 10, height: 42 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  fullView: { flex: 1, backgroundColor: '#FFF' },
  fullHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  bigIconBox: { width: 80, height: 80, borderRadius: 25, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 },
  fullTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 8 },
  fullSub: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 30 },
  calendarContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 },
  calendarDay: { width: 45, height: 45, borderRadius: 12, borderWidth: 2, borderColor: '#F1F5F9', backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  dayNumber: { fontSize: 14, fontWeight: '700', color: '#CBD5E1' },
  mainBtn: { padding: 20, borderRadius: 20, alignItems: 'center' },
  mainBtnText: { color: 'white', fontSize: 18, fontWeight: '800' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modal: { backgroundColor: '#FFF', borderRadius: 30, padding: 25 },
  modalTitleText: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
  input: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  modalButtons: { flexDirection: 'row', gap: 10 },
  btnCancel: { flex: 1, padding: 18, alignItems: 'center' },
  btnSave: { flex: 2, padding: 18, borderRadius: 15, alignItems: 'center' }
});