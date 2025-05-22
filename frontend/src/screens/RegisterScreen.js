import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, ScrollView, Switch
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
      <Text style={styles.title}>Registro</Text>

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
          placeholderTextColor="#888"
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

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#000' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#f2f2f2',
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6200EE',
  },
  buttonText: { fontSize: 18, color: '#fff' },
  link: { textAlign: 'center', marginTop: 20, color: '#6200EE' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: { color: '#000' },
});
