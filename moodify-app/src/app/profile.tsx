import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '@/components/user-provider';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { StaticBottomNavBar } from '@/components/StaticBottomNavBar';
import { HabitProgress } from '@/components/profile/HabitProgress';
import { ChallengesSection } from '@/components/profile/ChallengesSection';
import { AchievementsBar } from '@/components/profile/AchievementsBar';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

const LANGUAGES = [
  { code: 'es', name: 'Español',   flag: '🇪🇸' },
  { code: 'en', name: 'English',   flag: '🇬🇧' },
  { code: 'ca', name: 'Català',    flag: '🏴' },
  { code: 'fr', name: 'Français',  flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',   flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export default function ProfileScreen() {
  const { userValue, setUserValue, logout } = useContext(UserContext);

  const user = userValue?.user ?? { name: 'Usuario', email: '', streak: 0, points: 0 };
  const token = userValue?.accessToken ?? null;

  // ── Tab ──
  const [activeTab, setActiveTab] = useState<'perfil' | 'ajustes'>('perfil');

  // ── Settings state — initialised from user context ──
  const [isPublic,         setIsPublic]         = useState<boolean>(user.is_public         ?? true);
  const [showInCommunity,  setShowInCommunity]  = useState<boolean>(user.show_in_community  ?? true);
  const [notifications,    setNotifications]    = useState<boolean>(user.notifications_enabled ?? true);
  const [selectedLang,     setSelectedLang]     = useState<string>(user.language             ?? 'es');

  // ── Modal visibility ──
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEditModal,     setShowEditModal]     = useState(false);

  // ── Password form ──
  const [currentPass,    setCurrentPass]    = useState('');
  const [newPass,        setNewPass]        = useState('');
  const [confirmPass,    setConfirmPass]    = useState('');
  const [showCurrentP,   setShowCurrentP]   = useState(false);
  const [showNewP,       setShowNewP]       = useState(false);
  const [showConfirmP,   setShowConfirmP]   = useState(false);
  const [passLoading,    setPassLoading]    = useState(false);

  // ── Edit profile form ──
  const [editName,        setEditName]        = useState(user.name     ?? '');
  const [editUsername,    setEditUsername]    = useState(user.username  ?? '');
  const [editEmail,       setEditEmail]       = useState(user.email    ?? '');
  const [profileLoading,  setProfileLoading]  = useState(false);

  // ── Password strength ──
  const passStrength =
    newPass.length === 0 ? 0 :
    newPass.length < 6   ? 1 :
    newPass.length < 10  ? 2 :
    newPass.length < 14  ? 3 : 4;
  const passColors = ['#E2E8F0', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
  const passLabels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) ?? LANGUAGES[0];

  // ── Helpers ──
  const authHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const patchContext = (updatedUser: any) => {
    setUserValue((prev: any) => ({ ...prev, user: updatedUser }));
  };

  // ── API: update single setting silently ──
  const updateSetting = useCallback(async (patch: Record<string, any>) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}update-settings`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        patchContext(data.user);
      }
    } catch {
      // silent — toggle already reflects visually, will retry next time
    }
  }, [token]);

  // ── Toggle handlers (save immediately) ──
  const handlePublicToggle = (v: boolean) => {
    setIsPublic(v);
    updateSetting({ is_public: v });
  };
  const handleCommunityToggle = (v: boolean) => {
    setShowInCommunity(v);
    updateSetting({ show_in_community: v });
  };
  const handleNotifToggle = (v: boolean) => {
    setNotifications(v);
    updateSetting({ notifications_enabled: v });
  };

  // ── Language save ──
  const handleLangSelect = (code: string) => {
    setSelectedLang(code);
    setShowLanguageModal(false);
    updateSetting({ language: code });
  };

  // ── API: update profile ──
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    if (!token) {
      Alert.alert('Sin sesión', 'Inicia sesión para guardar cambios.');
      return;
    }
    setProfileLoading(true);
    try {
      const res = await fetch(`${API}update-profile`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: editName.trim(), username: editUsername.trim(), email: editEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        patchContext(data.user);
        setShowEditModal(false);
        Alert.alert('¡Guardado!', 'Tu perfil ha sido actualizado.');
      } else {
        const msg = data.errors?.username?.[0] ?? data.errors?.email?.[0] ?? data.errors?.name?.[0] ?? data.message ?? 'No se pudo guardar.';
        Alert.alert('Error', msg);
      }
    } catch {
      Alert.alert('Error de red', 'Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setProfileLoading(false);
    }
  };

  // ── API: change password ──
  const handlePasswordChange = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert('Faltan campos', 'Rellena todos los campos.');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }
    if (newPass.length < 8) {
      Alert.alert('Contraseña corta', 'Usa al menos 8 caracteres.');
      return;
    }
    if (!token) {
      Alert.alert('Sin sesión', 'Inicia sesión para cambiar la contraseña.');
      return;
    }
    setPassLoading(true);
    try {
      const res = await fetch(`${API}change-password`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          current_password: currentPass,
          new_password: newPass,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setShowPasswordModal(false);
        setCurrentPass(''); setNewPass(''); setConfirmPass('');
        Alert.alert('¡Listo!', 'Contraseña actualizada correctamente.');
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo actualizar la contraseña.');
      }
    } catch {
      Alert.alert('Error de red', 'Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = () =>
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);

  // ─── Sub-components ───────────────────────────────────────────

  const SectionLabel = ({ title }: { title: string }) => (
    <Text style={styles.sectionLabel}>{title}</Text>
  );

  const SettingRow = ({
    icon, iconColor, iconBg, label, sublabel,
    isSwitch, switchValue, onToggle, onPress, isLast = false,
  }: {
    icon: string; iconColor: string; iconBg: string;
    label: string; sublabel?: string;
    isSwitch?: boolean; switchValue?: boolean;
    onToggle?: (v: boolean) => void;
    onPress?: () => void; isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, isLast && styles.settingRowLast]}
      onPress={onPress}
      disabled={isSwitch}
      activeOpacity={0.65}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon as any} size={17} color={iconColor} />
      </View>
      <View style={styles.settingTextGroup}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sublabel ? <Text style={styles.settingSubLabel}>{sublabel}</Text> : null}
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onToggle}
          trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Feather name="chevron-right" size={17} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );

  // ─── Render ───────────────────────────────────────────────────

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Mi Perfil</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ──────────── HERO ──────────── */}
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarRing}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                <Feather name="camera" size={13} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.heroName}>{user.name}</Text>
            <Text style={styles.heroEmail}>{user.email}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{user.streak ?? 0}</Text>
                <Text style={styles.statLbl}>Racha</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{user.points ?? 0}</Text>
                <Text style={styles.statLbl}>Puntos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>4</Text>
                <Text style={styles.statLbl}>Logros</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.privacyPill,
                { backgroundColor: isPublic ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)' },
              ]}
              onPress={() => handlePublicToggle(!isPublic)}
              activeOpacity={0.8}
            >
              <Feather
                name={isPublic ? 'globe' : 'lock'}
                size={12}
                color={isPublic ? '#6EE7B7' : '#FCD34D'}
              />
              <Text style={[styles.privacyPillText, { color: isPublic ? '#6EE7B7' : '#FCD34D' }]}>
                {isPublic ? 'Perfil público' : 'Perfil privado'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* ──────────── TABS ──────────── */}
          <View style={styles.tabBar}>
            {(['perfil', 'ajustes'] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.75}
              >
                <Feather
                  name={tab === 'perfil' ? 'user' : 'settings'}
                  size={15}
                  color={activeTab === tab ? '#6366F1' : '#94A3B8'}
                />
                <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                  {tab === 'perfil' ? 'Perfil' : 'Ajustes'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ──────────── TAB PERFIL ──────────── */}
          {activeTab === 'perfil' && (
            <View style={styles.card}>
              <HabitProgress />
              <ChallengesSection />
              <AchievementsBar />
            </View>
          )}

          {/* ──────────── TAB AJUSTES ──────────── */}
          {activeTab === 'ajustes' && (
            <View style={styles.card}>

              <SectionLabel title="CUENTA" />
              <View style={styles.group}>
                <SettingRow
                  icon="user" iconColor="#6366F1" iconBg="#EEF2FF"
                  label="Editar perfil" sublabel={user.name}
                  onPress={() => { setEditName(user.name ?? ''); setEditUsername(user.username ?? ''); setEditEmail(user.email ?? ''); setShowEditModal(true); }}
                />
                <SettingRow
                  icon="lock" iconColor="#8B5CF6" iconBg="#F5F3FF"
                  label="Cambiar contraseña" sublabel="Mantén tu cuenta segura"
                  onPress={() => setShowPasswordModal(true)}
                  isLast
                />
              </View>

              <SectionLabel title="PRIVACIDAD" />
              <View style={styles.group}>
                <SettingRow
                  icon="globe" iconColor="#10B981" iconBg="#ECFDF5"
                  label="Perfil público"
                  sublabel={isPublic ? 'Visible para todos los usuarios' : 'Solo tú puedes verlo'}
                  isSwitch switchValue={isPublic} onToggle={handlePublicToggle}
                />
                <SettingRow
                  icon="users" iconColor="#3B82F6" iconBg="#EFF6FF"
                  label="Aparecer en explorar"
                  sublabel={showInCommunity ? 'Te mostramos a otros usuarios' : 'Modo incógnito activo'}
                  isSwitch switchValue={showInCommunity} onToggle={handleCommunityToggle}
                  isLast
                />
              </View>

              <SectionLabel title="APARIENCIA" />
              <View style={styles.group}>
                <SettingRow
                  icon="globe" iconColor="#F59E0B" iconBg="#FFFBEB"
                  label="Idioma"
                  sublabel={`${currentLang.flag}  ${currentLang.name}`}
                  onPress={() => setShowLanguageModal(true)}
                  isLast
                />
              </View>

              <SectionLabel title="NOTIFICACIONES" />
              <View style={styles.group}>
                <SettingRow
                  icon="bell" iconColor="#F59E0B" iconBg="#FFFBEB"
                  label="Notificaciones push"
                  sublabel={notifications ? 'Recibirás recordatorios diarios' : 'Notificaciones desactivadas'}
                  isSwitch switchValue={notifications} onToggle={handleNotifToggle}
                  isLast
                />
              </View>

              <SectionLabel title="SOPORTE" />
              <View style={styles.group}>
                <SettingRow
                  icon="help-circle" iconColor="#64748B" iconBg="#F1F5F9"
                  label="Centro de ayuda" onPress={() => {}}
                />
                <SettingRow
                  icon="mail" iconColor="#64748B" iconBg="#F1F5F9"
                  label="Contactar soporte" onPress={() => {}}
                />
                <SettingRow
                  icon="file-text" iconColor="#64748B" iconBg="#F1F5F9"
                  label="Términos y condiciones" onPress={() => {}}
                  isLast
                />
              </View>

              <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF2F2' }]}>
                  <Feather name="log-out" size={17} color="#EF4444" />
                </View>
                <Text style={styles.logoutLabel}>Cerrar sesión</Text>
              </TouchableOpacity>

              <Text style={styles.versionStr}>Moodify v1.0.4 (Beta)</Text>
            </View>
          )}
        </ScrollView>
      </DashboardBackground>

      {/* ──────────── MODAL: CAMBIAR CONTRASEÑA ──────────── */}
      <Modal visible={showPasswordModal} animationType="slide" transparent statusBarTranslucent>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => !passLoading && setShowPasswordModal(false)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Cambiar contraseña</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)} disabled={passLoading}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {[
              { label: 'Contraseña actual',   value: currentPass, setter: setCurrentPass, show: showCurrentP, setShow: setShowCurrentP, placeholder: '••••••••' },
              { label: 'Nueva contraseña',    value: newPass,     setter: setNewPass,     show: showNewP,     setShow: setShowNewP,     placeholder: 'Mínimo 8 caracteres' },
              { label: 'Confirmar contraseña',value: confirmPass, setter: setConfirmPass, show: showConfirmP, setShow: setShowConfirmP, placeholder: 'Repite la contraseña' },
            ].map(({ label, value, setter, show, setShow, placeholder }) => (
              <View key={label}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <View style={[styles.fieldRow, passLoading && styles.fieldDisabled]}>
                  <TextInput
                    style={styles.field}
                    value={value}
                    onChangeText={setter}
                    secureTextEntry={!show}
                    placeholder={placeholder}
                    placeholderTextColor="#CBD5E1"
                    autoCapitalize="none"
                    editable={!passLoading}
                  />
                  <TouchableOpacity onPress={() => setShow((s: boolean) => !s)}>
                    <Feather name={show ? 'eye-off' : 'eye'} size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {newPass.length > 0 && (
              <View style={styles.strengthRow}>
                {[1, 2, 3, 4].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      { backgroundColor: i <= passStrength ? passColors[passStrength] : '#E2E8F0' },
                    ]}
                  />
                ))}
                <Text style={[styles.strengthLabel, { color: passColors[passStrength] }]}>
                  {passLabels[passStrength]}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, passLoading && styles.primaryBtnDisabled]}
              onPress={handlePasswordChange}
              activeOpacity={0.85}
              disabled={passLoading}
            >
              {passLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.primaryBtnText}>Actualizar contraseña</Text>
              }
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ──────────── MODAL: IDIOMA ──────────── */}
      <Modal visible={showLanguageModal} animationType="slide" transparent statusBarTranslucent>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Idioma</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
            {LANGUAGES.map((lang, idx) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langRow,
                  idx === LANGUAGES.length - 1 && { borderBottomWidth: 0 },
                  selectedLang === lang.code && styles.langRowActive,
                ]}
                onPress={() => handleLangSelect(lang.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langName, selectedLang === lang.code && styles.langNameActive]}>
                  {lang.name}
                </Text>
                {selectedLang === lang.code && (
                  <Feather name="check-circle" size={18} color="#6366F1" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ──────────── MODAL: EDITAR PERFIL ──────────── */}
      <Modal visible={showEditModal} animationType="slide" transparent statusBarTranslucent>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => !profileLoading && setShowEditModal(false)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Editar perfil</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)} disabled={profileLoading}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Nombre</Text>
            <View style={[styles.fieldRow, profileLoading && styles.fieldDisabled]}>
              <TextInput
                style={styles.field}
                value={editName}
                onChangeText={setEditName}
                placeholder="Tu nombre"
                placeholderTextColor="#CBD5E1"
                editable={!profileLoading}
              />
            </View>

            <Text style={styles.fieldLabel}>Nombre de usuario</Text>
            <View style={[styles.fieldRow, profileLoading && styles.fieldDisabled]}>
              <Text style={styles.fieldPrefix}>@</Text>
              <TextInput
                style={styles.field}
                value={editUsername}
                onChangeText={(t: string) => setEditUsername(t.toLowerCase().replace(/\s/g, ''))}
                placeholder="tu_usuario"
                placeholderTextColor="#CBD5E1"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!profileLoading}
              />
            </View>

            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.fieldRow, profileLoading && styles.fieldDisabled]}>
              <TextInput
                style={styles.field}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="tu@email.com"
                placeholderTextColor="#CBD5E1"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!profileLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, profileLoading && styles.primaryBtnDisabled]}
              onPress={handleSaveProfile}
              activeOpacity={0.85}
              disabled={profileLoading}
            >
              {profileLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.primaryBtnText}>Guardar cambios</Text>
              }
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <StaticBottomNavBar activeTab="user" />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  topBarTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    gap: 12,
  },

  // ── Hero ──
  heroCard: {
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  avatarWrapper: { position: 'relative', marginBottom: 4 },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%' },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  heroName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 4 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 28,
    gap: 20,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.68)', fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.22)' },
  privacyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    marginTop: 4,
  },
  privacyPillText: { fontSize: 12, fontWeight: '700' },

  // ── Tabs ──
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 7,
  },
  tabBtnActive: { backgroundColor: '#EEF2FF' },
  tabBtnText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  tabBtnTextActive: { color: '#6366F1', fontWeight: '700' },

  // ── Card ──
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 4,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },

  // ── Settings ──
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  group: {
    marginHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingRowLast: { borderBottomWidth: 0 },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextGroup: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  settingSubLabel: { fontSize: 12, color: '#94A3B8', marginTop: 1 },

  // ── Color picker ──
  colorCard: {
    marginHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  colorCardTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorCell: { alignItems: 'center', gap: 5, width: 62 },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchActive: { borderWidth: 2.5, borderColor: '#6366F1' },
  colorName: { fontSize: 11, fontWeight: '600', color: '#64748B' },

  // ── Logout ──
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 13,
  },
  logoutLabel: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  versionStr: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
    paddingTop: 16,
    paddingBottom: 12,
  },

  // ── Modals ──
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 7,
    marginTop: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fieldDisabled: { opacity: 0.5 },
  fieldPrefix: { fontSize: 15, color: '#94A3B8', fontWeight: '600', paddingRight: 2 },
  field: { flex: 1, fontSize: 15, color: '#1E293B', paddingVertical: 14 },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '700', minWidth: 46, textAlign: 'right' },
  primaryBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // ── Language rows ──
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 14,
    borderRadius: 12,
  },
  langRowActive: {
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 0,
    paddingHorizontal: 12,
  },
  langFlag: { fontSize: 24 },
  langName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#334155' },
  langNameActive: { color: '#6366F1', fontWeight: '700' },
});
