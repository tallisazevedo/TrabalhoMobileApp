import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen({ updateProfileImage }) {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setCpf(userData.cpf);
        setEmail(userData.email);
        setPhone(userData.phone);
        setProfileImage(userData.profileImage);
      }
    } catch (error) {
      console.log("Erro ao carregar o perfil:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !cpf || !email || !phone) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    const updatedUserData = { firstName, lastName, cpf, email, phone, profileImage };

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      setSuccessMessage('Perfil atualizado com sucesso!');
      setErrorMessage('');
      if (updateProfileImage) {
        updateProfileImage(profileImage);
      }
    } catch (error) {
      console.log("Erro ao salvar o perfil:", error);
      setErrorMessage('Erro ao salvar o perfil');
    }
  };

  const handleChooseImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("É necessário permitir acesso à biblioteca de fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
      setErrorMessage('Erro ao sair');
    }
  };

  // Função para obter as iniciais do usuário
  const getUserInitials = () => {
  const firstInitial = firstName ? firstName[0] : '';
  const lastInitial = lastName ? lastName[0] : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // Ajuste conforme necessário
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Perfil</Text>
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity onPress={handleChooseImage} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{getUserInitials()}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={(text) => setCpf(text.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))}
          keyboardType="numeric"
          maxLength={14}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'))}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, color: '#333' },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  initialsContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  input: { width: '100%', padding: 10, borderColor: '#ccc', borderWidth: 1, marginVertical: 10, borderRadius: 5 },
  button: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10, width: '100%' },
  buttonText: { color: '#fff', fontSize: 16 },
  logoutButton: { backgroundColor: '#d9534f', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20, width: '100%' },
  logoutButtonText: { color: '#fff', fontSize: 16 },
  successText: { color: '#388E3C', fontSize: 14, textAlign: 'center', marginBottom: 10 },
  errorText: { color: '#D32F2F', fontSize: 14, textAlign: 'center', marginBottom: 10 },
});