import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

export default function BoardScreen() {
  const route = useRoute();
  const { boardId, boardName } = route.params;
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const storedBoards = await AsyncStorage.getItem('boards');
    const boards = storedBoards ? JSON.parse(storedBoards) : [];
    const board = boards.find((b) => b.id === boardId);
    setLists(board ? board.lists || [] : []);
  };

  const saveLists = async (updatedLists) => {
    const storedBoards = await AsyncStorage.getItem('boards');
    const boards = storedBoards ? JSON.parse(storedBoards) : [];
    const boardIndex = boards.findIndex((b) => b.id === boardId);

    if (boardIndex !== -1) {
      boards[boardIndex].lists = updatedLists;
      await AsyncStorage.setItem('boards', JSON.stringify(boards));
    }

    setLists(updatedLists);
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = { id: Date.now().toString(), name: newListName, cards: [] };
      saveLists([...lists, newList]);
      setNewListName('');
    }
  };

  const renderList = ({ item }) => (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>{item.name}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={80}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{boardName}</Text>

        <FlatList data={lists} renderItem={renderList} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} />

        <TextInput style={styles.input} placeholder="Nome da nova lista" value={newListName} onChangeText={setNewListName} />

        <TouchableOpacity style={styles.button} onPress={handleCreateList}>
          <Text style={styles.buttonText}>Criar Lista</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, color: '#333' },
  listContainer: { padding: 15, backgroundColor: '#ddd', marginVertical: 5, borderRadius: 5 },
  listTitle: { fontSize: 18, color: '#333' },
  input: { width: '100%', padding: 10, borderColor: '#ccc', borderWidth: 1, marginVertical: 10, borderRadius: 5 },
  button: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff' },
});
