import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const theme = useTheme();

  const handleRegister = async () => {
    if (!form.email || !form.password || form.password !== form.confirm) {
      Alert.alert('Error', 'Revisa los campos');
      return;
    }

    try {
      await api.post('/users/register', { email: form.email, password: form.password });
      Alert.alert('Registro exitoso', 'Ya puedes iniciar sesión');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'No se pudo registrar');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Registro</Text>
      <TextInput style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.inputBorder, color: theme.colors.text }]}
        placeholder="Correo"
        placeholderTextColor={theme.colors.placeholderText}
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <TextInput style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.inputBorder, color: theme.colors.text }]}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.placeholderText}
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      <TextInput style={[styles.input, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.inputBorder, color: theme.colors.text }]}
        placeholder="Confirmar contraseña"
        placeholderTextColor={theme.colors.placeholderText}
        secureTextEntry
        value={form.confirm}
        onChangeText={(text) => setForm({ ...form, confirm: text })}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.buttonBackground }]} onPress={handleRegister}>
        <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.link, { color: theme.colors.linkText }]}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 15 },
  button: { padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 18 },
  link: { textAlign: 'center', marginTop: 20 },
});
