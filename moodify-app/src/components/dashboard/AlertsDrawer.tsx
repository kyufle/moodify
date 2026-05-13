import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, Animated, Dimensions, 
  TouchableOpacity, FlatList, Image, ActivityIndicator, Modal 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { UserContext } from '@/components/user-provider';
import { avatarMap } from '../../utils/utils'; 

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';
const { width } = Dimensions.get('window');

interface AlertsDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  // NUEVO: Prop para avisar al padre de cuántas notificaciones hay
  onUnreadCount?: (count: number) => void; 
}

interface AlertItem {
  id: number;
  type: 'like' | 'comment' | 'follow';
  avatar: string | null;
  username: string;
  user_name: string;
  date: string | null;
}

const AlertsDrawer: React.FC<AlertsDrawerProps> = ({ isVisible, onClose, onUnreadCount }) => {
  const { userValue } = useContext(UserContext);
  const { t } = useTranslation();
  const token = userValue?.accessToken ?? null;
  const router = useRouter();

  const slideAnim = useRef(new Animated.Value(width)).current;
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(isVisible);
  // NUEVO: Ejecutar una comprobación silenciosa al montar el componente para saber si hay notis ANTES de abrir
  useEffect(() => {
    fetchAlerts(false);
  }, []);

  const fetchAlerts = async (showSpinner = true) => {
    if (!token) return;
    if (showSpinner) setLoading(true);
    try {
      const response = await fetch(`${API}user/alerts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
        // NUEVO: Le decimos al padre cuántas alertas han llegado
        if (onUnreadCount) {
          onUnreadCount(data.length);
        }
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true); 
      Animated.timing(slideAnim, { 
        toValue: 0, 
        duration: 300, 
        useNativeDriver: true 
      }).start();
      fetchAlerts(true); 
    } else {
      Animated.timing(slideAnim, { 
        toValue: width, 
        duration: 300, 
        useNativeDriver: true 
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isVisible]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    // NUEVO: El intervalo funciona siempre, incluso si el panel está cerrado, para actualizar la bolita roja
    if (token) {
      interval = setInterval(() => {
        fetchAlerts(false); 
      }, 8000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token]); // Quitamos isVisible de las dependencias del intervalo

  const dismissAlert = async (alertToRemove: AlertItem) => {
    const updatedAlerts = alerts.filter(alert => 
      !(alert.id === alertToRemove.id && alert.type === alertToRemove.type)
    );
    setAlerts(updatedAlerts);
    
    // Actualizamos la bolita roja al borrar
    if (onUnreadCount) onUnreadCount(updatedAlerts.length);

    if (!token) return;
    try {
      await fetch(`${API}user/alerts/dismiss`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: alertToRemove.type,
          id: alertToRemove.id
        })
      });
    } catch (error) {
      console.error('Error al descartar la notificación en el servidor:', error);
    }
  };

const formatDateTime = (dateString: string | null, type: 'like' | 'comment' | 'follow') => {
  const safeDateString = !dateString 
    ? null 
    : (dateString.includes('T') ? dateString : dateString.replace(' ', 'T') + 'Z');
    
  const date = safeDateString ? new Date(safeDateString) : new Date();

  // Extraemos los datos manuales
  const day = date.getDate().toString().padStart(2, '0');
  const monthName = t('months.'+date.getMonth());
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const alertName = t('alert.'+type);

  // Construimos el mensaje final
  return `${alertName} ${day} ${monthName} ${t('alert.at')} ${hours}:${minutes}`;
};

  const renderItem = ({ item }: { item: AlertItem }) => {
    let message = '';
    let iconName: keyof typeof Feather.glyphMap = 'bell';
    let iconColor = '#8a5cf69c';

    switch (item.type) {
      case 'like': 
        message = t('alert.like'); 
        iconName = 'heart';
        iconColor = '#EF4444'; 
        break;
      case 'comment': 
        message = t('alert.comment');
        iconName = 'message-circle';
        iconColor = '#3B82F6'; 
        break;
      case 'follow': 
        message = t('alert.follow'); 
        iconName = 'user-plus';
        iconColor = '#10B981'; 
        break;
    }

    const avatarSource = item.avatar && avatarMap[item.avatar] 
      ? avatarMap[item.avatar] 
      : { uri: 'https://i.pravatar.cc/150' };

    return (
     <TouchableOpacity 
        style={styles.notificationCard}
        activeOpacity={0.7}
        onPress={() => {
          onClose(); // Cerramos el panel
          
          if (item.type === 'follow') {
            // Añadimos "as any" para silenciar a TypeScript
            router.push('/community/discover'); 
          } else {
            // @ts-ignore
            router.push(`/community/comment/${item.publication_id}`); 
          }
        }}
      >
        <View style={styles.avatarContainer}>
          <Image source={avatarSource} style={styles.avatar} />
          <View style={[styles.iconBadge, { backgroundColor: iconColor }]}>
            <Feather name={iconName} size={10} color="white" />
          </View>
        </View>
        
        <View style={styles.textContent}>
          <Text style={styles.notificationText}>
            <Text style={styles.username}>@{item.username}</Text> {message}
          </Text>
          <Text style={styles.timeText}>{formatDateTime(item.date, item.type)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.dismissButton} 
          onPress={() => dismissAlert(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={shouldRender}
      transparent={true}
      animationType="none" 
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFillObject} 
          onPress={onClose} 
          activeOpacity={1} 
        >
          <Animated.View style={[
            StyleSheet.absoluteFillObject, 
            { 
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              opacity: slideAnim.interpolate({
                inputRange: [0, width],
                outputRange: [1, 0]
              })
            }
          ]} />
        </TouchableOpacity>
        
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('alert.notifications')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
              <Feather name="x" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#8a5cf69c" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={alerts}
              keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Feather name="bell-off" size={40} color="#CBD5E1" />
                  <Text style={styles.emptyText}>{t('alert.noNotifications')}</Text>
                </View>
              }
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AlertsDrawer;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', 
  },
  drawer: { 
    width: width * 0.85, 
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000', 
    shadowOffset: { width: -5, height: 0 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    overflow: 'hidden',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: 60, 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#1E293B' 
  },
  listContainer: { 
    padding: 15,
    paddingBottom: 40
  },
  notificationCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F8FAFC' 
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#F1F5F9' 
  },
  iconBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  textContent: { 
    flex: 1,
    paddingRight: 10
  },
  notificationText: { 
    fontSize: 14, 
    color: '#64748B',
    lineHeight: 20
  },
  username: { 
    fontWeight: '700', 
    color: '#1E293B' 
  },
  timeText: { 
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500'
  },
  dismissButton: { 
    padding: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60
  },
  emptyText: {
    marginTop: 15,
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 15
  }
});