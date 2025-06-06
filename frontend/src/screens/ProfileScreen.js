import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator
} from 'react-native';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    const storedId = await AsyncStorage.getItem('userId');
    const storedEmail = await AsyncStorage.getItem('email');
    setUserId(storedId);
    setEmail(storedEmail || 'No disponible');
  };

  const fetchMyRecipes = async (id) => {
    try {
      const res = await api.get(`/recipes`);
      const userRecipes = res.data.filter(recipe => recipe.createdBy === id);
      setRecipes(userRecipes);
    } catch (error) {
      console.error('Error al obtener recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadAndFetch = async () => {
        await loadUserData();
      };
      loadAndFetch();
    }, [])
  );

  // Este useEffect escucha cambios en userId
  useEffect(() => {
    if (userId) {
      fetchMyRecipes(userId);
    }
  }, [userId]);

  const handleDelete = async (id) => {
    Alert.alert("Confirmar", "¿Estás seguro que deseas eliminar esta receta?", [
      { text: "Cancelar" },
      {
        text: "Eliminar", onPress: async () => {
          try {
            await api.delete(`/recipes/${id}`);
            fetchMyRecipes(userId);
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo eliminar");
          }
        }
      }
    ]);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('DetailRecipe', { recipe: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardFooter}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash" size={22} color={COLORS.tertiary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color={COLORS.fourth} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.emailLabel}>Correo:</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <Text style={styles.subtitle}>Mis Recetas</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.fourth} />
      ) : recipes.length === 0 ? (
        <View style={styles.noRecipesContainer}>
          <Text style={styles.noRecipesText}>No tienes recetas aún</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateRecipe')}>
            <Ionicons name="add-circle-outline" size={26} color="#fff" />
            <Text style={styles.addButtonText}>Crear mi primera receta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.fifth,
  },
  infoContainer: {
    marginBottom: 16,
  },
  emailLabel: {
    fontSize: 16,
    color: COLORS.fifth,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.fourth,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: COLORS.fifth,
  },
  recipeCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.fifth,
  },
  noRecipesContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noRecipesText: {
    fontSize: 18,
    marginBottom: 20,
    color: COLORS.fifth
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.fourth,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ProfileScreen;
