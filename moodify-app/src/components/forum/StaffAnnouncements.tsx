import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const STAFF_NEWS = [
  {
    id: '1',
    title: 'Nueva Actualización v2.0',
    content: 'Descubre las nuevas racha de 30 días y premios exclusivos.',
    tag: 'OFICIAL',
    icon: 'zap',
    colors: ['#6366F1', '#A855F7'] as [string, string],
  },
  {
    id: '2',
    title: 'Mantenimiento Programado',
    content: 'Mañana de 02:00 a 04:00 (CET) para mejorar los servidores.',
    tag: 'AVISO',
    icon: 'info',
    colors: ['#F59E0B', '#EF4444'] as [string, string],
  },
  {
    id: '3',
    title: 'Tips de Bienestar',
    content: '¿Sabías que meditar 5 min al día reduce el estrés un 20%?',
    tag: 'CONSEJO',
    icon: 'heart',
    colors: ['#10B981', '#3B82F6'] as [string, string],
  }
];

export const StaffAnnouncements = () => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Avisos del Staff</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STAFF_NEWS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.cardContainer}>
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
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  cardContainer: {
    width: 280,
    marginHorizontal: 5,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientCard: {
    padding: 16,
    height: 110,
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardInfo: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    lineHeight: 16,
  }
});
