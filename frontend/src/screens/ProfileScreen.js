import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator
} from 'react-native';
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
          <Ionicons name="trash" size={22} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.emailLabel}>Correo:</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <Text style={styles.subtitle}>Mis Recetas</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} />
      ) : recipes.length === 0 ? (
        <View style={styles.noRecipesContainer}>
          <Text style={styles.noRecipesText}>No tienes recetas aún</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateRecipe')}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Crear mi primera receta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
        />
      )}
    </SafeAreaView>
  );
};

const COLORS = {
  primary: '#FFFFFF',
  background: '#FAFAFA',
  accent: '#FF6B00',     // Naranja para botones, íconos principales
  secondary: '#F2F2F2',   // Gris clarito
  textPrimary: '#222222',
  textSecondary: '#666666',
  border: '#E0E0E0',
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
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  infoContainer: {
    marginBottom: 16,
  },
  emailLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    color: COLORS.textPrimary,
  },
  recipeCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1
  },
  noRecipesContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noRecipesText: {
    fontSize: 18,
    marginBottom: 20,
    color: COLORS.textSecondary
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
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
