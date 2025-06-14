import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import api from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Paleta moderna
const COLORS = {
  background: '#F9F9F9',
  card: '#FFFFFF',
  border: '#E0E0E0',
  textPrimary: '#333333',
  textSecondary: '#777777',
  accent: '#FF6B00',  // el color del logo
  button: '#2F4858'
};

export default function AddRecipeToGroupScreen({ route, navigation }) {
  const { groupId } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/recipes');
      setRecipes(res.data);
    } catch (error) {
      console.error('Error al obtener recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecipeToGroup = async (recipeId) => {
    try {
      await api.put(`/groups/${groupId}/addRecipe`, { recipeId });
      Alert.alert("✅ Éxito", "Receta agregada al grupo");
      navigation.goBack();
    } catch (error) {
      console.error('Error al agregar receta al grupo:', error);
      Alert.alert("Error", error.response?.data?.error || "No se pudo agregar la receta");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const renderRecipe = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => addRecipeToGroup(item._id)}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.recipeName} numberOfLines={2}>{item.name}</Text>
        <TouchableOpacity onPress={() => addRecipeToGroup(item._id)}>
          <Ionicons name="add-circle" size={30} color={COLORS.button} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 40 }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={COLORS.darkGrey} />
      </TouchableOpacity>
      <Text style={styles.title}>Agregar receta al grupo</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} />
      ) : (
        <FlatList
          numColumns={1}
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 18,
    zIndex: 10,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 6,
    shadowColor: COLORS.darkGrey,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.button,
    marginBottom: 20
  },
  cardContainer: {
    marginBottom: 18
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12
  },
  recipeName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary
  }
});
