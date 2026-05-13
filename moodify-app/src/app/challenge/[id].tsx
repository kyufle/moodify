import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for challenges
const CHALLENGE_DATA: any = {
  '1': { name: '30 Días sin Azúcar', current: 12, total: 30, color: '#F472B6', icon: 'coffee', description: 'Elimina el azúcar procesado de tu dieta para mejorar tu energía y salud dental.' },
  '2': { name: 'Caminar 10k Pasos', current: 5, total: 7, color: '#60A5FA', icon: 'trending-up', description: 'Mantente activo caminando al menos 10,000 pasos cada día de esta semana.' },
  '3': { name: 'Dormir 8 Horas', current: 20, total: 30, color: '#818CF8', icon: 'moon', description: 'Regula tu ciclo de sueño descansando lo suficiente para una recuperación total.' },
};

export default function ChallengeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const challenge = CHALLENGE_DATA[id as string] || CHALLENGE_DATA['1'];

  // Crear 30 días para el grid
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    status: i < challenge.current ? 'completed' : (i === challenge.current ? 'today' : 'pending')
  }));

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reto</Text>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="share-2" size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.mainCard}>
            <View style={[styles.iconBox, { backgroundColor: challenge.color + '20' }]}>
              <Feather name={challenge.icon} size={32} color={challenge.color} />
            </View>
            
            <Text style={styles.title}>{challenge.name}</Text>
            <Text style={styles.description}>{challenge.description}</Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Tu progreso</Text>
                <Text style={styles.progressPercent}>{Math.round((challenge.current / challenge.total) * 100)}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(challenge.current / challenge.total) * 100}%`, backgroundColor: challenge.color }]} />
              </View>
              <Text style={styles.progressDays}>{challenge.current} de {challenge.total} días completados</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Calendario del Reto</Text>
            <View style={styles.calendarGrid}>
              {days.map((d) => (
                <View 
                  key={d.day} 
                  style={[
                    styles.dayBox, 
                    d.status === 'completed' && { backgroundColor: challenge.color },
                    d.status === 'today' && { borderColor: challenge.color, borderWidth: 2 }
                  ]}
                >
                  <Text style={[styles.dayText, d.status === 'completed' && { color: '#FFF' }]}>{d.day}</Text>
                  {d.status === 'completed' && <Feather name="check" size={10} color="#FFF" style={styles.checkIcon} />}
                </View>
              ))}
            </View>

            <View style={styles.benefitsBox}>
              <Text style={styles.benefitsTitle}>Beneficios</Text>
              <View style={styles.benefitItem}>
                <Feather name="zap" size={16} color="#F59E0B" />
                <Text style={styles.benefitText}>Más energía durante el día</Text>
              </View>
              <View style={styles.benefitItem}>
                <Feather name="smile" size={16} color="#10B981" />
                <Text style={styles.benefitText}>Mejor humor y claridad mental</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.completeButton}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.completeButtonText}>Completar reto de hoy</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.abandonButton}>
              <Text style={styles.abandonText}>Abandonar reto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </DashboardBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 25,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6366F1',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressDays: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 25,
  },
  sectionTitle: {
    width: '100%',
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 30,
  },
  dayBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  benefitsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 20,
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  completeButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  abandonButton: {
    paddingVertical: 10,
  },
  abandonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  }
});
