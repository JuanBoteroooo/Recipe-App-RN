import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;

  let ingredients = recipe.ingredients;
  let steps = recipe.steps;
  if (typeof ingredients === 'string') {
    try { ingredients = JSON.parse(ingredients); } catch { ingredients = [ingredients]; }
  }
  if (typeof steps === 'string') {
    try { steps = JSON.parse(steps); } catch { steps = [steps]; }
  }
  if (Array.isArray(ingredients) && Array.isArray(ingredients[0])) {
    ingredients = ingredients[0];
  }
  if (Array.isArray(steps) && Array.isArray(steps[0])) {
    steps = steps[0];
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={COLORS.darkGrey} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.title}>{recipe.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {Array.isArray(ingredients) && ingredients.length > 0 ? (
            ingredients.map((ing, idx) => (
              <View key={idx} style={styles.listItemContainer}>
                <View style={styles.bullet} />
                <Text style={styles.listItem}>{ing}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.listItem}>No hay ingredientes.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pasos</Text>
          {Array.isArray(steps) && steps.length > 0 ? (
            steps.map((step, idx) => (
              <View key={idx} style={styles.listItemContainer}>
                <Text style={styles.stepNumber}>{idx + 1}.</Text>
                <Text style={styles.listItem}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.listItem}>No hay pasos.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#F9F9F9',
  cardBackground: '#FFFFFF',
  accent: '#FF6B00',
  darkGrey: '#333333',
  midGrey: '#666666',
  lightGrey: '#DDDDDD',
  border: '#E5E5E5'
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
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
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 14,
    marginBottom: 22,
    backgroundColor: '#eee'
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.darkGrey,
    marginBottom: 14
  },
  section: {
    marginBottom: 28
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    color: COLORS.midGrey,
    lineHeight: 22
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginTop: 8,
    marginRight: 10
  },
  listItem: {
    fontSize: 16,
    color: COLORS.darkGrey,
    flex: 1
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 8
  }
});
