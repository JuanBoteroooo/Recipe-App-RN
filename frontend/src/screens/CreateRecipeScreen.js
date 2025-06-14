import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  ScrollView, Alert, Image, TouchableOpacity, Platform, KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateRecipeScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [stepInput, setStepInput] = useState('');
  const [steps, setSteps] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a la galería');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setForm({ ...form, image: result.assets[0].uri });
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo seleccionar imagen");
    }
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput.trim()]);
      setStepInput('');
    }
  };

  const handleCreate = async () => {
    const { name, description, image } = form;
    if (!name || !description || ingredients.length === 0 || steps.length === 0 || !image) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    ingredients.forEach((ing) => data.append('ingredients', ing));
    steps.forEach((step) => data.append('steps', step));
    data.append('image', {
      uri: image,
      name: 'recipe.jpg',
      type: 'image/jpeg'
    });

    try {
      const token = await AsyncStorage.getItem('token');
      await api.post('/recipes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      Alert.alert('Éxito', 'Receta creada correctamente');
      navigation.navigate('Home', { newRecipeCreated: true });
    } catch (err) {
      console.error(err.response || err);
      Alert.alert('Error', err.response?.data?.error || 'No se pudo crear la receta');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>Crear Receta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            maxLength={50}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción"
            maxLength={300}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline
          />

          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Agregar ingrediente"
              value={ingredientInput}
              onChangeText={setIngredientInput}
              onSubmitEditing={addIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {ingredients.map((ing, idx) => (
            <Text key={idx} style={styles.listItem}>• {ing}</Text>
          ))}

          <Text style={styles.sectionTitle}>Pasos</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Agregar paso"
              value={stepInput}
              onChangeText={setStepInput}
              onSubmitEditing={addStep}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={addStep} style={styles.addButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {steps.map((step, idx) => (
            <Text key={idx} style={styles.listItem}>{idx + 1}. {step}</Text>
          ))}

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={styles.imageText}>{form.image ? "Cambiar Imagen" : "Seleccionar Imagen"}</Text>
          </TouchableOpacity>

          {form.image && (
            <Image source={{ uri: form.image }} style={styles.imagePreview} />
          )}

          <Button title="Guardar Receta" color="#3E3E3E" onPress={handleCreate} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#ffffff',
  secondary: '#f4f4f4',
  accent: '#FF6B00',
  textPrimary: '#222222',
  textSecondary: '#666666',
  border: '#dddddd',
  button: '#3E3E3E'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    color: COLORS.textPrimary
  },
  textArea: {
    minHeight: 80
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.textPrimary
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  addButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 10,
    marginLeft: 8
  },
  listItem: {
    marginLeft: 8,
    marginBottom: 4,
    color: COLORS.textPrimary
  },
  imagePicker: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12
  },
  imageText: {
    color: COLORS.textSecondary,
    fontSize: 15
  },
  imagePreview: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20
  }
});
