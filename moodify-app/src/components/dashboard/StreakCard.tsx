import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

export const StreakCard = () => {
  // Para obtener el día de la semana actual con la zona horaria de Barcelona
  const dateInBarcelona = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
  // getDay() devuelve 0(Domingo) - 6(Sábado). Convertimos para que Lunes sea 0 y Domingo 6.
  let todayIndex = dateInBarcelona.getDay() - 1;
  if (todayIndex === -1) todayIndex = 6; // Domingo

  // Generando datos de ejemplo para la semana actual
  // En una app real, esto vendría de tu base de datos o estado global.
  const weekDays = [
    { label: 'L', recorded: true, isToday: false }, // Lunes: Registrado
    { label: 'M', recorded: true, isToday: false }, // Martes: Registrado
    { label: 'X', recorded: false, isToday: false },// Miércoles (Hoy): Pendiente
    { label: 'J', recorded: false, isToday: false },// Jueves (Futuro): Vacío
    { label: 'V', recorded: false, isToday: false },// Viernes (Futuro): Vacío
    { label: 'S', recorded: false, isToday: false },
    { label: 'D', recorded: false, isToday: false },
  ];

  // Marcamos dinámicamente cuál es "Hoy"
  weekDays[todayIndex].isToday = true;

  // Lógica de Racha Consecutiva (siempre hacia atrás desde ayer u hoy)
  let currentStreak = 0;
  for (let i = todayIndex; i >= 0; i--) {
    if (weekDays[i].recorded) {
      currentStreak++;
    } else if (i !== todayIndex) {
      // Si el día NO está registrado y NO es hoy, la racha se rompe inmediatamente
      break; 
    }
    // Si i === todayIndex y no está registrado, no cortamos la racha (el usuario tiene tiempo de registrar hoy)
    // Pero tampoco suma a la racha hasta que lo registre.
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{currentStreak} días en racha!</Text>
      
      {/* Calendario semanal */}
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <View 
            key={index} 
            style={[
              styles.dayItem,
              day.isToday && styles.dayItemToday
            ]}
          >
            {/* Ícono de diamante en formato SVG */}
            <Image 
              source={require('@/assets/images/diamante-racha.svg')}
              style={[
                styles.diamondIcon,
                { opacity: day.recorded ? 1 : 0.2 } // Diamante apagado si no hay registro
              ]}
              contentFit="contain"
            />
            <Text style={[
              styles.dayLabel,
              day.isToday && styles.dayLabelToday
            ]}>
              {day.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Botón de Progreso (reemplaza Iniciar sesión) */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Feather name="bar-chart-2" size={18} color="#6B21A8" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Ver mi progreso</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8EAFD', // Violeta pastel fondo
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20, 
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 16,
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  dayItemToday: {
    backgroundColor: '#FFF1E6', // Fondo especial para el día de hoy
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diamondIcon: {
    width: 24,
    height: 24,
  },
  dayLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  dayLabelToday: {
    color: '#D97706', // Naranja/Dorado para el día activo
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8a62a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B21A8',
  }
});
