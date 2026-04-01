import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

export const DashboardHeader = () => {
  // Configurado para la zona horaria de Barcelona, Catalunya
  const currentDateFormatted = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    day: '2-digit',
    month: 'short', // 'abr' en lugar de 'abril' para un look más limpio
    year: 'numeric'
  }).format(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        
        {/* Lado izquierdo: Avatar e Info */}
        <View style={styles.userInfoContainer}>
          {/* Contenedor del Avatar con un anillo estilizado tipo "Historia" */}
          <View style={styles.avatarRing}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=44' }} // Imagen de perfil (cambiada a otra más estética)
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Bienvenid@ de vuelta</Text>
            <Text style={styles.nameText}>Maria Orpi</Text>
            <Text style={styles.dateText}>{currentDateFormatted.toUpperCase()}</Text>
          </View>
        </View>

        {/* Lado derecho: Puntos (Diamantes) */}
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>275</Text>
          {/* Usamos el diamante SVG que agregaste antes para mantener consistencia */}
          <Image 
            source={require('@/assets/images/diamante-racha.svg')}
            style={styles.diamondIcon}
            contentFit="contain"
          />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 15, // Reducido para evitar altura excesiva (usa el SafeArea global)
    paddingBottom: 15, // Más pegado a las tarjetas
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#8a62a6', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Anillo decorativo tipo Instagram más compacto
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D4B3E0', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 9,
    color: '#8B8BA7',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1E2D',
    marginBottom: 1,
  },
  dateText: {
    fontSize: 9,
    color: '#A0A0B8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF', 
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B21A8', 
    marginRight: 4,
  },
  diamondIcon: {
    width: 14,
    height: 14,
  }
});
