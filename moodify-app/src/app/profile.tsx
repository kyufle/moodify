import React, { useContext, useState, useCallback, useEffect } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, Text, 
  Image, Alert, Modal, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Keyboard 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { UserContext } from '@/components/user-provider';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';
import { avatarMap } from '../utils/utils';

// Componentes de perfil
import { HabitProgress } from '@/components/profile/HabitProgress';
import { ChallengesSection } from '@/components/profile/ChallengesSection';
import { AchievementsBar } from '@/components/profile/AchievementsBar';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

// --- COMPONENTE SUB-MODAL CENTRADO ---
const SettingsModal = ({ visible, title, onClose, onSave, loading, showSave = true, children }: any) => {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose} statusBarTranslucent={true}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.dismissOverlay} activeOpacity={1} onPress={onClose} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
          <View style={styles.modalContentCentered}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={15}>
                <Feather name="x" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <ScrollView bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ maxHeight: 450 }}>
              <View style={{ paddingBottom: 10 }}>{children}</View>
              {showSave && (
                <TouchableOpacity style={[styles.btnSave, loading && { opacity: 0.6 }]} onPress={onSave} disabled={loading}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnSaveText}>{t('profile.save')}</Text>}
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default function ProfileScreen() {
  const { userValue, logout, setUserValue } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const user = userValue?.user ?? { id: null, name: 'Usuario', email: '', username: '', streak: 0, points: 0, language: 'es', image_id: null };
  const token = userValue?.accessToken ?? null;

  const [activeTab, setActiveTab] = useState<'perfil' | 'ajustes'>('perfil');
  const [activeModal, setActiveModal] = useState<'perfil' | 'seguridad' | 'idioma' | 'avatar' | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [selectedLang, setSelectedLang] = useState(user.language || i18n.language);

  const [habitsData, setHabitsData] = useState<any[]>([]);
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  // ESTADO FORMULARIO CON USERNAME
  const [formProfile, setFormProfile] = useState({ 
    name: user.name, 
    email: user.email,
    username: user.username 
  });
  const [formPass, setFormPass] = useState({ current_password: '', new_password: '' });

  const authHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const languages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ca', label: 'Català', flag: '🚩' },
  ];

  useEffect(() => {
    if (user.language && user.language !== i18n.language) {
      i18n.changeLanguage(user.language);
      setSelectedLang(user.language);
    }
  }, [user.language]);

  const handleUpdateAvatar = async (selectedAvatarId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}profile/update`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ image_id: selectedAvatarId }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserValue({ ...userValue, user: data.user });
        setActiveModal(null);
      } else {
        Alert.alert("Error", "No se pudo actualizar el avatar");
      }
    } catch (e) {
      Alert.alert("Error", "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLanguage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}profile/update`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ language: selectedLang }),
      });
      const data = await res.json();
      if (res.ok) {
        await i18n.changeLanguage(selectedLang);
        setUserValue({ ...userValue, user: data.user });
        setActiveModal(null);
      } else {
        Alert.alert("Error", data.message || t('error_guardar_idioma'));
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar el idioma");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const res = await fetch(`${API}profile/update`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ 
          name: formProfile.name, 
          email: formProfile.email,
          username: formProfile.username 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserValue({ ...userValue, user: data.user });
        setActiveModal(null);
        setTimeout(() => Alert.alert(t('exito'), t('perfil_actualizado')), 400);
      } else {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join('\n') : data.message;
        Alert.alert("Error", errorMsg || "Error al actualizar");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const res = await fetch(`${API}profile/update`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          current_password: formPass.current_password,
          password: formPass.new_password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveModal(null);
        setFormPass({ current_password: '', new_password: '' });
        setTimeout(() => Alert.alert(t('exito'), t('pass_cambiada')), 400);
      } else {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join('\n') : data.message;
        Alert.alert("Error", errorMsg || "La contraseña no es válida");
      }
    } catch (e) {
      Alert.alert("Error", "Server error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnlockedAchievements = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}achievements`, { method: 'GET', headers: authHeaders });
      const data = await res.json();
      if (res.ok) setUnlockedIds(data.unlocked_ids || []);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => { fetchUnlockedAchievements(); }, [fetchUnlockedAchievements]);

  const syncLogros = (data: any, type: 'habits' | 'challenges' | 'weekly') => {
    if (type === 'habits') setHabitsData(data);
    if (type === 'challenges') setChallengesData(data);
    if (type === 'weekly') setWeeklyData(data);
    fetchUnlockedAchievements();
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.topBar}><Text style={styles.topBarTitle}>{t('profile.myProfile')}</Text></View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <LinearGradient colors={['#c2c3eca9', '#8a5cf69c', '#a955f785']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <Image source={user.image_id ? avatarMap[user.image_id] : { uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} resizeMode="cover" />
              </View>
              <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setActiveModal('avatar')} activeOpacity={0.8}>
                <Feather name="camera" size={14} color="#c6c6f0" />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroName}>{user.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}><Text style={styles.statNum}>{user.streak}</Text><Text style={styles.statLbl}>{t('profile.streak')}</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statNum}>{user.points}</Text><Text style={styles.statLbl}>{t('profile.points')}</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}><Text style={styles.statNum}>{unlockedIds.length}</Text><Text style={styles.statLbl}>{t('profile.achievements')}</Text></View>
            </View>
          </LinearGradient>

          <View style={styles.tabBar}>
            {['perfil', 'ajustes'].map((tab: any) => (
              <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab as any)}>
                <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>{tab === 'perfil' ? t('profile.profile') : t('profile.settings')}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'perfil' ? (
            <View style={styles.card}>
              <HabitProgress onDataLoaded={(d) => syncLogros(d, 'habits')} onWeeklyLoaded={(d) => syncLogros(d, 'weekly')} />
              <ChallengesSection onDataLoaded={(d) => syncLogros(d, 'challenges')} />
              <AchievementsBar habits={habitsData} challenges={challengesData} weeklyStatus={weeklyData} unlockedIds={unlockedIds} />
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>{t('profile.account')}</Text>
              <SettingRow icon="user" label={t('profile.editarPerfil')} onPress={() => setActiveModal('perfil')} />
              <SettingRow icon="lock" label={t('profile.changePassword')} onPress={() => setActiveModal('seguridad')} />
              <Text style={styles.sectionLabel}>{t('profile.preferences')}</Text>
              <SettingRow icon="globe" label={t('idioma')} onPress={() => setActiveModal('idioma')} color="#10B981" />
              <TouchableOpacity style={[styles.settingRow, { marginTop: 20, borderBottomWidth: 0 }]} onPress={logout}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF2F2' }]}><Feather name="log-out" size={18} color="#EF4444" /></View>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>{t('profile.closeSession')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </DashboardBackground>

      {/* MODAL AVATAR */}
      <SettingsModal visible={activeModal === 'avatar'} title={t('seleccionar_avatar')} onClose={() => setActiveModal(null)} showSave={false}>
        <View style={styles.avatarGrid}>
          {Object.keys(avatarMap).map((key) => (
            <TouchableOpacity key={key} style={[styles.avatarOption, user.image_id === key && styles.avatarOptionActive]} onPress={() => handleUpdateAvatar(key)}>
              <Image source={avatarMap[key]} style={styles.avatarImage} />
              {user.image_id === key && (
                <View style={styles.checkBadge}><Feather name="check" size={12} color="white" /></View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SettingsModal>

      {/* MODAL PERFIL - USERNAME PRIMERO */}
      <SettingsModal visible={activeModal === 'perfil'} title={t('profile.editarPerfil')} onClose={() => setActiveModal(null)} onSave={handleUpdateInfo} loading={loading}>
          <Text style={styles.inputLabel}>{t('profile.username')} (@)</Text>
          <View style={styles.inputWithPrefix}>
            <Text style={styles.prefixText}>@</Text>
            <TextInput 
              style={[styles.input, { flex: 1, marginTop: 0, borderWidth: 0 }]} 
              value={formProfile.username} 
              onChangeText={(text) => setFormProfile({...formProfile, username: text})}
              autoCapitalize="none"
              placeholder="username"
            />
          </View>

          <Text style={styles.inputLabel}>{t('profile.name')}</Text>
          <TextInput style={styles.input} value={formProfile.name} onChangeText={(text) => setFormProfile({...formProfile, name: text})} />
          
          <Text style={styles.inputLabel}>{t('profile.email')}</Text>
          <TextInput style={styles.input} value={formProfile.email} onChangeText={(text) => setFormProfile({...formProfile, email: text})} keyboardType="email-address" autoCapitalize="none" />
      </SettingsModal>

      {/* OTROS MODALES IGUAL... */}
      <SettingsModal visible={activeModal === 'seguridad'} title={t('profile.changePassword')} onClose={() => setActiveModal(null)} onSave={handleUpdatePassword} loading={loading}>
          <Text style={styles.inputLabel}>{t('profile.currentPassword')}</Text>
          <TextInput style={styles.input} secureTextEntry value={formPass.current_password} onChangeText={(text) => setFormPass({...formPass, current_password: text})} placeholder="••••••••" />
          <Text style={styles.inputLabel}>{t('profile.newPassword')}</Text>
          <TextInput style={styles.input} secureTextEntry value={formPass.new_password} onChangeText={(text) => setFormPass({...formPass, new_password: text})} placeholder="••••••••" />
      </SettingsModal>

      <SettingsModal visible={activeModal === 'idioma'} title={t('profile.language')} onClose={() => setActiveModal(null)} onSave={handleSaveLanguage} loading={loading}>
          <View style={styles.languageList}>
            {languages.map((lang) => (
              <TouchableOpacity key={lang.code} style={[styles.langItem, selectedLang === lang.code && styles.langItemActive]} onPress={() => setSelectedLang(lang.code)}>
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langLabel, selectedLang === lang.code && styles.langLabelActive]}>{lang.label}</Text>
                {selectedLang === lang.code && <Feather name="check" size={18} color="#b6b7d6" />}
              </TouchableOpacity>
            ))}
          </View>
      </SettingsModal>

      <StaticBottomNavBar activeTab="user" />
    </View>
  );
}

const SettingRow = ({ icon, label, onPress, color = "#8a5cf69c" }: any) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <View style={[styles.settingIcon, { backgroundColor: color + '15' }]}><Feather name={icon} size={18} color={color} /></View>
    <Text style={styles.settingLabel}>{label}</Text>
    <Feather name="chevron-right" size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  topBarTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110, gap: 12 },
  heroCard: { borderRadius: 28, paddingVertical: 28, paddingHorizontal: 24, alignItems: 'center' },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatarRing: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: 'white', overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 3 },
  heroName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  statsRow: { flexDirection: 'row', marginTop: 15, gap: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 20 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: 'white' },
  statLbl: { fontSize: 10, color: 'white' },
  statDivider: { width: 1, backgroundColor: 'white', opacity: 0.3 },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 5, marginTop: 10 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabBtnActive: { backgroundColor: '#EEF2FF' },
  tabBtnText: { color: '#94A3B8', fontWeight: '600', fontSize: 14 },
  tabBtnTextActive: { color: '#8a5cf69c', fontWeight: '700' },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15, marginTop: 10 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', alignItems: 'center' },
  dismissOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  keyboardView: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  modalContentCentered: { backgroundColor: 'white', borderRadius: 30, padding: 24, width: '90%', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 15, elevation: 10 },
  btnSave: { backgroundColor: '#8a5cf69c', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 20, marginBottom: 5 },
  btnSaveText: { color: 'white', fontWeight: '700', fontSize: 16 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, fontSize: 16, color: '#1E293B', marginTop: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 8, marginTop: 12 },
  languageList: { gap: 10 },
  langItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 15, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  langItemActive: { backgroundColor: '#EEF2FF', borderColor: '#8a5cf69c' },
  langFlag: { fontSize: 22, marginRight: 12 },
  langLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#475569' },
  langLabelActive: { color: '#8a5cf69c' },
  // ESTILOS ESPECIALES USERNAME
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingLeft: 16,
    marginTop: 5,
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8a5cf69c',
    marginRight: 4,
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingVertical: 10 },
  avatarOption: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#F1F5F9', padding: 3, position: 'relative' },
  avatarOptionActive: { borderColor: '#8a5cf69c' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 40 },
  checkBadge: { position: 'absolute', right: -2, bottom: -2, backgroundColor: '#8a5cf69c', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
});