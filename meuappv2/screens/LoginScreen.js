import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput as PaperInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        navigation.replace('Home');
      }
    };
    checkLoggedIn();
  }, [navigation]);

  const handleLogin = async () => {
    const storedUserData = await AsyncStorage.getItem('userData');
    const userData = storedUserData ? JSON.parse(storedUserData) : null;

    if (userData && userData.email === email && userData.password === password) {
      navigation.replace('Home');
    } else {
      setErrorMessage('Email ou senha incorretos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <PaperInput label="Email" value={email} onChangeText={setEmail} mode="outlined" />
      <PaperInput label="Senha" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>Login</Button>
      <Button onPress={() => navigation.navigate('Register')} style={styles.button}>Registrar</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, color: '#333' },
  button: { marginTop: 20 },
  errorText: { color: '#D32F2F', fontSize: 14, textAlign: 'center' },
});
