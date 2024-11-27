import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput as PaperInput } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('BR');
  const [callingCode, setCallingCode] = useState('+55');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (firstName && lastName && cpf && email && phone && password && confirmPassword) {
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem');
        return;
      }

      const userData = { firstName, lastName, cpf, email, phone: `${callingCode} ${phone}`, password };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      navigation.replace('Login');
    } else {
      setErrorMessage('Por favor, preencha todos os campos');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Registrar</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <PaperInput label="Nome" value={firstName} onChangeText={setFirstName} mode="outlined" />
        <PaperInput label="Sobrenome" value={lastName} onChangeText={setLastName} mode="outlined" />
        <PaperInput label="CPF" value={cpf} onChangeText={(text) => setCpf(text.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))} mode="outlined" />
        <PaperInput label="Email" value={email} onChangeText={setEmail} mode="outlined" />
        <View style={styles.phoneContainer}>
          <CountryPicker
            countryCode={countryCode}
            withCallingCode
            withFlag
            onSelect={(country) => { setCountryCode(country.cca2); setCallingCode(`+${country.callingCode[0]}`); }}
          />
          <PaperInput label="Telefone" value={phone} onChangeText={(text) => setPhone(text.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'))} style={{ flex: 1 }} mode="outlined" />
        </View>
        <PaperInput label="Senha" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" />
        <PaperInput label="Confirmar Senha" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} mode="outlined" />
        <Button mode="contained" onPress={handleRegister} style={styles.button}>Registrar</Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, color: '#333' },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  button: { marginTop: 20 },
  errorText: { color: '#D32F2F', fontSize: 14, textAlign: 'center' },
});
