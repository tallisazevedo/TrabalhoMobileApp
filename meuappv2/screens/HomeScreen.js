// screens/HomeScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({ firstName: '', lastName: '', profileImage: null });
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    };

    const loadBoards = async () => {
      const storedBoards = await AsyncStorage.getItem('boards');
      if (storedBoards) {
        setBoards(JSON.parse(storedBoards));
      }
    };

    loadUserData();
    loadBoards();
  }, []);

  // Função para obter as iniciais do usuário
  const getUserInitials = useCallback(() => {
    const firstInitial = userData.firstName ? userData.firstName[0] : '';
    const lastInitial = userData.lastName ? userData.lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }, [userData.firstName, userData.lastName]);

  // Configura o cabeçalho para exibir o perfil do usuário
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.avatarContainer}
        >
          {userData.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{getUserInitials()}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, userData, getUserInitials]);

  const handleCreateBoard = async () => {
    if (newBoardName.trim()) {
      const newBoard = { id: Date.now().toString(), name: newBoardName };
      const updatedBoards = [...boards, newBoard];
      setBoards(updatedBoards);
      await AsyncStorage.setItem('boards', JSON.stringify(updatedBoards));
      setNewBoardName('');
    }
  };

  const renderBoard = ({ item }) => (
    <TouchableOpacity
      style={styles.boardItem}
      onPress={() => navigation.navigate('Board', { boardId: item.id, boardName: item.name })}
    >
      <Text style={styles.boardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {userData.firstName}!</Text>

      <FlatList
        data={boards}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.boardList}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum quadro encontrado</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do novo quadro"
        value={newBoardName}
        onChangeText={setNewBoardName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateBoard}>
        <Text style={styles.buttonText}>Criar Quadro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  boardList: { width: '100%', marginTop: 20 },
  boardItem: { padding: 15, backgroundColor: '#ddd', marginVertical: 5, borderRadius: 5, alignItems: 'center' },
  boardText: { fontSize: 18, color: '#333' },
  input: { width: '100%', padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginVertical: 10 },
  button: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontSize: 16 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
  avatarContainer: { marginRight: 15, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 40, height: 40, borderRadius: 20 },
  initialsContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
