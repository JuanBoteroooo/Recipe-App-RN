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

  // Pedir permisos al iniciar la pantalla
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
        <Ionicons name="arrow-back" size={28} color="#7b4258" />
      </TouchableOpacity>

      <Text style={styles.title}>Crear Grupo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Grupo"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imageText}>{image ? "Cambiar Imagen" : "Seleccionar Imagen"}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <Button title="Crear Grupo" onPress={handleCreateGroup} />
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
    padding: 24,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    position: 'absolute',
    left: 18,
    zIndex: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 4
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.fifth,
    marginBottom: 20,
    marginTop: 20,
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
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.tertiary
  }
});
