import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../user-provider'; 
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export const StaffAnnouncements = () => {
  const { userValue } = useContext(UserContext);
  const { t } = useTranslation();
  
  const ADVICE_TYPES = [
    { tag: t('forum.official'), icon: 'zap', colors: ['#6366F1', '#A855F7'] },
    { tag: t('forum.warning'), icon: 'info', colors: ['#F59E0B', '#EF4444'] },
    { tag: t('forum.advice'), icon: 'heart', colors: ['#10B981', '#3B82F6'] },
  ];

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState(ADVICE_TYPES[0]);

  const isAdmin = userValue?.user?.type_user === 'admin';

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

  const handleDelete = (id: number) => {
    Alert.alert(
      t('forum.deleteNotice'),
      t('forum.deleteNoticeText'),
      [
        { text: t('profile.cancel'), style: "cancel" },
        { 
          text: t('forum.erase'), 
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}deleteAnnouncement/${id}`, {
                method: 'DELETE',
                headers: { 
                  'Authorization': `Bearer ${userValue.accessToken}`,
                  'Accept': 'application/json'
                }
              });
              
              if (res.ok) {
                setAnnouncements(prev => prev.filter(item => item.id !== id));
                Alert.alert(t('forum.removing'), t('forum.notificationDisappeared'));
              } else {
                Alert.alert(t('sleep.error'), t('forum.noticeCouldNotBeDeleted'));
              }
            } catch (e) {
              Alert.alert(t('sleep.error'), t('forum.connectionError'));
            }
          }
        }
      ]
    );
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert(t('forum.connectionError'), t('forum.needsMoreInformation'));
      return;
    }

    const newEntry = {
      title,
      content,
      tag: selectedType.tag,
      icon: selectedType.icon,
      colors: selectedType.colors,
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
        const savedItem = await response.json();
        setAnnouncements([savedItem, ...announcements]);
        setModalVisible(false);
        setTitle('');
        setContent('');
        Alert.alert(t('forum.save'), t('forum.saveText'));
        fetchAnnouncements();
      }
    } catch (e) {
      Alert.alert(t('sleep.error'), t('forum.errorSave'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>{t('forum.staffNotices')}</Text>
          {isAdmin && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Feather name="plus-circle" size={22} color="#FF8DA1" />
            </TouchableOpacity>
          )}
        </View>
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
              <View key={item.id || index} style={styles.cardContainer}>
                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCard}
                >
                  {isAdmin && (
                    <TouchableOpacity 
                      style={styles.deleteBtn} 
                      onPress={() => handleDelete(item.id)}
                    >
                      <Feather name="trash-2" size={16} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>
                  )}

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
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>{t('forum.noAnnouncementsToday')}</Text>
          )}
        </ScrollView>
      )}

      {/* MODAL CENTRADO */}
      <Modal 
        animationType="fade" 
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          {/* View interna para evitar que el modal se cierre al tocar el contenido */}
          <View 
            onStartShouldSetResponder={() => true} 
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('forum.newNotice')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x-circle" size={28} color="#D4A5A5" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>{t('forum.title')}</Text>
                <TextInput 
                style={styles.input} 
                value={title} 
                onChangeText={setTitle} 
                placeholder={t('forum.writeAd')}
                placeholderTextColor="#D4A5A5"
                />

                <Text style={styles.label}>{t('forum.content')}</Text>
                <TextInput 
                style={[styles.input, styles.textArea]} 
                value={content} 
                onChangeText={setContent} 
                multiline 
                placeholder={t('forum.noticeDetails')}
                placeholderTextColor="#D4A5A5"
                />

                <Text style={styles.label}>{t('forum.category')}</Text>
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
                <Text style={styles.saveBtnText}>{t('forum.post')}</Text>
                </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#7D5A5A' },
  addBtn: { marginLeft: 10 },
  loaderContainer: { height: 120, justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 15 },
  cardContainer: { width: 280, marginHorizontal: 8, borderRadius: 25, overflow: 'hidden', elevation: 3 },
  gradientCard: { padding: 16, height: 120, justifyContent: 'center' },
  badge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  deleteBtn: { position: 'absolute', bottom: 10, right: 12, padding: 5, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10 },
  contentRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255, 255, 255, 0.25)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  textContent: { flex: 1 },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  cardInfo: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, lineHeight: 18 },
  noDataText: { marginLeft: 20, color: '#D4A5A5', fontStyle: 'italic' },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(125, 90, 90, 0.6)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#FFF9FB', 
    borderRadius: 35, 
    padding: 25, 
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 2, 
    borderColor: '#FFECF0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#7D5A5A' },
  label: { fontSize: 13, fontWeight: '800', color: '#D4A5A5', marginBottom: 8, marginTop: 15, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, fontSize: 16, borderWidth: 2, borderColor: '#FFECF0', color: '#7D5A5A' },
  textArea: { height: 90, textAlignVertical: 'top' },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5 },
  typeOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#FFECF0' },
  typeOptionActive: { backgroundColor: '#FFDDE4', borderColor: '#FF8DA1' },
  typeOptionText: { fontSize: 11, fontWeight: '800', color: '#D4A5A5' },
  typeOptionTextActive: { color: '#FF8DA1' },
  saveBtn: { backgroundColor: '#B2E2F2', borderRadius: 22, padding: 18, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#5A808D', fontWeight: '900', fontSize: 16 }
});