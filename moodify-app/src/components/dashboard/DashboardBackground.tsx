import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export const DashboardBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container} >
      {/* <Image 
        source={require('@/assets/images/fondo_claro.svg')}
        blurRadius={2}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      /> */}
      
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc', 
    position: 'relative',
  }
});
