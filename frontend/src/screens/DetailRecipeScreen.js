import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#7b4258" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.category}>Categoría: {recipe.category}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 18,
    zIndex: 10,
    backgroundColor: '#f5eaed',
    borderRadius: 20,
    padding: 4
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 18
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8
  },
  category: {
    fontSize: 16,
    color: '#aa6e7f',
    marginBottom: 12
  },
  description: {
    fontSize: 16,
    color: '#3c2a30'
  }
});