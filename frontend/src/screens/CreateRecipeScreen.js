import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  ScrollView, Alert, Image, TouchableOpacity,
  KeyboardAvoidingView, Platform
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
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

  const removeIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const removeStep = (idx) => {
    setSteps(steps.filter((_, i) => i !== idx));
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
      console.log("Token al crear receta:", token);

      await axios.post(`${API_URL}/recipes`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
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
            style={styles.descriptionInput}
            placeholder="Descripción"
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Ingredientes</Text>
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
            <View key={idx} style={styles.listItemRow}>
              <Text style={styles.listItem}>• {ing}</Text>
              <TouchableOpacity onPress={() => removeIngredient(idx)}>
                <Ionicons name="close" size={18} color="#aa6e7f" />
              </TouchableOpacity>
            </View>
          ))}

          <Text style={styles.label}>Pasos</Text>
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
            <View key={idx} style={styles.listItemRow}>
              <Text style={styles.listItem}>{idx + 1}. {step}</Text>
              <TouchableOpacity onPress={() => removeStep(idx)}>
                <Ionicons name="close" size={18} color="#aa6e7f" />
              </TouchableOpacity>
            </View>
          ))}

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
      </KeyboardAvoidingView>
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
  descriptionInput: {
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    color: COLORS.fifth,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top'
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.fifth,
    marginBottom: 4,
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  addButton: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 8,
    padding: 8,
    marginLeft: 8
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  listItem: {
    color: COLORS.fifth,
    marginLeft: 8,
    marginRight: 4
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
