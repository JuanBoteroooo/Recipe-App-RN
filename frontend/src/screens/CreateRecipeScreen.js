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
  const [form, setForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    steps: '',
    image: ''
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleCreate = async () => {
    const { name, description, ingredients, steps, image } = form;

    if (!name || !description || !ingredients || !steps || !image) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('ingredients', ingredients);
    data.append('steps', steps);

    data.append('image', {
      uri: image,
      name: 'recipe.jpg',
      type: 'image/jpeg'
    });

    try {
      await api.post('/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Alert.alert('Éxito', 'Receta creada correctamente');
      navigation.goBack();
    } catch (err) {
      console.error(err.response || err);
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
          placeholder="Nombre"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingredientes (separados por coma)"
          value={form.ingredients}
          onChangeText={(text) => setForm({ ...form, ingredients: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Pasos (separados por coma)"
          value={form.steps}
          onChangeText={(text) => setForm({ ...form, steps: text })}
        />

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imageText}>
            {form.image ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </Text>
        </TouchableOpacity>

        {form.image && (
          <Image
            source={{ uri: form.image }}
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