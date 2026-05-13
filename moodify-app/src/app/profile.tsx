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
import { ProgressDashboard } from '@/components/calendar/ProgressDashboard';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

// --- COMPONENTE SUB-MODAL ---
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
  const { userValue, logout, setUserValue, unreadCount } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const user = userValue?.user ?? { id: null, name: 'Usuario', email: '', username: '', streak: 0, points: 0, language: 'es', image_id: null };
  const token = userValue?.accessToken ?? null;

  const [activeTab, setActiveTab] = useState<'perfil' | 'ajustes'>('perfil');
  const [activeModal, setActiveModal] = useState<'perfil' | 'avatar' | 'bloqueados' | 'password' | 'idioma' | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [habitsData, setHabitsData] = useState<any[]>([]);
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  const [formProfile, setFormProfile] = useState({ 
    name: user.name, 
    email: user.email,
    username: user.username 
  });

  const [formPassword, setFormPassword] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    setFormProfile({ name: user.name, email: user.email, username: user.username });
  }, [userValue]);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchBlockedUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}community/blocked-users`, { method: 'GET', headers: authHeaders });
      const data = await res.json();
      if (res.ok) setBlockedUsers(data);
    } catch (e) {
      console.error("Error fetching blocked users", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeModal === 'bloqueados') fetchBlockedUsers();
  }, [activeModal, fetchBlockedUsers]);

  const handleUnblock = async (blockedUserId: number) => {
  setLoading(true);
  try {
    const res = await fetch(`${API}community/users/${blockedUserId}/unblock`, {
      method: 'POST',
      headers: authHeaders,
    });

    if (res.ok) {
      // Filtramos el usuario de la lista local para que desaparezca de la vista
      setBlockedUsers((prev) => prev.filter(user => user.id !== blockedUserId));
      Alert.alert(t('exito'), t('Usuario desbloqueado'));
    } else {
      Alert.alert("Error", "No se pudo desbloquear al usuario");
    }
  } catch (e) {
    console.error("Error unblocking user", e);
    Alert.alert("Error", "Error de conexión");
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
        body: JSON.stringify(formProfile),
      });
      const data = await res.json();
      if (res.ok) {
        setUserValue({ ...userValue, user: data.user });
        setActiveModal(null);
        Alert.alert(t('exito'), t('perfil_actualizado'));
      }
    } catch (e) {
        Alert.alert("Error", "No se pudo actualizar");
    } finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const res = await fetch(`${API}profile/change-password`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(formPassword),
      });
      if (res.ok) {
        setActiveModal(null);
        setFormPassword({ current_password: '', password: '', password_confirmation: '' });
        Alert.alert(t('exito'), t('contrasena_actualizada'));
      } else {
        Alert.alert("Error", t('error_contrasena'));
      }
    } catch (e) {
      Alert.alert("Error", "Error de conexión");
    } finally { setLoading(false); }
  };

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
      }
    } catch (e) { Alert.alert("Error", "Error de conexión"); }
    finally { setLoading(false); }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setActiveModal(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.topBar}><Text style={styles.topBarTitle}>{t('profile.myProfile')}</Text></View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <LinearGradient colors={['#c2c3eca9', '#8a5cf69c', '#a955f785']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <Image 
                  source={user.image_id ? avatarMap[user.image_id] : { uri: 'https://i.pravatar.cc/150?img=12' }} 
                  style={styles.avatar} 
                />
              </View>
              <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setActiveModal('avatar')}>
                <Feather name="camera" size={14} color="#6366f1" />
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
            {['perfil', 'ajustes'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} 
                onPress={() => setActiveTab(tab as any)}
              >
                <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                    {tab === 'perfil' ? t('profile.profile') : t('profile.settings')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'perfil' ? (
            <View style={styles.card}>
              <HabitProgress onDataLoaded={setHabitsData} onWeeklyLoaded={setWeeklyData} />
              <ChallengesSection onDataLoaded={setChallengesData} />
              <ProgressDashboard />
              <AchievementsBar habits={habitsData} challenges={challengesData} weeklyStatus={weeklyData} unlockedIds={unlockedIds} />
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>{t('profile.account')}</Text>
              <SettingRow icon="user" label={t('profile.editarPerfil')} onPress={() => setActiveModal('perfil')} />
              <SettingRow icon="lock" label={t('profile.cambiarPassword')} onPress={() => setActiveModal('password')} />
              <SettingRow icon="globe" label={t('profile.language')} onPress={() => setActiveModal('idioma')} />
              
              <Text style={styles.sectionLabel}>{t('profile.privacy')}</Text>
              <SettingRow icon="slash" label={t('profile.usuariosBloqueados')} onPress={() => setActiveModal('bloqueados')} color="#EF4444" />

              <TouchableOpacity style={[styles.settingRow, { marginTop: 20, borderBottomWidth: 0 }]} onPress={logout}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF2F2' }]}><Feather name="log-out" size={18} color="#EF4444" /></View>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>{t('profile.closeSession')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </DashboardBackground>

      {/* MODAL PERFIL */}
      <SettingsModal visible={activeModal === 'perfil'} title={t('profile.editarPerfil')} onClose={() => setActiveModal(null)} onSave={handleUpdateInfo} loading={loading}>
          <Text style={styles.inputLabel}>{t('profile.username')} (@)</Text>
          <View style={styles.inputWithPrefix}>
            <Text style={styles.prefixText}>@</Text>
            <TextInput 
                style={[styles.input, { flex: 1, marginTop: 0, borderWidth: 0 }]} 
                value={formProfile.username} 
                onChangeText={(text) => setFormProfile({...formProfile, username: text})} 
                autoCapitalize="none" 
            />
          </View>
          <Text style={styles.inputLabel}>{t('profile.name')}</Text>
          <TextInput style={styles.input} value={formProfile.name} onChangeText={(text) => setFormProfile({...formProfile, name: text})} />
          <Text style={styles.inputLabel}>{t('profile.email')}</Text>
          <TextInput style={styles.input} value={formProfile.email} onChangeText={(text) => setFormProfile({...formProfile, email: text})} keyboardType="email-address" autoCapitalize="none" />
      </SettingsModal>

      {/* MODAL PASSWORD */}
      <SettingsModal visible={activeModal === 'password'} title={t('profile.cambiarPassword')} onClose={() => setActiveModal(null)} onSave={handleChangePassword} loading={loading}>
          <Text style={styles.inputLabel}>{t('profile.current_password')}</Text>
          <TextInput style={styles.input} secureTextEntry value={formPassword.current_password} onChangeText={(text) => setFormPassword({...formPassword, current_password: text})} />
          <Text style={styles.inputLabel}>{t('profile.new_password')}</Text>
          <TextInput style={styles.input} secureTextEntry value={formPassword.password} onChangeText={(text) => setFormPassword({...formPassword, password: text})} />
          <Text style={styles.inputLabel}>{t('profile.confirm_password')}</Text>
          <TextInput style={styles.input} secureTextEntry value={formPassword.password_confirmation} onChangeText={(text) => setFormPassword({...formPassword, password_confirmation: text})} />
      </SettingsModal>

      {/* MODAL IDIOMA */}
      <SettingsModal visible={activeModal === 'idioma'} title={t('profile.language')} onClose={() => setActiveModal(null)} showSave={false}>
        <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('es')}>
          <Text style={[styles.langText, i18n.language === 'es' && styles.langTextActive]}>Español</Text>
          {i18n.language === 'es' && <Feather name="check" size={18} color="#8a5cf6" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('en')}>
          <Text style={[styles.langText, i18n.language === 'en' && styles.langTextActive]}>English</Text>
          {i18n.language === 'en' && <Feather name="check" size={18} color="#8a5cf6" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('ca')}>
          <Text style={[styles.langText, i18n.language === 'ca' && styles.langTextActive]}>Català</Text>
          {i18n.language === 'ca' && <Feather name="check" size={18} color="#8a5cf6" />}
        </TouchableOpacity>
      </SettingsModal>

      {/* MODAL AVATAR */}
      <SettingsModal visible={activeModal === 'avatar'} title={t('seleccionar_avatar')} onClose={() => setActiveModal(null)} showSave={false}>
        <View style={styles.avatarGrid}>
          {Object.keys(avatarMap).map((key) => (
            <TouchableOpacity key={key} style={[styles.avatarOption, user.image_id === key && styles.avatarOptionActive]} onPress={() => handleUpdateAvatar(key)}>
              <Image source={avatarMap[key]} style={styles.avatarImage} />
              {user.image_id === key && <View style={styles.checkBadge}><Feather name="check" size={12} color="white" /></View>}
            </TouchableOpacity>
          ))}
        </View>
      </SettingsModal>

      {/* MODAL BLOQUEADOS */}
      <SettingsModal visible={activeModal === 'bloqueados'} title={t('profile.usuariosBloqueados')} onClose={() => setActiveModal(null)} showSave={false}>
        {loading ? (
          <ActivityIndicator color="#8a5cf6" style={{ marginVertical: 20 }} />
        ) : blockedUsers.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 30 }}>
            <Feather name="shield" size={40} color="#CBD5E1" />
            <Text style={{ marginTop: 12, color: '#94A3B8', fontWeight: '600' }}>No tienes usuarios bloqueados</Text>
          </View>
        ) : (
          blockedUsers.map((item) => (
            <View key={item.id} style={styles.blockedItem}>
              <Image source={item.image_id ? avatarMap[item.image_id] : { uri: 'https://i.pravatar.cc/150?img=1' }} style={styles.blockedAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.blockedName}>{item.name}</Text>
                <Text style={styles.blockedUsername}>@{item.username}</Text>
              </View>
              <TouchableOpacity style={styles.btnUnblock} onPress={() =>handleUnblock((item.id))}>
                <Text style={styles.btnUnblockText}>{t('profile.unblock')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </SettingsModal>

      <StaticBottomNavBar activeTab="user" hasNotifications={unreadCount > 0} />
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
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 4 },
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
  inputWithPrefix: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingLeft: 16, marginTop: 5 },
  prefixText: { fontSize: 16, fontWeight: '700', color: '#8a5cf69c', marginRight: 4 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, paddingVertical: 10 },
  avatarOption: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#F1F5F9', padding: 3, position: 'relative' },
  avatarOptionActive: { borderColor: '#8a5cf69c' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 40 },
  checkBadge: { position: 'absolute', right: -2, bottom: -2, backgroundColor: '#8a5cf69c', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  blockedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  blockedAvatar: { width: 44, height: 44, borderRadius: 22 },
  blockedName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  blockedUsername: { fontSize: 12, color: '#64748B' },
  btnUnblock: { backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  btnUnblockText: { color: '#8a5cf69c', fontWeight: '700', fontSize: 13 },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  langText: { fontSize: 16, color: '#64748B', fontWeight: '600' },
  langTextActive: { color: '#8a5cf6', fontWeight: '700' },
});