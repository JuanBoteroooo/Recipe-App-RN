import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  ActivityIndicator, TouchableOpacity
} from 'react-native';
import api from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchRecipes();
  }, []);

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailRecipe', { recipe: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.category}>Categoría: {item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Recetas Generales</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateRecipe')}
      >
        <Text style={styles.addButtonText}>Nueva Receta</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 80 }}
          numColumns={2} // <-- Añadido para mostrar dos columnas
          columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
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
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: COLORS.primary
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: COLORS.fifth,
    letterSpacing: 1
  },
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    shadowColor: COLORS.fifth,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flex: 1,
    marginHorizontal: 4, // Espacio lateral entre tarjetas
    minWidth: 0 // Para evitar problemas de overflow
  },
  image: {
    width: '100%',
    aspectRatio: 1.2, // Mantiene la imagen cuadrada y responsiva
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.tertiary
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.fifth,
    marginBottom: 2
  },
  description: {
    fontSize: 13,
    color: COLORS.fourth,
    marginBottom: 2
  },
  category: {
    fontSize: 12,
    color: COLORS.tertiary,
    marginTop: 2
  },
  addButton: {
    backgroundColor: COLORS.tertiary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 22
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16
  },
});