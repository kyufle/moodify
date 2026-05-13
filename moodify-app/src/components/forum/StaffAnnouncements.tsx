import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../user-provider'; // Ajusta la ruta según tu proyecto

// Configuración de estilos visuales para los avisos
const ADVICE_TYPES = [
  { tag: 'OFICIAL', icon: 'zap', colors: ['#6366F1', '#A855F7'] },
  { tag: 'AVISO', icon: 'info', colors: ['#F59E0B', '#EF4444'] },
  { tag: 'CONSEJO', icon: 'heart', colors: ['#10B981', '#3B82F6'] },
];

export const StaffAnnouncements = () => {
  const { userValue } = useContext(UserContext);
  
  // Estados para datos
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal (Admin)
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState(ADVICE_TYPES[0]);

  // Verificación de admin según tu tabla 'users' (columna type_user)
  const isAdmin = userValue?.user?.type_user === 'admin';

  // 1. Cargar anuncios desde la base de datos al montar el componente
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}getAnnouncements`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${userValue.accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Formateamos los colores si vienen como string JSON desde Laravel
        const formatted = data.map((item: any) => ({
          ...item,
          colors: typeof item.colors === 'string' ? JSON.parse(item.colors) : item.colors
        }));
        setAnnouncements(formatted);
      }
    } catch (e) {
      console.error("Error cargando avisos:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Publicar y guardar permanentemente en la base de datos
  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("¡Ups!", "Faltan datos para tu aviso tierno ✨");
      return;
    }

    const newEntry = {
      title: title,
      content: content,
      tag: selectedType.tag,
      icon: selectedType.icon,
      colors: selectedType.colors, // Se envía como array, Laravel lo hace JSON
    };

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}storeAnnouncement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userValue.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newEntry)
      });

      if (response.ok) {
        // Actualizamos la lista local añadiendo el nuevo al principio
        // Para asegurar que los colores se manejen bien localmente:
        setAnnouncements([{...newEntry, id: Date.now()}, ...announcements]);
        
        // Limpiamos UI
        setModalVisible(false);
        setTitle('');
        setContent('');
        Alert.alert("✨ ¡Guardado!", "Tu aviso ya es permanente en la nube.");
      } else {
        throw new Error("Error en el servidor");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo conectar con el servidor ☁️");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Avisos del Staff</Text>
          {isAdmin && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Feather name="plus-circle" size={22} color="#FF8DA1" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="#FF8DA1" />
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {announcements.length > 0 ? (
            announcements.map((item, index) => (
              <TouchableOpacity key={item.id || index} style={styles.cardContainer}>
                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCard}
                >
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.tag}</Text>
                  </View>
                  
                  <View style={styles.contentRow}>
                    <View style={styles.iconWrapper}>
                      <Feather name={item.icon as any} size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.textContent}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardInfo} numberOfLines={2}>{item.content}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No hay avisos hoy 🌸</Text>
          )}
        </ScrollView>
      )}

      {/* MODAL KAWAII DE CREACIÓN */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Aviso 🎀</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x-circle" size={28} color="#D4A5A5" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Título del Mensaje</Text>
            <TextInput 
              style={styles.input} 
              value={title} 
              onChangeText={setTitle} 
              placeholder="Escribe algo lindo..."
              placeholderTextColor="#D4A5A5"
            />

            <Text style={styles.label}>Contenido</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={content} 
              onChangeText={setContent} 
              multiline 
              placeholder="Detalles del aviso..."
              placeholderTextColor="#D4A5A5"
            />

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.typeSelector}>
              {ADVICE_TYPES.map((type) => (
                <TouchableOpacity 
                  key={type.tag}
                  style={[
                    styles.typeOption, 
                    selectedType.tag === type.tag && styles.typeOptionActive
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[
                    styles.typeOptionText, 
                    selectedType.tag === type.tag && styles.typeOptionTextActive
                  ]}>{type.tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handlePublish}>
              <Text style={styles.saveBtnText}>Publicar en la nube ✨</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#7D5A5A' },
  seeAllText: { fontSize: 13, color: '#FF8DA1', fontWeight: '700' },
  addBtn: { marginLeft: 10 },
  loaderContainer: { height: 120, justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 15 },
  cardContainer: { width: 280, marginHorizontal: 8, borderRadius: 25, overflow: 'hidden', elevation: 3 },
  gradientCard: { padding: 16, height: 120, justifyContent: 'center' },
  badge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  contentRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255, 255, 255, 0.25)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  textContent: { flex: 1 },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  cardInfo: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, lineHeight: 18 },
  noDataText: { marginLeft: 20, color: '#D4A5A5', fontStyle: 'italic' },
  
  // Estilos Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(125, 90, 90, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF9FB', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, minHeight: 520, borderWidth: 2, borderColor: '#FFECF0' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#7D5A5A' },
  label: { fontSize: 13, fontWeight: '800', color: '#D4A5A5', marginBottom: 8, marginTop: 15, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, fontSize: 16, borderWidth: 2, borderColor: '#FFECF0', color: '#7D5A5A' },
  textArea: { height: 90, textAlignVertical: 'top' },
  typeSelector: { flexDirection: 'row', gap: 8, marginTop: 5 },
  typeOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#FFECF0' },
  typeOptionActive: { backgroundColor: '#FFDDE4', borderColor: '#FF8DA1' },
  typeOptionText: { fontSize: 11, fontWeight: '800', color: '#D4A5A5' },
  typeOptionTextActive: { color: '#FF8DA1' },
  saveBtn: { backgroundColor: '#B2E2F2', borderRadius: 22, padding: 18, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#5A808D', fontWeight: '900', fontSize: 16 }
});