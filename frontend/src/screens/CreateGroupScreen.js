import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  Image, Alert, TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CreateGroupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a la galería para seleccionar imágenes.');
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
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Ocurrió un error al seleccionar la imagen");
    }
  };

  const handleCreateGroup = async () => {
    if (!name || !image) {
      Alert.alert("Error", "El nombre y la imagen son obligatorios");
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('image', {
      uri: image,
      name: 'group.jpg',
      type: 'image/jpeg',
    });

    try {
      const token = await AsyncStorage.getItem('token');
      await api.post('/groups', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      Alert.alert("Grupo creado correctamente");
      navigation.goBack();
    } catch (err) {
      console.error(err.response?.data);
      Alert.alert("Error", err.response?.data?.error || "No se pudo crear el grupo");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color={COLORS.primaryText} />
      </TouchableOpacity>

      <Text style={styles.title}>Crear Grupo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Grupo"
        placeholderTextColor={COLORS.placeholder}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imageText}>{image ? "Cambiar Imagen" : "Seleccionar Imagen"}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Crear Grupo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#F5F7FA',
  primary: '#FFFFFF',
  accent: '#FF6B00',  // Logo naranja
  primaryText: '#232946',
  secondaryText: '#666666',
  placeholder: '#999999',
  border: '#E0E0E0',
  button: '#232946',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: 'absolute',
    left: 18,
    zIndex: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: 30,
    marginTop: 50,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    color: COLORS.primaryText
  },
  imagePicker: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageText: {
    color: COLORS.primaryText,
    fontWeight: '600',
    fontSize: 16,
  },
  imagePreview: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  createButton: {
    backgroundColor: COLORS.button,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  }
});
