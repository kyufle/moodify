import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export const DashboardBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      {/* Fondo estético desde el SVG proporcionado */}
      <Image 
        source={require('@/assets/images/fondo_claro.svg')}
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
