import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  ScrollView, Alert, Image, TouchableOpacity
} from 'react-native';
import api from '../api/api';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#000'
  },
  imagePicker: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  imageText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  imagePreview: {
    height: 180,
    width: '100%',
    borderRadius: 10,
    marginBottom: 20
  }
});
