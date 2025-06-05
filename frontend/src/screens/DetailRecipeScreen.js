import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;

  // Si los ingredientes y pasos vienen como string, conviértelos a array
  let ingredients = recipe.ingredients;
  let steps = recipe.steps;
  if (typeof ingredients === 'string') {
    try { ingredients = JSON.parse(ingredients); } catch { ingredients = [ingredients]; }
  }
  if (typeof steps === 'string') {
    try { steps = JSON.parse(steps); } catch { steps = [steps]; }
  }

  // Si el primer elemento es un array, aplanar
  if (Array.isArray(ingredients) && Array.isArray(ingredients[0])) {
    ingredients = ingredients[0];
  }
  if (Array.isArray(steps) && Array.isArray(steps[0])) {
    steps = steps[0];
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#7b4258" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {Array.isArray(ingredients) && ingredients.length > 0 ? (
          ingredients.map((ing, idx) => (
            <Text key={idx} style={styles.listItem}>• {ing}</Text>
          ))
        ) : (
          <Text style={styles.listItem}>No hay ingredientes.</Text>
        )}

        <Text style={styles.sectionTitle}>Pasos</Text>
        {Array.isArray(steps) && steps.length > 0 ? (
          steps.map((step, idx) => (
            <Text key={idx} style={styles.listItem}>{idx + 1}. {step}</Text>
          ))
        ) : (
          <Text style={styles.listItem}>No hay pasos.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#fff',
  secondary: '#f5eaed',
  tertiary: '#aa6e7f',
  fourth: '#7b4258',
  fifth: '#3c2a30'
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 18,
    zIndex: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 4
  },
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#eee'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.fifth
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.tertiary,
    marginTop: 18,
    marginBottom: 6
  },
  description: {
    fontSize: 16,
    color: COLORS.fifth,
    marginBottom: 8
  },
  listItem: {
    fontSize: 16,
    color: COLORS.fifth,
    marginLeft: 8,
    marginBottom: 4
  }
});