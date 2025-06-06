import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, ScrollView, Switch, Image
} from 'react-native';
import api from '../api/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', pais: '',
    email: '', password: '', confirm: '', esChef: false
  });

  const handleRegister = async () => {
    const { nombre, apellido, pais, email, password, confirm, esChef } = form;

    if (!nombre || !apellido || !pais || !email || !password || password !== confirm) {
      Alert.alert('Error', 'Revisa los campos, incluyendo confirmación de contraseña.');
      return;
    }

    try {
      await api.post('/users/register', { nombre, apellido, pais, esChef, email, password });
      Alert.alert('Registro exitoso', 'Ya puedes iniciar sesión');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'No se pudo registrar');
    }
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>GastroShare</Text>
      <Text style={styles.subtitle}>Crea tu cuenta</Text>

      {[ 
        { name: 'nombre', placeholder: 'Nombre' },
        { name: 'apellido', placeholder: 'Apellido' },
        { name: 'pais', placeholder: 'País' },
        { name: 'email', placeholder: 'Correo electrónico' },
        { name: 'password', placeholder: 'Contraseña', secure: true },
        { name: 'confirm', placeholder: 'Confirmar Contraseña', secure: true },
      ].map(({ name, placeholder, secure }, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={secure}
          autoCapitalize="none"
          value={form[name]}
          onChangeText={(text) => handleChange(name, text)}
        />
      ))}

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>¿Eres Chef?</Text>
        <Switch
          value={form.esChef}
          onValueChange={(value) => handleChange('esChef', value)}
          trackColor={{ false: '#ccc', true: COLORS.accent }}
          thumbColor={form.esChef ? COLORS.accent : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// PALETA FINAL
const COLORS = {
  primary: '#F5F5F5',
  card: '#FFFFFF',
  accent: '#FF6B00',  // solo para logo y pequeños detalles
  textPrimary: '#1F1F1F',
  textSecondary: '#808080',
  border: '#E0E0E0',
  button: '#333333',
  buttonText: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.primary,
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.button,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginRight: 10
  },
  button: {
    backgroundColor: COLORS.button,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: COLORS.accent,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500'
  },
});
