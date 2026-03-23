import * as Device from 'expo-device';
import { View, Image, Platform, StyleSheet, TextInput } from 'react-native';
import { Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useState } from 'react';
import moodify from '@/assets/images/moodifyLogo.png';
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
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
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
        style={{
        backgroundColor: "white",
        borderRadius: 20,
        height: 40,
        paddingLeft: 20
      }}
      autoCapitalize="none"
      ></TextInput>

      <TextInput
        placeholder='Contraseña'
        value={password}
        onChangeText={val => setPassword(val)}
        style={{
        backgroundColor: "white",
        borderRadius: 20,
        height: 40,
        paddingLeft: 20
      }}
      autoCapitalize="none"
      ></TextInput>
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
        
        {/* <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView> */}

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

  buttons:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }
});