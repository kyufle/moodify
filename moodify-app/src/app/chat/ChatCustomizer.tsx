import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  ImageBackground, FlatList, ScrollView, Image, Dimensions, ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '@/components/user-provider';

const { width } = Dimensions.get('window');

export const ALL_BACKGROUNDS = [
  { id: 'fondo1.jpg', source: require('../../../assets/images/backgroundchat/fondo1.jpg') },
  { id: 'fondo2.jpg', source: require('../../../assets/images/backgroundchat/fondo2.jpg') },
  { id: 'fondo3.png', source: require('../../../assets/images/backgroundchat/fondo3.png') },
  { id: 'fondo4.png', source: require('../../../assets/images/backgroundchat/fondo4.png') },
  { id: 'fondo5.png', source: require('../../../assets/images/backgroundchat/fondo5.png') },
  { id: 'fondo6.png', source: require('../../../assets/images/backgroundchat/fondo6.png') },
  { id: 'fondo7.jpg', source: require('../../../assets/images/backgroundchat/fondo7.jpg') },
];

const FULL_COLOR_PALETTE = ['#F472B6', '#E91E63', '#3B82F6', '#2196F3', '#10B981', '#4CAF50', '#F59E0B', '#FF5722', '#8B5CF6', '#000000', '#64748B', '#FFFFFF'];

const PRESET_THEMES = [
  { id: '1', name: 'Rosa Clásico', bgName: ALL_BACKGROUNDS[0].id, myMsgColor: '#F472B6', otherMsgColor: '#FFFFFF', textColorOther: '#FFFFFF', textColorOwn: '#FFFFFF'},
  { id: '2', name: 'Perritos Pink', bgName: ALL_BACKGROUNDS[1].id, myMsgColor: '#F472B6', otherMsgColor: '#FFFFFF', textColorOther: '#FFFFFF', textColorOwn: '#FFFFFF' },
  { id: '3', name: 'Modo Rana', bgName: ALL_BACKGROUNDS[2].id, myMsgColor: '#128C7E', otherMsgColor: '#E2E8F0', textColorOther: '#FFFFFF', textColorOwn: '#FFFFFF' },
];

export const ChatCustomizer = ({ visible, onClose, onSave, currentTheme }: any) => {
  const { userValue } = useContext(UserContext);

  const tokenString = userValue?.accessToken;

  const [view, setView] = useState<'presets' | 'customize'>('presets');
  const [theme, setTheme] = useState(currentTheme || PRESET_THEMES[1]);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!tokenString) {
      console.error("Faltan credenciales:", { token: !!tokenString});
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}chat-themes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenString}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(theme)
      });

      console.log(response);
      

      if (response.ok) {
        onSave(await response.json());
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error servidor:", errorData);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderChatPreview = (themePrev: typeof theme, isMini = false) => (
    <ImageBackground 
      source={ALL_BACKGROUNDS.find((background) => background.id === themePrev.bgName)?.source} 
      style={isMini ? styles.miniBg : styles.fullBg}
      imageStyle={isMini ? { borderRadius: 12 } : {}}
    >
      <View style={[styles.chatOverlay, isMini && { padding: 8 }]}>
        <View style={[styles.bubble, { backgroundColor: themePrev.otherMsgColor, alignSelf: 'flex-start' }, isMini ? { width: '70%', height: 12, marginBottom: 5 } : { padding: 12 }]}>
          {!isMini && <Text style={{ color: themePrev.textColorOther, fontSize: 12 }}>¡Hola! ¿Te gusta?</Text>}
        </View>
        <View style={[styles.bubble, { backgroundColor: themePrev.myMsgColor, alignSelf: 'flex-end' }, isMini ? { width: '70%', height: 12 } : { padding: 12 }]}>
          {!isMini && <Text style={{ color: themePrev.textColorOwn, fontSize: 12 }}>¡Me encanta! 😍</Text>}
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={view === 'customize' ? () => setView('presets') : onClose} disabled={loading}>
            <Feather name={view === 'customize' ? "arrow-left" : "x"} size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{view === 'presets' ? 'Temas' : 'Diseñador'}</Text>
          <TouchableOpacity onPress={handleApply} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#3B82F6" /> : <Text style={styles.applyText}>Aplicar</Text>}
          </TouchableOpacity>
        </View>

        {view === 'presets' ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={PRESET_THEMES}
              numColumns={2}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.presetCard, (theme.bgName === item.bgName) && styles.activeCard]} 
                  onPress={() => setTheme(item)}
                >
                  <View style={styles.thumbContainer}>{renderChatPreview(item, true)}</View>
                  <View style={styles.presetLabel}>
                    <Text style={styles.presetText} numberOfLines={1}>{item.name}</Text>
                    {(theme.bgName === item.bgName) && <Feather name="check-circle" size={16} color="#3B82F6" />}
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={styles.footer}>
              <TouchableOpacity style={styles.customizeBtn} onPress={() => setView('customize')}>
                <Feather name="edit-3" size={18} color="white" style={{marginRight: 8}} />
                <Text style={styles.customizeBtnText}>Personalizar a mano</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} bounces={false}>
            <View style={styles.mainPreviewHolder}>{renderChatPreview(theme)}</View>
            <View style={styles.editorPanel}>
              <Text style={styles.sectionTitle}>1. Fondo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.scrollContentContainer} style={styles.bgPickerRow}>
                {ALL_BACKGROUNDS.map((item) => (
                  <TouchableOpacity key={item.id} onPress={() => setTheme({ ...theme, bgName: item.id })} style={[styles.bgThumbnail, (theme.bgName === item.id) && styles.activeBgThumbnail]}>
                    <Image source={item.source} style={styles.bgImageFull} />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>2. Color de tus mensajes (Tú)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.scrollContentContainer} style={styles.colorPickerRow}>
                {FULL_COLOR_PALETTE.map(color => (
                  <TouchableOpacity key={`me-bg-${color}`} style={[styles.colorOption, { backgroundColor: color }, theme.myMsgColor === color && styles.activeColorOption]} onPress={() => setTheme({ ...theme, myMsgColor: color })} />
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>3. Color mensajes otros</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.scrollContentContainer} style={styles.colorPickerRow}>
                {FULL_COLOR_PALETTE.map(color => (
                  <TouchableOpacity key={`other-bg-${color}`} style={[styles.colorOption, { backgroundColor: color }, theme.otherMsgColor === color && styles.activeColorOption]} onPress={() => setTheme({ ...theme, otherMsgColor: color })} />
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>4. Color del texto (Tus mensajes)</Text>
              <View style={styles.row}>
                {['#FFFFFF', '#000000'].map(c => (
                  <TouchableOpacity key={`txt-global-${c}`} style={[styles.chip, theme.textColorOwn === c && styles.activeChip]} onPress={() => setTheme({ ...theme, textColorOwn: c })}>
                    <Text style={{ color: theme.textColorOwn === c ? '#FFF' : '#000', fontWeight: 'bold' }}>{c === '#FFFFFF' ? 'Blanco' : 'Negro'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ height: 40 }} />
               <Text style={styles.sectionTitle}>4. Color del texto (Otros mensajes)</Text>
              <View style={styles.row}>
                {['#FFFFFF', '#000000'].map(c => (
                  <TouchableOpacity key={`txt-global-${c}`} style={[styles.chip, theme.textColorOther === c && styles.activeChip]} onPress={() => setTheme({ ...theme, textColorOther: c })}>
                    <Text style={{ color: theme.textColorOther === c ? '#FFF' : '#000', fontWeight: 'bold' }}>{c === '#FFFFFF' ? 'Blanco' : 'Negro'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ height: 40 }} />
            </View>
            
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  applyText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 16 },
  presetCard: { width: '48%', marginBottom: 20, borderRadius: 16, backgroundColor: '#FFF', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  activeCard: { borderWidth: 2, borderColor: '#3B82F6' },
  thumbContainer: { height: 150, width: '100%' },
  presetLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 },
  presetText: { fontSize: 13, fontWeight: '700', marginRight: 5, color: '#475569' },
  fullBg: { height: 350, width: '100%' },
  miniBg: { width: '100%', height: '100%' },
  chatOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.03)', justifyContent: 'center', padding: 20 },
  bubble: { borderRadius: 18, marginBottom: 10 },
  mainPreviewHolder: { overflow: 'hidden' },
  editorPanel: { padding: 20, backgroundColor: 'white', flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, elevation: 15 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, paddingTop: 10, paddingBottom: 10, marginBottom: 5, marginTop: 5 },
  colorPickerRow: { flexDirection: 'row', marginBottom: 10, paddingVertical: 12 }, 
  scrollContentContainer: { paddingBottom: 15, paddingHorizontal: 10 },
  colorOption: { width: 44, height: 44, borderRadius: 22, marginRight: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  activeColorOption: { borderWidth: 3, borderColor: '#3B82F6', transform: [{ scale: 1.1 }], marginHorizontal: 2 },
  bgPickerRow: { flexDirection: 'row', marginBottom: 10, paddingVertical: 10 },
  bgThumbnail: { width: 65, height: 95, borderRadius: 12, marginRight: 15, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  activeBgThumbnail: { borderColor: '#3B82F6' },
  bgImageFull: { width: '100%', height: '100%', borderRadius: 10 },
  row: { flexDirection: 'row' },
  chip: { paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15, backgroundColor: '#F1F5F9', marginRight: 12 },
  activeChip: { backgroundColor: '#3B82F6' },
  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  customizeBtn: { backgroundColor: '#1E293B', padding: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  customizeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});