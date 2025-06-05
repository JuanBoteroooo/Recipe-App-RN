import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import api from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
      Alert.alert("Éxito", "Receta agregada al grupo");
      navigation.goBack();
    } catch (error) {
      console.error('Error al agregar receta al grupo:', error);
      Alert.alert("Error", error.response?.data?.error || "No se pudo agregar la receta");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Selecciona una receta:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#aa6e7f" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => addRecipeToGroup(item._id)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.recipeName}>{item.name}</Text>
              <Ionicons name="add-circle" size={28} color="#aa6e7f" />
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      )}
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#ffffff',
  secondary: '#f5eaed',
  tertiary: '#aa6e7f',
  fourth: '#7b4258',
  fifth: '#3c2a30'
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.primary },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: COLORS.fifth },
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center'
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
    marginBottom: 4
  },
});
