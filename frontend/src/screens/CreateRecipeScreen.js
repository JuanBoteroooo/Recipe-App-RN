import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  ScrollView, Alert, Image, TouchableOpacity
} from 'react-native';
import api from '../api/api';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // <-- Importa Ionicons

export default function CreateRecipeScreen({ navigation }) {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    category: '',
    image: ''
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setRecipe({ ...recipe, image: result.assets[0].uri });
    }
  };

  const handleCreate = async () => {
    const { title, description, category, image } = recipe;

    if (!title || !description || !category || !image) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      await api.post('/recipes', recipe);
      Alert.alert('Éxito', 'Receta creada correctamente');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'No se pudo crear la receta');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#7b4258" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear Nueva Receta</Text>

        <TextInput
          style={styles.input}
          placeholder="Título"
          value={recipe.title}
          onChangeText={(text) => setRecipe({ ...recipe, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={recipe.description}
          onChangeText={(text) => setRecipe({ ...recipe, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Categoría"
          value={recipe.category}
          onChangeText={(text) => setRecipe({ ...recipe, category: text })}
        />

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imageText}>
            {recipe.image ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </Text>
        </TouchableOpacity>

        {recipe.image && (
          <Image
            source={{ uri: recipe.image }}
            style={styles.imagePreview}
          />
        )}

        <Button title="Guardar Receta" onPress={handleCreate} />
      </ScrollView>
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
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    marginBottom: 28,
    textAlign: 'center',
    color: COLORS.fifth,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    color: COLORS.fifth,
    fontSize: 16
  },
  imagePicker: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12
  },
  imageText: {
    color: COLORS.tertiary,
    fontWeight: '600',
    fontSize: 15
  },
  imagePreview: {
    height: 180,
    width: '100%',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.tertiary
  }
});