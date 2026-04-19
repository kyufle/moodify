import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { UserContext } from '../user-provider';

export const DashboardBackground = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = useContext(UserContext);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#0F172A' : '#F8FAFC' }]}>
      {/* Fondo estético desde el SVG proporcionado */}
      <Image 
        source={darkMode ? require('@/assets/images/fondo_oscuro.svg') : require('@/assets/images/fondo_claro.svg')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      
      {/* Contenido principal por encima del fondo */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Fondo base detrás de la imagen por si acaso
    position: 'relative',
  }
});
