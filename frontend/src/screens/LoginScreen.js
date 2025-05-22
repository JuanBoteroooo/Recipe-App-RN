import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { email, password });
      Alert.alert('Bienvenido', 'Token: ' + res.data.token);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'No se pudo iniciar sesión');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Iniciar Sesión</Text>
      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.inputBackground,
          borderColor: theme.colors.inputBorder,
          color: theme.colors.text
        }]}
        placeholder="Correo"
        placeholderTextColor={theme.colors.placeholderText}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.inputBackground,
          borderColor: theme.colors.inputBorder,
          color: theme.colors.text
        }]}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.placeholderText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.buttonBackground }]} onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, { color: theme.colors.linkText }]}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { fontSize: 18 },
  link: { textAlign: 'center', marginTop: 20 },
});
