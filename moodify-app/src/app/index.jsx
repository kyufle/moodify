import { useState, useContext } from 'react';
import { View, Image, Platform, StyleSheet, TextInput, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { UserContext } from '@/components/user-provider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import moodify from '@/assets/images/moodifyLogo.png';

// Import Device to fix the previous error
import * as Device from 'expo-device';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const { isLoggedIn } = useContext(UserContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // Redirigir al dashboard si ya estamos "logueados" (modo prueba)
  if (isLoggedIn) {
     return <Redirect href="/dashboard" />;
  }

  function showAlert(message) {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(message);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <Image 
            source={moodify} 
            style={{ width: 150, height: 150 }} 
            resizeMode="contain" 
          />
          <ThemedText type="title" style={styles.title}>
            Bienvenid@ a&nbsp;Moodify
          </ThemedText>
        </ThemedView>

        <TextInput
          placeholder='Email o nombre de usuario'
          value={email}
          onChangeText={val => setEmail(val)}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder='Contraseña'
          value={password}
          onChangeText={val => setPassword(val)}
          style={styles.input}
          autoCapitalize="none"
          secureTextEntry
        />

        <View style={styles.buttons}>
          <Button
            title="Acceder"
            color={'#DDAADD'}
            onPress={() => showAlert('Accediendo')}
          />
          <Button
            title="Regístrate"
            type="outline"
            buttonStyle={{ borderColor: '#99AAFF' }}
            titleStyle={{ color: '#99AAFF' }}
            onPress={() => showAlert('Registrando')}
          />
        </View>
        
        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1edd5',
  },
  safeArea: {
    flex: 1,
    width: '100%',           
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,
    paddingLeft: 20,
    width: '100%',
    marginBottom: 10,
  },
  buttons:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  }
});