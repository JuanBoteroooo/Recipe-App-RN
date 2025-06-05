import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Image, Alert
} from 'react-native';
import COLORS from '../constants/colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [myRecipes, setMyRecipes] = useState([]);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const loadUserData = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    const storedUserId = await AsyncStorage.getItem('userId');
    setEmail(storedEmail);
    setUserId(storedUserId);
  };

  const fetchMyRecipes = async () => {
    try {
      const res = await api.get('/recipes');
      const myRecipesFiltered = res.data.filter(recipe => recipe.createdBy === userId);
      setMyRecipes(myRecipesFiltered);
    } catch (error) {
      console.error('Error al obtener recetas personales:', error);
      Alert.alert('Error', 'No se pudieron cargar tus recetas.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData().then(() => fetchMyRecipes());
    }, [userId])
  );

  const renderRecipe = ({ item }) => (
    <View style={styles.recipeCard}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.recipeName}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity
        style={[styles.logoutButton, { top: insets.top + 10, right: 20 }]}
        onPress={handleLogout}
      >
        <Ionicons name="exit-outline" size={30} color={COLORS.fourth} />
      </TouchableOpacity>

      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <Text style={styles.subtitle}>Mis Recetas:</Text>

      <FlatList
        data={myRecipes}
        keyExtractor={(item) => item._id}
        renderItem={renderRecipe}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
  logoutButton: {
    position: 'absolute',
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.fifth,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: COLORS.fifth,
    marginBottom: 5,
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.fourth,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.fifth,
    marginVertical: 10,
  },
  recipeCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    flex: 1,
    marginHorizontal: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: 10,
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.fifth,
    textAlign: 'center',
  }
});
