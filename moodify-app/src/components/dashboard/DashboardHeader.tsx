import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../user-provider';
import { ThemedText } from '../themed-text';
import { avatarMap } from '../../utils/utils';
import { useTranslation } from 'react-i18next';

import AlertsDrawer from './AlertsDrawer'; 

export const DashboardHeader = () => {
  const { userValue } = React.useContext(UserContext);
  const { t } = useTranslation();
  
  const [isAlertsVisible, setIsAlertsVisible] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  if (userValue?.user == null) return null;

  const user = userValue.user;
  
  const currentDateFormatted = new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date()); 

  return (
    <>
      <View style={styles.container}>
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.alertButton} 
            onPress={() => setIsAlertsVisible(true)}
          >
            <Feather name="bell" size={18} color="#64748B" />
            {unreadAlerts > 0 && (
              <View style={styles.redBadge} />
            )}
            
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRow}>
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarRing}>
              <Image 
                source={user.image_id ? avatarMap[user.image_id] : null}
                style={styles.avatar}
                resizeMode="cover" 
              />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.welcomeText}>{t('dashboard.welcome')}</ThemedText>
              <ThemedText style={styles.nameText}>{user.name}</ThemedText>
            </View>
          </View>
        </View>

        <View>
          <ThemedText style={styles.dateText}>{currentDateFormatted}</ThemedText>
          <ThemedText style={styles.fraseText}>
            {t('dashboard.messageHello')} {user.name} {t('dashboard.messageWelcome')}
          </ThemedText>
        </View>
      </View>

      <AlertsDrawer 
        isVisible={isAlertsVisible} 
        onClose={() => setIsAlertsVisible(false)} 
        onUnreadCount={(count) => setUnreadAlerts(count)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 15,
    backgroundColor: 'rgb(255, 255, 255)', 
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#8a62a6', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 17, 
    alignItems: 'center',
    marginLeft: 15,
    marginBottom: 15
  },
  userInfoContainer: {
    gap: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15
  },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D4B3E0', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 31,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 28,
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    marginTop: 25,
  },
  welcomeText: {
    fontSize: 15,
    color: '#606060',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E2D',
    marginBottom: 1,
  },
  fraseText: {
    fontSize: 15,
    color: '#1E1E2D',
    marginBottom: 1,
    marginLeft: 15
  },
  dateText: {
    fontSize: 12,
    color: '#606060',
    letterSpacing: 0.5,
    marginLeft: 15
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5
  },
  alertButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  redBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#F1F5F9'
  }
});